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
import { useLocation, useNavigate } from "react-router-dom";

const ApplicationRunTimePage = () => {
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
    hardware: [],
    operating_system: [],
    gpu: [],
    cpu: [],
    memory: "",
    disk: "",
  };
  const [isSelected, setIsSelected] = useState(true);
  const [formData, setFormData] = useState(initialFormData);
  const [hardwaresData, setHardwareData] = useState("");
  const [operatingSystemData, setOperatingSystemData] = useState("");
  const [gpuData, setGpuData] = useState("");
  const [cpuData, setCpuData] = useState("");

  const [showAppID, setShowAppID] = useState("");
  const [editFormData, setEditFormData] = useState(initialFormData);
  const [hardwaresEditData, setHardwareEditData] = useState("");
  const [operatingSystemEditData, setOperatingSystemEditData] = useState("");
  const [gpuEditData, setGpuEditData] = useState("");
  const [cpuEditData, setCpuEditData] = useState("");

  const runtimeRequiredFields = ["hardware", "operating_system"];

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

  const addCategoryData = (value: any) => {
    // console.log("++++++++++", value);
    if (value === "hardware") {
      if (hardwaresData.trim()) {
        setFormData((prevData) => ({
          ...prevData,
          hardware: [...prevData.hardware, hardwaresData],
        }));
        setHardwareData("");
      }
    }
    if (value === "operating_system") {
      if (operatingSystemData.trim()) {
        setFormData((prevData) => ({
          ...prevData,
          operating_system: [...prevData.operating_system, operatingSystemData],
        }));
        setOperatingSystemData("");
      }
    }
    if (value === "gpu") {
      if (gpuData.trim()) {
        setFormData((prevData) => ({
          ...prevData,
          gpu: [...prevData.gpu, gpuData],
        }));
        setGpuData("");
      }
    }
    if (value === "cpu") {
      if (cpuData.trim()) {
        setFormData((prevData) => ({
          ...prevData,
          cpu: [...prevData.cpu, cpuData],
        }));
        setCpuData("");
      }
    }
  };
  const removeCategoryData = (value: any, indexToRemove: any) => {
    if (value === "hardware") {
      setFormData((prevData) => ({
        ...prevData,
        hardware: prevData.hardware.filter(
          (_, index) => index !== indexToRemove
        ),
      }));
    }

    if (value === "operating_system") {
      setFormData((prevData) => ({
        ...prevData,
        operating_system: prevData.operating_system.filter(
          (_, index) => index !== indexToRemove
        ),
      }));
    }
    if (value === "gpu") {
      setFormData((prevData) => ({
        ...prevData,
        gpu: prevData.gpu.filter((_, index) => index !== indexToRemove),
      }));
    }
    if (value === "cpu") {
      setFormData((prevData) => ({
        ...prevData,
        cpu: prevData.cpu.filter((_, index) => index !== indexToRemove),
      }));
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // console.log(formData, "090990909");

    if (validateFormData(formData, runtimeRequiredFields)) {
      try {
        const response = await fetchPostApi(
          "/api/applications/runtime",
          formData,
          "application/json",
          access_user,
          navigate,
          location
        );
        // console.log(response, "response******");
        if (response.status === 201) {
          toast.success("Product runtime information created successfully!");
        }
        setFormData(initialFormData);
      } catch (error) {
        console.log("Product runtime information creation Error:", error);
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
      const path = `/api/applications/${showAppID}/runtime`;
      const response = await fetchGetApi(path, undefined, navigate, location);
      if (response.status === 200) {
        setEditFormData(response?.data);
      }
      // console.log("res*****", response);
    } catch (error) {
      toast.error(error.response.data.error || error.response.data);
      setShowAppID("");
      //    setShowModalAppData([]);
    }
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

  const addEditCategoryData = (value: any) => {
    // console.log("++++++++++", value);
    if (value === "hardware") {
      if (hardwaresEditData.trim()) {
        setEditFormData((prevData) => ({
          ...prevData,
          hardware: [...prevData.hardware, hardwaresEditData],
        }));
        setHardwareEditData("");
      }
    }
    if (value === "operating_system") {
      if (operatingSystemEditData.trim()) {
        setEditFormData((prevData) => ({
          ...prevData,
          operating_system: [
            ...prevData.operating_system,
            operatingSystemEditData,
          ],
        }));
        setOperatingSystemEditData("");
      }
    }
    if (value === "gpu") {
      if (gpuEditData.trim()) {
        setEditFormData((prevData) => ({
          ...prevData,
          gpu: [...prevData.gpu, gpuEditData],
        }));
        setGpuEditData("");
      }
    }
    if (value === "cpu") {
      if (cpuEditData.trim()) {
        setEditFormData((prevData) => ({
          ...prevData,
          cpu: [...prevData.cpu, cpuEditData],
        }));
        setCpuEditData("");
      }
    }
  };
  const removeEditCategoryData = (value: any, indexToRemove: any) => {
    if (value === "hardware") {
      setEditFormData((prevData) => ({
        ...prevData,
        hardware: prevData.hardware.filter(
          (_, index) => index !== indexToRemove
        ),
      }));
    }

    if (value === "operating_system") {
      setEditFormData((prevData) => ({
        ...prevData,
        operating_system: prevData.operating_system.filter(
          (_, index) => index !== indexToRemove
        ),
      }));
    }
    if (value === "gpu") {
      setEditFormData((prevData) => ({
        ...prevData,
        gpu: prevData.gpu.filter((_, index) => index !== indexToRemove),
      }));
    }
    if (value === "cpu") {
      setEditFormData((prevData) => ({
        ...prevData,
        cpu: prevData.cpu.filter((_, index) => index !== indexToRemove),
      }));
    }
  };

  const handleEditFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // console.log(formData, "090990909");

    if (validateFormData(editFormData, runtimeRequiredFields)) {
      try {
        const response = await fetchPutApi(
          `/api/applications/${editFormData.application_id}/runtime`,
          editFormData,
          "application/json",
          access_user,
          navigate,
          location
        );
        // console.log(response, "response******");
        if (response.status === 200) {
          toast.success("Product runtime information updated successfully!");
        }
      } catch (error) {
        console.log("Product runtime information update Error:", error);
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
        isActive="applicationRunTime"
      />

      <div className="flex justify-center" data-testid="sidebar-toggle">
        <div className="w-full max-w-[80%] h-auto mb-20">
          <div className="flex lg:flex-row flex-col sm:p-4 p-[14px] pb-0 mt-[60px] mb-5 gap-[70px]">
            <div className=" border-[#e6e6e6] rounded-md border-[1px] p-[16px] w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] h-fit">
              <h1 className="md:text-[40px] sm:text-[30px] text-[26px] roboto font-bold">
                Add/Update Product Runtime Information
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
                      Product
                    </label>
                    <select
                      name="application_id"
                      onChange={handleInputChange}
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
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
                  </div>

                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Hardware
                    </label>
                    <input
                      data-testid="hardware"
                      id="hardware"
                      name="hardware"
                      type="text"
                      value={hardwaresData}
                      onChange={(e) => setHardwareData(e.target.value)}
                      placeholder="Supported hardware (it runs on)"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                    {hardwaresData && (
                      <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                        {hardwaresData}
                        <button
                          onClick={() => addCategoryData("hardware")}
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
                      {formData.hardware.map((data, index) => (
                        <div
                          key={index}
                          className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                        >
                          {data}
                          <button
                            onClick={() => removeCategoryData("hardware", index)}
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
                      Operating System
                    </label>
                    <input
                      data-testid="operating_system"
                      id="operating_system"
                      name="operating_system"
                      type="text"
                      value={operatingSystemData}
                      onChange={(e) => setOperatingSystemData(e.target.value)}
                      placeholder="Operating System(s) it runs on"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                    {operatingSystemData && (
                      <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                        {operatingSystemData}
                        <button
                          onClick={() => addCategoryData("operating_system")}
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
                      {formData.operating_system.map((data, index) => (
                        <div
                          key={index}
                          className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                        >
                          {data}
                          <button
                            onClick={() => removeCategoryData("operating_system", index)}
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
                      GPU
                    </label>
                    <input
                      data-testid="gpu"
                      id="gpu"
                      name="gpu"
                      type="text"
                      value={gpuData}
                      onChange={(e) => setGpuData(e.target.value)}
                      placeholder="GPU requirements (if any)"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                    {gpuData && (
                      <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                        {gpuData}
                        <button
                          onClick={() => addCategoryData("gpu")}
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
                      {formData.gpu.map((data, index) => (
                        <div
                          key={index}
                          className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                        >
                          {data}
                          <button
                            onClick={() => removeCategoryData("gpu", index)}
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
                      CPU
                    </label>
                    <input
                      data-testid="cpu"
                      id="cpu"
                      name="cpu"
                      type="text"
                      value={cpuData}
                      onChange={(e) => setCpuData(e.target.value)}
                      placeholder="CPU requirements (if any)"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                    {cpuData && (
                      <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                        {cpuData}
                        <button
                          onClick={() => addCategoryData("cpu")}
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
                      {formData.cpu.map((data, index) => (
                        <div
                          key={index}
                          className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                        >
                          {data}
                          <button
                            onClick={() => removeCategoryData("cpu", index)}
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
                      Memory
                    </label>
                    <input
                      data-testid="memory"
                      id="memory"
                      name="memory"
                      type="text"
                      value={formData.memory}
                      onChange={handleInputChange}
                      placeholder="Memory (RAM) required"
                      className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                    />
                  </div>

                  <div>
                    <label className="text-black text-[14px] roboto block font-medium">
                      Disk
                    </label>
                    <input
                      data-testid="disk"
                      id="disk"
                      name="disk"
                      type="text"
                      value={formData.disk}
                      onChange={handleInputChange}
                      placeholder="Disk space required"
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
                          Hardware
                        </label>
                        <input
                          data-testid="hardware"
                          id="hardware"
                          name="hardware"
                          type="text"
                          value={hardwaresEditData}
                          onChange={(e) => setHardwareEditData(e.target.value)}
                          placeholder="Supported hardware (it runs on)"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                        {hardwaresEditData && (
                          <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                            {hardwaresEditData}
                            <button
                              onClick={() => addEditCategoryData("hardware")}
                              className="cursor-pointer"
                            >
                              <FaCirclePlus size={20} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                            </button>
                          </div>
                        )}
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {editFormData.hardware.map((data, index) => (
                            <div
                              key={index}
                              className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                            >
                              {data}
                              <button
                                onClick={() =>
                                  removeEditCategoryData("hardware", index)
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
                          Operating System
                        </label>
                        <input
                          data-testid="operating_system"
                          id="operating_system"
                          name="operating_system"
                          type="text"
                          value={operatingSystemEditData}
                          onChange={(e) =>
                            setOperatingSystemEditData(e.target.value)
                          }
                          placeholder="Operating System(s) it runs on"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                        {operatingSystemEditData && (
                          <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                            {operatingSystemEditData}
                            <button
                              onClick={() =>
                                addEditCategoryData("operating_system")
                              }
                              className="cursor-pointer"
                            >
                              <FaCirclePlus size={20} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                            </button>
                          </div>
                        )}
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {editFormData.operating_system.map((data, index) => (
                            <div
                              key={index}
                              className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                            >
                              {data}
                              <button
                                onClick={() =>
                                  removeEditCategoryData(
                                    "operating_system",
                                    index
                                  )
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
                          GPU
                        </label>
                        <input
                          data-testid="gpu"
                          id="gpu"
                          name="gpu"
                          type="text"
                          value={gpuEditData}
                          onChange={(e) => setGpuEditData(e.target.value)}
                          placeholder="GPU requirements (if any)"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                        {gpuEditData && (
                          <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                            {gpuEditData}
                            <button
                              onClick={() => addEditCategoryData("gpu")}
                              className="cursor-pointer"
                            >
                              <FaCirclePlus size={20} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                            </button>
                          </div>
                        )}
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {editFormData.gpu.map((data, index) => (
                            <div
                              key={index}
                              className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                            >
                              {data}
                              <button
                                onClick={() =>
                                  removeEditCategoryData("gpu", index)
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
                          CPU
                        </label>
                        <input
                          data-testid="cpu"
                          id="cpu"
                          name="cpu"
                          type="text"
                          value={cpuEditData}
                          onChange={(e) => setCpuEditData(e.target.value)}
                          placeholder="CPU requirements (if any)"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                        {cpuEditData && (
                          <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                            {cpuEditData}
                            <button
                              onClick={() => addEditCategoryData("cpu")}
                              className="cursor-pointer"
                            >
                              <FaCirclePlus size={20} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                            </button>
                          </div>
                        )}
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {editFormData.cpu.map((data, index) => (
                            <div
                              key={index}
                              className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                            >
                              {data}
                              <button
                                onClick={() =>
                                  removeEditCategoryData("cpu", index)
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
                          Memory
                        </label>
                        <input
                          data-testid="memory"
                          id="memory"
                          name="memory"
                          type="text"
                          value={editFormData.memory}
                          onChange={handleEditInputChange}
                          placeholder="Memory (RAM) required"
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                        />
                      </div>

                      <div>
                        <label className="text-black text-[14px] roboto block font-medium">
                          Disk
                        </label>
                        <input
                          data-testid="disk"
                          id="disk"
                          name="disk"
                          type="text"
                          value={editFormData.disk}
                          onChange={handleEditInputChange}
                          placeholder="Disk space required"
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
                          Save Info
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

export default ApplicationRunTimePage;
