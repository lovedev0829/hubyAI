import Top from "../../assets/Images/top.png";
// import Star from "../../assets/Images/Star.png";
// import Starborder from "../../assets/Images/Star-border.png";
import thumbup from "../../assets/Images/thumb_up.png";
import errowup from "../../assets/Images/arrow-up.png";
import heart from "../../assets/Images/heart.png";
// import StarBox from "../../assets/Images/start-box.png";
// import appreview1 from "../../assets/Images/app-review1.png";
// import appreview2 from "../../assets/Images/app-review2.png";
// import appreview3 from "../../assets/Images/app-review3.png";
// import downdouble from "../../assets/Images/down-double.png";
// import Search from "../../assets/Images/search.png";
// import edit from "../../assets/Images/Edit.png";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useEffect, useState } from "react";
// import { GrClose } from "react-icons/gr";
import {
  // calculateAverageRatings,
  fetchGetApi,
} from "../../functions/apiFunctions";
import Sidebar from "../../components/Sidebar/Sidebar";
// import { FaRegThumbsUp } from "react-icons/fa";
// import { FaThumbsUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CommentTree from "../../components/Comments/structureComments";
import RatingsComponent from "../../components/ApplicationRatings/RatingsComponent";
import CreateRatingsComponent from "../../components/ApplicationRatings/CreateRatingsComponent";
import AverageRatingComponent from "../../components/ApplicationRatings/AverageRatingComponent";
import ModelSection from "../../components/ApplicationDetailPage/ModelSection";
import ApplicationRuntime from "../../components/ApplicationDetailPage/ApplicationRuntime";
import SourceInformation from "../../components/ApplicationDetailPage/SourceInformation";
import MarketingSection from "../../components/ApplicationDetailPage/MarketingSection";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { AiFillPicture } from "react-icons/ai";
import { useLocation } from "react-router-dom";
// import { convertToYouTubeEmbedUrl } from "../../functions/helper";

