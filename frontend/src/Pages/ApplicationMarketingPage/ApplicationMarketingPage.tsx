import {
  fetchPostApi,
  fetchPutApi,
  fetchGetApi,
  validateFormData,
} from "../../functions/apiFunctions";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCirclePlus } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import Sidebar from "../../components/Sidebar/Sidebar";
import MediaAssetsSection from "../../components/MediaAssetsSection/MediaAssetsSection";
import { useLocation, useNavigate } from "react-router-dom";

const ApplicationMarketingPage = () => {
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

  const initialFormData = {
    application_id: "",
    industry: [],
    brochure: "",
    demo: [],
    tutorials: { primer: "", introduction: "" },
    featured_page: "",
    pricing_type: "",
    pricing: "",
    tags: [],
    communities: { twitter_x: "", discord: "", slack: "" },
    privacy: "",
    ethics: "",
    marketing_id: "",
  };
  const [isSelected, setIsSelected] = useState(true);
  const [formData, setFormData] = useState(initialFormData);
  const [industryData, setIndustryData] = useState("");
  const [demoData, setDemoData] = useState("");
  const [tagsData, setTagsData] = useState("");

  const [showAppID, setShowAppID] = useState("");
  const [editFormData, setEditFormData] = useState(initialFormData);
  const [industryEditData, setIndustryEditData] = useState("");
  const [demoEditData, setDemoEditData] = useState("");
  const [tagsEditData, setTagsEditData] = useState("");

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    if (name === "application_id") {
      const selectedValue = JSON.parse(value);
      setFormData({
        ...formData,
        application_id: selectedValue?._id,
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleNestedInputChange = (e, parent, child) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [child]: value,
      },
    });
  };

  const addCategoryData = (value: any) => {
    if (value === "industry") {
      if (industryData.trim()) {
        setFormData((prevData) => ({
          ...prevData,
          industry: [...prevData.industry, industryData],
        }));
        setIndustryData("");
      }
    }
    if (value === "demo") {
      if (demoData.trim()) {
        setFormData((prevData) => ({
          ...prevData,
          demo: [...prevData.demo, demoData],
        }));
        setDemoData("");
      }
    }
    if (value === "tags") {
      if (tagsData.trim()) {
        setFormData((prevData) => ({
          ...prevData,
          tags: [...prevData.tags, tagsData],
        }));
        setTagsData("");
      }
    }
  };

  const removeCategoryData = (value: any, indexToRemove: any) => {
    if (value === "industry") {
      setFormData((prevData) => ({
        ...prevData,
        industry: prevData.industry.filter(
          (_, index) => index !== indexToRemove
        ),
      }));
    }
    if (value === "demo") {
      setFormData((prevData) => ({
        ...prevData,
        demo: prevData.demo.filter((_, index) => index !== indexToRemove),
      }));
    }
    if (value === "tags") {
      setFormData((prevData) => ({
        ...prevData,
        tags: prevData.tags.filter((_, index) => index !== indexToRemove),
      }));
    }
  };
  const applicationMarketingFields = [
    "application_id",
    "industry",
    "brochure",
    "pricing_type",
    "pricing",
    "privacy",
  ];
  const handleFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // console.log(formData, "marketing");

    if (validateFormData(formData, applicationMarketingFields)) {
      try {
        const response = await fetchPostApi(
          "/api/applications/marketing",
          formData,
          "application/json",
          access_user,
          navigate,
          location
        );
        // console.log(response, "response******");
        if (response.status === 201) {
          toast.success("Marketing information added successfully!");
        }

        setFormData(initialFormData);

        // setCategory("");
      } catch (error) {
        console.log("Marketing Add/Update Error:", error);
        toast.error(error.response.data.error || error.response.data);
        setFormData(initialFormData);
      }
    }
  };
  const getMarketingData = async () => {
    try {
      const path = `/api/applications/marketing/${showAppID}`;
      const response = await fetchGetApi(path, undefined, navigate, location);
      if (response.status === 200) {
        setEditFormData(response?.data);
      }
      console.log("res*****", response);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      setShowAppID("");
      //    setShowModalAppData([]);
    }
  }

  const handleShowButton = async () => {
    if (showAppID === "") {
      toast.error("Please select a product");
      return;
    }
    getMarketingData()
  };

  const handleEditInputChange = (event: any) => {
    const { name, value } = event.target;
    if (name === "application_id") {
      const selectedValue = JSON.parse(value);
      setEditFormData({
        ...editFormData,
        application_id: selectedValue?._id,
      });
    } else {
      setEditFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleNestedEditInputChange = (e, parent, child) => {
    const { value } = e.target;
    setEditFormData({
      ...editFormData,
      [parent]: {
        ...editFormData[parent],
        [child]: value,
      },
    });
  };

  const addEditCategoryData = (value: any) => {
    if (value === "industry") {
      if (industryEditData.trim()) {
        setEditFormData((prevData) => ({
          ...prevData,
          industry: [...prevData.industry, industryEditData],
        }));
        setIndustryEditData("");
      }
    }

    if (value === "demo") {
      if (demoEditData.trim()) {
        setEditFormData((prevData) => ({
          ...prevData,
          demo: [...prevData.demo, demoEditData],
        }));
        setDemoEditData("");
      }
    }

    if (value === "tags") {
      if (tagsEditData.trim()) {
        setEditFormData((prevData) => ({
          ...prevData,
          tags: [...prevData.tags, tagsEditData],
        }));
        setTagsEditData("");
      }
    }
  };

  const removeEditCategoryData = (value: any, indexToRemove: any) => {
    if (value === "industry") {
      setEditFormData((prevData) => ({
        ...prevData,
        industry: prevData.industry.filter(
          (_, index) => index !== indexToRemove
        ),
      }));
    }
    if (value === "demo") {
      setEditFormData((prevData) => ({
        ...prevData,
        demo: prevData.demo.filter((_, index) => index !== indexToRemove),
      }));
    }
    if (value === "tags") {
      setEditFormData((prevData) => ({
        ...prevData,
        tags: prevData.tags.filter((_, index) => index !== indexToRemove),
      }));
    }
  };

  const handleEditFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // console.log(editFormData, "marketing**************");

    if (validateFormData(editFormData, applicationMarketingFields)) {
      try {
        const response = await fetchPutApi(
          `/api/applications/marketing/${editFormData.application_id}`,
          editFormData,
          "application/json",
          access_user,
          navigate,
          location
        );
        // console.log(response, "wewewewew");
        if (response.status === 200) {
          toast.success("Product marketing information pdated successfully!");
        }
      } catch (error) {
        console.log("Update product marketing Error:", error);
        toast.error(error.response.data.error || error.response.data);
        setEditFormData(initialFormData);
        setShowAppID("");
      }
    }
  };

  const handleCancelEditFormData = () => {
    setEditFormData(initialFormData);
    setShowAppID("");
  };

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
        isActive="applicationMarketing"
      />
      <div className="flex justify-center" data-testid="sidebar-toggle">
        <div className="w-full max-w-[80%] h-auto mb-20">
          <div className="flex lg:flex-row flex-col sm:p-4 p-[14px] pb-0 mt-[60px] mb-5 gap-[70px]">
            <div className=" border-[#e6e6e6] rounded-md border-[1px] p-[16px] w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] h-fit">
              <h1 className="md:text-[40px] sm:text-[30px] text-[26px] roboto font-bold">
                Add/Update Marketing Information
              </h1>

              <div className="flex">
                <button
                  onClick={() => setIsSelected(true)}
                  className={`${isSelected
                    ? "bg-[#000000] text-white"
                    : "bg-[#ffff] text-black"
                    } border-[#000] border-[1px] rounded-l-lg h-[48px] max-w-[240px] w-full roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg hover:z-10 transition-all duration-300`}
                >
                  Add Information
                </button>

                <button
                  onClick={() => setIsSelected(false)}
                  className={`${!isSelected
                    ? "bg-[#000000] text-white"
                    : "bg-[#ffff] text-black"
                    } border-[#000] border-[1px] rounded-r-lg h-[48px] max-w-[240px] w-full roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg hover:z-10 transition-all duration-300`}
                >
                  View/Update Information
                </button>
              </div>

              {/* Add Applications */}
              {isSelected && (
                <div className="border-[#e6e6e6]  border-[1px] p-[16px]  w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <div>
                    <label className="text-black text-[14px] roboto block font-medium mb-1">
                      Product Name
                    </label>
                    <select
                      name="application_id"
                      onChange={handleInputChange}
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                    >
                      <option
                        selected={formData.application_id === ""}
                        value=""
                      >
                        Select Your Product
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
                      Industry
                    </label>
                    <input
                      data-testid="industry"
                      id="industry"
                      name="industry"
                      type="text"
                      value={industryData}
                      onChange={(e) => setIndustryData(e.target.value)}
                      placeholder="Industry that this product falls under e.g. Media, Entertainment, Publishing, Technology"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                    {industryData && (
                      <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                        {industryData}
                        <button
                          onClick={() => addCategoryData("industry")}
                          className="cursor-pointer"
                        >
                          <FaCirclePlus size={20} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {formData.industry.map((data, index) => (
                        <div
                          key={index}
                          className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                        >
                          {data}
                          <button
                            onClick={() =>
                              removeCategoryData("industry", index)
                            }
                            className="cursor-pointer"
                          >
                            <IoCloseCircle size={25} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Brochure
                    </label>
                    <input
                      data-testid="brochure"
                      id="brochure"
                      name="brochure"
                      type="text"
                      value={formData.brochure}
                      onChange={handleInputChange}
                      placeholder="URL of the product brochure or a list of features / Free form"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>

                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Demo Urls
                    </label>
                    <input
                      data-testid="dependencies"
                      id="dependencies"
                      name="dependencies"
                      type="text"
                      value={demoData}
                      onChange={(e) => setDemoData(e.target.value)}
                      placeholder="URL(s) of demo video clip(s)"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                    {demoData && (
                      <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                        {demoData}
                        <button
                          onClick={() => addCategoryData("demo")}
                          className="cursor-pointer"
                        >
                          <FaCirclePlus size={20} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {formData.demo.map((data, index) => (
                        <div
                          key={index}
                          className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                        >
                          {data}
                          <button
                            onClick={() => removeCategoryData("demo", index)}
                            className="cursor-pointer"
                          >
                            <IoCloseCircle size={25} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex gap-2">
                      <div className="w-full">
                        <label className="text-black text-[14px] roboto block font-medium">
                          Tutorials Primer
                        </label>
                        <input
                          data-testid="primer"
                          id="primer"
                          name="primer"
                          type="text"
                          value={formData.tutorials.primer}
                          onChange={(e) =>
                            handleNestedInputChange(e, "tutorials", "primer")
                          }
                          placeholder="Introduction, Primer, Advanced capabilities etc"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                      <div className="w-full">
                        <label className="text-black text-[14px] roboto block font-medium">
                          Tutorials Introduction
                        </label>
                        <input
                          data-testid="introduction"
                          id="introduction"
                          name="introduction"
                          type="text"
                          value={formData.tutorials.introduction}
                          onChange={(e) =>
                            handleNestedInputChange(
                              e,
                              "tutorials",
                              "introduction"
                            )
                          }
                          placeholder="Introduction, Primer, Advanced capabilities etc "
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Featured Page
                    </label>
                    <input
                      data-testid="featured_page"
                      id="featured_page"
                      name="featured_page"
                      type="text"
                      value={formData.featured_page}
                      onChange={handleInputChange}
                      placeholder="List of featured pages (URLs and/or text)"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>

                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Pricing Type
                    </label>
                    <input
                      data-testid="pricing_type"
                      id="pricing_type"
                      name="pricing_type"
                      type="text"
                      value={formData.pricing_type}
                      onChange={handleInputChange}
                      placeholder="Free, Freemium, or Paid"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>

                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Pricing
                    </label>
                    <input
                      data-testid="pricing"
                      id="pricing"
                      name="pricing"
                      type="text"
                      value={formData.pricing}
                      onChange={handleInputChange}
                      placeholder="Location of pricing information"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>

                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Tags
                    </label>
                    <input
                      data-testid="tags"
                      id="tags"
                      name="tags"
                      type="text"
                      value={tagsData}
                      onChange={(e) => setTagsData(e.target.value)}
                      placeholder="Multiple values on marketing attributes e.g. user friendly, cheap, quality "
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                    {tagsData && (
                      <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                        {tagsData}
                        <button
                          onClick={() => addCategoryData("tags")}
                          className="cursor-pointer"
                        >
                          <FaCirclePlus size={20} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {formData.tags.map((data, index) => (
                        <div
                          key={index}
                          className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                        >
                          {data}
                          <button
                            onClick={() => removeCategoryData("tags", index)}
                            className="cursor-pointer"
                          >
                            <IoCloseCircle size={25} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-full">
                        <label className="text-black text-[14px] roboto block font-medium">
                          Communities Twitter_X
                        </label>
                        <input
                          data-testid="twitter_x"
                          id="twitter_x"
                          name="twitter_x"
                          type="text"
                          value={formData.communities.twitter_x}
                          onChange={(e) =>
                            handleNestedInputChange(
                              e,
                              "communities",
                              "twitter_x"
                            )
                          }
                          placeholder="Community engagement platforms where you interact with your community"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                      <div className="w-full">
                        <label className="text-black text-[14px] roboto block font-medium">
                          Communities Discord
                        </label>
                        <input
                          data-testid="discord"
                          id="discord"
                          name="discord"
                          type="text"
                          value={formData.communities.discord}
                          onChange={(e) =>
                            handleNestedInputChange(e, "communities", "discord")
                          }
                          placeholder="Community engagement platforms where you interact with your community"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                      <div className="w-full">
                        <label className="text-black text-[14px] roboto block font-medium">
                          Communities Slack
                        </label>
                        <input
                          data-testid="slack"
                          id="slack"
                          name="slack"
                          type="text"
                          value={formData.communities.slack}
                          onChange={(e) =>
                            handleNestedInputChange(e, "communities", "slack")
                          }
                          placeholder="Community engagement platforms where you interact with your community"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      privacy
                    </label>
                    <input
                      data-testid="privacy"
                      id="privacy"
                      name="privacy"
                      type="text"
                      value={formData.privacy}
                      onChange={handleInputChange}
                      placeholder="Location of your privacy policy"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>
                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Ethics
                    </label>
                    <input
                      data-testid="ethics"
                      id="ethics"
                      name="ethics"
                      type="text"
                      value={formData.ethics}
                      onChange={handleInputChange}
                      placeholder="Location of ethics policy "
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>


                  <div className="flex gap-[12px]">
                    {/* <button className="border-[#000] border-[1px] rounded-lg h-[48px] max-w-[240px] w-full text-black roboto font-medium text-[16px]">
                             Save Draft
                           </button> */}

                    <button
                      onClick={handleFormSubmit}
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
                  <div className="w-full flex flex-col gap-3">
                    <div>
                      <label className="text-black text-[14px] roboto block font-medium mb-1">
                        Product Name
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
                    {showAppID !== "" && editFormData.application_id !== "" && (
                      <>
                        <div>
                          <label className="text-black text-[14px] roboto block font-medium">
                            Industry
                          </label>
                          <input
                            data-testid="industry"
                            id="industry"
                            name="industry"
                            type="text"
                            value={industryEditData}
                            onChange={(e) =>
                              setIndustryEditData(e.target.value)
                            }
                            placeholder="Industry that this product falls under e.g. Media, Entertainment, Publishing, Technology"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                          {industryEditData && (
                            <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                              {industryEditData}
                              <button
                                onClick={() => addEditCategoryData("industry")}
                                className="cursor-pointer"
                              >
                                <FaCirclePlus size={20} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                              </button>
                            </div>
                          )}
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {editFormData.industry.map((data, index) => (
                              <div
                                key={index}
                                className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                              >
                                {data}
                                <button
                                  onClick={() =>
                                    removeEditCategoryData("industry", index)
                                  }
                                  className="cursor-pointer"
                                >
                                  <IoCloseCircle size={25} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-black text-[14px] roboto block font-medium">
                            Brochure
                          </label>
                          <input
                            data-testid="brochure"
                            id="brochure"
                            name="brochure"
                            type="text"
                            value={editFormData.brochure}
                            onChange={handleEditInputChange}
                            placeholder="URL of the product brochure or a list of features"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                        </div>

                        <div>
                          <label className="text-black text-[14px] roboto block font-medium">
                            Demo Urls
                          </label>
                          <input
                            data-testid="demo"
                            id="demo"
                            name="demo"
                            type="text"
                            value={demoEditData}
                            onChange={(e) => setDemoEditData(e.target.value)}
                            placeholder="URL(s) of demo video clip(s)"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                          {demoEditData && (
                            <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                              {demoEditData}
                              <button
                                onClick={() => addEditCategoryData("demo")}
                                className="cursor-pointer"
                              >
                                <FaCirclePlus size={20} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                              </button>
                            </div>
                          )}
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {editFormData.demo.map((data, index) => (
                              <div
                                key={index}
                                className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                              >
                                {data}
                                <button
                                  onClick={() =>
                                    removeEditCategoryData("demo", index)
                                  }
                                  className="cursor-pointer"
                                >
                                  <IoCloseCircle size={25} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex gap-2">
                            <div className="w-full">
                              <label className="text-black text-[14px] roboto block font-medium">
                                Tutorials Primer
                              </label>
                              <input
                                data-testid="primer"
                                id="primer"
                                name="primer"
                                type="text"
                                value={editFormData.tutorials.primer}
                                onChange={(e) =>
                                  handleNestedEditInputChange(
                                    e,
                                    "tutorials",
                                    "primer"
                                  )
                                }
                                placeholder="Location of primer/tutorial(s)"
                                className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                              />
                            </div>
                            <div className="w-full">
                              <label className="text-black text-[14px] roboto block font-medium">
                                Tutorials Introduction
                              </label>
                              <input
                                data-testid="introduction"
                                id="introduction"
                                name="introduction"
                                type="text"
                                value={editFormData.tutorials.introduction}
                                onChange={(e) =>
                                  handleNestedEditInputChange(
                                    e,
                                    "tutorials",
                                    "introduction"
                                  )
                                }
                                placeholder="Location of introductory information on the product"
                                className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-black text-[14px] roboto block font-medium">
                            Featured Page
                          </label>
                          <input
                            data-testid="featured_page"
                            id="featured_page"
                            name="featured_page"
                            type="text"
                            value={editFormData.featured_page}
                            onChange={handleEditInputChange}
                            placeholder="List of key features or location of a features doc"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                        </div>

                        <div>
                          <label className="text-black text-[14px] roboto block font-medium">
                            Pricing Type
                          </label>
                          <input
                            data-testid="pricing_type"
                            id="pricing_type"
                            name="pricing_type"
                            type="text"
                            value={editFormData.pricing_type}
                            onChange={handleEditInputChange}
                            placeholder="e.g. Free, Freemium, or Paid"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                        </div>

                        <div>
                          <label className="text-black text-[14px] roboto block font-medium">
                            Pricing
                          </label>
                          <input
                            data-testid="pricing"
                            id="pricing"
                            name="pricing"
                            type="text"
                            value={editFormData.pricing}
                            onChange={handleEditInputChange}
                            placeholder="Location of pricing information"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                        </div>

                        <div>
                          <label className="text-black text-[14px] roboto block font-medium">
                            Tags
                          </label>
                          <input
                            data-testid="tags"
                            id="tags"
                            name="tags"
                            type="text"
                            value={tagsEditData}
                            onChange={(e) => setTagsEditData(e.target.value)}
                            placeholder="Marketing attributes for visibility e.g. user friendly, cheap, quality"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                          {tagsEditData && (
                            <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                              {tagsEditData}
                              <button
                                onClick={() => addEditCategoryData("tags")}
                                className="cursor-pointer"
                              >
                                <FaCirclePlus size={20} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                              </button>
                            </div>
                          )}
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {editFormData.tags.map((data, index) => (
                              <div
                                key={index}
                                className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                              >
                                {data}
                                <button
                                  onClick={() =>
                                    removeEditCategoryData("tags", index)
                                  }
                                  className="cursor-pointer"
                                >
                                  <IoCloseCircle size={25} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-full">
                            <label className="text-black text-[14px] roboto block font-medium">
                              Communities Twitter_X
                            </label>
                            <input
                              data-testid="twitter_x"
                              id="twitter_x"
                              name="twitter_x"
                              type="text"
                              value={editFormData.communities.twitter_x}
                              onChange={(e) =>
                                handleNestedEditInputChange(
                                  e,
                                  "communities",
                                  "twitter_x"
                                )
                              }
                              placeholder="Community engagement platforms"
                              className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                            />
                          </div>
                          <div className="w-full">
                            <label className="text-black text-[14px] roboto block font-medium">
                              Communities Discord
                            </label>
                            <input
                              data-testid="discord"
                              id="discord"
                              name="discord"
                              type="text"
                              value={editFormData.communities.discord}
                              onChange={(e) =>
                                handleNestedEditInputChange(
                                  e,
                                  "communities",
                                  "discord"
                                )
                              }
                              placeholder="Community engagement platforms"
                              className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                            />
                          </div>
                          <div className="w-full">
                            <label className="text-black text-[14px] roboto block font-medium">
                              Communities Slack
                            </label>
                            <input
                              data-testid="slack"
                              id="slack"
                              name="slack"
                              type="text"
                              value={editFormData.communities.slack}
                              onChange={(e) =>
                                handleNestedEditInputChange(
                                  e,
                                  "communities",
                                  "slack"
                                )
                              }
                              placeholder="Community engagement platforms "
                              className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-black text-[14px] roboto block font-medium">
                            privacy
                          </label>
                          <input
                            data-testid="privacy"
                            id="privacy"
                            name="privacy"
                            type="text"
                            value={editFormData.privacy}
                            onChange={handleEditInputChange}
                            placeholder="Location of their privacy policy"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                        </div>

                        <div>
                          <label className="text-black text-[14px] roboto block font-medium">
                            Ethics
                          </label>
                          <input
                            data-testid="ethics"
                            id="ethics"
                            name="ethics"
                            type="text"
                            value={editFormData.ethics}
                            onChange={handleEditInputChange}
                            placeholder="Location of ethics policy"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                        </div>

                        <div className="flex gap-[12px]">
                          <button
                            onClick={handleCancelEditFormData}
                            className="border-gray-500 border-[1px] bg-gray-500 rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
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

                        <MediaAssetsSection
                          application_id={editFormData.application_id}
                          marketing_id={editFormData.marketing_id}
                          editFormData={editFormData}
                          getMarketingData={getMarketingData}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>

  );
};

export default ApplicationMarketingPage;
