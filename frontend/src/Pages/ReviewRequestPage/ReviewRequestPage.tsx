import {
  createApplicationReviewRequest,
  // fetchPutApi,
  fetchGetApi,
  validateFormData,
} from "../../functions/apiFunctions";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Sidebar from "../../components/Sidebar/Sidebar";
import { FaCirclePlus } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

interface ReviewEditFormData {
  application_id: string;
  review_topics: string[];
  reviewer_emails: string[];
  request_note: string;
  review_request_id: string;
  created: number;
}

const ReviewRequestPage = () => {
  const access_token = JSON.parse(
    localStorage.getItem("access_token") as string
  );
  // console.log("access_token:", access_token);
  console.log("access_token:", access_token);
  const [filterAppData, setFilterAppData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const filterAppDataByLoginUser = async () => {
      try {
        const path = "/api/applications/user_owned";
        const response = await fetchGetApi(
          path,
          access_token,
          navigate,
          location
        );
        setFilterAppData(response.data);
      } catch (error) {
        console.log("filterData Error:", error);
      }
    };
    filterAppDataByLoginUser();
  }, []);

  const reviewRequestRequiredFields = ["review_topics", "reviewer_emails"];
  const intialReviewData = {
    application_id: "",
    review_topics: [],
    reviewer_emails: [],
    request_note:
      "We kindly request a comprehensive review of our application.",
  };
  const [isSelected, setIsSelected] = useState(true);
  const [reviewFormData, setReviewFormData] = useState(intialReviewData);
  const [reviewTopicsData, setReviewTopicsData] = useState("");
  const [reviewerEmailsData, setReviewerEmailsData] = useState("");

  // const initialEditReviewData = {
  //   application_id: "",
  //   review_topics: [],
  //   reviewer_emails: [],
  //   request_note: "",
  //   review_request_id: "",
  // };

  const [showAppID, setShowAppID] = useState("");
  const [reviewEditFormData, setReviewEditFormData] = useState<
    ReviewEditFormData[]
  >([]);
  // const [editReviewTopicsData, setEditReviewTopicsData] = useState("");
  // const [editReviewerEmailsData, setEditReviewerEmailsData] = useState("");
  useEffect(() => {
    console.log("object====", reviewEditFormData);
  }, [reviewEditFormData]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    if (name === "application_id") {
      const selectedValue = JSON.parse(value);
      setReviewFormData({
        ...reviewFormData,
        application_id: selectedValue._id,
      });
    } else {
      setReviewFormData({
        ...reviewFormData,
        [name]: value,
      });
    }
  };

  const addCategoryData = (value: any) => {
    if (value === "review_topics") {
      if (reviewTopicsData.trim()) {
        setReviewFormData((prevData) => ({
          ...prevData,
          review_topics: [...prevData.review_topics, reviewTopicsData],
        }));
        setReviewTopicsData("");
      }
    }
    if (value === "reviewer_emails") {
      if (reviewerEmailsData.trim()) {
        setReviewFormData((prevData) => ({
          ...prevData,
          reviewer_emails: [...prevData.reviewer_emails, reviewerEmailsData],
        }));
        setReviewerEmailsData("");
      }
    }
  };

  const removeCategoryData = (value: any, indexToRemove: any) => {
    if (value === "review_topics") {
      setReviewFormData((prevData) => ({
        ...prevData,
        review_topics: prevData.review_topics.filter(
          (_, index) => index !== indexToRemove
        ),
      }));
    }
    if (value === "reviewer_emails") {
      setReviewFormData((prevData) => ({
        ...prevData,
        reviewer_emails: prevData.reviewer_emails.filter(
          (_, index) => index !== indexToRemove
        ),
      }));
    }
  };

  const handleSubmitForReview = async (e) => {
    e.preventDefault();
    // console.log("reviewFormData", reviewFormData);
    if (validateFormData(reviewFormData, reviewRequestRequiredFields)) {
      try {
        const reviewResponse = await createApplicationReviewRequest(
          reviewFormData,
          access_token,
          navigate,
          location
        );
        // console.log("reviewResponse", reviewResponse);
        if (reviewResponse.reveiew_request_id) {
          toast.success("Review Request Created Successfully");
        }
        setReviewFormData(intialReviewData);
      } catch (error) {
        console.error("handleSubmitForOwnerShip Error:", error);
        toast.error(error.response.data.error || error.response.data);
        setReviewFormData(intialReviewData);
      }
    }
  };

  const handleShowButton = async () => {
    if (showAppID === "") {
      toast.error("Please select a product");
      return;
    }
    try {
      const path = `/api/applications/${showAppID}/review_requests`;
      const response = await fetchGetApi(
        path,
        access_token,
        navigate,
        location
      );
      if (response.status === 200) {
        setReviewEditFormData(response?.data);
      }
      console.log("res*****", response.data);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.response.data);
      setShowAppID("");
      setReviewEditFormData([]);
    }
  };

  // Handle Input Change
  // const handleEditInputChange = (
  //   mainIndex: number,
  //   fieldName: string,
  //   value: string
  // ) => {
  //   setReviewEditFormData((prevData) =>
  //     prevData.map((item, index) =>
  //       index === mainIndex ? { ...item, [fieldName]: value } : item
  //     )
  //   );
  // };

  // Add New Category Data
  // const addEditCategoryData = (mainIndex: number, fieldName: string) => {
  //   setReviewEditFormData((prevData) =>
  //     prevData.map((item, index) => {
  //       if (index === mainIndex) {
  //         if (fieldName === "review_topics" && editReviewTopicsData.trim()) {
  //           return {
  //             ...item,
  //             review_topics: [...item.review_topics, editReviewTopicsData],
  //           };
  //         }
  //         if (
  //           fieldName === "reviewer_emails" &&
  //           editReviewerEmailsData.trim()
  //         ) {
  //           return {
  //             ...item,
  //             reviewer_emails: [
  //               ...item.reviewer_emails,
  //               editReviewerEmailsData,
  //             ],
  //           };
  //         }
  //       }
  //       return item;
  //     })
  //   );
  //   if (fieldName === "review_topics") setEditReviewTopicsData("");
  //   if (fieldName === "reviewer_emails") setEditReviewerEmailsData("");
  // };

  // Remove Category Data
  // const removeEditCategoryData = (
  //   mainIndex: number,
  //   fieldName: string,
  //   indexToRemove: number
  // ) => {
  //   setReviewEditFormData((prevData) =>
  //     prevData.map((item, index) => {
  //       if (index === mainIndex) {
  //         return {
  //           ...item,
  //           [fieldName]: (item as any)[fieldName].filter(
  //             (_: string, i: number) => i !== indexToRemove
  //           ),
  //         };
  //       }
  //       return item;
  //     })
  //   );
  // };

  // Submit Form
  // const handleEditFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
  //   event.preventDefault();

  //   try {
  //     const responses = await Promise.all(
  //       reviewEditFormData.map((data) =>
  //         fetchPutApi(
  //           `/api/review_requests/${data.review_request_id}`,
  //           data,
  //           "application/json",
  //           access_token,
  //           navigate,
  //           location
  //         )
  //       )
  //     );

  //     // Check if all responses are successful
  //     if (responses.every((response) => response.status === 200)) {
  //       toast.success("Product review requests updated successfully!");
  //       setShowAppID("");
  //       setReviewEditFormData([]);
  //     }
  //   } catch (error: any) {
  //     console.error("Product review request update Error:", error);
  //     toast.error(error.response?.data?.error || "An error occurred.");
  //   }
  // };

  // Cancel Form
  // const handleCancelEditFormData = () => {
  //   setReviewEditFormData([]);
  //   setShowAppID("");
  // };

  // const removeReview = (review_request_id: string) => {
  //   setReviewEditFormData((prevData) =>
  //     prevData.filter(
  //       (review) => review.review_request_id !== review_request_id
  //     )
  //   );
  // };

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

  return (
    <>
      <>
        <Header path="appinfo" toggleSidebar={toggleSidebar} />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          isActive="reviewRequest"
        />

        <div className="flex justify-center" data-testid="sidebar-toggle">
          <div className="w-full max-w-[80%] h-auto mb-20">
            <div className="flex lg:flex-row flex-col sm:p-4 p-[14px] pb-0 mt-[60px] mb-5 gap-[70px]">
              <div className=" border-[#e6e6e6] rounded-md border-[1px] p-[16px] w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] h-fit">
                <h1 className="md:text-[40px] sm:text-[30px] text-[26px] roboto font-bold">
                  Add/View Review Request for your Product
                </h1>

                <div className="flex">
                  <button
                    onClick={() => setIsSelected(true)}
                    className={`${isSelected
                      ? "bg-[#000000] text-white"
                      : "bg-[#ffff] text-black"
                      } border-[#000] border-[1px] rounded-l-lg h-[48px] max-w-[240px] w-full roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg hover:z-10 transition-all duration-300`}
                  >
                    Add Request
                  </button>

                  <button
                    onClick={() => setIsSelected(false)}
                    className={`${!isSelected
                      ? "bg-[#000000] text-white"
                      : "bg-[#ffff] text-black"
                      } border-[#000] border-[1px] rounded-r-lg h-[48px] max-w-[240px] w-full roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg hover:z-10 transition-all duration-300`}
                  >
                    View Request
                  </button>
                </div>

                {/* Add Applications */}
                {isSelected && (
                  <div className="border-[#e6e6e6]  border-[1px] p-[16px]  w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div >
                      <label className="text-black text-[14px] roboto block font-medium">
                        Product
                      </label>
                      <select
                        name="application_id"
                        onChange={handleReviewChange}
                        className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                      >
                        <option
                          selected={reviewFormData.application_id === ""}
                          value=""
                        >
                          Select Your Product
                        </option>
                        {filterAppData?.map((data: any, index) => (
                          <option key={index} value={JSON.stringify(data)}>
                            {data.application}
                          </option>
                        ))}
                      </select>

                      <div>
                        <div className="mb-2">
                          <br />
                          <label className="text-black text-[14px] roboto block font-medium">
                            Review Topics
                          </label>
                          <input
                            data-testid="review_topics"
                            id="review_topics"
                            name="review_topics"
                            type="text"
                            value={reviewTopicsData}
                            onChange={(e) => setReviewTopicsData(e.target.value)}
                            placeholder="List of review topics e.g. usefulness, usability, look and feel, productivity"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                          {reviewTopicsData && (
                            <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                              {reviewTopicsData}
                              <button
                                onClick={() => addCategoryData("review_topics")}
                                className="cursor-pointer"
                              >
                                <FaCirclePlus size={20} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                              </button>
                            </div>
                          )}
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {reviewFormData?.review_topics.map((data, index) => (
                              <div
                                key={index}
                                className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                              >
                                {data}
                                <button
                                  onClick={() =>
                                    removeCategoryData("review_topics", index)
                                  }
                                  className="cursor-pointer"
                                >
                                  <IoCloseCircle size={25} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-2">
                          <label className="text-black text-[14px] roboto block font-medium">
                            Reviewer Emails
                          </label>
                          <input
                            data-testid="reviewer_emails"
                            id="reviewer_emails"
                            name="reviewer_emails"
                            type="text"
                            value={reviewerEmailsData}
                            onChange={(e) =>
                              setReviewerEmailsData(e.target.value)
                            }
                            placeholder="Reviewers' email addresses"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                          {reviewerEmailsData && (
                            <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                              {reviewerEmailsData}
                              <button
                                onClick={() => addCategoryData("reviewer_emails")}
                                className="cursor-pointer"
                              >
                                <FaCirclePlus size={20} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                              </button>
                            </div>
                          )}
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {reviewFormData?.reviewer_emails.map(
                              (data, index) => (
                                <div
                                  key={index}
                                  className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex gap-3 items-center`}
                                >
                                  {data}
                                  <button
                                    onClick={() =>
                                      removeCategoryData("reviewer_emails", index)
                                    }
                                    className="cursor-pointer"
                                  >
                                    <IoCloseCircle size={25} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        <div className="mb-2">
                          <label className="text-black text-[14px] roboto block font-medium">
                            Request Note
                          </label>
                          <textarea
                            name="request_note"
                            value={reviewFormData.request_note}
                            onChange={handleReviewChange}
                            className={
                              "border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-3 placeholder:text-[#00000080] text-[14px] h-[100px] outline-none"
                            }
                          />
                        </div>

                      </div>
                    </div>


                    <div className="flex gap-[12px]">
                      {/* <button className="border-[#000] border-[1px] rounded-lg h-[48px] max-w-[240px] w-full text-black roboto font-medium text-[16px]">
                      Save Draft
                    </button> */}

                      <button
                        onClick={handleSubmitForReview}
                        className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}

                {/* Update Applications */}
                {!isSelected && (
                  <div className=" border-[#e6e6e6]  border-[1px] p-[16px]  w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div>
                      <label className="text-black text-[14px] roboto block font-medium mb-1">
                        Product
                      </label>
                      <div className="flex items-center gap-3 mb-3">
                        <select
                          name="application_id"
                          value={showAppID}
                          onChange={(e) => setShowAppID(e.target.value)}
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                        >
                          <option selected={showAppID === ""} value="">
                            Select Your Product
                          </option>
                          {filterAppData?.map((data: any, index) => (
                            <option key={index} value={data?._id}>
                              {data.application}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={handleShowButton}
                          className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[200px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                        >
                          Show Request
                        </button>
                      </div>
                    </div>

                    {showAppID !== "" && reviewEditFormData.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border-b py-2 px-4 text-left">
                                Request Date
                              </th>
                              <th className="border-b py-2 px-4 text-left">
                                Review Topics
                              </th>
                              <th className="border-b py-2 px-4 text-left">
                                Reviewer Emails
                              </th>
                              <th className="border-b py-2 px-4 text-left">
                                Request Note
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {reviewEditFormData.map((data, mainIndex) => (
                              <tr key={mainIndex} className="border-b">
                                <td className="py-2 px-4">
                                  {new Date(
                                    data.created * 1000
                                  ).toLocaleString()}
                                </td>

                                {/* Assuming 'created' is a Unix timestamp */}
                                <td className="py-2 px-4">
                                  {data.review_topics.join(", ")}
                                </td>
                                <td className="py-2 px-4">
                                  {data.reviewer_emails.join(", ")}
                                </td>
                                <td className="py-2 px-4">
                                  {data.request_note}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    </>
  );
};

export default ReviewRequestPage;
