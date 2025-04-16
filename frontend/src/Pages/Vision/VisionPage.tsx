import Header from "../../components/Header/Header";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const VisionPage = () => {
  return (
    <>
      <div>
        <Header path="/prototypedetails" />
        <div>
          <div className="max-w-[1100px] mx-auto px-[14px]">
            <div className="shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border-[#000] border-[1px] m-[60px_0] rounded-[10px] flex justify-between items-center">
              <div>
                <h1 className="text-[40px] mb-[24px] font-bold text-black px-[20px] roboto mt-20">
                  Our Vision
                </h1>
                <p className="mb-0 text-[24px] f-[16px] font-normal roboto  px-[20px] ">
                  Expand AI capabilities to uplift humanity.
                </p>
              </div>
              <div className="bg-[#ECECEC] h-[180px] w-[180px]"></div>
            </div>
          </div>
          <div className="max-w-[1100px] mx-auto px-[14px]">
            <div className="shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border-[#000] border-[1px] m-[60px_0] rounded-[10px] flex justify-between items-center">
              <div>
                <h1 className="text-[40px] mb-[24px] font-bold text-black px-[20px] roboto mt-20">
                  Our Mission
                </h1>
                <p className="mb-0 text-[24px] f-[16px] font-normal roboto  px-[20px] ">
                  Build a collaborative ecosystem of practical AI.
                </p>
              </div>
              <div className="bg-[#ECECEC] h-[180px] w-[180px]"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisionPage;
