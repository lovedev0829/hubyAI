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
      <div className="flex" data-testid="sidebar-toggle">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          isActive="viewReviewResponse"
        />

        <div className="w-full min-h-[84vh]">
          {/* {for create app} */}
          <div className="flex lg:flex-row flex-col sm:p-4 p-[14px] pb-0 mt-[60px] mb-5 gap-[70px] justify-center">
            <div className="lg:w-[50%] w-full">
              <div className="mb-3">
                <h1 className="md:text-[40px] sm:text-[30px] text-[26px] roboto font-bold mb-4">
                  View Product Review Response(s)
                </h1>
                <p className="mt-[24px] text-[16px] roboto mb-0 text-black">
                  Feedback responses for your product
                </p>
              </div>

              <div className=" border-[#e6e6e6]  border-[1px] p-[16px]  w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
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

                {/* {showAppID !== "" && editFormData.application_id !== "" && (
                  <>
                    <div>
                      <label className="text-black text-[14px] roboto block font-medium">
                        Source type
                      </label>
                      <input
                        data-testid="source_type"
                        id="source_type"
                        required
                        name="source_type"
                        type="text"
                        value={editFormData.source_type}
                        onChange={handleEditInputChange}
                        placeholder="Open source or Closed source"
                        className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                      />
                    </div>

                    <div>
                      <label className="text-black text-[14px] roboto block font-medium">
                        Programming Languages
                      </label>
                      <input
                        data-testid="programming_languages"
                        id="programming_languages"
                        required
                        name="programming_languages"
                        type="text"
                        value={programmingLanguagesEditData}
                        onChange={(e) =>
                          setProgrammingLanguagesEditData(e.target.value)
                        }
                        placeholder="Programming languages your app is written in"
                        className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                      />
                      {programmingLanguagesEditData && (
                        <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                          {programmingLanguagesEditData}
                          <button
                            onClick={() =>
                              addEditCategoryData("programming_languages")
                            }
                            className="cursor-pointer"
                          >
                            <FaCirclePlus size={20} />
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {editFormData?.programming_languages.map(
                          (data, index) => (
                            <div
                              key={index}
                              className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                            >
                              {data}
                              <button
                                onClick={() =>
                                  removeEditCategoryData(
                                    "programming_languages",
                                    index
                                  )
                                }
                                className="cursor-pointer"
                              >
                                <IoCloseCircle size={25} />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-black text-[14px] roboto block font-medium">
                        Dependencies
                      </label>
                      <input
                        data-testid="dependencies"
                        id="dependencies"
                        required
                        name="dependencies"
                        type="text"
                        value={dependenciesEditData}
                        onChange={(e) =>
                          setDependenciesEditData(e.target.value)
                        }
                        placeholder="Products and libraries that this app depends on, incl. databases, cloud providers, etc "
                        className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                      />
                      {dependenciesEditData && (
                        <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                          {dependenciesEditData}
                          <button
                            onClick={() => addEditCategoryData("dependencies")}
                            className="cursor-pointer"
                          >
                            <FaCirclePlus size={20} />
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {editFormData?.dependencies.map((data, index) => (
                          <div
                            key={index}
                            className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                          >
                            {data}
                            <button
                              onClick={() =>
                                removeEditCategoryData("dependencies", index)
                              }
                              className="cursor-pointer"
                            >
                              <IoCloseCircle size={25} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-black text-[14px] roboto block font-medium">
                        Repo Url
                      </label>
                      <input
                        data-testid="repo"
                        id="repo"
                        required
                        name="repo"
                        type="text"
                        value={editFormData.repo}
                        onChange={handleEditInputChange}
                        placeholder="Location ofthe source code repository"
                        className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                      />
                    </div>

                    <div className="flex gap-[12px]">
                      <button
                        onClick={handleCancelEditFormData}
                        className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleEditFormSubmit}
                        className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px]"
                      >
                        Save App
                      </button>
                    </div>
                  </>
                )} */}
              </div>
            </div>

            {/* <div className=" border-[#e6e6e6] rounded-md border-[1px] p-[16px] lg:w-[50%] w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] h-fit">
              <div>
                <label className="text-black text-[14px] roboto block font-medium mb-1">
                  App Name
                </label>
                <select
                  name="application_id"
                  onChange={handleInputChange}
                  className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                >
                  <option selected={formData.application_id === ""} value="">
                    Select Your App
                  </option>
                  {filterAppData.map((data: any, index) => (
                    <option key={index} value={JSON.stringify(data)}>
                      {data.application}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-black text-[14px] roboto block font-medium">
                  Source type
                </label>
                <input
                  data-testid="source_type"
                  id="source_type"
                  required
                  name="source_type"
                  type="text"
                  value={formData.source_type}
                  onChange={handleInputChange}
                  placeholder="Open source or closed source"
                  className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                />
              </div>

              <div>
                <label className="text-black text-[14px] roboto block font-medium">
                  Programming Languages
                </label>
                <input
                  data-testid="programming_languages"
                  id="programming_languages"
                  required
                  name="programming_languages"
                  type="text"
                  value={programmingLanguagesData}
                  onChange={(e) => setProgrammingLanguagesData(e.target.value)}
                  placeholder="List of programming languages this app is written in"
                  className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                />
                {programmingLanguagesData && (
                  <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                    {programmingLanguagesData}
                    <button
                      onClick={() => addCategoryData("programming_languages")}
                      className="cursor-pointer"
                    >
                      <FaCirclePlus size={20} />
                    </button>
                  </div>
                )}
                <div className="flex gap-2 mt-1 flex-wrap">
                  {formData.programming_languages.map((data, index) => (
                    <div
                      key={index}
                      className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                    >
                      {data}
                      <button
                        onClick={() =>
                          removeCategoryData("programming_languages", index)
                        }
                        className="cursor-pointer"
                      >
                        <IoCloseCircle size={25} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-black text-[14px] roboto block font-medium">
                  Dependencies
                </label>
                <input
                  data-testid="dependencies"
                  id="dependencies"
                  required
                  name="dependencies"
                  type="text"
                  value={dependenciesData}
                  onChange={(e) => setDependenciesData(e.target.value)}
                  placeholder="Products and libraries that this app depends on, incl. Databases, cloud providers, etc"
                  className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                />
                {dependenciesData && (
                  <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                    {dependenciesData}
                    <button
                      onClick={() => addCategoryData("dependencies")}
                      className="cursor-pointer"
                    >
                      <FaCirclePlus size={20} />
                    </button>
                  </div>
                )}
                <div className="flex gap-2 mt-1 flex-wrap">
                  {formData.dependencies.map((data, index) => (
                    <div
                      key={index}
                      className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                    >
                      {data}
                      <button
                        onClick={() =>
                          removeCategoryData("dependencies", index)
                        }
                        className="cursor-pointer"
                      >
                        <IoCloseCircle size={25} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-black text-[14px] roboto block font-medium">
                  Repo Url
                </label>
                <input
                  data-testid="repo"
                  id="repo"
                  required
                  name="repo"
                  type="text"
                  value={formData.repo}
                  onChange={handleInputChange}
                  placeholder="Location of the source code repository"
                  className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                />
              </div>

              <div className="flex gap-[12px]">
                <button className="border-[#000] border-[1px] rounded-lg h-[48px] max-w-[240px] w-full text-black roboto font-medium text-[16px]">
                  Save Draft
                </button>
                <button
                  onClick={handleFormSubmit}
                  className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px]"
                >
                  Submit
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewReviewResponse;
