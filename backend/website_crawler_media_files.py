import scrapy
from scrapy.crawler import CrawlerProcess
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from urllib.parse import urlparse, urljoin
import re
import json
import sys, os
import logging

class MediaSpider(CrawlSpider):
    name = 'media_spider'
    
    def __init__(self, url=None, max_pages=10):
        super(MediaSpider, self).__init__()
        logfile = "/var/log/huby/website_crawler_media_files.log"
        loglevel = "INFO"
        logging.basicConfig(
            format='%(asctime)s %(levelname)-s %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S %Z',
            filename=logfile,
            level=loglevel,
            filemode='a'
        )
        
        self.logger.info("Logger initialized for MediaSpider.")
        self.max_pages = int(max_pages)
        self.crawled_pages = set()
        self.pages_to_crawl = set()
        
        if url:
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            self.start_urls = [url]
            parsed_uri = urlparse(url)
            self.allowed_domains = [parsed_uri.netloc]
            self.base_url = url

    def is_valid_url(self, url):
        """Check if URL should be included in crawling"""
        try:
            if not url:
                return False
                
            # Convert relative URLs to absolute
            if not url.startswith(('http://', 'https://')):
                url = urljoin(self.base_url, url)
                
            parsed_url = urlparse(url)
            parsed_base = urlparse(self.base_url)
            
            # Must be same domain
            if parsed_url.netloc != parsed_base.netloc:
                return False
                
            # Skip common non-content URLs
            skip_patterns = [
                r'\.(css|js|json|xml|pdf|doc|docx|zip|rar|exe|txt)$',
                r'^mailto:', r'^tel:', r'^ftp:', r'^file:', r'^data:', r'^javascript:',
                r'/tag/', r'/category/', r'/author/', r'/page/', r'/feed/',
                r'/comment/', r'/search/', r'/archive/', r'/wp-content/',
                r'#', r'\?'  # Skip anchors and query parameters
            ]
            
            for pattern in skip_patterns:
                if re.search(pattern, url.lower()):
                    return False
            
            return True
            
        except Exception:
            return False

    def start_requests(self):
        """First request only gets links from landing page"""
        yield scrapy.Request(
            self.start_urls[0],
            callback=self.parse_landing_page,
            dont_filter=True
        )

    def parse_landing_page(self, response):
        """Extract and filter all links from landing page before crawling"""
        self.logger.info(f"Parsing landing page: {response.url}")
        
        # Extract all unique links
        all_links = set()
        for link in response.css('a::attr(href)').getall():
            if link:
                full_url = response.urljoin(link)
                if self.is_valid_url(full_url):
                    all_links.add(full_url)
        
        self.logger.info(f"Found {len(all_links)} valid links on landing page")
        
        # Limit number of pages to crawl
        self.pages_to_crawl = set(list(all_links)[:self.max_pages])
        self.logger.info(f"Will crawl {len(self.pages_to_crawl)} pages")
        
        # First process the landing page
        yield from self.extract_media(response)
        
        # Then start crawling the filtered pages
        for url in self.pages_to_crawl:
            if url not in self.crawled_pages:
                yield scrapy.Request(url, callback=self.parse_page)

    def parse_page(self, response):
        """Process each page for media content"""
        if response.url in self.crawled_pages:
            return
            
        self.crawled_pages.add(response.url)
        self.logger.info(f"Parsing page {len(self.crawled_pages)} of {len(self.pages_to_crawl)}: {response.url}")
        
        yield from self.extract_media(response)

    def extract_media(self, response):
        """Extract media from a page and yield the results"""
        media_urls = self.extract_media_urls(response)
        
        if media_urls['images'] or media_urls['videos']:
            yield {
                'url': response.url,
                'media': media_urls
            }

    def extract_media_urls(self, response):
        """Extract image and video URLs from the page"""
        media = {
            'images': [],
            'videos': []
        }
        
        # Extract images
        for img in response.css('img'):
            src = img.xpath('@src').get()
            if src:
                full_url = urljoin(response.url, src)
                if (full_url.startswith(('http://', 'https://')) and 
                        re.search(r'\.(jpg|jpeg|png|gif|webp|svg)($|\?)', full_url.lower())):
                    title = self.get_image_title(img)
                    media['images'].append({
                        'url': full_url,
                        'title': title if title else 'Untitled Image'
                    })

        # Extract videos
        for video in response.css('video'):
            src = video.xpath('@src').get()
            if src:
                title = self.get_video_title(video)
                media['videos'].append({
                    'url': urljoin(response.url, src),
                    'title': title if title else 'Untitled Video'
                })
            
            for source in video.css('source'):
                src = source.xpath('@src').get()
                if src:
                    title = self.get_video_title(video)
                    media['videos'].append({
                        'url': urljoin(response.url, src),
                        'title': title if title else 'Untitled Video'
                    })

        # YouTube embeds
        for iframe in response.css('iframe'):
            src = iframe.xpath('@src').get()
            if src and ('youtube.com' in src or 'youtu.be' in src):
                title = self.get_video_title(iframe)
                media['videos'].append({
                    'url': src,
                    'title': title if title else 'YouTube Video'
                })

        return media

    def get_image_title(self, img_element):
        """Extract title from image element"""
        for attr in ['@title', '@alt', '@aria-label']:
            if value := img_element.xpath(attr).get():
                return value.strip()
        if caption := img_element.xpath('../figcaption/text()').get():
            return caption.strip()
        return None

    def get_video_title(self, video_element):
        """Extract title from video element"""
        for attr in ['@title', '@aria-label']:
            if value := video_element.xpath(attr).get():
                return value.strip()
        return None

