import facebooklogo from "../../assets/Images/facebook-logo.png";
import twitter from "../../assets/Images/twitter.png";
import instagram from "../../assets/Images/instagram.png";
import Combinedshape from "../../assets/Images/Combined.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div data-testid="footer" className="md:fixed w-full bottom-0 z-[2]">
      <div className="bg-[#252525] md:p-[26px_34px_26px_12px] p-[10px] flex flex-col md:flex-row justify-between md:gap-0 gap-[3px] items-center relative bottom-0 w-full z-1">
        <div className="flex flex-row lg:gap-[50px] gap-[25px] items-center ">
          <div className="flex gap-[7px] lg:gap-[13px] items-center">
            <Link
              to="/about"
              className="text-[#D0D0D0] text-[16px] lg:text-[18px] leading-[26px] font-normal hanken-grotesk m-0 md:px-[6px] no-underline"
            >
              About Us
            </Link>
            <Link
              to="mailto:support@huby.ai"
              className="text-[#D0D0D0] text-[16px] lg:text-[18px] leading-[26px] font-normal hanken-grotesk m-0 md:px-[4px] no-underline"
            >
              Contact Us
            </Link>
          </div>
          <div className="flex lg:gap-[31px] gap-[10px] items-center">
            <img src={facebooklogo} alt="facebooklogo" />
            <img src={twitter} alt="twitter" />
            <img src={instagram} alt="instagram" />
            <img src={Combinedshape} alt="Combined-shape" />
          </div>
        </div>
        <div>
          <p className="text-[#D0D0D0] text-[14px] lg:text-[16px]  font-normal leading-[26px] text-center m-0 ">
            © 2024 huby. All rights reserved.{" "}
          </p>
        </div>
        <div className="flex gap-[20px] lg:gap-[50px]">
          <div >
            <Link
              to="/privacy"
              className="text-[#D0D0D0] text-[16px] lg:text-[18px] leading-[26px] font-normal hanken-grotesk m-0 md:px-[6px] no-underline"
            >
              Privacy Policy
            </Link>
          </div>
          <div>
            <Link
              to="/terms"
              className="text-[#D0D0D0] text-[16px] lg:text-[18px] font-normal leading-[20px] hanken-grotesk m-0 no-underline"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
