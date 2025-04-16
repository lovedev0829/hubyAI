import {
  // fetchPostApi,
  //   fetchPutApi,
  fetchGetApi,
  // validateFormData,
} from "../../functions/apiFunctions";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar/Sidebar";
// import RatingEditForm from "../../components/ApplicationRating/RatingEditForm";
import { useLocation, useNavigate } from "react-router-dom";
import CreateRatingsComponent from "../../components/ApplicationRatings/CreateRatingsComponent";
import AverageRatingComponent from "../../components/ApplicationRatings/AverageRatingComponent";
import RatingsComponent from "../../components/ApplicationRatings/RatingsComponent";

const ApplicationRatingPage = () => {
  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );
  const user = JSON.parse(localStorage.getItem("userData") as string);
  const loginUser = user?.user_id;

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
        console.log("filterData Error:", error);
      }
    };
    filterAppDataByLoginUser();
  }, []);

  // const initialFormData = {
  //   application_id: "",
  //   proto_impact_rating: 0,
  //   proto_practicality_rating: 0,
  //   app_practicality_rating: "",
  //   app_performance_rating: "",
  //   app_ux_rating: "",
  //   app_ecosystem_rating: "",
  //   comment: "",
  //   owner_comment_reply: "",
  //   upvote_downvote: 0,
  // };

  // const [formData, setFormData] = useState(initialFormData);

  const [showAppID, setShowAppID] = useState("");
  //   const [editFormData, setEditFormData] = useState(initialFormData);
  const [ratingsData, setRatingsData] = useState(null);

  const [Owner, setOwner] = useState("");
  const [isUserCreateRatings, setIsUserCreateRatings] = useState(false);

  // const handleInputChange = (event: any) => {
  //   const { name, value } = event.target;
  //   if (name === "application_id") {
  //     const selectedValue = JSON.parse(value);
  //     setFormData({
  //       ...formData,
  //       application_id: selectedValue?._id,
  //     });
  //   } else {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }
  // };

  // const handleFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
  //   event.preventDefault();

  //   // console.log(formData, "090990909");

  //   if (validateFormData(formData)) {
  //     try {
  //       const response = await fetchPostApi(
  //         "/api/applications/ratings",
  //         formData,
  //         "application/json",
  //         access_user,
  //         navigate,
  //         location
  //       );
  //       // console.log(response, "response******");
  //       if (response.status === 201) {
  //         toast.success("App ratings created successfully!");
  //       }
  //       setFormData(initialFormData);
  //     } catch (error) {
  //       console.log("Create Application ratings Error:", error);
  //       toast.error(error.response.data.error || error.response.data);
  //       setFormData(initialFormData);
  //     }
  //   }
  // };
  const fetchRatingData = async () => {
    try {
      const path = `/api/applications/ratings/${showAppID}`;
      //const response = await fetchGetApi(path, access_user);
      const response = await fetchGetApi(path, undefined, navigate, location);
      if (response.status === 200) {
        setRatingsData(response?.data);
        setOwner(response?.data.created_by);
      }
      console.log("res*****", response);
    } catch (error) {
      console.error("fetchRatingData Error:", error);
      setRatingsData([]);
    }
  };

  const handleShowButton = async () => {
    if (showAppID === "") {
      toast.error("Please select an App Name");
      return;
    }
    try {
      await fetchRatingData();
    } catch (error) {
      toast.error(error?.response?.data?.error);
      setShowAppID("");
      setRatingsData([]);
    }
  };

  const hasUserCreatedRating = (ratings, userId) => {
    return ratings.some((rating) => rating?.created_by === userId);
  };

  useEffect(() => {
    if (ratingsData) {
      const userHasCreatedRating = hasUserCreatedRating(ratingsData, loginUser);
      setIsUserCreateRatings(userHasCreatedRating);
    }
  }, [ratingsData, loginUser]);

  //   const handleEditInputChange = (event: any) => {
  //     const { name, value } = event.target;
  //     if (name === "application_id") {
  //       const selectedValue = JSON.parse(value);
  //       setEditFormData({
  //         ...editFormData,
  //         application_id: selectedValue?._id,
  //       });
  //     } else {
  //       setEditFormData((prevData) => ({
  //         ...prevData,
  //         [name]: value,
  //       }));
  //     }
  //   };

  //   const handleEditFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
  //     event.preventDefault();

  //     // console.log(editFormData, "090990909");

  //     if (validateFormData(editFormData)) {
  //       try {
  //         const response = await fetchPutApi(
  //           `/api/ratings/${editFormData.application_id}`,
  //           editFormData,
  //           "application/json",
  //           access_user
  //         );
  //         // console.log(response, "response******");
  //         if (response.status === 200) {
  //           toast.success("App Source Updated successfully!");
  //         }
  //       } catch (error) {
  //         console.log("Update Application Source Error:", error);
  //         toast.error(error.response.data.error || error.response.data);
  //         setEditFormData(initialFormData);
  //         setShowAppID("");
  //       }
  //     }
  //   };

  //   const handleCancelEditFormData = () => {
  //     setEditFormData(initialFormData);
  //     setShowAppID("");
  //   };

  useEffect(() => {
    console.log("showAppID", showAppID);
  }, [showAppID]);

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
      <Header path="appinfo" toggleSidebar={toggleSidebar} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        isActive="applicationRating"
      />

      <div className="flex justify-center" data-testid="sidebar-toggle">
        <div className="w-full max-w-[80%] h-auto mb-20">
          <div className="flex lg:flex-row flex-col sm:p-4 p-[14px] pb-0 mt-[60px] mb-5 gap-[70px]">
            <div className=" border-[#e6e6e6] rounded-md border-[1px] p-[16px] w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] h-fit">
              <div className="mb-3">
                <h1 className="md:text-[40px] sm:text-[30px] text-[26px] roboto font-bold mb-4">
                  Provide Product Rating
                </h1>
                <p className="mt-[24px] text-[16px] roboto mb-0 text-black">
                  Upload and register your AI application on Huby
                </p>
              </div>

              <div className="border-[#e6e6e6]  border-[1px] p-[16px]  w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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
                        Select Product
                      </option>
                      {filterAppData.map((data: any, index) => (
                        <option key={index} value={data?._id}>
                          {data.application}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleShowButton}
                      className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[200px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                    >
                      Show Product
                    </button>
                  </div>
                </div>

                {/* {showAppID !== "" &&
                  ratingsData?.length !== 0 &&
                  ratingsData.map((rating) => (
                    <RatingEditForm
                      key={rating?.rating_id}
                      rating={rating}
                      setShowAppID={setShowAppID}
                    />
                  ))} */}

                {showAppID !== "" && ratingsData && ratingsData?.length > 0 && (
                  <div className="max-w-full px-[12px] my-[20px] mb-[40px] md:mb-[50px] xl:mb-[80px]">
                    <h1 className="text-[24px] font-black mulish text-left">
                      Ratings:
                    </h1>
                    <AverageRatingComponent
                      /*applicationId={showAppID} */ ratingsData={ratingsData}
                    />
                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between border-b-[1px] border-b-[#000000] mt-[20px] mx-4">
                      {ratingsData?.map((rating) => (
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

                {showAppID !== "" &&
                  ratingsData?.length === 0 &&
                  !isUserCreateRatings && (
                    <CreateRatingsComponent
                      applicationId={showAppID}
                      fetchRatingData={fetchRatingData}
                      Owner={Owner}
                    />
                  )}

              </div>


            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplicationRatingPage;
