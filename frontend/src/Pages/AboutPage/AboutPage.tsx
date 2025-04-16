import Header from "../../components/Header/Header";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Hubyteam from "../../assets/Images/huby-team.svg";
import { IoLocationSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <>
      <div>
        <Header path="/prototypedetails" />
        <div>
          <div className="w-full bg-[#000]  sm:p-[180px_0] py-[60px]  opacity-[60%]">
            <div className="max-w-[1100px] mx-auto px-[14px] flex flex-wrap items-center gap-[40px]">
              <div className="w-[100px] h-[100px] rounded-full bg-[#d9d9d9] opacity-[50%]"></div>
              <div>
                <div>
                  <img src={Hubyteam} alt="" />
                </div>
                {/* <h1 className="f-[24px] font-bold text-white roboto">
                  huby Team
                </h1> */}
                <button className="f-[12px] roboto text-black font-bold bg-[#d9d9d9] opacity-[50%] rounded-[2px] p-[5px_10px]">
                  AI Enthusiasts
                </button>
                <p className="f-[16px] text-white font-normal mt-[10px] roboto mb-0">
                  We are dedicated to bringing you the latest and most useful
                  Generative AI products through huby.
                </p>
              </div>
            </div>
          </div>
          <div className="max-w-[1100px] mx-auto px-[14px]">
            <div className="shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border-[#000] border-[1px] m-[60px_0] flex justify-between items-center">
              <div>
                <h1 className="text-[40px] mb-[24px] font-bold text-black roboto mt-20">
                  Our Mission
                </h1>
                <p className="mb-0 f-[16px] font-normal roboto">
                  Our mission is to harness the power of generative AI to uplift
                  humanity.
                </p>
              </div>
              <div className="bg-[#ECECEC] h-[180px] w-[180px]"></div>
            </div>
          </div>
          <div className="max-w-[1100px] mx-auto px-[14px] mt-[20px] grid sm:grid-cols-2 grid-cols-1 sm:gap-[40px] gap-[20px]">
            <div className="border-[rgba(0, 0, 0, 0.1)] border-[1px] rounded-md p-[14px] flex gap-[14px] items-start">
              <div className="bg-[#d9d9d97f] sm:min-w-[100px] min-w-[80px] sm:h-[100px] h-[80px]"></div>
              <div className="">
                <h2 className="text-[20px] font-medium roboto text-black">
                  Innovation in AI
                </h2>
                <p className="text-[16px] roboto mt-2">
                  We believe in driving innovation through accessible AI
                  applications.
                </p>
              </div>
            </div>
            <div className="border-[rgba(0, 0, 0, 0.1)] border-[1px] rounded-md p-[14px] flex gap-[14px] items-start">
              <div className="bg-[#d9d9d97f] sm:min-w-[100px] min-w-[80px] sm:h-[100px] h-[80px]"></div>
              <div className="">
                <h2 className="text-[20px] font-medium roboto text-black">
                  User-Centric Approach
                </h2>
                <p className="text-[16px] roboto mt-2">
                  Our focus is on creating a seamless experience for all users.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#f2f2f2] max-w-[1100px] mx-auto px-[14px] bg-no-repeat bg-cover md:mt-[144px] mt-[100px]">
            <div className="bg-map h-[292px] flex flex-col justify-center gap-2 items-center">
              <IoLocationSharp className="text-[#a9a9a9] text-[24px]" />
              <p className="roboto text-[16px] font-medium">
                Explore the global impact of AI and how Huby is connecting users
                worldwide.
              </p>
            </div>
          </div>
          <div className=" flex justify-center md:flex-row flex-col md:gap-[60px] gap-[30px] md:mb-0 mb-[20px] mt-[64px] md:h-[90px] items-center px-[14px]">
            <Link
              to="/values"
              className="lg:text-[20px] text-[18px] roboto mb-0 no-underline"
            >
              Our Values
            </Link>
            <p className="lg:text-[20px] text-[18px] roboto mb-0">
              © 2024 huby. All Rights Reserved.
            </p>
            <Link
              to="/terms"
              className="lg:text-[20px] text-[18px] roboto mb-0 no-underline"
            >
              Terms of Use
            </Link>

            <Link
              to="/privacy"
              className="lg:text-[20px] text-[18px] roboto mb-0 font-normal no-underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
