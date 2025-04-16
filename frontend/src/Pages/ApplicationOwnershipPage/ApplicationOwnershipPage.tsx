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

import Sidebar from "../../components/Sidebar/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";

const ApplicationOwnershipPage = () => {
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
        console.log("filterData Error:", error);
      }
    };
    filterAppDataByLoginUser();
  }, []);

  const initialFormData = {
    application_id: "",
    owner_company: "",
    company_url: "",
    product_url: "",
    owner_name: "",
    owner_id: "",
    owner_email: "",
    owner_phone: "",
    secondary_owner_name: "",
    secondary_owner_id: "",
    secondary_owner_email: "",
    secondary_owner_phone: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const [showAppID, setShowAppID] = useState("");
  const [editFormData, setEditFormData] = useState(initialFormData);
  const ownershipRequiredFields = [
    "owner_company",
    "company_url",
    "product_url",
    "owner_name",
    "owner_email",
  ];
  const handleOwnerShipChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "application_id") {
      const selectedValue = JSON.parse(value);
      setFormData({
        ...formData,
        application_id: selectedValue._id,
        owner_id: selectedValue.created_by,
        secondary_owner_id: selectedValue.created_by,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmitForOwnerShip = async (e) => {
    e.preventDefault();
    // console.log("ownerShipformData111111111", formData);
    if (validateFormData(formData, ownershipRequiredFields)) {
      try {
        const response = await fetchPostApi(
          "/api/applications/ownership",
          formData,
          "application/json",
          access_user,
          navigate,
          location
        );
        // console.log(response, "response******");
        if (response.status === 201) {
          toast.success("Ownership created successfully!");
        }
        setFormData(initialFormData);
      } catch (error) {
        console.log("Create Product Ownership Error:", error);
        toast.error(error.response.data.error || error.response.data);
        setFormData(initialFormData);
      }
    }
  };

  const handleShowButton = async () => {
    if (showAppID === "") {
      toast.error("Please select a product");
      return;
    }
    try {
      const path = `/api/applications/ownership/${showAppID}`;
      const response = await fetchGetApi(path, undefined, navigate, location);
      if (response.status === 200) {
        setEditFormData(response?.data);
      }
      // console.log("res*****", response);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      setShowAppID("");
      setEditFormData(initialFormData);
    }
  };

  const handleEditInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "application_id") {
      const selectedValue = JSON.parse(value);
      setEditFormData({
        ...editFormData,
        application_id: selectedValue._id,
        owner_id: selectedValue.created_by,
        secondary_owner_id: selectedValue.created_by,
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  const handleEditFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // console.log(editFormData, "090990909");

    if (validateFormData(editFormData, ownershipRequiredFields)) {
      try {
        const response = await fetchPutApi(
          `/api/applications/ownership/${editFormData.application_id}`,
          editFormData,
          "application/json",
          access_user,
          navigate,
          location
        );
        // console.log(response, "response******");
        if (response.status === 200) {
          toast.success("Ownership Updated successfully!");
        }
      } catch (error) {
        console.log("Update Application Ownership Error:", error);
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

  // console.log("********-*-*-***************************", filterAppData);

  return (
    <>
      <Header path="appinfo" toggleSidebar={toggleSidebar} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        isActive="applicationOwnership"
      />

      <div className="flex justify-center" data-testid="sidebar-toggle">
        <div className="w-full max-w-[80%] h-auto mb-20">
          <div className="flex lg:flex-row flex-col sm:p-4 p-[14px] pb-0 mt-[60px] mb-5 gap-[70px]">
            <div className=" border-[#e6e6e6] rounded-md border-[1px] p-[16px] w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] h-fit">
              <h1 className="md:text-[40px] sm:text-[30px] text-[26px] roboto font-bold">
                Add/Update Product Ownership
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

                    <label className="text-black text-[14px] roboto block font-medium">
                      Product
                    </label>
                    <select
                      name="application_id"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-3 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                      onChange={handleOwnerShipChange}
                    >
                      <option selected={formData.application_id === ""} value="">
                        Select Your Product
                      </option>
                      {filterAppData.map((data: any, index) => (
                        <option key={index} value={JSON.stringify(data)}>
                          {data.application}
                        </option>
                      ))}
                    </select>
                    {/* <p className="text-[#00000080] text-[12px] roboto mb-0">
                  Check the available methods or add new methods
                </p>
                <p className="roboto text-[16px] font-normal mb-3">
                  Include criteria like Usability, Innovation, and Performance
                </p> */}
                    <div>
                      <label className="text-black text-[14px] roboto block font-medium">
                        Owner Company
                      </label>
                      <input
                        type="text"
                        name="owner_company"
                        value={formData.owner_company}
                        onChange={handleOwnerShipChange}
                        className={
                          "border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-3 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                        }
                      />
                      <label className="text-black text-[14px] roboto block font-medium">
                        Company URL
                      </label>
                      <input
                        type="email"
                        name="company_url"
                        value={formData.company_url}
                        onChange={handleOwnerShipChange}
                        className={
                          "border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-3 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                        }
                      />
                      <label className="text-black text-[14px] roboto block font-medium">
                        Product URL
                      </label>
                      <input
                        type="text"
                        name="product_url"
                        value={formData.product_url}
                        onChange={handleOwnerShipChange}
                        className={
                          "border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-3 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                        }
                      />
                      <label className="text-black text-[14px] roboto block font-medium">
                        Owner Name
                      </label>
                      <input
                        type="text"
                        name="owner_name"
                        value={formData.owner_name}
                        onChange={handleOwnerShipChange}
                        className={
                          "border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-3 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                        }
                      />
                      <label className="text-black text-[14px] roboto block font-medium">
                        Owner Email
                      </label>
                      <input
                        type="text"
                        name="owner_email"
                        value={formData.owner_email}
                        onChange={handleOwnerShipChange}
                        className={
                          "border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-3 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                        }
                      />
                      <label className="text-black text-[14px] roboto block font-medium">
                        Owner Phone
                      </label>
                      <input
                        type="text"
                        name="owner_phone"
                        value={formData.owner_phone}
                        onChange={handleOwnerShipChange}
                        className={
                          "border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-3 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                        }
                      />
                      <label className="text-black text-[14px] roboto block font-medium">
                        Secondary Owner Name
                      </label>
                      <input
                        type="text"
                        name="secondary_owner_name"
                        value={formData.secondary_owner_name}
                        onChange={handleOwnerShipChange}
                        className={
                          "border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-3 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                        }
                      />
                      <label className="text-black text-[14px] roboto block font-medium">
                        Secondary Owner Email
                      </label>
                      <input
                        type="text"
                        name="secondary_owner_email"
                        value={formData.secondary_owner_email}
                        onChange={handleOwnerShipChange}
                        className={
                          "border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-3 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                        }
                      />
                      <label className="text-black text-[14px] roboto block font-medium">
                        Secondary Owner Phone
                      </label>
                      <input
                        type="text"
                        name="secondary_owner_phone"
                        value={formData.secondary_owner_phone}
                        onChange={handleOwnerShipChange}
                        className={
                          "border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-4 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                        }
                      />

                    </div>
                  </div>

                  <div className="flex gap-[12px]">
                    {/* <button className="border-[#000] border-[1px] rounded-lg h-[48px] max-w-[240px] w-full text-black roboto font-medium text-[16px]">
                      Save Draft
                    </button> */}

                    <button
                      onClick={handleSubmitForOwnerShip}
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
                          Owner company
                        </label>
                        <input
                          data-testid="owner_company"
                          id="owner_company"
                          name="owner_company"
                          type="text"
                          value={editFormData.owner_company}
                          onChange={handleEditInputChange}
                          placeholder="Provide a detailed description of your app"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Company URL
                        </label>
                        <input
                          data-testid="company_url"
                          id="company_url"
                          name="company_url"
                          type="text"
                          value={editFormData.company_url}
                          onChange={handleEditInputChange}
                          placeholder="Provide a detailed description of your app"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Product URL
                        </label>
                        <input
                          data-testid="product_url"
                          id="product_url"
                          name="product_url"
                          type="text"
                          value={editFormData.product_url}
                          onChange={handleEditInputChange}
                          placeholder="Provide a detailed description of your app"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Owner Name
                        </label>
                        <input
                          data-testid="owner_name"
                          id="owner_name"
                          name="owner_name"
                          type="text"
                          value={editFormData.owner_name}
                          onChange={handleEditInputChange}
                          placeholder="Provide a detailed description of your app"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Owner Email
                        </label>
                        <input
                          data-testid="owner_email"
                          id="owner_email"
                          name="owner_email"
                          type="text"
                          value={editFormData.owner_email}
                          onChange={handleEditInputChange}
                          placeholder="Provide a detailed description of your app"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Owner Phone
                        </label>
                        <input
                          data-testid="owner_phone"
                          id="owner_phone"
                          name="owner_phone"
                          type="text"
                          value={editFormData.owner_phone}
                          onChange={handleEditInputChange}
                          placeholder="Provide a detailed description of your app"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Secondary Owner Name
                        </label>
                        <input
                          data-testid="secondary_owner_name"
                          id="secondary_owner_name"
                          name="secondary_owner_name"
                          type="text"
                          value={editFormData.secondary_owner_name}
                          onChange={handleEditInputChange}
                          placeholder="Provide a detailed description of your app"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Secondary Owner Email
                        </label>
                        <input
                          data-testid="secondary_owner_email"
                          id="secondary_owner_email"
                          name="secondary_owner_email"
                          type="text"
                          value={editFormData.secondary_owner_email}
                          onChange={handleEditInputChange}
                          placeholder="Provide a detailed description of your app"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>
                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Secondary Owner Phone
                        </label>
                        <input
                          data-testid="secondary_owner_phone"
                          id="secondary_owner_phone"
                          name="secondary_owner_phone"
                          type="text"
                          value={editFormData.secondary_owner_phone}
                          onChange={handleEditInputChange}
                          placeholder="Provide a detailed description of your app"
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
                          Save Ownership
                        </button>
                      </div>
                    </>
                  )}
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

export default ApplicationOwnershipPage;