const AppDetailsPage: React.FC = () => {
  // const [open, setOpen] = useState<boolean>(false); // Specify boolean type for the state
  // const [hoveredId, setHoveredId] = useState(null);

  //This page should not require the user login.
  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );

  const user = JSON.parse(localStorage.getItem("userData") as string);
  const loginUser = user?.user_id;

  const navigate = useNavigate();
  const location = useLocation();

  const [filterAppData, setFilterAppData] = useState(null);
  const [ratingAppData, setRatingAppData] = useState([]);
  const [applicationId, setApplicationId] = useState("");
  const [appName, setAppName] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isUserCreateRatings, setIsUserCreateRatings] = useState(false);
  const [Owner, setOwner] = useState("");

  // const [avgRatings, setAvgRatings] = useState(null);

  // const initialCreateRatingData = {
  //   prot_impact_rating: null,
  //   proto_practicality_rating: null,
  //   app_practicality_rating: null,
  //   app_performance_rating: null,
  //   app_ux_rating: null,
  //   app_ecosystem_rating: null,
  //   comment: "",
  //   owner_comment_reply: "",
  //   upvote_downvote: null,
  // };
  // const [createRatingData, setCreateRatingData] = useState(
  //   initialCreateRatingData
  // );
  // const [upvoteDownvote, setUpvoteDownvote] = useState(false);

  // const [showAppID, setShowAppID] = useState("");
  const [statusData, setStatusData] = useState([]);
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const appId = urlParams.get("application_id");
    const name = urlParams.get("name");
    const search = urlParams.get("search_text");
    // console.log(appId);
    setApplicationId(appId);
    setAppName(name);
    setSearchText(search);
  }, []);

  const handleShowButton = async () => {
    // if (applicationId === "") {
    //   toast.error("Please select an App Name");
    //   return;
    // }
    try {
      const path = `/api/applications/user_comments/${applicationId}`;
      // const response = await fetchGetApi(path, access_user);
      const response = await fetchGetApi(path, undefined, navigate, location);
      if (response.status === 200) {
        setStatusData(response.data);
      }
    } catch (error) {
      // toast.error(error?.response?.data?.error);
      // setShowAppID("");
      // setCommentData([]);
    }
  };
  useEffect(() => {
    applicationId && handleShowButton();
  }, [applicationId]);

  useEffect(() => {
    const filterAppDataByLoginUser = async () => {
      if (applicationId) {
        try {
          const path = `/api/applications/${applicationId}${searchText ? `?search_text=${searchText}` : ""
            }`;
          const response = await fetchGetApi(
            path,
            access_user,
            navigate,
            location
          );
          setFilterAppData(response?.data);
          setOwner(response?.data.created_by);
          // console.log("application by id data: ", response?.data);
        } catch (error) {
          console.error("filterData Error:", error);
        }
      }
    };
    setIsLoading(true);
    applicationId && filterAppDataByLoginUser();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [applicationId]);

  // ================= fetch Detail steps data Api ==================================

  useEffect(() => {
    const fetchDetailSetpsData = async () => {
      if (!applicationId) {
        try {
          setIsSearchLoading(true);
          const path = `/api/application/external?name=${appName}&search_text=${searchText}`;
          const response = await fetchGetApi(
            path,
            access_user,
            navigate,
            location
          );
          const combinedData = { ...location?.state?.val, ...response.data };
          setFilterAppData(combinedData);
          // setOwner(response?.data.created_by);
          // console.log("response", combinedData);
          setIsSearchLoading(false);
        } catch (error) {
          console.error("filterData Error:", error);
          setIsSearchLoading(false);
        }
      }
    };

    (appName || searchText) && fetchDetailSetpsData();
  }, [appName, searchText]);

  const fetchRatingData = async () => {
    try {
      const path = `/api/applications/ratings/${applicationId}`;
      //const response = await fetchGetApi(path, access_user);
      const response = await fetchGetApi(path, undefined, navigate, location);
      setRatingAppData(response?.data);
    } catch (error) {
      console.error("fetchRatingData Error:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    applicationId && fetchRatingData();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [applicationId]);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  const hasUserCreatedRating = (ratings, userId) => {
    return ratings.some((rating) => rating?.created_by === userId);
  };

  useEffect(() => {
    if (ratingAppData) {
      const userHasCreatedRating = hasUserCreatedRating(
        ratingAppData,
        loginUser
      );
      setIsUserCreateRatings(userHasCreatedRating);
    }
  }, [ratingAppData, loginUser]);

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

  const [marketingData, setMarketingData] = useState<MarketingData | null>(
    null
  );
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);
  const getApiDomain = (url: string) => {
    // Remove 'dist' from the URL and add 'assets' instead
    return url.replace("dist/", "https://huby.ai/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // setLoading(true);
        const path = `/api/applications/marketing/${applicationId}`;
        const response = await fetchGetApi(path, undefined, navigate, location);
        if (response.status === 200) {
          setMarketingData(response?.data);
        }
      } catch (error) {
        // const errorMessage = error.error || "Model not Found";
        // setError(errorMessage);
      } finally {
        // setLoading(false);
      }
    };

    applicationId && fetchData();
  }, [applicationId]);

  return (
    <div className="overflow-hidden">
      <Header path="appdetails" toggleSidebar={toggleSidebar} />

      {isLoading && <div className="appDetailsLoader"></div>}

      {!isLoading && (
        <div>
          <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} isActive="" />
          <div className="flex" data-testid="sidebar-toggle">
            <div className="flex sm:flex-row flex-col w-full ">
              {/*==================== Hovered model ================================*/}

              <div className="sm:m-[auto_auto_100px_auto] mx-[10px]">
                <div className="md:pt-[35px] pt-[22px] pb-[55px]  sm:w-[600px] lg:w-[900px] xl:w-[1150px] px-[10px]">
                  <div className="px-[12px] app-details-container  flex gap-5 flex-col lg:flex-row">
                    {applicationId &&
                      marketingData?.images &&
                      marketingData.images.some(
                        (image) => !Object.values(image)[0].includes(".pdf")
                      ) ? (
                      <Swiper
                        navigation={true}
                        modules={[Navigation, Autoplay]}
                        autoplay={{
                          delay: 2000,
                          disableOnInteraction: false,
                          pauseOnMouseEnter: true,
                        }}
                        spaceBetween={10}
                        slidesPerView={1}
                        loop={true}
                        className="h-[330px]"
                      >
                        {marketingData.images.map((image, index) =>
                          !Object.values(image)[0].includes(".pdf") ? (
                            <SwiperSlide key={index}>
                              <div className="relative">
                                <img
                                  src={getApiDomain(Object.values(image)[0])}
                                  alt={Object.keys(image)[0]}
                                  className="w-full h-[400px] object-cover rounded-lg shadow-md"
                                />
                                <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-md">
                                  <AiFillPicture className="inline mr-1" />
                                  {Object.keys(image)[0]}
                                </div>
                              </div>
                            </SwiperSlide>
                          ) : null
                        )}
                      </Swiper>
                    ) : (
                      applicationId && (
                        <div className="flex items-center justify-center w-full h-[220px] bg-gray-200 rounded-lg shadow-md">
                          <p className="text-gray-500">No images available</p>
                        </div>
                      )
                    )}

                    <div className="w-full mb-[40px] md:mb-[50px] xl:mb-[80px]">
                      <h1
                        className="text-[24px] font-black mulish text-left"
                        data-testid="appdetails"
                      >
                        Product Details
                      </h1>

                      {/* Render Details Setps Data */}
                      {!isSearchLoading && filterAppData?.detailed_steps ? (
                        <p className="text-sm whitespace-pre-wrap">
                          {filterAppData.detailed_steps}
                        </p>
                      ) : (
                        isSearchLoading && (
                          <div className="appDetailsLoader"></div>
                        )
                      )}

                      {applicationId && (
                        <div className="mt-[10px] relative shadow-[0px_9px_24px_-13px_#3333331A] bg-[#FFFFFF] rounded-[16px] sm:p-[16px] p-[12px] cursor-pointer group trans gap-[20px] border-[2px] border-[#000]">
                          {" "}
                          <div className="flex items-center gap-[10px]">
                            <div>
                              <div className="flex items-center gap-[10px]">
                                <div className="w-[40px] h-[40px] flex items-center justify-center bg-gray-200 rounded-full">
                                  {filterAppData?.application_logo_url ||
                                    filterAppData?.product_logo_url ||
                                    filterAppData?.app_logo_url ? (
                                    <img
                                      src={
                                        filterAppData?.application_logo_url ??
                                        filterAppData?.product_logo_url ??
                                        filterAppData?.app_logo_url
                                      }
                                      alt="start-box"
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <div className="w-full h-full" />
                                  )}
                                </div>
                                <p
                                  className="sm:text-[20px] text-[14px] sm:mt-2 mt-1 text-left mb-0"
                                  data-testid="GoogleAssistant"
                                >
                                  {filterAppData?.application}
                                </p>
                                <img src={Top} alt="Top" />
                              </div>
                              <p className="mulish text-[#666666] sm:text-[14px] text-[12px] sm:mt-2 mt-1 text-left mb-0 xl:w-[410px]">
                                {filterAppData?.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex sm:items-end justify-between flex-col-reverse sm:flex-row-reverse lg:gap-3">
                            <div className="flex items-center justify-center gap-[10px] xl:gap-[20px] mt-2">
                              <button
                                className="bg-[#66666629] p-[10px] rounded-full"
                                onClick={() =>
                                  window.open(
                                    filterAppData?.product_url ??
                                    filterAppData.company_url,
                                    "_blank"
                                  )
                                }
                              >
                                <img src={errowup} alt="arrow-up" />
                              </button>
                              <button className="border-[1px] boder-[#66666629] rounded-[14px] shadow-[0px_4px_4px_0px_#00000040] p-[7px_14px]">
                                <img src={heart} alt="heart" />
                              </button>
                            </div>

                            <div className="mt-[8px]">
                              <div className="flex gap-[8px] items-center sm:mt-[10px] mt-1 flex-wrap">
                                <p className="mulish text-[#666666] sm:text-[14px] text-[12px] mb-0 text-left">
                                  Free Options
                                </p>
                                <span className="bg-[#666666] w-[4px] h-[4px] rounded-full"></span>
                                <p className="mulish text-[#666666] sm:text-[14px] text-[12px] mb-0 text-left">
                                  Productivity
                                </p>
                              </div>
                              <div className="flex gap-[6px] xl:gap-[8px] items-center sm:mt-[10px] mt-1  justify-center sm:justify-normal flex-col sm:flex-row">
                                <button className="bg-[#FDB54A] p-[4px_6px] rounded-[6px] w-[80%] sm:w-auto flex justify-center items-center text-[#fff] text-[12px] font-normal mulish">
                                  Staff favorite
                                  <img src={thumbup} alt="thumb_up" />
                                </button>
                                <button className="bg-[#82DD57] p-[4px_6px] rounded-[6px] w-[80%] sm:w-auto flex justify-center items-center text-[#fff] text-[12px] font-normal mulish">
                                  High quality
                                  <img src={thumbup} alt="thumb_up" />
                                </button>
                                <button className="bg-[#7CCBEA] p-[4px_6px] rounded-[6px] w-[80%] sm:w-auto flex justify-center items-center text-[#fff] text-[12px] font-normal mulish">
                                  High quality
                                  <img src={thumbup} alt="thumb_up" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* <div className="w-[1000px] px-[12px] mt-[20px] mb-[80px]">
                  <h1 className="text-[24px] font-black mulish text-left">
                    App Details
                  </h1>
                  <div className="flex items-center gap-[10px] overflow-hidden mt-[10px]">
                    <img src={appreview1} alt="appreview" />
                    <img src={appreview2} alt="appreview" />
                    <img src={appreview3} alt="appreview" />
                  </div>
                </div> */}

                  {applicationId && (
                    <>
                      <div className="max-w-full px-[12px] mt-[20px] mb-[40px] md:mb-[50px] xl:mb-[80px]">
                        <h1 className="text-[24px] font-black mulish text-left">
                          Product Description
                        </h1>
                        <p className=" sm:text-[18px] font-normal hanken-grotesk text-left mt-[10px]">
                          {filterAppData?.description}
                        </p>
                      </div>
                      <ModelSection applicationId={applicationId} />
                      <ApplicationRuntime applicationId={applicationId} />
                      <SourceInformation applicationId={applicationId} />
                      <MarketingSection applicationId={applicationId} />
                      {ratingAppData && ratingAppData?.length > 0 && (
                        <div className="max-w-full px-[12px] my-[20px] mb-[40px] md:mb-[50px] xl:mb-[80px]">
                          <h1 className="text-[24px] font-black mulish text-left">
                            Ratings:
                          </h1>
                          <AverageRatingComponent
                            /*applicationId={applicationId}*/ ratingsData={
                              ratingAppData
                            }
                          />
                          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between border-b-[1px] border-b-[#000000] mt-[20px] mx-4">
                            {ratingAppData?.map((rating) => (
                              <RatingsComponent
                                rating={rating}
                                fetchRatingData={fetchRatingData}
                                Owner={Owner}
                                key={rating?.rating_id}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="max-w-full px-[12px] mt-[10px]">
                        {!isUserCreateRatings && (
                          <CreateRatingsComponent
                            applicationId={applicationId}
                            fetchRatingData={fetchRatingData}
                            Owner={Owner}
                          />
                        )}
                        <div className="mt-2 ">
                          <h1 className="text-[24px] font-black mulish text-left my-2">
                            Comments:
                          </h1>
                          <CommentTree
                            applicationId={applicationId}
                            initialComments={statusData}
                            fetchComments={handleShowButton}
                            dataType="userComment"
                          />
                        </div>

                        {/* <div className="flex justify-center mt-[10px] p-[6px_0px]">
                    <h6 className="text-[14px] font-normal mulish flex items-center">
                      Read more comments
                      <img src={downdouble} alt="downdouble" />
                    </h6>
                  </div>

                  <div className="max-w-[630px] mx-auto  mt-[10px] ">
                    <h1 className="text-[20px] font-normal mulish text-left">
                      Related apps
                    </h1>
                    <div className="mt-[10px] relative shadow-[0px_9px_24px_-13px_#3333331A] bg-[#FFFFFF] rounded-[16px] sm:p-[16px] p-[12px] flex justify-between items-center cursor-pointer group trans gap-[20px] border-[2px] border-[#000]">
                      <div className="flex md:gap-[32px] gap-[14px] items-center">
                        <img
                          src={StarBox}
                          alt="start-box"
                          className="sm:w-auto w-[50px]"
                        />
                        <div>
                          <div className="flex gap-1 items-center">
                            <p
                              className="sm:text-[16px] text-[14px] sm:mt-2 mt-1 text-left mb-0"
                              data-testid="GoogleAssistant"
                            >
                              Google Assistant
                            </p>
                            <img src={Top} alt="Top" />
                          </div>
                          <p className="mulish text-[#666666] sm:text-[14px] text-[12px] sm:mt-2 mt-1 text-left mb-0 xl:w-[410px]">
                            AI-powered virtual assistant by Google.
                          </p>
                          <div className="flex items-center justify-between flex-wrap gap-[10px]">
                            <div className="flex mt-[10px] gap-[3px] items-center">
                              <img src={Star} alt="Star" />
                              <img src={Star} alt="Star" />
                              <img src={Star} alt="Star" />
                              <img src={Star} alt="Star" />
                              <img src={Starborder} alt="Star" />
                            </div>
                            <div className="flex items-center gap-[20px]">
                              <button className="bg-[#66666629] p-[10px] rounded-full">
                                <img src={errowup} alt="arrow-up" />
                              </button>
                              <button className="border-[1px] boder-[#66666629] rounded-[14px] shadow-[0px_4px_4px_0px_#00000040] p-[7px_14px]">
                                <img src={heart} alt="heart" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-[8px]">
                            <div className="flex gap-[8px] items-center sm:mt-[10px] mt-1 flex-wrap">
                              <p className="mulish text-[#666666] sm:text-[14px] text-[12px] mb-0 text-left">
                                Free Option
                              </p>
                              <span className="bg-[#666666] w-[4px] h-[4px] rounded-full"></span>
                              <p className="mulish text-[#666666] sm:text-[14px] text-[12px] mb-0 text-left">
                                Productivity
                              </p>
                            </div>
                            <div className="flex gap-[8px] items-center sm:mt-[10px] mt-1 flex-wrap">
                              <button className="bg-[#FDB54A] p-[1px_8px] rounded-[6px] flex justify-center items-center text-[#fff] text-[12px] font-normal mulish">
                                Staff favorite
                                <img src={thumbup} alt="thumb_up" />
                              </button>
                              <button className="bg-[#82DD57] p-[1px_8px] rounded-[6px] flex justify-center items-center text-[#fff] text-[12px] font-normal mulish">
                                High quality
                                <img src={thumbup} alt="thumb_up" />
                              </button>
                              <button className="bg-[#7CCBEA] p-[1px_8px] rounded-[6px] flex justify-center items-center text-[#fff] text-[12px] font-normal mulish">
                                High quality
                                <img src={thumbup} alt="thumb_up" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-[10px] relative shadow-[0px_9px_24px_-13px_#3333331A] bg-[#FFFFFF] rounded-[16px] sm:p-[16px] p-[12px] flex justify-between items-center cursor-pointer group trans gap-[20px] border-[2px] border-[#000]">
                      <div className="flex md:gap-[32px] gap-[14px] items-center">
                        <img
                          src={StarBox}
                          alt="start-box"
                          className="sm:w-auto w-[50px]"
                        />
                        <div>
                          <div className="flex gap-1 items-center">
                            <p
                              className="sm:text-[16px] text-[14px] sm:mt-2 mt-1 text-left mb-0"
                              data-testid="GoogleAssistant"
                            >
                              Google Assistant
                            </p>
                            <img src={Top} alt="Top" />
                          </div>
                          <p className="mulish text-[#666666] sm:text-[14px] text-[12px] sm:mt-2 mt-1 text-left mb-0 xl:w-[410px]">
                            AI-powered virtual assistant by Google.
                          </p>
                          <div className="flex items-center justify-between flex-wrap gap-[10px]">
                            <div className="flex mt-[10px] gap-[3px] items-center">
                              <img src={Star} alt="Star" />
                              <img src={Star} alt="Star" />
                              <img src={Star} alt="Star" />
                              <img src={Star} alt="Star" />
                              <img src={Starborder} alt="Star" />
                            </div>
                            <div className="flex items-center gap-[20px]">
                              <button className="bg-[#66666629] p-[10px] rounded-full">
                                <img src={errowup} alt="arrow-up" />
                              </button>
                              <button className="border-[1px] boder-[#66666629] rounded-[14px] shadow-[0px_4px_4px_0px_#00000040] p-[7px_14px]">
                                <img src={heart} alt="heart" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-[8px]">
                            <div className="flex gap-[8px] items-center sm:mt-[10px] mt-1 flex-wrap">
                              <p className="mulish text-[#666666] sm:text-[14px] text-[12px] mb-0 text-left">
                                Free Option
                              </p>
                              <span className="bg-[#666666] w-[4px] h-[4px] rounded-full"></span>
                              <p className="mulish text-[#666666] sm:text-[14px] text-[12px] mb-0 text-left">
                                Productivity
                              </p>
                            </div>
                            <div className="flex gap-[8px] items-center sm:mt-[10px] mt-1 flex-wrap">
                              <button className="bg-[#FDB54A] p-[1px_8px] rounded-[6px] flex justify-center items-center text-[#fff] text-[12px] font-normal mulish">
                                Staff favorite
                                <img src={thumbup} alt="thumb_up" />
                              </button>
                              <button className="bg-[#82DD57] p-[1px_8px] rounded-[6px] flex justify-center items-center text-[#fff] text-[12px] font-normal mulish">
                                High quality
                                <img src={thumbup} alt="thumb_up" />
                              </button>
                              <button className="bg-[#7CCBEA] p-[1px_8px] rounded-[6px] flex justify-center items-center text-[#fff] text-[12px] font-normal mulish">
                                High quality
                                <img src={thumbup} alt="thumb_up" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative sm:mt-[45px] mt-[25px]">
                    <img
                      src={Search}
                      alt="Search"
                      className="absolute left-[12px] top-[50%] translate-y-[-50%]"
                    />
                    <input
                      type="text"
                      placeholder="I want to record, edit and transcribe my podcast to be used in social media"
                      className="border-[#66666680] border-[1px] rounded-[10px] placeholder:text-[#666666] outline-none w-full h-[32px] sm:p-[25px_38px_25px_38px] p-[17px_30px_17px_30px] truncate min-w-[100px]"
                    />
                    <img
                      src={edit}
                      alt="edit"
                      className="absolute sm:right-[7px] right-[2px] top-[50%] translate-y-[-50%] bg-white"
                    />
                  </div> */}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AppDetailsPage;
