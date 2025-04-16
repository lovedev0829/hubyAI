import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import emoji from "../../assets/Images/emoji.png";
import trophy from "../../assets/Images/Trophy.png";
import { TiStarFullOutline } from "react-icons/ti";
import thumdown from "../../assets/Images/thumdown.png";
import thumup from "../../assets/Images/thumup.png";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import hart from "../../assets/Images/red-hart.png";
import comment from "../../assets/Images/comment.png";
import mobile from "../../assets/Images/mobile.png";

const PrototypeDetailPage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div>
      <Header path="/prototypedetails" />

      <div>
        <div className="flex md:flex-row flex-col justify-center items-center xl:gap-[60px] lg:gap-[30px] xl:p-[60px_170px] sm:p-[40px] p-[20px_16px] border-b-[1px] border-b-[#E6E6E6]">
          <div className="md:w-[50%] ">
            <h1 className="md:text-[40px] text-[28px] font-bold sm:sm:leading-[48px] roboto !text-center md:!text-left">
              App Name
            </h1>
            <p className="md:!text-left !text-center text-[16px] font-normal sm:sm:leading-[24px] roboto md:mt-[24px] mt-[12px]">
              Description of the app
            </p>
          </div>
          <div className="md:w-[50%]">
            <div className="bg-[#ECECEC] xl:w-[577px] lg:w-[430px] sm:w-[350px] w-[250px] xl:h-[400px] sm:h-[280px] h-[200px]"></div>
          </div>
        </div>

        <div className="xl:p-[60px_170px] sm:p-[40px] p-[20px_16px] border-b-[1px] border-b-[#E6E6E6]">
          <div className="flex sm:flex-row flex-col-reverse justify-start xl:gap-[60px] sm:gap-[30px] gap-[15px] items-center">
            <div className="bg-[#ECECEC] w-[180px] h-[180px]"></div>
            <h1 className="md:text-[40px] text-[28px] font-bold sm:sm:leading-[48px] roboto sm:!text-left !text-center">
              Other Apps by Developer
            </h1>
          </div>
          <div className="lg:mt-[60px] mt-[30px] grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 items-center xl:gap-[40px] gap-[20px]">
            <div className="border-[1px] border-[#D4D4D4] rounded-[6px] ">
              <div className="h-[340px] bg-[#EBEBEB] ">
                <button className="bg-[#E0E0E0] text-[12px] font-medium sm:leading-[16px] roboto p-[6px_8px] rounded-br-[6px] rounded-tl-[6px]">
                  New
                </button>
                <p
                  className="text-[12px] font-normal sm:leading-[16px] roboto 2xl:m-[25%_0_auto] md:m-[37%_0_auto] sm:m-[23%_0_auto] m-[37%_0_auto] text-center flex justify-center items-center"
                  data-testid="app-image-placeholder"
                >
                  App Image 1
                </p>
              </div>
              <div className="p-[12px]">
                <p className="text-[16px] font-normal sm:leading-[24px] roboto m-0 ">
                  App 1
                </p>
                <h3 className="text-[20px] font-medium sm:leading-[28px] roboto m-0 mt-[4px]">
                  Details about App 1
                </h3>
                <div className="flex items-center gap-[8px] mt-[4px]">
                  <img src={emoji} alt="emoji" className="w-[24px] h-[24px]" />
                  <img
                    src={trophy}
                    alt="trophy"
                    className="w-[24px] h-[24px]"
                  />
                </div>
              </div>
            </div>

            <div className="border-[1px] border-[#D4D4D4] rounded-[6px] ">
              <div className="h-[340px] bg-[#EBEBEB]">
                <button className="bg-[#E0E0E0] text-[12px] font-medium sm:leading-[16px] roboto p-[6px_8px] rounded-br-[6px] rounded-tl-[6px]">
                  Popular
                </button>
                <p
                  className="text-[12px] font-normal sm:leading-[16px] roboto 2xl:m-[25%_0_auto] md:m-[37%_0_auto] sm:m-[23%_0_auto] m-[37%_0_auto] text-center flex justify-center items-center"
                  data-testid="app-image-placeholder"
                >
                  App Image 2
                </p>
              </div>
              <div className="p-[12px]">
                <p className="text-[16px] font-normal sm:leading-[24px] roboto m-0 ">
                  App 2
                </p>
                <h3 className="text-[20px] font-medium sm:leading-[28px] roboto m-0 mt-[4px]">
                  Details about App 2
                </h3>
                <div className="flex items-center gap-[8px] mt-[4px]">
                  <img src={emoji} alt="emoji" className="w-[24px] h-[24px]" />
                  <img
                    src={trophy}
                    alt="trophy"
                    className="w-[24px] h-[24px]"
                  />
                </div>
              </div>
            </div>

            <div className="border-[1px] border-[#D4D4D4] rounded-[6px] ">
              <div className="h-[340px] bg-[#EBEBEB]">
                <button className="bg-[#E0E0E0] text-[12px] font-medium sm:leading-[16px] roboto p-[6px_8px] rounded-br-[6px] rounded-tl-[6px]">
                  Top Rated
                </button>
                <p
                  className="text-[12px] font-normal sm:leading-[16px] roboto 2xl:m-[25%_0_auto] md:m-[37%_0_auto] sm:m-[23%_0_auto] m-[37%_0_auto] text-center flex justify-center items-center"
                  data-testid="app-image-placeholder"
                >
                  App Image 3
                </p>
              </div>
              <div className="p-[12px]">
                <p className="text-[16px] font-normal sm:leading-[24px] roboto m-0 ">
                  App 3
                </p>
                <h3 className="text-[20px] font-medium sm:leading-[28px] roboto m-0 mt-[4px]">
                  Details about App 3
                </h3>
                <div className="flex items-center gap-[8px] mt-[4px]">
                  <img src={emoji} alt="emoji" className="w-[24px] h-[24px]" />
                  <img
                    src={trophy}
                    alt="trophy"
                    className="w-[24px] h-[24px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:p-[60px_170px] sm:p-[40px] p-[20px_16px] flex lg:flex-row flex-col items-center xl:gap-[60px] lg:gap-[30px] border-b-[1px] border-b-[#E6E6E6]">
          <div className="lg:w-[50%]">
            <div>
              <h1
                className="md:text-[40px] text-[28px] font-bold sm:sm:leading-[48px] roboto m-0 sm:!text-left !text-center"
                data-testid="user-review-placeholder"
              >
                User Reviews
              </h1>
              <p className="text-[16px] font-normal sm:sm:leading-[24px] roboto xl:mt-[24px] mt-[12px] sm:!text-left !text-center">
                See what users are saying about the app
              </p>
            </div>
            <div className="flex sm:flex-row flex-col xl:gap-[40px] gap-[20px] xl:mt-[60px] sm:mt-[30px] py-[20px]">
              <div className="bg-[#F2F2F2] rounded-[6px] p-[16px] ">
                <div className="flex items-center">
                  <div className="flex gap-[8px] items-center">
                    <div className="bg-[#DADADA] w-[32px] h-[32px] rounded-full"></div>
                    <h6 className="text-[14px] font-medium sm:leading-[20px] roboto">
                      User 1
                    </h6>
                  </div>
                  <div className="ml-auto">
                    <button>
                      <TiStarFullOutline className="text-[#FFC700]" />
                    </button>
                    <button>
                      <TiStarFullOutline className="text-[#FFC700]" />
                    </button>
                    <button>
                      <TiStarFullOutline className="text-[#FFC700]" />
                    </button>
                    <button>
                      <TiStarFullOutline className="text-[#FFC700]" />
                    </button>
                    <button>
                      <TiStarFullOutline className="text-[#FFC700]" />
                    </button>
                  </div>
                </div>
                <p className="text-[16px] font-normal sm:leading-[24px] roboto mt-[16px] h-[72px] mb-0">
                  Great app! Really useful features.
                </p>
                <div className="flex gap-[8px]">
                  <img src={thumdown} alt="thumdown" />
                  <img src={thumup} alt="thumup" />
                </div>
              </div>

              <div className="bg-[#F2F2F2] rounded-[6px] p-[16px] ">
                <div className="flex items-center">
                  <div className="flex gap-[8px] items-center">
                    <div className="bg-[#DADADA] w-[32px] h-[32px] rounded-full"></div>
                    <h6 className="text-[14px] font-medium sm:leading-[20px] roboto">
                      User 2
                    </h6>
                  </div>
                  <div className="ml-auto">
                    <button>
                      <TiStarFullOutline className="text-[#FFC700]" />
                    </button>
                    <button>
                      <TiStarFullOutline className="text-[#FFC700]" />
                    </button>
                    <button>
                      <TiStarFullOutline className="text-[#FFC700]" />
                    </button>
                    <button>
                      <TiStarFullOutline className="text-[#FFC700]" />
                    </button>
                    <button>
                      <TiStarFullOutline className="text-[#FFC700]" />
                    </button>
                  </div>
                </div>
                <p className="text-[16px] font-normal sm:leading-[24px] roboto mt-[16px] h-[72px] mb-0">
                  Needs improvement in performance.
                </p>
                <div className="flex gap-[8px]">
                  <img src={thumdown} alt="thumdown" />
                  <img src={thumup} alt="thumup" />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-[50%] flex justify-end">
            <div className="bg-[#ECECEC] xl:w-[577px] lg:w-[430px] sm:w-[350px] w-[250px] xl:h-[388px] sm:h-[280px] h-[200px]"></div>
          </div>
        </div>

        <div className="xl:p-[60px_170px] sm:p-[40px] p-[20px_16px] border-b-[1px] border-b-[#E6E6E6]">
          <h1
            className="md:text-[40px] text-[28px] font-bold sm:sm:leading-[48px] roboto text-center"
            data-testid="latest-update-placeholder"
          >
            Latest Updates
          </h1>
          <p className="text-[16px] font-normal sm:sm:leading-[24px] roboto md:mt-[24px] mt-[10px] text-center">
            Stay connected with the app community
          </p>
          <div>
            <div className="border-[1px] border-[#E6E6E6] rounded-[6px] py-[12px] md:w-[600px] sm:m-[60px_auto] m-[20px_auto] ">
              <div className="flex gap-[8px] items-center px-[12px]">
                <div className="bg-[#ECECEC] w-[32px] h-[32px] rounded-full"></div>
                <h3 className="text-[14px] font-medium sm:sm:leading-[20px] roboto my-0">
                  AppTeam
                </h3>
                <button className="ml-auto">
                  <PiDotsThreeOutlineFill />
                </button>
              </div>
              <div>
                <div className="slider-container" data-testid="carousel-slide">
                  <Slider {...settings}>
                    <div>
                      <div
                        className="bg-[#ECECEC] w-full h-[300px]"
                        data-testid="carousel"
                      >
                        <p className="text-[12px] font-normal sm:sm:leading-[16px] text-center">
                          Post Image
                        </p>
                      </div>
                    </div>
                    <div>
                      <div
                        className="bg-[#ECECEC] w-full h-[300px]"
                        data-testid="carousel"
                      >
                        <p className="text-[12px] font-normal sm:sm:leading-[16px] text-center">
                          Post Image
                        </p>
                      </div>
                    </div>
                    <div>
                      <div
                        className="bg-[#ECECEC] w-full h-[300px]"
                        data-testid="carousel"
                      >
                        <p className="text-[12px] font-normal sm:sm:leading-[16px] text-center">
                          Post Image
                        </p>
                      </div>
                    </div>
                    <div>
                      <div
                        className="bg-[#ECECEC] w-full h-[300px]"
                        data-testid="carousel"
                      >
                        <p className="text-[12px] font-normal sm:sm:leading-[16px] text-center">
                          Post Image
                        </p>
                      </div>
                    </div>
                  </Slider>
                </div>
              </div>
              <div className="px-[12px]">
                <h6 className="text-[16px] font-normal sm:sm:leading-[24px] roboto sm:mt-[12px] mt-[6px] mb-0">
                  Exciting new features released! Check them out now.
                </h6>
                <button className="text-[12px] font-normal sm:sm:leading-[16px] roboto p-[2px_4px] bg-[#EBEBEB] rounded-[2px] border-[0.5px] border-[#D4D4D4]">
                  Update
                </button>
                <div className="flex gap-[8px] items-center mt-[8px]">
                  <img src={hart} alt="hart" data-testid="heart-icon" />
                  <img src={comment} alt="comment" data-testid="comment-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:p-[60px_170px] sm:p-[40px] p-[20px_16px] border-b-[1px] border-b-[#E6E6E6] flex sm:flex-row flex-col xl:gap-[60px] lg:gap-[30px] items-center">
          <div className="sm:w-[50%] w-full">
            <h1
              className="md:text-[40px] text-[28px] font-bold sm:sm:leading-[48px] roboto !text-center md:!text-left"
              data-testid="related-app-placeholder"
            >
              Related Apps
            </h1>
          </div>
          <div className="sm:w-[50%] w-full">
            <div className="border-b-[1px] border-b-[#E6E6E6] flex sm:gap-[16px] gap-[8px] sm:py-[24px] py-[12px]">
              <img src={mobile} alt="mobile" />
              <div>
                <h6 className="text-[20px] font-normal sm:leading-[28px] roboto">
                  App A
                </h6>
                <p className="text-[#808080] text-[16px] font-normal sm:leading-[24px] roboto mb-0">
                  Similar app to explore
                </p>
              </div>
            </div>

            <div className="border-b-[1px] border-b-[#E6E6E6] flex sm:gap-[16px] gap-[8px] sm:py-[24px] py-[12px]">
              <img src={mobile} alt="mobile" />
              <div>
                <h6 className="text-[20px] font-normal sm:leading-[28px] roboto">
                  App B
                </h6>
                <p
                  className="text-[#808080] text-[16px] font-normal sm:leading-[24px] roboto mb-0"
                  data-testid="other-apps-placeholder"
                >
                  Another great app choice
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap sm:gap-[60px] gap-[20px] justify-center xl:p-[60px_170px] sm:p-[40px] p-[20px_16px]">
          <h6 className="sm:text-[20px] text-[16px] font-normal sm:leading-[28px] roboto">
            Privacy Policy
          </h6>
          <h6 className="sm:text-[20px] text-[16px] font-normal sm:leading-[28px] roboto">
            Terms of Service
          </h6>
          <h6 className="sm:text-[20px] text-[16px] font-normal sm:leading-[28px] roboto">
            Social Media
          </h6>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrototypeDetailPage;
