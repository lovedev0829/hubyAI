import { FC, useState } from "react";
import { Link } from "react-router-dom";
import Top from "../../assets/Images/top.png";
import thumbup from "../../assets/Images/thumb_up.png";
import errowup from "../../assets/Images/arrow-up.png";
import heart from "../../assets/Images/heart.png";
import Star from "../../assets/Images/Star.png";
import Starborder from "../../assets/Images/Star-border.png";

// import AverageRatingComponent from "../ApplicationRatings/AverageRatingComponent";

interface RenderApplicationProps {
  val: any;
  showReviews?: boolean;
  appName?: string;
  searchText?: string;
}

const RenderApplication: FC<RenderApplicationProps> = ({
  val,
  showReviews = false,
  appName,
  searchText,
}) => {
  let redirectUrl: string;
  const linkStyle: React.CSSProperties = {
    textDecoration: "none",
  };

  if (val?._id?.$oid ?? val?.application_id) {
    redirectUrl =
      `/appdetails?application_id=${val?._id?.$oid ?? val?.application_id}` +
      (searchText ? `&search_text=${searchText}` : "");
  } else {
    redirectUrl =
      `/appdetails?name=${appName || ""}` +
      (searchText ? `&search_text=${searchText}` : "");
  }
  const [imageError, setImageError] = useState(false);
  const handleError = () => {
    setImageError(true);
  };

  const logoUrl = val.application_logo_url ?? val.product_logo_url ?? val.app_logo_url
  return (
    <div>
      <Link
        // to={val.company_url}
        to={redirectUrl}
        state={
          redirectUrl ===
            `/appdetails?name=${appName}&search_text=${searchText}`
            ? { val }
            : undefined
        }
        style={linkStyle}
      // target="_blank"
      >
        <div className="mt-[28px] relative shadow-[0px_9px_24px_-13px_#3333331A] bg-[#FFFFFFC2] rounded-[16px] mb-[24px] sm:p-[16px] p-[12px] flex items-center cursor-pointer group trans gap-[20px]">
          <div className="flex md:gap-[32px] gap-[15px] items-center">
            {logoUrl && !imageError ? (
              <img
                src={logoUrl}
                onError={handleError}
                alt="start-box"
                className="w-[50px]"
              />
            ) : (
              <div className="w-[60px] h-[50px] bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500"></span>
              </div>
            )}
            <div className="w-full">
              <div className="flex gap-1 items-center">
                <p className="sm:text-[16px] text-[14px] sm:mt-2 mt-1 text-left mb-0">
                  {val.application}
                </p>
                <img src={Top} alt="Top" />
              </div>
              <p className="mulish text-[#666666] sm:text-[14px] text-[12px] sm:mt-2 mt-1 text-left mb-0 md:w-[598px]">
                {val.description}
              </p>
              {showReviews && (
                <p className="mulish text-[#666666] sm:text-[14px] text-[12px] text-left mb-0 md:w-[598px]">
                  {val.reviews}
                </p>
              )}

              {/* {
                <AverageRatingComponent
                  applicationId={val?._id?.$oid ?? val?.application_id}
                />
              }

              <div className="flex items-center sm:gap-[20px] gap-[10px] mt-2">
                <button
                  className="bg-[#66666629] p-[10px] rounded-full"
                  data-testid="arrow20"
                >
                  <img src={errowup} alt="arrow-up" />
                </button>
                <button className="border-[1px] boder-[#66666629] rounded-[14px] shadow-[0px_4px_4px_0px_#00000040] p-[7px_14px]">
                  <img src={heart} alt="heart" />
                </button>
              </div> */}

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
              <div className="flex gap-[8px] items-center sm:mt-[10px] mt-1 flex-wrap">
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
      </Link>
    </div>
  );
};

export default RenderApplication;
