import { convertToYouTubeEmbedUrl } from "../../functions/helper";
import { fetchGetApi } from "../../functions/apiFunctions";
import React, { useEffect, useState } from "react";
import {
  AiFillFilePdf,
  // AiOutlineVideoCamera,
  AiFillPicture,
} from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import './styles.css';

// import required
import { Autoplay, Navigation } from "swiper/modules";

interface MarketingSectionProps {
  applicationId: string;
}

interface MarketingData {
  brochure: string;
  demo: string[];
  communities: {
    discord?: string;
    slack?: string;
    twitter_x?: string;
  };
  images: { [key: string]: string }[];
  videos: { [key: string]: string }[];
  industry: string[];
  tags: string[];
  pricing: string;
  pricing_type: string;
  privacy: string;
  tutorials: {
    introduction: string;
    primer: string;
  };
  external_media_links: { [key: string]: string }[];
}

const getApiDomain = (url: string) => {
  // Remove 'dist' from the URL and add 'assets' instead
  return url.replace("dist/", "https://huby.ai/");
};

const MarketingSection: React.FC<MarketingSectionProps> = ({
  applicationId,
}) => {
  //const access_user = JSON.parse(
  // localStorage.getItem("access_token") as string
  // );
  const [marketingData, setMarketingData] = useState<MarketingData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const path = `/api/applications/marketing/${applicationId}`;
        const response = await fetchGetApi(path, undefined, navigate, location);
        if (response.status === 200) {
          setMarketingData(response?.data);
        }
      } catch (error) {
        const errorMessage = error.error || "Model not Found";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    applicationId && fetchData();
  }, [applicationId]);

  useEffect(() => {
    if (error) {
      // toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <svg
          className="animate-spin h-10 w-10 text-black"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l-1.647 1.647C6.627 20.627 9.373 22 12 22v-4c-1.657 0-3-1.343-3-3v-1.709z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="px-[12px]">
      <h2 className="text-[24px] font-black mulish text-left my-3">
        Marketing Section
      </h2>
      {marketingData !== null ? (
        <div>
          <div className=" p-6 max-w-full mb-[40px] md:mb-[50px] xl:mb-[80px] mt-[20px] mx-auto bg-white rounded-lg border border-gray-400  text-black">
            <div className="cursor-pointer mb-3 text-ellipsis overflow-hidden whitespace-nowrap">
              <h3 className="text-lg font-semibold">Brochure</h3>
              <Link to={marketingData?.brochure} className="list-disc pl-5 ">
                {marketingData?.brochure}{" "}
                <AiFillFilePdf className="inline text-red-500 ml-2" />
              </Link>
            </div>

            <div className="text-ellipsis overflow-hidden whitespace-nowrap">
              <h3 className="text-lg font-semibold">Demo Videos</h3>
              <ul className="list-disc pl-5 text-ellipsis overflow-hidden whitespace-nowrap">
                {marketingData?.demo?.map((item, index) => (
                  <li key={index} className="flex text-ellipsis overflow-hidden whitespace-nowrap">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Communities</h3>
              <ul className="list-disc pl-5 text-ellipsis overflow-hidden whitespace-nowrap">
                {Object.entries(marketingData.communities).map(
                  ([key, value], index) => (
                    <li key={index} className="flex items-center space-x-2">
                      {key === "discord" && (
                        <span className="">Discord: {value}</span>
                      )}
                      {key === "slack" && <span>Slack: {value}</span>}
                      {key === "twitter_x" && <span>Twitter/X: {value}</span>}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* <div className="mt-[20px]">
              <h3 className="text-lg font-semibold">Images</h3>

              <Swiper
                navigation={true}
                modules={[Navigation, Autoplay]}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                className="mySwiper h-[300px]"
              >
                {marketingData?.images?.map(
                  (image, index) =>
                    !Object.values(image)[0].includes(".pdf") && (
                      <SwiperSlide>
                        <div key={index} className="relative">
                          <img
                            src={getApiDomain(Object.values(image)[0])}
                            alt={Object.keys(image)[0]}
                            className="w-full h-[300px] object-cover rounded-lg shadow-md"
                          />
                          <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-md">
                            <AiFillPicture className="inline mr-1" />
                            {Object.keys(image)[0]}
                          </div>
                        </div>
                      </SwiperSlide>
                    )
                )}
              </Swiper>
            </div> */}

            {marketingData?.images?.some((image) =>
              Object.values(image)[0].includes(".pdf")
            ) && (
                <div className="my-2">
                  <h3 className="text-lg font-semibold">Documents</h3>
                  <div className="grid grid-cols-2 gap-4 min-h-[50px] max-h-[360px] overflow-auto">
                    {marketingData?.images?.map((image, index) => {
                      const imageUrl = Object.values(image)[0];
                      const imageTitle = Object.keys(image)[0];

                      if (imageUrl.includes(".pdf")) {
                        return (
                          <div key={index}>
                            <Link
                              to={getApiDomain(imageUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <p className="text-md font-semibold ml-4">
                                {imageTitle}
                                <AiFillFilePdf className="inline text-red-500 ml-2" />
                              </p>
                            </Link>
                          </div>
                        );
                      }

                      return null; // This ensures that non-PDF images are not duplicated.
                    })}
                  </div>
                </div>
              )}

            <div className="mt-[30px]">
              <h3 className="text-lg font-semibold">Videos</h3>
              {!marketingData.videos ? (
                <div className="flex justify-center">
                  <p className="text-center text-gray-500">
                    No Videos found for this application.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4  ">
                  {marketingData?.videos?.map((video, index) => (
                    <div key={index}>
                      <p className="text-md font-semibold ml-4 my-3">
                        {Object.keys(video)[0]}
                      </p>
                      <video
                        width="100%"
                        height="500"
                        controls
                        muted
                        loop
                        className="mx-auto"
                      >
                        <source
                          src={getApiDomain(Object.values(video)[0])}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="my-[30px] ">
              <h3 className="text-lg font-semibold">Industry</h3>
              <div className="flex flex-wrap gap-2">
                {marketingData?.industry?.map((item, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="my-[30px]">
              <h3 className="text-lg font-semibold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {marketingData?.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="my-[30px]">
              <h3 className="text-lg font-semibold">Pricing</h3>
              <p className="pl-5">{marketingData.pricing}</p>
              <p>
                <strong className="pl-4">Pricing Type:</strong>{" "}
                {marketingData.pricing_type}
              </p>
            </div>

            <div className="my-[30px]">
              <h3 className="text-lg font-semibold">Privacy Policy</h3>
              <p className="list-disc pl-5">{marketingData?.privacy}</p>
            </div>

            <div className="my-[30px]">
              <h3 className="text-lg font-semibold">Tutorials</h3>
              <div>
                <h4 className="text-base font-semibold pl-3">Introduction</h4>
                <p className=" pl-6 text-ellipsis overflow-hidden whitespace-nowrap">
                  {marketingData?.tutorials?.introduction}
                </p>
              </div>
              <div>
                <h4 className="text-base font-semibold pl-3">Primer</h4>
                <p className="pl-6 text-ellipsis overflow-hidden whitespace-nowrap">{marketingData?.tutorials?.primer}</p>
              </div>
              <div className="my-[30px]">
                <h3 className="text-lg font-semibold">External Reference</h3>
                {!marketingData?.external_media_links ? (
                  <div className="flex justify-center">
                    <p className="text-center text-gray-500">
                      No External Reference Videos found for this application.
                    </p>
                  </div>
                ) : (
                  marketingData?.external_media_links?.map(
                    (data, index) =>
                      data.category === "videos" && (
                        <div key={index}>
                          <p className="text-md font-semibold ml-2 my-3">
                            {data.title}
                          </p>
                          {convertToYouTubeEmbedUrl(data.url).status ? (
                            <iframe
                              width="100%"
                              height="100%"
                              src={convertToYouTubeEmbedUrl(data.url).newUrl}
                              title="YouTube video player"
                              frameBorder="2"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                              className="w-full h-[200px] sm:h-[400px] lg:h-[600px]"
                            ></iframe>
                          ) : (
                            <video width="600" height="400" controls muted loop>
                              <source src={data.url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          )}
                        </div>
                      )
                  )
                )}

                {marketingData?.external_media_links?.some((data) =>
                  data.url.includes(".pdf")
                ) && (
                    <div className="my-4">
                      <p className="text-md font-semibold ml-2 my-3">
                        External Documents
                      </p>
                      <div className="grid grid-cols-2 gap-4 min-h-[50px] max-h-[360px] overflow-auto ml-4">
                        {marketingData?.external_media_links?.map(
                          (data, index) => {
                            const dataUrl = data.url;
                            const dataTitle = data.title;

                            if (
                              dataUrl.includes(".pdf") &&
                              data.category === "images"
                            ) {
                              return (
                                <div key={index}>
                                  <Link
                                    to={getApiDomain(dataUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <p className="text-md font-semibold ml-4">
                                      {dataTitle}
                                      <AiFillFilePdf className="inline text-red-500 ml-2" />
                                    </p>
                                  </Link>
                                </div>
                              );
                            }

                            return null; // This ensures that non-PDF images are not duplicated.
                          }
                        )}
                      </div>
                    </div>
                  )}
                {
                  marketingData?.external_media_links?.some(
                    (data) => !data.url.includes(".pdf") && data.category === "images"
                  ) ? (
                    <div className="my-2">
                      <p className="text-md font-semibold my-3 ml-2">
                        External Images
                      </p>
                      <Swiper
                        navigation={true}
                        modules={[Navigation, Autoplay]}
                        autoplay={{ delay: 2000, disableOnInteraction: false }}
                        spaceBetween={10}
                        slidesPerView={1}
                        loop={true}
                        className="mySwiper h-[300px]"
                      >
                        {marketingData?.external_media_links?.map((data, index) => {
                          const dataUrl = data.url;
                          const dataTitle = data.title;

                          if (!dataUrl.includes(".pdf") && data.category === "images") {
                            return (
                              <SwiperSlide key={index}>
                                <div className="relative">
                                  <img
                                    src={getApiDomain(dataUrl)}
                                    alt={dataTitle}
                                    className="w-full h-[300px] object-cover rounded-lg shadow-md"
                                  />
                                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-md">
                                    <AiFillPicture className="inline mr-1" />
                                    {dataTitle}
                                  </div>
                                </div>
                              </SwiperSlide>
                            );
                          }

                          return null; // Prevent rendering if not a valid image.
                        })}
                      </Swiper>
                    </div>
                  ) : (
                    // Show placeholder when no valid images are found
                    <div className="py-2">
                      <p className="text-md font-semibold my-3 ml-2">
                        External Images
                      </p>
                      <div className="flex items-center justify-center w-full h-[220px] bg-gray-200 rounded-lg shadow-md">
                        <p className="text-gray-500">No external images available</p>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No Application Marketing Information found for this application.
        </p>
      )}
    </div>
  );
};

export default MarketingSection;