def run_spider(url, file_json, max_pages=10):
    """Run the spider with specified settings"""
    process = CrawlerProcess(settings={
        'USER_AGENT': 'Mozilla/5.0 (compatible; MediaSpider/1.0)',
        'ROBOTSTXT_OBEY': True,
        'CONCURRENT_REQUESTS': 1,
        'DOWNLOAD_DELAY': 1,
        'COOKIES_ENABLED': False,
        'LOG_LEVEL': 'INFO',
        'FEEDS': {
            file_json: {
                'format': 'json',
                'encoding': 'utf8',
                'overwrite': True,
                'indent': 2
            }
        }
    })
    
    try:
        process.crawl(MediaSpider, url=url, max_pages=max_pages)
        process.start()
        
        # Print summary
        with open(file_json, 'r', encoding='utf8') as f:
            data = json.load(f)
            print(f"\nScraped {len(data)} pages with media content")
            total_images = sum(len(page.get('media', {}).get('images', [])) for page in data)
            total_videos = sum(len(page.get('media', {}).get('videos', [])) for page in data)
            print(f"Found {total_images} images and {total_videos} videos")
            
    except Exception as e:
        print(f"Error during crawling: {str(e)}")


def prepare_final_list_of_images_videos(json_file, url_pattern):
    import json, os
    #print("json_file", json_file)
    if not os.path.exists(json_file):
        print("file not found")
        return
    try:
        with open(json_file, 'r') as fh:
            l_dict = json.loads(fh.read())
            #print("l_dict", l_dict)
    except Exception as e:
        print("json file read error ".format(e))
        return
    l_images        = []
    img_count       = 0
    l_videos        = []
    sorted_images   = []
    sorted_videos   = []
    video_count     = 0
    for d in l_dict:
        #print("d[media]: ", d["media"])
        if "images" in d["media"] and len(d["media"]["images"]) > 0:
            for img in d["media"]["images"]:
                if img not in l_images:
                    l_images.append(img)
                    img_count += 1
        if "videos" in d["media"] and len(d["media"]["videos"]) > 0:
            for video in d["media"]["videos"]:
                if video not in l_videos:
                    l_videos.append(video)
                    video_count += 1
    l_images = l_images[0:10]
    l_videos = l_videos[0:10]
    #print("l_images:", l_images)
    #print("\n"); print("\n")

    #print("l_videos:", l_videos)
    if len(l_images) > 0:
        sorted_images = sorted(l_images, key=lambda x: url_pattern not in x['url'])
    if len(l_videos) > 0:
        sorted_videos = sorted(l_videos, key=lambda x: url_pattern not in x['url'])
    # remove the file now
    os.rename(json_file, "last_media_urls_file.json")
    return {"images": sorted_images, "videos": sorted_videos}


