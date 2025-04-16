import {
  // fetchPostApi,
  // fetchPutApi,
  fetchGetApi,
  // validateFormData,
} from "../../functions/apiFunctions";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import { FaCirclePlus } from "react-icons/fa6";
// import { IoCloseCircle } from "react-icons/io5";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";

const ViewReviewResponse = () => {
  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );
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

  // const initialFormData = [
  //   {
  //     application_id: "",
  //     source_type: "",
  //     programming_languages: [],
  //     dependencies: [],
  //     repo: "",
  //   },
  // ];

  // const [formData, setFormData] = useState(initialFormData);
  // const [programmingLanguagesData, setProgrammingLanguagesData] = useState("");
  // const [dependenciesData, setDependenciesData] = useState("");

  const [showAppID, setShowAppID] = useState("");
  const [editFormData, setEditFormData] = useState([]);

  // const [programmingLanguagesEditData, setProgrammingLanguagesEditData] =
  //   useState("");
  // const [dependenciesEditData, setDependenciesEditData] = useState("");

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

  // const addCategoryData = (value: any) => {
  //   // console.log("++++++++++", value);
  //   if (value === "programming_languages") {
  //     if (programmingLanguagesData.trim()) {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         programming_languages: [
  //           ...prevData.programming_languages,
  //           programmingLanguagesData,
  //         ],
  //       }));
  //       setProgrammingLanguagesData("");
  //     }
  //   }
  //   if (value === "dependencies") {
  //     if (dependenciesData.trim()) {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         dependencies: [...prevData.dependencies, dependenciesData],
  //       }));
  //       setDependenciesData("");
  //     }
  //   }
  // };
  // const removeCategoryData = (value: any, indexToRemove: any) => {
  //   if (value === "programming_languages") {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       programming_languages: prevData.programming_languages.filter(
  //         (_, index) => index !== indexToRemove
  //       ),
  //     }));
  //   }
  //   if (value === "dependencies") {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       dependencies: prevData.dependencies.filter(
  //         (_, index) => index !== indexToRemove
  //       ),
  //     }));
  //   }
  // };

  // const handleFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
  //   event.preventDefault();

  //   // console.log(formData, "090990909");

  //   if (validateFormData(formData)) {
  //     try {
  //       const response = await fetchPostApi(
  //         "/api/applications/source",
  //         formData,
  //         "application/json",
  //         access_user
  //       );
  //       // console.log(response, "response******");
  //       if (response.status === 201) {
  //         toast.success("App Source created successfully!");
  //       }
  //       setFormData(initialFormData);
  //     } catch (error) {
  //       console.log("Create Application Source Error:", error);
  //       toast.error(error.response.data.error || error.response.data);
  //       setFormData(initialFormData);
  //     }
  //   }
  // };

  const handleShowButton = async () => {
    if (showAppID === "") {
      toast.error("Please select a product");
      return;
    }
    try {
      const path = `/api/applications/${showAppID}/reviews`;
      const response = await fetchGetApi(path, access_user, navigate, location);
      if (response.status === 200) {
        setEditFormData(response?.data);
      }
      console.log("res*****", response);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      setShowAppID("");
      //    setShowModalAppData([]);
    }
  };

  // const handleEditInputChange = (event: any) => {
  //   const { name, value } = event.target;
  //   if (name === "application_id") {
  //     const selectedValue = JSON.parse(value);
  //     setEditFormData({
  //       ...editFormData,
  //       application_id: selectedValue?._id,
  //     });
  //   } else {
  //     setEditFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }
  // };

  // const addEditCategoryData = (value: any) => {
  //   // console.log("++++++++++", value);
  //   if (value === "programming_languages") {
  //     if (programmingLanguagesEditData.trim()) {
  //       setEditFormData((prevData) => ({
  //         ...prevData,
  //         programming_languages: [
  //           ...prevData.programming_languages,
  //           programmingLanguagesEditData,
  //         ],
  //       }));
  //       setProgrammingLanguagesEditData("");
  //     }
  //   }
  //   if (value === "dependencies") {
  //     if (dependenciesEditData.trim()) {
  //       setEditFormData((prevData) => ({
  //         ...prevData,
  //         dependencies: [...prevData.dependencies, dependenciesEditData],
  //       }));
  //       setDependenciesEditData("");
  //     }
  //   }
  // };
  // const removeEditCategoryData = (value: any, indexToRemove: any) => {
  //   if (value === "programming_languages") {
  //     setEditFormData((prevData) => ({
  //       ...prevData,
  //       programming_languages: prevData.programming_languages.filter(
  //         (_, index) => index !== indexToRemove
  //       ),
  //     }));
  //   }
  //   if (value === "dependencies") {
  //     setEditFormData((prevData) => ({
  //       ...prevData,
  //       dependencies: prevData.dependencies.filter(
  //         (_, index) => index !== indexToRemove
  //       ),
  //     }));
  //   }
  // };

  // const handleEditFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
  //   event.preventDefault();

  //   // console.log(editFormData, "090990909");

  //   if (validateFormData(editFormData)) {
  //     try {
  //       const response = await fetchPutApi(
  //         `/api/applications/source/${editFormData.application_id}`,
  //         editFormData,
  //         "application/json",
  //         access_user
  //       );
  //       // console.log(response, "response******");
  //       if (response.status === 200) {
  //         toast.success("App Source Updated successfully!");
  //       }
  //     } catch (error) {
  //       console.log("Update Application Source Error:", error);
  //       toast.error(error.response.data.error || error.response.data);
  //       setEditFormData(initialFormData);
  //       setShowAppID("");
  //     }
  //   }
  // };

  // const handleCancelEditFormData = () => {
  //   setEditFormData(initialFormData);
  //   setShowAppID("");
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
      <Header path="appinfo" toggleSidebar={toggleSidebar} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        isActive="viewReviewResponse"
      />
      <div className="flex justify-center" data-testid="sidebar-toggle">
        <div className="w-full max-w-[80%] h-auto mb-20">
          <div className="flex lg:flex-row flex-col sm:p-4 p-[14px] pb-0 mt-[60px] mb-5 gap-[70px]">
            <div className=" border-[#e6e6e6] rounded-md border-[1px] p-[16px] w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] h-fit">
              <div className="mb-3">
                <h1 className="md:text-[40px] sm:text-[30px] text-[26px] roboto font-bold mb-4">
                  View Product Review Response(s)
                </h1>
                <p className="mt-[24px] text-[16px] roboto mb-0 text-black">
                  Feedback responses for your product
                </p>
              </div>


              <div className="border-[#e6e6e6]  border-[1px] p-[16px]  w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>
                  <label className="text-black text-[14px] roboto block font-medium mb-1">
                    Product
                  </label>
                  <div className="flex items-center gap-4 mb-3">
                    <select
                      name="application_id"
                      onChange={(e) => setShowAppID(e.target.value)}
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                    >
                      <option selected={showAppID === ""} value="">
                        Select a product
                      </option>
                      {filterAppData.map((data: any, index) => (
                        <option key={index} value={data?._id}>
                          {data.application}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleShowButton}
                      className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[200px] w-full text-white roboto font-medium text-[16px]"
                    >
                      Show Product
                    </button>
                  </div>
                </div>
                {showAppID !== "" &&
                  editFormData.length !== 0 &&
                  editFormData.map((data) => (
                    <div
                      className="border border-[#000] rounded-md"
                      key={data?.reveiew_id}
                    >
                      <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 m-2">
                        <div>
                          <h6 className="mb-0">Reviewer Email:</h6>
                        </div>
                        <div>
                          <p className="mb-0">{data?.reviewer_email}</p>
                        </div>
                      </div>
                      {data?.reviews.map((subData, index) => (
                        <div
                          className="grid sm:grid-cols-2 grid-cols-1  gap-2 m-2"
                          key={index}
                        >
                          <div>
                            <h6 className="mb-0">{subData?.topic}:</h6>
                          </div>
                          <div>
                            <p className="mb-0">{subData?.review}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    // <div
                    //   className="border border-[#000]"
                    //   key={data?.reveiew_id}
                    // >
                    //   <div className="flex gap-2 m-2">
                    //     <h5>Reviewer Email:</h5>
                    //     <p>{data?.reviewer_email}</p>
                    //   </div>
                    //   {data?.reviews.map((subData, index) => (
                    //     <div className="flex gap-2 m-2" key={index}>
                    //       <h5>{subData?.topic}:</h5>
                    //       <p>{subData?.review}</p>
                    //     </div>
                    //   ))}
                    // </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewReviewResponse;
