import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import "react-datepicker/dist/react-datepicker.css";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import { fetchPutApi, fetchGetApi } from "../../functions/apiFunctions";
import { CommentTree } from "../../components/Comments/structureComments";
import { useLocation, useNavigate } from "react-router-dom";

const ViewStatusPage = () => {
  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );
  const userData = localStorage.getItem("userData");
  let privilege;

  if (userData) {
    const parsedUserData = JSON.parse(userData);
    privilege = parsedUserData?.privilege;
  } else {
    privilege = null;
  }
  const [filterAppData, setFilterAppData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const filterAppDataByLoginUser = async () => {
      try {
        const path = "/api/applications/user_owned";
        const response = await fetchGetApi(
          path,
          access_user,
          navigate,
          location
        );
        setFilterAppData(response.data);
      } catch (error) {
        console.error("filterData Error:", error);
      }
    };
    filterAppDataByLoginUser();
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [AppApprovedText, SetAppApprovedText] = useState("");

  const initialStatusData = {
    approved_by: "",
    approved_date: "",
    last_reviewed_by: "",
    last_reviewed_date: "",
    submission_reviews: [],
    submitted_by: "",
    submitted_date: "",
  };

  const [showAppID, setShowAppID] = useState("");
  const [statusData, setStatusData] = useState(initialStatusData);
  const [openModel, setOpenModel] = useState(false);

  const handleShowButton = async () => {
    if (showAppID === "") {
      toast.error("Please select an product");
      return;
    }
    try {
      const path = `/api/applications/${showAppID}/submission-status`;
      const response = await fetchGetApi(path, access_user, navigate, location);
      if (response.status === 200) {
        setStatusData(response.data);
        console.log("getData======", response.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error.response.data || "An unexpected error occurred.");
      setShowAppID("");
      // setCommentData([]);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlerStatus = async (value) => {
    try {
      const status = value == "Review" ? "reviewed" : "approved";
      const path = `/api/applications/${showAppID}/submission-status`;
      const payload = { status };

      const response = await fetchPutApi(
        path,
        payload,
        "application/json",
        access_user,
        navigate,
        location
      );

      console.log("response:---", response);
      if (response.status === 200) {
        handleShowButton();
        setOpenModel(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || error.response.data || "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  const regexValidation = /(sysadmin|admin|support)/;
  console.log("regex validation.test:", regexValidation.test(privilege));

  return (
    <div>
      <Header path="viewstatus" toggleSidebar={toggleSidebar} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        isActive="View Submission status"
        data-testid="sidebar"
      />
      <div className="flex justify-center" data-testid="sidebar-toggle">
        <div className="w-full max-w-[80%] h-auto mb-20">
          <div className="flex lg:flex-row flex-col sm:p-4 p-[14px] pb-0 mt-[60px] mb-5 gap-[70px]">
            <div className=" border-[#e6e6e6] rounded-md border-[1px] p-[16px] w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] h-fit">
              <h1 className="md:text-[40px] sm:text-[30px] text-[26px] roboto font-bold">
                View Submission Status
              </h1>

              <div className="border-[#e6e6e6]  border-[1px] p-[16px]  w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>
                  <div>
                    <label className="text-black text-[14px] roboto block font-medium mb-1">
                      Product
                    </label>
                    <div className="flex items-center gap-3 mb-3">
                      <select
                        name="application_id"
                        onChange={(e) => setShowAppID(e.target.value)}
                        className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                      >
                        <option selected={showAppID === ""} value="">
                          Select Your Product
                        </option>
                        {filterAppData.map((data: any, index) => (
                          <option key={index} value={data?._id}>
                            {data.application}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleShowButton}
                        className="border-[#000] border-[1px] bg-[#000000] rounded-lg  text-white roboto font-medium text-[16px] p-[7px_10px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                      >
                        Show
                      </button>
                    </div>
                  </div>
                  <button className="bg-[#7CE68D] text-[#fff] rounded-[5px] w-full sm:py-[10px] py-[6px] mt-[16px]">
                    In progress
                  </button>

                  <div className="mt-[57px] sm:mr-[30px] mr-[5px]">
                    <ol className="relative left-[4%] pl-0 lg:max-w-[551px] md:max-w-[545px] sm:max-w-[400px] min-w-[800px]">
                      <li
                        className={`relative md:ps-[70px] sm:ps-[40px] ps-[20px] h-full ${statusData?.submitted_date !== ""
                          ? "border-l-[#7CE68D]"
                          : "border-l-[#D9D9D9]"
                          } border-l-[3px]`}
                      >
                        <span
                          className={`absolute flex items-center justify-center md:p-[10px_12px] p-[7px] ${statusData?.submitted_date !== ""
                            ? "bg-[#7CE68D]"
                            : "bg-[#D9D9D9]"
                            } rounded-full md:-start-[21px] -start-[16px] top-0`}
                        >
                          <svg
                            className="w-[13.5px] md:h-[17.67px] h-[15px] text-[#000]"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 16 12"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5.917 5.724 10.5 15 1.5"
                            />
                          </svg>
                        </span>
                        <div className="flex justify-between ">
                          <h3 className="md:text-[20px] text-[16px] font-normal leading-[24px] py-[3px]">
                            Product Submitted
                          </h3>
                          <div
                            className="sm:text-right cursor-pointer sm:max-w-[150px] max-w-[100px]"
                            data-testid="datepicker"
                          >
                            <div className="sm:text-right sm:max-w-[150px] max-w-[100px] placeholder:text-[#000] md:text-[20px] text-[16px] font-normal leading-[24px] focus-visible:outline-none mb-1">
                              {statusData?.submitted_date.split(" ")[0]}
                              {/* {statusData?.submitted_date.split(" ")[0] ?? ""} */}
                            </div>
                            <div className="text-[#000] md:text-[20px] text-[16px] font-normal leading-[24px]">
                              {/* {statusData?.submitted_date.split(" ")[1] ?? ""} PST */}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col">
                          {statusData?.submitted_date ? (
                            <CommentTree
                              applicationId={showAppID}
                              initialComments={statusData?.submission_reviews}
                              fetchComments={handleShowButton}
                              dataType="viewStatus"
                            />
                          ) : (
                            <p
                              className={`${statusData.submitted_date !== ""
                                ? "bg-[#7CE68D]"
                                : "bg-[#D9D9D9]"
                                } rounded-[10px] text-[14px] font-normal leading-[17px] text-[#000] p-[15px_7px_15px_10px] mt-2 max-w-[330px] focus:outline-none`}
                            ></p>
                          )}
                        </div>
                      </li>
                      <li
                        className={`relative md:ps-[70px] sm:ps-[40px] ps-[20px] mt-[-7px] h-full ${statusData.last_reviewed_date !== ""
                          ? "border-l-[#7CE68D]"
                          : "border-l-[#D9D9D9]"
                          } border-l-[3px]`}
                      >
                        <span
                          className={`absolute flex items-center justify-center md:p-[10px_12px] p-[7px] top-0 ${statusData?.last_reviewed_date !== ""
                            ? "bg-[#7CE68D]"
                            : "bg-[#D9D9D9]"
                            } rounded-full md:-start-[21px] -start-[16px]`}
                        >
                          <svg
                            className="w-[13.5px] md:h-[17.67px] h-[15px] text-[#000]"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 16 12"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5.917 5.724 10.5 15 1.5"
                            />
                          </svg>
                        </span>
                        <div className="flex justify-between">
                          <h3 className="md:text-[20px] text-[16px] font-normal leading-[24px] py-[3px]">
                            Product Reviewed
                          </h3>

                          <div className="sm:text-right cursor-pointer sm:max-w-[150px] max-w-[100px]">
                            <div className="sm:text-right sm:max-w-[150px] max-w-[100px] placeholder:text-[#000] md:text-[20px] text-[16px] font-normal leading-[24px] focus-visible:outline-none mb-1">
                              {statusData?.last_reviewed_date.split(" ")[0]}
                            </div>
                            <div className="text-[#000] md:text-[20px] text-[16px] font-normal leading-[24px]">
                              {/* {statusData?.last_review_date.split(" ")[1] ?? ""} PST */}
                            </div>
                          </div>

                          {regexValidation.test(privilege) &&
                            statusData?.submitted_date !== "" &&
                            statusData?.last_reviewed_date === "" && (
                              <button
                                onClick={() => {
                                  setOpenModel(true);
                                  SetAppApprovedText("Review");
                                }}
                                className="border-[#000] border-[1px] bg-[#000000] rounded-lg  text-white roboto font-medium text-[16px] p-[7px_10px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                              >
                                Approve
                              </button>
                            )}
                        </div>
                        {openModel ? (
                          <>
                            <div className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                              <div className="bg-[#fff] lg:w-[30%] w-full flex gap-[16px] flex-col lg:mt-0 mt-[30px] border-[#e6e6e6] rounded-md border-[1px] p-[16px] h-fit">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                  Product {AppApprovedText} Status:
                                </h5>
                                <p>
                                  Are you sure you want to approve the product status to{" "}
                                  {AppApprovedText}?
                                </p>
                                <div className="flex gap-[12px] justify-center items-center">
                                  {/* <button className="border-[#000] border-[1px] rounded-lg h-[48px] max-w-[240px] w-full text-black roboto font-medium text-[16px]">
                                    Save Draft
                                  </button> */}

                                  <button
                                    onClick={() => setOpenModel(false)}
                                    className="border-gray-500 border-[1px] bg-gray-500 rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px] opacity-60 transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => {
                                      handlerStatus(AppApprovedText);
                                    }}
                                    className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                                  >
                                    Confirm
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                          </>
                        ) : null}
                        <div className="flex flex-col">
                          <p
                            className={`${statusData.last_reviewed_date !== ""
                              ? "bg-[#7CE68D]"
                              : "bg-[#D9D9D9]"
                              } rounded-[10px] text-[14px] font-normal leading-[17px] text-[#000] p-[15px_7px_15px_10px] mt-2 max-w-[330px] focus:outline-none`}
                          ></p>
                        </div>
                      </li>
                      <li
                        className={`relative md:ps-[70px] sm:ps-[40px] ps-[20px] mt-[-7px] h-full ${statusData?.approved_date !== ""
                          ? "border-l-[#7CE68D]"
                          : "border-l-[#D9D9D9]"
                          } border-l-[3px]`}
                      >
                        <span
                          className={`absolute flex items-center justify-center md:p-[10px_12px] p-[7px] top-0 ${statusData?.approved_date !== ""
                            ? "bg-[#7CE68D]"
                            : "bg-[#D9D9D9]"
                            } rounded-full md:-start-[21px] -start-[16px]`}
                        >
                          <svg
                            className="w-[13.5px] md:h-[17.67px] h-[15px] text-[#000]"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 16 12"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5.917 5.724 10.5 15 1.5"
                            />
                          </svg>
                        </span>
                        <div className="flex justify-between">
                          <h3 className="md:text-[20px] text-[16px] font-normal leading-[24px] py-[3px]">
                            Product Approved
                          </h3>
                          <div className="sm:text-right cursor-pointer sm:max-w-[150px] max-w-[100px]">
                            <div className="sm:text-right sm:max-w-[150px] max-w-[100px] placeholder:text-[#000] md:text-[20px] text-[16px] font-normal leading-[24px] focus-visible:outline-none mb-1">
                              {statusData?.approved_date.split(" ")[0]}
                            </div>
                            <div className="text-[#000] md:text-[20px] text-[16px] font-normal leading-[24px]">
                              {/* {statusData?.last_review_date.split(" ")[1] ?? ""} PST */}
                            </div>
                          </div>
                          {regexValidation.test(privilege) &&
                            statusData?.submitted_date !== "" &&
                            statusData?.approved_date === "" && (
                              <button
                                onClick={() => {
                                  setOpenModel(true);
                                  SetAppApprovedText("Approve");
                                }}
                                className="border-[#000] border-[1px] bg-[#000000] rounded-lg  text-white roboto font-medium text-[16px] p-[7px_10px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                              >
                                Approve
                              </button>
                            )}
                        </div>
                        {/* <div className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                          Review Model
                        </div> */}
                        <div className="flex flex-col">
                          <p
                            className={`${statusData.approved_date !== ""
                              ? "bg-[#7CE68D]"
                              : "bg-[#D9D9D9]"
                              } rounded-[10px] text-[14px] font-normal leading-[17px] text-[#000] p-[15px_7px_15px_10px] mt-2 max-w-[330px] focus:outline-none`}
                          ></p>
                        </div>
                      </li>
                      <li className={`relative md:ps-[70px] sm:ps-[40px] ps-[20px]`}>
                        <span className="absolute flex items-center justify-center md:p-[10px_12px] p-[7px] bg-[#D9D9D9] rounded-full md:-start-[18px] -start-[16px] top-0">
                          <svg
                            className="w-[13.5px] md:h-[17.67px] h-[15px] text-[#000]"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 16 12"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5.917 5.724 10.5 15 1.5"
                            />
                          </svg>
                        </span>

                        <div className="flex justify-between sm:pt-[10px] pt-[32px]">
                          <h3 className="md:text-[20px] text-[16px] font-normal leading-[24px] py-[3px]">
                            Posted on Marketplace
                          </h3>
                          <div className="sm:text-right cursor-pointer sm:max-w-none max-w-[100px]">
                            {/* <div className="text-[#000] md:text-[20px] text-[16px] font-normal leading-[24px]">
                              {currTime} PST
                            </div> */}
                          </div>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>

              </div>


            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ViewStatusPage;
