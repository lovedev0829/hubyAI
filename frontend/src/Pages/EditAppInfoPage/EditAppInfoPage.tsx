import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  // createApplicationReviewRequest,
  // createOwnerID,
  // fetchPostApi,
  fetchPutApi,
  fetchGetApi,
  uploadApplicationLogoUrl,
  validateFormData,
  // getApplicationOwnerShip,
  // updateApplicationOwnerShip,
} from "../../functions/apiFunctions";
import { toast } from "react-toastify";
import { IoCloseCircle } from "react-icons/io5";
import { FaCirclePlus } from "react-icons/fa6";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";

interface AppInfo {
  application: string;
  description: string;
  features: string;
  integrations: string;
  type: string;
  version: string;
  access_type: string;
  access_means: string;
  output_type: string;
  interface_languages: string;
  category: string[];
  // keywords: string;
  // app_logo_url: string;
  // screenShorts_url: string;
  // other_media_url: string;
  // developer_name: string;
  // web_url: string;
  // email: string;
}

const editAppRequiredFields = [];
const EditAppInfoPage = () => {
  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );

  const [appId, setAppId] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("app_id");
    setAppId(id);
  }, []);
  // console.log("appid", appId);

  const [editAppInfo, setEditAppInfo] = useState<Partial<AppInfo>>({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getAppDataById = async () => {
      const response = await fetchGetApi(
        `/api/applications/${appId}`,
        undefined,
        navigate,
        location
      );
      setEditAppInfo(response.data);
    };
    getAppDataById();
  }, [appId]);

  // console.log("editAppInfo", editAppInfo);

  const initialFormData: AppInfo = {
    application: editAppInfo.application || "",
    description: editAppInfo.description || "",
    features: editAppInfo.features || "",
    integrations: editAppInfo.integrations || "",
    type: editAppInfo.type || "",
    version: editAppInfo.version || "",
    access_type: editAppInfo.access_type || "",
    access_means: editAppInfo.access_means || "",
    output_type: editAppInfo.output_type || "",
    interface_languages: editAppInfo.interface_languages || "",
    category: editAppInfo.category || [],
    // keywords: editAppInfo.keywords || "",
    // app_logo_url: editAppInfo.app_logo_url || "",
    // screenShorts_url: editAppInfo.screenShorts_url || "",
    // other_media_url: editAppInfo.other_media_url || "",
    // developer_name: editAppInfo.developer_name || "",
    // web_url: editAppInfo.web_url || "",
    // email: editAppInfo.email || "",
  };

  useEffect(() => {
    if (editAppInfo && Object.keys(editAppInfo).length > 0) {
      setEditFormData(initialFormData);
    }
  }, [editAppInfo]);

  const [filterAppData, setFilterAppData] = useState([]);

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

  console.log("filterAppData", filterAppData);

  const [editFormData, setEditFormData] = useState(initialFormData);
  const [categoryData, setCategoryData] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  // const [imageData, setImageData] = useState<string>("");

  // const convertBase64ToBlob = (base64Data: string): Blob => {
  //   const byteString = atob(base64Data.split(",")[1]);
  //   const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
  //   const ab = new ArrayBuffer(byteString.length);
  //   const ia = new Uint8Array(ab);

  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }

  //   return new Blob([ab], { type: mimeString });
  // };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     const details = reader.result as string;
    //     setImageData(details);
    //     const blob = convertBase64ToBlob(details);
    //     const blobUrl = URL.createObjectURL(blob);
    //     setImageData(blobUrl);
    //     localStorage.setItem("AppLogo", blobUrl);
    //   };
    //   reader.readAsDataURL(file);
    // }
  };

  // const [ownerShipformData, setOwnerShipFormData] = useState({
  //   application_id: "",
  //   owner_company: "",
  //   company_url: "",
  //   product_url: "",
  //   owner_name: "",
  //   owner_id: "",
  //   owner_email: "",
  //   owner_phone: "",
  // });
  // const [reviewFormData, setReviewFormData] = useState({
  //   application_id: "",
  //   review_topics: "",
  //   reviewer_emails: "",
  //   request_note: "",
  // });

  // const [category, setCategory] = useState("");
  // const appLogoRef = useRef<HTMLInputElement>(null);
  // const screenShortsRef = useRef<HTMLInputElement>(null);
  // const otherMediaRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files && event.target.files[0];
  //   if (file) {
  //     const updatedField: any = { [event.target.name]: file.name };
  //     setEditFormData((prevData) => ({
  //       ...prevData,
  //       ...updatedField,
  //     }));
  //   }
  // };

  // const handleClickCategory = (option: string) => {
  //   setCategory(option);
  //   setEditFormData((prevData) => ({ ...prevData, category: option }));
  // };

  const handleChangeCategoryData = (e) => {
    setCategoryData(e.target.value);
  };
  const addCategoryData = () => {
    if (categoryData.trim()) {
      setEditFormData((prevData) => ({
        ...prevData,
        category: [...prevData.category, categoryData],
      }));
      setCategoryData("");
    }
  };
  const removeCategoryData = (indexToRemove) => {
    setEditFormData((prevData) => ({
      ...prevData,
      category: prevData.category.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // console.log(editFormData);

    if (!imageFile) toast.error("Please select App Logo");
    if (validateFormData(editFormData, editAppRequiredFields) && imageFile) {
      try {
        const response = await fetchPutApi(
          `/api/applications/${appId}`,
          editFormData,
          "application/json",
          access_user,
          navigate,
          location
        );
        if (response.status === 200) {
          const formData = new FormData();
          formData.append("file", imageFile);
          await uploadApplicationLogoUrl(
            formData,
            appId,
            access_user,
            navigate,
            location
          );
          toast.success("App Updated successfully!");
        }

        // console.log(`check api log`, response);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      toast.error("Please fill form");
    }
  };

  // const handleSelectAppOwner = (e) => {
  //   setSelectedAppForOwner(e.target.value);
  // };

  // const handleOwnerShipChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "application_id") {
  //     const selectedValue = JSON.parse(value);
  //     setOwnerShipFormData({
  //       ...ownerShipformData,
  //       application_id: selectedValue._id,
  //       owner_id: selectedValue.created_by,
  //     });
  //   } else {
  //     setOwnerShipFormData({
  //       ...ownerShipformData,
  //       [name]: value,
  //     });
  //   }
  // };

  // const handleSubmitForOwnerShip = async (e) => {
  //   e.preventDefault();
  //   console.log("ownerShipformData111111111", ownerShipformData);
  //   try {
  //     const data = {
  //       ...ownerShipformData,
  //       secondary_owner_name: ownerShipformData.owner_name,
  //       secondary_owner_id: ownerShipformData.owner_id,
  //       secondary_owner_email: ownerShipformData.owner_email,
  //       secondary_owner_phone: ownerShipformData.owner_phone,
  //     };
  //     console.log("ownerShipformData2222", data);
  //     const createOwnerIdData = await createOwnerID(data, access_user);
  //     console.log("createOwnerIdData33333", createOwnerIdData);
  //     const getApplicationOwnerShipData = await getApplicationOwnerShip(
  //       `/api/applications/ownership/${ownerShipformData.application_id}`,
  //       access_user
  //     );
  //     console.log(
  //       "getApplicationOwnerShipData4444444",
  //       getApplicationOwnerShipData
  //     );
  //     const response = await updateApplicationOwnerShip(
  //       `/api/applications/ownership/${ownerShipformData.application_id}`,
  //       getApplicationOwnerShipData,
  //       access_user
  //     );
  //     console.log("updateApplicationOwnerShip5555555", response);
  //     if (response.status === 200) {
  //       toast.success("OwnerShip Updated Successfully");
  //     }
  //     setOwnerShipFormData({
  //       application_id: "",
  //       owner_company: "",
  //       company_url: "",
  //       product_url: "",
  //       owner_name: "",
  //       owner_id: "",
  //       owner_email: "",
  //       owner_phone: "",
  //     });
  //   } catch (error) {
  //     console.error("handleSubmitForOwnerShip Error:", error.message);
  //   }
  // };

  // const handleReviewChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "application_id") {
  //     const selectedValue = JSON.parse(value);
  //     setReviewFormData({
  //       ...reviewFormData,
  //       application_id: selectedValue._id,
  //     });
  //   } else {
  //     setReviewFormData({
  //       ...reviewFormData,
  //       [name]: value,
  //     });
  //   }
  // };

  // const handleSubmitForReview = async (e) => {
  //   e.preventDefault();
  //   // console.log("reviewFormData", reviewFormData);
  //   try {
  //     const reviewResponse = await createApplicationReviewRequest(
  //       reviewFormData,
  //       access_user
  //     );
  //     // console.log("reviewResponse", reviewResponse);
  //     setReviewFormData({
  //       application_id: "",
  //       review_topics: "",
  //       reviewer_emails: "",
  //       request_note: "",
  //     });
  //     if (reviewResponse.reveiew_request_id) {
  //       toast.success("Review Request Created Successfully");
  //     }
  //   } catch (error) {
  //     console.error("handleSubmitForOwnerShip Error:", error.message);
  //   }
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
    <div>
      <Header path="appinfo" toggleSidebar={toggleSidebar} />
      <div className="flex" data-testid="sidebar-toggle">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          isActive="applicationSource"
        />

        <div className="w-full max-w-[80%] min-h-[84vh]">
          <div className="mx-auto container flex lg:flex-row flex-col sm:p-4 p-[14px] pb-0 mt-[60px] mb-[100px]">
            <div className="lg:w-[50%] w-full">
              <h1 className="md:text-[40px] sm:text-[30px] text-[26px] roboto font-bold mb-4">
                Edit Your AI Application
              </h1>
              <p className="mt-[24px] text-[16px] roboto mb-0 text-black">
                Upload and register your AI application on Huby
              </p>
            </div>
            <div className="lg:w-[50%] w-full flex sm:gap-[40px] gap-[24px] flex-col lg:mt-0 mt-[30px] mb-[30px]">
              <div>
                <label className="text-black text-[14px] roboto block font-medium">
                  App Name
                </label>
                <input
                  id="appName"
                  data-testid="appName"
                  required
                  type="text"
                  name="application"
                  value={editFormData.application}
                  onChange={handleInputChange}
                  placeholder="Enter your app name"
                  className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                />
              </div>

              <div>
                <label className="text-black text-[14px] roboto block font-medium">
                  Description
                </label>
                <input
                  data-testid="description"
                  id="description"
                  required
                  name="description"
                  type="text"
                  value={editFormData?.description}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of your app"
                  className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                />
              </div>

              <div>
                <label className="text-black text-[14px] roboto block font-medium">
                  Features
                </label>
                <input
                  data-testid="features"
                  id="features"
                  required
                  name="features"
                  type="text"
                  value={editFormData?.features}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of your app"
                  className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                />
              </div>

              <div>
                <label className="text-black text-[14px] roboto block font-medium">
                  Integrations
                </label>
                <input
                  data-testid="integrations"
                  id="integrations"
                  required
                  name="integrations"
                  type="text"
                  value={editFormData?.integrations}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of your app"
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
                  required
                  name="type"
                  type="text"
                  value={editFormData?.type}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of your app"
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
                  required
                  name="version"
                  type="text"
                  value={editFormData?.version}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of your app"
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
                  required
                  name="access_type"
                  type="text"
                  value={editFormData?.access_type}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of your app"
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
                  required
                  name="access_means"
                  type="text"
                  value={editFormData?.access_means}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of your app"
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
                  required
                  name="output_type"
                  type="text"
                  value={editFormData?.output_type}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of your app"
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
                  required
                  name="interface_languages"
                  type="text"
                  value={editFormData?.interface_languages}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of your app"
                  className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                />
              </div>

              <div>
                <label className="text-black text-[14px] roboto block font-medium">
                  Category
                </label>
                <input
                  data-testid="interface_languages"
                  id="categoryData"
                  required
                  name="categoryData"
                  type="text"
                  value={categoryData}
                  onChange={handleChangeCategoryData}
                  placeholder="Provide a detailed description of your app"
                  className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                />
                {categoryData && (
                  <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                    {categoryData}
                    <button
                      onClick={addCategoryData}
                      className="cursor-pointer"
                    >
                      <FaCirclePlus size={20} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
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
                          onClick={() => removeCategoryData(index)}
                          className="cursor-pointer"
                        >
                          <IoCloseCircle size={25} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="appLogo"
                  className="text-black text-[14px] roboto block font-medium"
                >
                  App Logo
                </label>
                <div className="border-[#e6e6e6] border-[1px] rounded-[6px] h-[36px] px-2">
                  <input
                    required
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditAppInfoPage;
