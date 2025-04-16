import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
//import Warning from "../../assets/Images/warning.png";
//import Right from "../../assets/Images/right.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  // createApplicationReviewRequest,
  // createOwnerID,
  fetchPostApi,
  fetchPutApi,
  fetchGetApi,
  uploadApplicationLogoUrl,
  validateFormData,
  // getApplicationOwnerShip,
  // updateApplicationOwnerShip,
} from "../../functions/apiFunctions";
import { toast } from "react-toastify";
import { FaCirclePlus } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import ProductModel from "../../components/ProductModel/ProductModel";

const AppInfoPage = () => {
  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );
  const [filterAppData, setFilterAppData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSelected, setIsSelected] = useState(true);

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
        // console.error("filterData Error:", error);
      }
    };
    !isSelected && filterAppDataByLoginUser();
  }, [isSelected]);
  // console.log(filterAppData);

  const initialFormData = {
    application: "",
    description: "",
    product_url: "",
    features: "",
    integrations: "",
    type: "",
    version: "",
    access_type: "",
    access_means: "",
    output_type: "",
    interface_languages: "",
    category: [],
  };


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categoryData, setCategoryData] = useState("");

  const [showAppID, setShowAppID] = useState("");
  const [editFormData, setEditFormData] = useState(initialFormData);
  const [editCategoryData, setEditCategoryData] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  //---------------create--------------------------------------------------------------------
  const applicationRequiredFields = [
    "application",
    "description",
    "product_url",
    "categoryData",
  ];
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeCategoryData = (e) => {
    setCategoryData(e.target.value);
  };
  const addCategoryData = () => {
    if (categoryData.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        category: [...prevData.category, categoryData],
      }));
      setCategoryData("");
    }
  };
  const removeCategoryData = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      category: prevData.category.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleFormSubmit = async () => {
    // event.preventDefault();

    //if (!validateFormData(formData, applicationRequiredFields)) return;

    if (!imageFile) {
      toast.error("Please select the product logo");
      return;
    }
    if (validateFormData(formData, applicationRequiredFields)) {
      try {
        const response = await fetchPostApi(
          "/api/applications",
          formData,
          "application/json",
          access_user,
          navigate,
          location
        );
        if (response.status === 201) {
          toast.success("Product submitted successfully!");
          const logoFormData = new FormData(); // Changed name to avoid conflict
          logoFormData.append("file", imageFile);

          await uploadApplicationLogoUrl(
            logoFormData,
            response?.data?.prototype_id,
            access_user,
            navigate,
            location
          );
          setFormData(initialFormData);
          setImageFile(null);
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.error ||
          error?.response?.data ||
          error.message;
        toast.error(errorMessage);

        setFormData(initialFormData);
        setImageFile(null);
      }
    }
  };

  //---------------------------------------------------------------------------------------------------

  //================= Edit ============================================================================

  const handleShowButton = async () => {
    if (showAppID === "") {
      toast.error("Please select a  product name");
      return;
    }
    try {
      const path = `/api/applications/${showAppID}`;
      const response = await fetchGetApi(path, undefined, navigate, location);
      if (response.status === 200) {
        setEditFormData(response?.data);
      }
      // console.log("res*****", response);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      setShowAppID("");
      //    setShowModalAppData([]);
    }
  };

  const handleEditInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditChangeCategoryData = (e) => {
    setEditCategoryData(e.target.value);
  };

  const addEditCategoryData = () => {
    if (editCategoryData.trim()) {
      setEditFormData((prevData) => ({
        ...prevData,
        category: [...prevData.category, editCategoryData],
      }));
      setEditCategoryData("");
    }
  };
  const removeEditCategoryData = (indexToRemove) => {
    setEditFormData((prevData) => ({
      ...prevData,
      category: prevData.category.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleEditImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditImageFile(file);
  };

  const handleEditFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (validateFormData(editFormData, applicationRequiredFields)) {
      try {
        const response = await fetchPutApi(
          `/api/applications/${showAppID}`,
          editFormData,
          "application/json",
          access_user,
          navigate,
          location
        );
        if (response.status === 200) {
          if (editImageFile) {
            const formData = new FormData();
            formData.append("file", editImageFile);
            await uploadApplicationLogoUrl(
              formData,
              showAppID,
              access_user,
              navigate,
              location
            );
            setEditImageFile(null);
          }
          toast.success("Product updated successfully!");
        }

        // console.log(`check api log`, response);
      } catch (error) {
        // console.error(error.message);
      }
    }
  };
  const handleCancelEditFormData = () => {
    setEditFormData(initialFormData);
    setShowAppID("");
  };


  // const handleOpenModal = () => {
  //   !access_user ? setIsModalOpen(true) : handleFormSubmit(); // Open the modal
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  // const handleSaveDraft = async () => {

  //   const payloadData = {
  //     collection: "applications",
  //     document: formData
  //   }
  //   const response = await fetchPostApi(
  //     "/api/create_document",
  //     payloadData,
  //     "application/json",
  //     access_user,
  //     navigate,
  //     location
  //   );
  //   console.log("response handleSaveDraft ==", response)
  // }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // console.log("formData ========   ", formData);
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
        isActive="App info"
      />
      <div className="flex justify-center" data-testid="sidebar-toggle">
        <div className="w-full max-w-[80%] h-auto mb-20">
          <div className="flex lg:flex-row flex-col sm:p-4 p-[14px] pb-0 mt-[60px] mb-5 gap-[70px]">
            <div className=" border-[#e6e6e6] rounded-md border-[1px] p-[16px] w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] h-fit">
              <h1 className="md:text-[40px] sm:text-[30px] text-[26px] roboto font-bold">
                Submit Your Favorite AI Product for Curation
              </h1>

              <div className="flex">
                <button
                  onClick={() => setIsSelected(true)}
                  className={`${isSelected
                    ? "bg-[#000000] text-white"
                    : "bg-[#ffff] text-black"
                    } border-[#000] border-[1px] rounded-l-lg h-[48px] max-w-[240px] w-full roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg hover:z-10 transition-all duration-300`}
                >
                  Add a Product
                </button>

                <button
                  onClick={() => setIsSelected(false)}
                  className={`${!isSelected
                    ? "bg-[#000000] text-white"
                    : "bg-[#ffff] text-black"
                    } border-[#000] border-[1px] rounded-r-lg h-[48px] max-w-[240px] w-full roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg hover:z-10 transition-all duration-300`}
                >
                  View/Update a Product
                </button>
              </div>

              {/* Add Applications */}
              {isSelected && (
                <div className="border-[#e6e6e6]  border-[1px] p-[16px]  w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Product Name<sup className="text-red-500">*</sup>
                    </label>
                    <input
                      id="appName"
                      data-testid="appName"
                      type="text"
                      name="application"
                      value={formData.application}
                      onChange={handleInputChange}
                      placeholder="Enter your product name"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>

                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Description<sup className="text-red-500">*</sup>
                    </label>
                    <input
                      data-testid="description"
                      id="description"
                      name="description"
                      type="text"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Provide a detailed description of your product"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>
                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Product URL<sup className="text-red-500">*</sup>
                    </label>
                    <input
                      data-testid="product_url"
                      id="product_url"
                      name="product_url"
                      type="text"
                      value={formData.product_url}
                      onChange={handleInputChange}
                      placeholder="Provide the URL for the product/company"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>
                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Category<sup className="text-red-500">*</sup>
                    </label>
                    <input
                      data-testid="interface_languages"
                      id="categoryData"
                      name="categoryData"
                      type="text"
                      value={categoryData}
                      onChange={handleChangeCategoryData}
                      placeholder="Category of product e.g. App | Bot | Assistant | Agent | AI Model | Infrastructure"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                    {categoryData && (
                      <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                        {categoryData}
                        <button
                          onClick={addCategoryData}
                          className="cursor-pointer"
                        >
                          <FaCirclePlus
                            size={20}
                            className="transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                          />
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {formData.category.map((data, index) => (
                        <div
                          key={index}
                          className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                        >
                          {data}
                          <button
                            onClick={() => removeCategoryData(index)}
                            className="cursor-pointer"
                          >
                            <IoCloseCircle
                              size={25}
                              className="transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Features
                    </label>
                    <textarea
                      data-testid="features"
                      id="features"
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      placeholder="List of key features"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[66px]"
                    />
                  </div>

                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Integrations
                    </label>
                    <input
                      data-testid="integrations"
                      id="integrations"
                      name="integrations"
                      type="text"
                      value={formData.integrations}
                      onChange={handleInputChange}
                      placeholder="List of applications/databases/libraries that your product is integrated with"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>

                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Type
                    </label>
                    <input
                      data-testid="type"
                      id="type"
                      name="type"
                      type="text"
                      value={formData.type}
                      onChange={handleInputChange}
                      placeholder="Production or a prototype"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>

                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Version
                    </label>
                    <input
                      data-testid="version"
                      id="version"
                      name="version"
                      type="text"
                      value={formData.version}
                      onChange={handleInputChange}
                      placeholder="Current version of your product"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>

                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Access Type
                    </label>
                    <input
                      data-testid="access_type"
                      id="access_type"
                      name="access_type"
                      type="text"
                      value={formData.access_type}
                      onChange={handleInputChange}
                      placeholder="Means of user communication with your product e.g. Text, Voice, Both"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>

                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Access Means
                    </label>
                    <input
                      data-testid="access_means"
                      id="access_means"
                      name="access_means"
                      type="text"
                      value={formData.access_means}
                      onChange={handleInputChange}
                      placeholder="Type of your product e.g. Website, Android App, iphone App, Agent, AI Model, download library"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>

                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Output Type
                    </label>
                    <input
                      data-testid="output_type"
                      id="output_type"
                      name="output_type"
                      type="text"
                      value={formData.output_type}
                      onChange={handleInputChange}
                      placeholder="Output type of your product e.g. Text, Image, Audio, Video"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>

                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Interface Languages
                    </label>
                    <input
                      data-testid="interface_languages"
                      id="interface_languages"
                      name="interface_languages"
                      type="text"
                      value={formData.interface_languages}
                      onChange={handleInputChange}
                      placeholder="Supported languages for international use"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="appLogo"
                      className="text-black text-[14px] roboto block font-medium"
                    >
                      Product Logo<sup className="text-red-500">*</sup>
                    </label>

                    <div className="border-[#e6e6e6] border-[1px] rounded-[6px] h-[36px] px-2">
                      <input
                        data-testid="appLogo"
                        id="appLogo"
                        type="file"
                        name="app_logo"
                        onChange={handleImageChange}
                        className=" mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f2f2f2] file:text-black hover:file:bg-indigo-100"
                      />
                    </div>
                  </div>

                  <div className="flex gap-[12px]">
                    {/* <button
                      onClick={handleSaveDraft}
                      className="border-[#000] border-[1px] rounded-lg h-[48px] max-w-[240px] w-full text-black roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300">
                      Save Draft
                    </button> */}

                    <button
                      onClick={handleFormSubmit}
                      className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                    >
                      Submit
                    </button>
                  </div>
                  {isModalOpen && (
                    <ProductModel onClose={handleCloseModal} />
                  )}
                </div>
              )}

              {/* Update Applications */}
              {!isSelected && (
                <div className=" border-[#e6e6e6]  border-[1px] p-[16px]  w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <div>
                    <label className="text-black text-[14px] roboto block font-medium mb-1">
                      Product Name
                    </label>
                    <div className="flex items-center gap-3 mb-3">
                      <select
                        value={showAppID}
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
                        className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[200px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                      >
                        Show Product
                      </button>
                    </div>


                  </div>

                  {showAppID !== "" && editFormData.application !== "" && (
                    <>
                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Product Name<sup className="text-red-500">*</sup>
                        </label>
                        <input
                          id="appName"
                          data-testid="appName"
                          type="text"
                          name="application"
                          value={editFormData.application}
                          onChange={handleInputChange}
                          placeholder="Enter your product name"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Description<sup className="text-red-500">*</sup>
                        </label>
                        <input
                          data-testid="description"
                          id="description"
                          name="description"
                          type="text"
                          value={editFormData?.description}
                          onChange={handleEditInputChange}
                          placeholder="Provide a detailed description of your product"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Product URL<sup className="text-red-500">*</sup>
                        </label>
                        <input
                          data-testid="product_url"
                          id="product_url"
                          name="product_url"
                          type="text"
                          value={editFormData?.product_url}
                          onChange={handleEditInputChange}
                          placeholder="Enter the URL for the product/company"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Category<sup className="text-red-500">*</sup>
                        </label>
                        <input
                          data-testid="interface_languages"
                          id="categoryData"
                          name="categoryData"
                          type="text"
                          value={editCategoryData}
                          onChange={handleEditChangeCategoryData}
                          placeholder="Product category e.g. Bot | assistant | agent | AI Model | Infrastructure"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                        {editCategoryData && (
                          <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                            {editCategoryData}
                            <button
                              onClick={addEditCategoryData}
                              className="cursor-pointer"
                            >
                              <FaCirclePlus
                                size={20}
                                className="transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                              />
                            </button>
                          </div>
                        )}
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {Array.isArray(editFormData.category) &&
                            editFormData?.category.map((data, index) => (
                              <div
                                key={index}
                                className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                              >
                                {data}
                                <button
                                  onClick={() => removeEditCategoryData(index)}
                                  className="cursor-pointer"
                                >
                                  <IoCloseCircle
                                    size={25}
                                    className="transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                                  />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Features
                        </label>
                        <textarea
                          data-testid="features"
                          id="features"
                          name="features"
                          value={editFormData?.features}
                          onChange={handleEditInputChange}
                          placeholder="Enter a list of key features for your product"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[66px]"
                        />
                      </div>

                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Integrations
                        </label>
                        <input
                          data-testid="integrations"
                          id="integrations"
                          name="integrations"
                          type="text"
                          value={editFormData?.integrations}
                          onChange={handleEditInputChange}
                          placeholder="If this product has integration with other products list them otherwise enter None"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>

                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Type
                        </label>
                        <input
                          data-testid="type"
                          id="type"
                          name="type"
                          type="text"
                          value={editFormData?.type}
                          onChange={handleEditInputChange}
                          placeholder="Production/Prototype (backend field)"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>

                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Version
                        </label>
                        <input
                          data-testid="version"
                          id="version"
                          name="version"
                          type="text"
                          value={editFormData?.version}
                          onChange={handleEditInputChange}
                          placeholder="Current version of the product"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>

                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Access Type
                        </label>
                        <input
                          data-testid="access_type"
                          id="access_type"
                          name="access_type"
                          type="text"
                          value={editFormData?.access_type}
                          onChange={handleEditInputChange}
                          placeholder="Means of user communication with this product e.g. Text, Voice, Both"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>

                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Access Means
                        </label>
                        <input
                          data-testid="access_means"
                          id="access_means"
                          name="access_means"
                          type="text"
                          value={editFormData?.access_means}
                          onChange={handleEditInputChange}
                          placeholder="Type of your product e.g. Website, Android App, iphone App, Agent, AI Model, download library"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>

                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Output Type
                        </label>
                        <input
                          data-testid="output_type"
                          id="output_type"
                          name="output_type"
                          type="text"
                          value={editFormData?.output_type}
                          onChange={handleEditInputChange}
                          placeholder="Output type of your product e.g. Text, Image, Audio, Video"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>

                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Interface Languages
                        </label>
                        <input
                          data-testid="interface_languages"
                          id="interface_languages"
                          name="interface_languages"
                          type="text"
                          value={editFormData?.interface_languages}
                          onChange={handleEditInputChange}
                          placeholder="Supported languages for international use"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="appLogo"
                          className="text-black text-[14px] roboto block font-medium"
                        >
                          Product Logo<sup className="text-red-500">*</sup>
                        </label>
                        <div className="border-[#e6e6e6] border-[1px] rounded-[6px] h-[36px] px-2">
                          <input
                            data-testid="appLogo"
                            id="appLogo"
                            type="file"
                            name="app_logo"
                            onChange={handleEditImageChange}
                            className=" mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f2f2f2] file:text-black hover:file:bg-indigo-100"
                          />
                        </div>
                      </div>

                      <div className="flex gap-[12px]">
                        <button
                          onClick={handleCancelEditFormData}
                          className="border-gray-500 border-[1px] bg-gray-500  rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleEditFormSubmit}
                          className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                        >
                          Save Product
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* TODO: Uncomment and improvise this block later.
          <div className=" border-y-[1px] border-b-[#e6e6e6e]">
            <div className="container flex lg:flex-row flex-col justify-between md:py-[60px] py-[40px]">
              <div className="lg:w-[50%] w-full">
                <h2 className="md:text-[40px] sm:text-[30px] text-[26px] roboto font-bold mb-4">
                  Submission Guidelines and Agreement
                </h2>
                <p className="mt-[24px] text-[16px] roboto mb-0 text-black">
                  Choose the feedback criteria for reviewers
                </p>
              </div>
              <div className="lg:w-[50%] w-full">
                <div className="flex gap-4 border-b-[#e6e6e6] border-b-[1px] py-[20px]">
                  <div className="bg-[#f2f2f2] rounded-full w-[60px] h-[60px] flex justify-center items-center text-[60px]">
                    <img src={Warning} alt="Warning" />
                  </div>
                  <div>
                    <h3 className="text-[20px] roboto">
                      Submission Guidelines
                    </h3>
                    <p className="#808080">Read Terms & Conditions</p>
                  </div>
                </div>
                <div className="flex gap-4 border-b-[#e6e6e6] border-b-[1px] py-[20px]">
                  <div className="bg-[#f2f2f2] rounded-full w-[60px] h-[60px] flex justify-center items-center text-[60px]">
                    <img src={Right} alt="Right" />
                  </div>
                  <div>
                    <h3 className="text-[20px] roboto">Agreement</h3>
                    <p className="#808080">Check to agree before submission</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          */}
          <div className="container md:py-[64px] py-[40px] mb-[100px]">
            <div className="bg-[#ececec] slider-main">
              <div className="slider-container">
                <Slider {...settings}>
                  <div>
                    <div className="bg-[#ECECEC] w-full h-[300px]">
                      <p className="text-[12px] font-normal sm:sm:leading-[16px] text-center h-full flex justify-center items-center">
                        Thank you for submitting your AI product to huby. You
                        will receive confirmation shortly.
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="bg-[#ECECEC] w-full h-[300px]">
                      <p className="text-[12px] font-normal sm:sm:leading-[16px] text-center h-full flex justify-center items-center">
                        Thank you for submitting your AI product to huby. You
                        will receive confirmation shortly.
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="bg-[#ECECEC] w-full h-[300px]">
                      <p className="text-[12px] font-normal sm:sm:leading-[16px] text-center h-full flex justify-center items-center">
                        Thank you for submitting your AI product to huby. You
                        will receive confirmation shortly.
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="bg-[#ECECEC] w-full h-[300px]">
                      <p className="text-[12px] font-normal sm:sm:leading-[16px] text-center h-full flex justify-center items-center">
                        Thank you for submitting your AI product to huby. You
                        will receive confirmation shortly.
                      </p>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default AppInfoPage;