def update_marketing_collection(application, sorted_media_urls, product_url):
    # sorted_media_urls = {"images": [{"ttile1": "<url>"}, {"ttile2": "<url>"}], "videos": [{"ttile1": "<url>"}, {}]}
    import sys
    from time import time
    sys.path.insert(0, '../../')
    from database import Database
    from configparser import ConfigParser
    import logging, os
    from bson.objectid import ObjectId
    from bson.errors import InvalidId
    if application == "":
        return "Error: application cannot be blank"
    config      = ConfigParser()
    configFile  = os.getenv("WorkingDirectory") + "/huby.cfg"
    #print("configFile:", configFile)
    config.read(configFile)
    webscrape_prompt = config.get('LLM', 'prompt_webscrape')
    logFile     = config.get('Default', 'log_file')
    logLevel    = config.get('Default', 'log_level')
    if logFile      == "":
        logFile     = "/var/log/huby/huby_api.log"
    if logLevel     == "":
        logLevel    = "INFO" 
    logging.basicConfig(format='%(asctime)s.%(msecs)03d  %(levelname)-s %(message)s', datefmt='%Y-%m-%d %H:%M:%S %Z', filename=logFile, level=logLevel, filemode='a')
    logger = logging.getLogger(logFile)
    logger.info("Initiating post webcrawled media URLs step of updating the product images/videos using update_marketing_collection()")

    dbCon   = Database(logFile)
    collection = "applications"
    fieldName  = "application"
    fieldValue = application
    try:
        apps = dbCon.get_documents_by_field(collection, fieldName, fieldValue)
    except Exception as e:
        logger.error("Error in website_crawler_media_files.update_marketing_collection() while trying to retrieve the application {} with error {}".format(application, e))
        return
    if len(apps) < 1:
        print("Couldn't find a product with name {}. Trying to find a product with this input as an id".format(application))
        logger.info("In website_crawler_media_files.update_marketing_collection() - Couldn't find a product with name {}. Now trying to find a product with this input as an id.".format(application))
        logger.info("Now trying with application_id")
        collection = "applications"
        fieldName  = "_id"
        try:
            fieldValue = ObjectId(application)
        except InvalidId:
            logger.error("Invalid input, can\'t convert it to an Object id. ")
            print("Invalid input, can\'t convert it to an Object id. Error: ")
            return
        try:
            apps = dbCon.get_documents_by_field(collection, fieldName, fieldValue)
        except Exception as e:
            logger.error("Error in website_crawler_media_files.update_marketing_collection() while trying to retrieve the application for id {} with error {}".format(application, e))
            return
        if len(apps) < 1:
            logger.error("Error in website_crawler_media_files.update_marketing_collection() no application forund for the application id {}".format(application))
            return
        logger.info("application found for updating the marketing/media URLs")
    app = apps[0]
    #print("Found app:", app)
    application_id = str(app["_id"])
    logger.info("Updating the video image urls for the application  " + application_id)
    if "application" not in app or app["application"] == "":
        logger.error("Error in website_crawler_media_files.update_marketing_collection(); stopped updating media URLs as no application name forund for the application id {}".format(application_id))
        return
    l_image_urls    = []
    l_video_urls    = []
    for img in sorted_media_urls["images"]:
        l_image_urls.append({img["title"]: img["url"]})
    for video in sorted_media_urls["videos"]:
        l_video_urls.append({video["title"]: video["url"]})
    collection = "application_marketing"
    fieldName  = "application_id"
    fieldValue = application_id
    try:
        marketings = dbCon.get_documents_by_field(collection, fieldName, fieldValue)
    except Exception as e:
        logger.error("Error in website_crawler_media_files.update_marketing_collection() while trying to retrieve the marketing info for application {} with error {}".format(application, e))
        return
    if len(marketings) < 1:
        # add the marketing record
        marketing = {}
        #application_id, industry, demo, tutorials, communities and tags are required fields of type array
        marketing["application_id"] = application_id
        marketing["industry"]       = ["Technology"]
        marketing["demo"]           = []
        marketing["tutorials"]      = []
        marketing["communities"]    = []
        marketing["tags"]           = ["Generative AI"]
        marketing["images"]         = l_image_urls
        marketing["videos"]         = l_video_urls
        marketing["created"]        = round(time())
        #print("inserting the marketing record:", marketing)
        try:
            #print("not yet inserting")
            marketing_id = dbCon.insert_document("application_marketing", marketing)
        except Exception as e:
            logger.error("Error inwebsite_crawler_media_files.update_marketing_collection() while trying to insert marketing info for  application with id {} and with marketing info as {} with error {}".format(application_id, marketing, e))
            return
    else:
        marketing = marketings[0]
        #merge the new list of urls with with old ones
        old_image_urls      = []
        old_video_urls      = []
        if "images" in marketing and len(marketing["images"]) > 0:
            old_image_urls      = marketing["images"]
        if "videos" in marketing and len(marketing["videos"]) > 0:
            old_video_urls      = marketing["videos"]
        #print("old_image_urls:", old_image_urls)
        #print("old video urls: ", old_video_urls)
        #print("product_url: ", product_url)
        if len(old_image_urls) > 0:
            l_image_urls    +=  old_image_urls
            #print("l_image_urls:", l_image_urls)
            #Here we cannot sort as there's no url key; key is title
            #sorted(l_image_urls, key=lambda x: product_url not in x['url'])
        if len(old_video_urls) > 0:
            l_video_urls    +=  old_video_urls
            # can't sort again for now
        marketing["images"]       = l_image_urls
        marketing["videos"]     = l_video_urls
        # Check del(markeiting["_id"])
        print("marketing record for update: ", marketing)
        try:
            #print("about to update")
            dbCon.update_document_by_field("application_marketing", "application_id", application_id, marketing)
        except Exception as e:
            logger.error("Error inwebsite_crawler_media_files.update_marketing_collection() while trying to update marketing info for  application with id {} and with marketing info as {} with error {}".format(application_id, marketing, e))
            return
    return



