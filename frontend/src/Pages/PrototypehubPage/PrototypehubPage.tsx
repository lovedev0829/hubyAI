import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useState } from "react";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";

const PrototypehubPage = () => {
  const [viewAllApps, setViewAllApps] = useState(false);
  const navigate = useNavigate();

  const handleViewAllApps = () => {
    setViewAllApps(!viewAllApps);
  };

  return (
    <div>
      <Header path="prototypehub" />

      <div>
        <div className="flex md:flex-row flex-col justify-center items-center xl:gap-[60px] lg:gap-[30px] xl:p-[60px_170px] sm:p-[40px] p-[20px_16px] border-b-[1px] border-b-[#E6E6E6]">
          <div className="md:w-[50%] ">
            <h1 className="md:text-[40px] text-[28px] font-bold sm:leading-[48px] roboto !text-center md:!text-left">
              Coming Soon...
            </h1>
            <p className="md:!text-left !text-center text-[16px] font-normal sm:leading-[24px] roboto md:mt-[24px] mt-[12px]">
              Browse through a collection of innovative prototypes.
            </p>
          </div>
          <div className="md:w-[50%]">
            <div className="bg-[#ECECEC] xl:w-[520px] lg:w-[430px] sm:w-[350px] w-[250px] xl:h-[400px] sm:h-[280px] h-[200px]"></div>
          </div>
        </div>

        <div className="xl:p-[60px_170px] sm:p-[40px] p-[20px_16px] border-b-[1px] border-b-[#E6E6E6]">
          {viewAllApps && (
            <button
              className="text-[16px] font-medium leading-[24px] border-b-[1px] border-b-[#000] px-[5px] flex items-center gap-[5px]"
              onClick={handleViewAllApps}
            >
              <HiOutlineArrowNarrowLeft />
              Back
            </button>
          )}
          <h1
            className="md:text-[40px] text-[28px] font-bold sm:leading-[48px] text-center roboto"
            data-testid="FeaturedPrototypes"
          >
            {viewAllApps ? "All Prototypes" : "Featured Prototypes"}
          </h1>
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-x-[40px] gap-x-[20px] xl:gap-y-[60px] gap-y-[30px] lg:mt-[60px] mt-[40px]">
            <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
              <div className="flex items-center gap-[4px]">
                <div className="flex items-center gap-[16px]">
                  <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                    A
                  </div>
                  <div>
                    <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                      Header
                    </h3>
                    <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                      Subhead
                    </p>
                  </div>
                </div>
                <button className="ml-auto ">
                  <PiDotsThreeVerticalBold />
                </button>
              </div>
              <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                This is going to be tasks for Calendar
              </p>
              <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                  Save
                </button>
                <button
                  className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto"
                  onClick={() => navigate("/prototypedetail")}
                >
                  Check
                </button>
              </div>
            </div>

            <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
              <div className="flex items-center gap-[4px]">
                <div className="flex items-center gap-[16px]">
                  <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                    A
                  </div>
                  <div>
                    <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                      Header
                    </h3>
                    <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                      Subhead
                    </p>
                  </div>
                </div>
                <button className="ml-auto ">
                  <PiDotsThreeVerticalBold />
                </button>
              </div>
              <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                This is going to be tasks for Calendar
              </p>
              <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                  Save
                </button>
                <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                  Check
                </button>
              </div>
            </div>

            <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
              <div className="flex items-center gap-[4px]">
                <div className="flex items-center gap-[16px]">
                  <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                    A
                  </div>
                  <div>
                    <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                      Header
                    </h3>
                    <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                      Subhead
                    </p>
                  </div>
                </div>
                <button className="ml-auto ">
                  <PiDotsThreeVerticalBold />
                </button>
              </div>
              <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                This is going to be tasks for Calendar
              </p>
              <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                  Save
                </button>
                <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                  Check
                </button>
              </div>
            </div>

            <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
              <div className="flex items-center gap-[4px]">
                <div className="flex items-center gap-[16px]">
                  <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                    A
                  </div>
                  <div>
                    <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                      Header
                    </h3>
                    <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                      Subhead
                    </p>
                  </div>
                </div>
                <button className="ml-auto ">
                  <PiDotsThreeVerticalBold />
                </button>
              </div>
              <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                This is going to be tasks for Calendar
              </p>
              <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                  Save
                </button>
                <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                  Check
                </button>
              </div>
            </div>

            <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
              <div className="flex items-center gap-[4px]">
                <div className="flex items-center gap-[16px]">
                  <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                    A
                  </div>
                  <div>
                    <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                      Header
                    </h3>
                    <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                      Subhead
                    </p>
                  </div>
                </div>
                <button className="ml-auto ">
                  <PiDotsThreeVerticalBold />
                </button>
              </div>
              <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                This is going to be tasks for Calendar
              </p>
              <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                  Save
                </button>
                <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                  Check
                </button>
              </div>
            </div>

            <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
              <div className="flex items-center gap-[4px]">
                <div className="flex items-center gap-[16px]">
                  <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                    A
                  </div>
                  <div>
                    <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                      Header
                    </h3>
                    <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                      Subhead
                    </p>
                  </div>
                </div>
                <button className="ml-auto ">
                  <PiDotsThreeVerticalBold />
                </button>
              </div>
              <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                This is going to be tasks for Calendar
              </p>
              <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                  Save
                </button>
                <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                  Check
                </button>
              </div>
            </div>

            <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
              <div className="flex items-center gap-[4px]">
                <div className="flex items-center gap-[16px]">
                  <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                    A
                  </div>
                  <div>
                    <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                      Header
                    </h3>
                    <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                      Subhead
                    </p>
                  </div>
                </div>
                <button className="ml-auto ">
                  <PiDotsThreeVerticalBold />
                </button>
              </div>
              <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                This is going to be tasks for Calendar
              </p>
              <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                  Save
                </button>
                <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                  Check
                </button>
              </div>
            </div>

            <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
              <div className="flex items-center gap-[4px]">
                <div className="flex items-center gap-[16px]">
                  <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                    A
                  </div>
                  <div>
                    <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                      Header
                    </h3>
                    <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                      Subhead
                    </p>
                  </div>
                </div>
                <button className="ml-auto ">
                  <PiDotsThreeVerticalBold />
                </button>
              </div>
              <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                This is going to be tasks for Calendar
              </p>
              <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                  Save
                </button>
                <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                  Check
                </button>
              </div>
            </div>

            <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
              <div className="flex items-center gap-[4px]">
                <div className="flex items-center gap-[16px]">
                  <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                    A
                  </div>
                  <div>
                    <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                      Header
                    </h3>
                    <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                      Subhead
                    </p>
                  </div>
                </div>
                <button className="ml-auto ">
                  <PiDotsThreeVerticalBold />
                </button>
              </div>
              <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                This is going to be tasks for Calendar
              </p>
              <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                  Save
                </button>
                <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                  Check
                </button>
              </div>
            </div>

            <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
              <div className="flex items-center gap-[4px]">
                <div className="flex items-center gap-[16px]">
                  <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                    A
                  </div>
                  <div>
                    <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                      Header
                    </h3>
                    <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                      Subhead
                    </p>
                  </div>
                </div>
                <button className="ml-auto ">
                  <PiDotsThreeVerticalBold />
                </button>
              </div>
              <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                This is going to be tasks for Calendar
              </p>
              <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                  Save
                </button>
                <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                  Check
                </button>
              </div>
            </div>

            <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
              <div className="flex items-center gap-[4px]">
                <div className="flex items-center gap-[16px]">
                  <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                    A
                  </div>
                  <div>
                    <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                      Header
                    </h3>
                    <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                      Subhead
                    </p>
                  </div>
                </div>
                <button className="ml-auto ">
                  <PiDotsThreeVerticalBold />
                </button>
              </div>
              <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                This is going to be tasks for Calendar
              </p>
              <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                  Save
                </button>
                <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                  Check
                </button>
              </div>
            </div>

            <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
              <div className="flex items-center gap-[4px]">
                <div className="flex items-center gap-[16px]">
                  <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                    A
                  </div>
                  <div>
                    <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                      Header
                    </h3>
                    <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                      Subhead
                    </p>
                  </div>
                </div>
                <button className="ml-auto ">
                  <PiDotsThreeVerticalBold />
                </button>
              </div>
              <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                This is going to be tasks for Calendar
              </p>
              <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                  Save
                </button>
                <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                  Check
                </button>
              </div>
            </div>
          </div>
          {viewAllApps && (
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-x-[40px] gap-x-[20px] xl:gap-y-[60px] gap-y-[30px] lg:mt-[60px] mt-[40px] transition duration-700 ease-in-out">
              <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
                <div className="flex items-center gap-[4px]">
                  <div className="flex items-center gap-[16px]">
                    <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                      A
                    </div>
                    <div>
                      <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                        Header
                      </h3>
                      <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                        Subhead
                      </p>
                    </div>
                  </div>
                  <button className="ml-auto ">
                    <PiDotsThreeVerticalBold />
                  </button>
                </div>
                <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                  This is going to be tasks for Calendar
                </p>
                <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                  <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                    Save
                  </button>
                  <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                    Check
                  </button>
                </div>
              </div>

              <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
                <div className="flex items-center gap-[4px]">
                  <div className="flex items-center gap-[16px]">
                    <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                      A
                    </div>
                    <div>
                      <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                        Header
                      </h3>
                      <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                        Subhead
                      </p>
                    </div>
                  </div>
                  <button className="ml-auto ">
                    <PiDotsThreeVerticalBold />
                  </button>
                </div>
                <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                  This is going to be tasks for Calendar
                </p>
                <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                  <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                    Save
                  </button>
                  <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                    Check
                  </button>
                </div>
              </div>

              <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
                <div className="flex items-center gap-[4px]">
                  <div className="flex items-center gap-[16px]">
                    <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                      A
                    </div>
                    <div>
                      <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                        Header
                      </h3>
                      <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                        Subhead
                      </p>
                    </div>
                  </div>
                  <button className="ml-auto ">
                    <PiDotsThreeVerticalBold />
                  </button>
                </div>
                <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                  This is going to be tasks for Calendar
                </p>
                <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                  <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                    Save
                  </button>
                  <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                    Check
                  </button>
                </div>
              </div>

              <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
                <div className="flex items-center gap-[4px]">
                  <div className="flex items-center gap-[16px]">
                    <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                      A
                    </div>
                    <div>
                      <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                        Header
                      </h3>
                      <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                        Subhead
                      </p>
                    </div>
                  </div>
                  <button className="ml-auto ">
                    <PiDotsThreeVerticalBold />
                  </button>
                </div>
                <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                  This is going to be tasks for Calendar
                </p>
                <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                  <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                    Save
                  </button>
                  <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                    Check
                  </button>
                </div>
              </div>

              <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
                <div className="flex items-center gap-[4px]">
                  <div className="flex items-center gap-[16px]">
                    <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                      A
                    </div>
                    <div>
                      <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                        Header
                      </h3>
                      <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                        Subhead
                      </p>
                    </div>
                  </div>
                  <button className="ml-auto ">
                    <PiDotsThreeVerticalBold />
                  </button>
                </div>
                <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                  This is going to be tasks for Calendar
                </p>
                <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                  <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                    Save
                  </button>
                  <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                    Check
                  </button>
                </div>
              </div>

              <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
                <div className="flex items-center gap-[4px]">
                  <div className="flex items-center gap-[16px]">
                    <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                      A
                    </div>
                    <div>
                      <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                        Header
                      </h3>
                      <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                        Subhead
                      </p>
                    </div>
                  </div>
                  <button className="ml-auto ">
                    <PiDotsThreeVerticalBold />
                  </button>
                </div>
                <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                  This is going to be tasks for Calendar
                </p>
                <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                  <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                    Save
                  </button>
                  <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                    Check
                  </button>
                </div>
              </div>

              <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
                <div className="flex items-center gap-[4px]">
                  <div className="flex items-center gap-[16px]">
                    <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                      A
                    </div>
                    <div>
                      <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                        Header
                      </h3>
                      <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                        Subhead
                      </p>
                    </div>
                  </div>
                  <button className="ml-auto ">
                    <PiDotsThreeVerticalBold />
                  </button>
                </div>
                <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                  This is going to be tasks for Calendar
                </p>
                <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                  <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                    Save
                  </button>
                  <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                    Check
                  </button>
                </div>
              </div>

              <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
                <div className="flex items-center gap-[4px]">
                  <div className="flex items-center gap-[16px]">
                    <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                      A
                    </div>
                    <div>
                      <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                        Header
                      </h3>
                      <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                        Subhead
                      </p>
                    </div>
                  </div>
                  <button className="ml-auto ">
                    <PiDotsThreeVerticalBold />
                  </button>
                </div>
                <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                  This is going to be tasks for Calendar
                </p>
                <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                  <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                    Save
                  </button>
                  <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                    Check
                  </button>
                </div>
              </div>

              <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
                <div className="flex items-center gap-[4px]">
                  <div className="flex items-center gap-[16px]">
                    <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                      A
                    </div>
                    <div>
                      <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                        Header
                      </h3>
                      <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                        Subhead
                      </p>
                    </div>
                  </div>
                  <button className="ml-auto ">
                    <PiDotsThreeVerticalBold />
                  </button>
                </div>
                <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                  This is going to be tasks for Calendar
                </p>
                <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                  <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                    Save
                  </button>
                  <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                    Check
                  </button>
                </div>
              </div>

              <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
                <div className="flex items-center gap-[4px]">
                  <div className="flex items-center gap-[16px]">
                    <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                      A
                    </div>
                    <div>
                      <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                        Header
                      </h3>
                      <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                        Subhead
                      </p>
                    </div>
                  </div>
                  <button className="ml-auto ">
                    <PiDotsThreeVerticalBold />
                  </button>
                </div>
                <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                  This is going to be tasks for Calendar
                </p>
                <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                  <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                    Save
                  </button>
                  <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                    Check
                  </button>
                </div>
              </div>

              <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
                <div className="flex items-center gap-[4px]">
                  <div className="flex items-center gap-[16px]">
                    <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                      A
                    </div>
                    <div>
                      <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                        Header
                      </h3>
                      <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                        Subhead
                      </p>
                    </div>
                  </div>
                  <button className="ml-auto ">
                    <PiDotsThreeVerticalBold />
                  </button>
                </div>
                <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                  This is going to be tasks for Calendar
                </p>
                <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                  <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                    Save
                  </button>
                  <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                    Check
                  </button>
                </div>
              </div>

              <div className="border-[1px] border-[#CAC4D0] rounded-[12px] p-[16px_16px_60px_16px]">
                <div className="flex items-center gap-[4px]">
                  <div className="flex items-center gap-[16px]">
                    <div className="bg-[#6750A4] w-[40px] h-[40px] rounded-full text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto flex justify-center items-center">
                      A
                    </div>
                    <div>
                      <h3 className="text-[#1D1B20] text-[16px] font-medium sm:leading-[24px] tracking-[0.15px] roboto m-0">
                        Header
                      </h3>
                      <p className="text-[#1D1B20] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto m-0 mt-[4px]">
                        Subhead
                      </p>
                    </div>
                  </div>
                  <button className="ml-auto ">
                    <PiDotsThreeVerticalBold />
                  </button>
                </div>
                <p className="text-[#49454F] text-[14px] font-normal sm:leading-[20px] tracking-[0.25px] roboto mt-[28px]">
                  This is going to be tasks for Calendar
                </p>
                <div className="flex justify-end gap-[8px] items-center mt-[32px]">
                  <button className="text-[#6750A4] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto border-[1px] border-[#79747E] rounded-[100px] p-[10px_24px]">
                    Save
                  </button>
                  <button className="bg-[#6750A4] border-[1px] border-[#6750A4] rounded-[100px] p-[10px_24px] text-[#fff] text-[14px] font-medium sm:leading-[20px] tracking-[0.1px] roboto">
                    Check
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-center items-center lg:mt-[60px] mt-[40px]">
            <button
              className="bg-[#000000] rounded-[8px] text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto p-[12px_54px]"
              onClick={handleViewAllApps}
            >
              {viewAllApps ? "Show less" : "Check all the apps"}
            </button>
          </div>
        </div>

        <div className="xl:p-[60px_170px] sm:p-[40px] p-[20px_16px] border-b-[1px] border-b-[#E6E6E6]">
          <h1 className="md:text-[40px] text-[28px] font-bold sm:leading-[48px] text-center roboto">
            Latest Updates
          </h1>
          <div
            className="flex lg:flex-row flex-col lg:gap-[40px] gap-[20px] justify-center items-center xl:mt-[80px] mt-[40px]"
            data-testid="update-card"
          >
            <div className="border-[1px] border-[#E6E6E6] rounded-[6px] sm:p-[16px] p-[10px] flex sm:gap-[16px] gap-[8px] items-center">
              <div className="bg-[#ECECEC] sm:w-[100px] w-[80px] sm:h-[100px] h-[50px]"></div>
              <div>
                <h3 className="text-[20px] font-medium sm:leading-[28px] roboto m-0">
                  New Prototype Release
                </h3>
                <p className="text-[16px] font-normal sm:leading-[24px] roboto mb-0 mt-[8px]">
                  Check out the latest addition to our prototype collection.
                </p>
                <div className="flex gap-[8px] items-center mt-[12px]">
                  <div className="bg-[#E6E6E6] w-[20px] h-[20px] rounded-full"></div>
                  <h6 className="text-[14px] font-medium sm:leading-[20px] roboto m-0 ">
                    Admin
                  </h6>
                </div>
              </div>
            </div>

            <div
              className="border-[1px] border-[#E6E6E6] rounded-[6px] sm:p-[16px] p-[10px] flex sm:gap-[16px] gap-[8px] items-center"
              data-testid="update-card"
            >
              <div className="bg-[#ECECEC] sm:w-[100px] w-[80px] sm:h-[100px] h-[50px]"></div>
              <div>
                <h3 className="text-[20px] font-medium sm:leading-[28px] roboto m-0">
                  New Prototype Release
                </h3>
                <p className="text-[16px] font-normal sm:leading-[24px] roboto mb-0 mt-[8px]">
                  Check out the latest addition to our prototype collection.
                </p>
                <div className="flex gap-[8px] items-center mt-[12px]">
                  <div className="bg-[#E6E6E6] w-[20px] h-[20px] rounded-full"></div>
                  <h6 className="text-[14px] font-medium sm:leading-[20px] roboto m-0 ">
                    Admin
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:flex-row flex-col lg:gap-[60px] md:gap-0 gap-[20px] items-center justify-center xl:p-[60px_170px] sm:p-[40px] p-[20px_16px]">
          <h1 className="md:text-[40px] text-[28px] font-bold sm:leading-[48px] roboto md:w-[50%] w-full md:!text-left !text-center">
            Subscribe for Updates
          </h1>
          <div className="md:w-[50%] w-full">
            <div className="flex flex-col">
              <label
                className="text-[14px] font-medium sm:leading-[20px] roboto"
                data-testid="EmailAddress"
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="placeholder:text-[#808080] placeholder:text-[14px] placeholder:font-normal placeholder:sm:leading-[20px] placeholder:roboto text-[14px] font-normal sm:leading-[20px] roboto p-[8px_12px] border-[1px] border-[#E6E6E6] rounded-[6px] w-full mt-[4px]"
              />
              <p className="text-[#808080] text-[12px] font-normal sm:leading-[16px] roboto mb-0 mt-[4px]">
                We'll send you our latest updates.
              </p>
            </div>
            <div className="flex md:justify-start justify-center">
              <button
                className="bg-[#000] text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto p-[12px_84px] rounded-[8px] mt-[40px]"
                data-testid="Subscribe"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrototypehubPage;