def main():
    urls_to_crawl = []
    while True:
        application = input("Enter the application name or application id: ")
        url = input("Enter the starting URL of a website to scrape (press Enter to stop): ")
        file_json = input("Enter the file name where media urls in json format will be saved: ")
        if not url:
            break
        urls_to_crawl.append(url)

    if urls_to_crawl:
        for url in urls_to_crawl:
            run_spider(url)
            sorted_media_urls = prepare_final_list_of_images_videos(file_json, url)
            print("sorted_media_urls", sorted_media_urls, url)
            update_marketing_collection(application, sorted_media_urls, url)
if __name__ == "__main__":
    #print("In website_crawler_media_files.py")
    # you can also run this program directly with 3 separate input params product_name/id  product_url some_file_name
    #       e.g. python3 website_crawler_media_files.py "veo" "https://deepmind.google/technologies/veo/veo-2/" "temp.json"
    #main() #-- call it for manual testing
    arguments = sys.argv[1:]
    print("arguments: ", arguments)
    if len(arguments) < 3:
        print("Error: website_crawler_media_files.py requires 3 args: url, application_id or name, and file name for storing media urls(json)")
        print("Optional 4th argument: max_pages (default 10)")
        print("Received args:", arguments)
    else:
        product_id  = arguments[0]
        url         = arguments[1]
        file_json   = arguments[2]
        max_pages   = int(arguments[3]) if len(arguments) > 3 else 10
        run_spider(url, file_json, max_pages)
        sorted_media_urls = prepare_final_list_of_images_videos(file_json, url)
        print("sorted_media_urls", sorted_media_urls, url)
        update_marketing_collection(product_id, sorted_media_urls, url) #- url is passed for pattern match/sorting
