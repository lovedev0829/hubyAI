//import React from "react";
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
import { IoCloseCircle } from "react-icons/io5";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";

const ApplicationModelPage = () => {
  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );
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

  const initialModelsData = {
    model_name: "",
    model_type: [],
    model_version: "",
    model_source: "",
    model_developer: "",
  };

  const initialFormData = {
    application_id: "",
    models: [],
  };
  const modelRequiredFields = [
    "model_name",
    "model_type",
    "model_source",
    "model_developer",
  ];
  // create formdata states=====================================================================
  const [isSelected, setIsSelected] = useState(true);
  const [formData, setFormData] = useState(initialFormData);
  const [modelsData, setModelsData] = useState(initialModelsData);
  const [modelTypeData, setModelTypeData] = useState("");
  // ============================================================================================

  const [openAddModels, setOpenAddModels] = useState(false);
  const [openAddModelType, setOpenAddModelType] = useState("");

  // Edit formdata states========================================================================
  const [openEditModel, setOpenEditModel] = useState(false);
  const [showAppID, setShowAppID] = useState("");
  const [editFormData, setEditFormData] = useState(initialFormData);
  const [editModelData, setEditModelData] = useState(initialModelsData);
  const [editModelDataIndex, setEditModelDataIndex] = useState(null);
  const [editModelTypeData, setEditModelTypeData] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  // ===============================================================================================

  // handle create model functions ============================================================================================

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    if (name === "application_id") {
      const selectedValue = JSON.parse(value);
      setFormData({
        ...formData,
        application_id: selectedValue?._id,
      });
    } else {
      setModelsData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const addCategoryData = () => {
    if (modelTypeData.trim()) {
      setModelsData((prevData) => ({
        ...prevData,
        model_type: [...prevData.model_type, modelTypeData],
      }));
      setModelTypeData("");
    }
  };
  const removeCategoryData = (indexToRemove: any) => {
    setModelsData((prevData) => ({
      ...prevData,
      model_type: prevData.model_type.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleRemoveModels = (indexToRemove: any) => {
    setFormData((prevData) => ({
      ...prevData,
      models: prevData.models.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // console.log(formData, "090990909");

    if (validateFormData(formData, modelRequiredFields)) {
      try {
        const response = await fetchPostApi(
          "/api/applications/models",
          formData,
          "application/json",
          access_user,
          navigate,
          location
        );
        // console.log(response, "response******");
        if (response.status === 201) {
          toast.success("Models added successfully!");
        }
        setFormData(initialFormData);
      } catch (error) {
        console.log("Error adding models information:", error);
        toast.error(error.response.data.error || error.response.data);
        setFormData(initialFormData);
      }
    }
  };

  // ============================================================================================================================

  const handleOpenAddModels = (value: string) => {
    setOpenAddModelType(value);
    setOpenAddModels(true);
  };

  const handleAddModels = () => {
    if (
      openAddModelType === "create" &&
      validateFormData(modelsData, modelRequiredFields)
    ) {
      setFormData((prevData) => ({
        ...prevData,
        models: [...prevData.models, modelsData],
      }));
      setModelsData(initialModelsData);
    }
    if (
      openAddModelType === "edit" &&
      validateFormData(modelsData, modelRequiredFields)
    ) {
      setEditFormData((prevData) => ({
        ...prevData,
        models: [...prevData.models, modelsData],
      }));
      setModelsData(initialModelsData);
    }
  };

  // handle Edit model functions ===============================================================================================

  const handleShowModeClick = async () => {
    if (showAppID === "") {
      toast.error("Please select a product");
      return;
    }
    try {
      const path = `/api/applications/models/${showAppID}`;
      const response = await fetchGetApi(path, undefined, navigate, location);
      // console.log(response?.data, "****************");
      if (response.status === 200) {
        setEditFormData({
          application_id: response?.data?.application_id,
          models: response?.data?.models,
        });
      }
      // console.log("res*****", response);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      setShowAppID("");
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
      setEditModelData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleEditChildModel = (data: any, index: any) => {
    setEditModelData(data);
    setEditModelDataIndex(index);
    setOpenEditModel(true);
  };

  const addEditCategoryData = () => {
    if (editModelTypeData.trim()) {
      setEditModelData((prevData) => ({
        ...prevData,
        model_type: [...prevData.model_type, editModelTypeData],
      }));
      setEditModelTypeData("");
    }
  };

  const removeEditCategoryData = (indexToRemove: any) => {
    setEditModelData((prevData) => ({
      ...prevData,
      model_type: prevData.model_type.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleSaveEditModels = () => {
    if (validateFormData(editModelData, modelRequiredFields)) {
      setEditFormData((prevData) => {
        const updatedModels = [...prevData.models];
        updatedModels[editModelDataIndex] = editModelData;
        return {
          ...prevData,
          models: updatedModels,
        };
      });
      setEditModelData(initialModelsData);
      setOpenEditModel(false);
    }
  };

  const handleRemoveEditModels = (indexToRemove: any) => {
    setEditFormData((prevData) => ({
      ...prevData,
      models: prevData.models.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleEditFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // console.log(editFormData, "090990909");

    if (validateFormData(editFormData, modelRequiredFields)) {
      try {
        const response = await fetchPutApi(
          `/api/applications/models/${editFormData.application_id}`,
          editFormData,
          "application/json",
          access_user,
          navigate,
          location
        );
        // console.log(response, "response******");
        if (response.status === 200) {
          toast.success("Model information updated successfully!");
        }
      } catch (error) {
        console.log("Update models information Error:", error);
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
  // ================================================================================================================================

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
          isActive="applicationModel"
        />

        <div className="flex justify-center" data-testid="sidebar-toggle">
          <div className="w-full max-w-[80%] h-auto mb-20">
            <div className="flex lg:flex-row flex-col sm:p-4 p-[14px] pb-0 mt-[60px] mb-5 gap-[70px]">
              <div className=" border-[#e6e6e6] rounded-md border-[1px] p-[16px] w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] h-fit">
                <h1 className="md:text-[40px] sm:text-[30px] text-[26px] roboto font-bold">
                  Add/Update Models Information
                </h1>

                <div className="flex">
                  <button
                    onClick={() => setIsSelected(true)}
                    className={`${isSelected
                      ? "bg-[#000000] text-white"
                      : "bg-[#ffff] text-black"
                      } border-[#000] border-[1px] rounded-l-lg h-[48px] max-w-[240px] w-full roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg hover:z-10 transition-all duration-300`}
                  >
                    Add Models
                  </button>

                  <button
                    onClick={() => setIsSelected(false)}
                    className={`${!isSelected
                      ? "bg-[#000000] text-white"
                      : "bg-[#ffff] text-black"
                      } border-[#000] border-[1px] rounded-r-lg h-[48px] max-w-[240px] w-full roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg hover:z-10 transition-all duration-300`}
                  >
                    View/Update Models
                  </button>
                </div>

                {/* Add Applications */}
                {isSelected && (
                  <div className="border-[#e6e6e6]  border-[1px] p-[16px]  w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="mb-3 ">
                      <label className="text-black text-[14px] roboto block font-medium mb-1">
                        Product Name
                      </label>
                      <div className="flex items-center gap-3">
                        <select
                          name="application_id"
                          value={showAppID}
                          onChange={handleInputChange}
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full  mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none "
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
                        <button
                          onClick={() => handleOpenAddModels("create")}
                          className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[200px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                        >
                          Add Models
                        </button>
                      </div>
                    </div>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Models Preview:
                    </h5>
                    <div className="w-auto flex-wrap flex gap-3 items-center">
                      {formData.models.map((data, index) => (
                        <div
                          key={index}
                          className="bg-[#f2f2f2] rounded-md border-2 p-3 w-full
                        max-w-[317px]"
                        >
                          <div>
                            <button
                              onClick={() => handleRemoveModels(index)}
                              className="flex  items-center justify-end w-full"
                            >
                              <IoCloseCircle size={25} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                            </button>
                            <div className="flex gap-2">
                              <span className="font-bold ">Model Name: </span>
                              <span className="font-medium">{data.model_name}</span>
                            </div>
                            <div className="flex gap-2 items-center">
                              <div className="font-bold">Model Type:</div>
                              <div>
                                {data.model_type.map((type, indexType) => (
                                  <span className="font-medium" key={indexType}>
                                    {type},{" "}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="font-bold">Model version: </span>
                              <span className="font-medium">
                                {data.model_version}
                              </span>
                            </div>
                            <div>
                              <span className="font-bold">Model source: </span>
                              <span className="font-medium">
                                {data.model_source}
                              </span>
                            </div>
                            <div>
                              <span className="font-bold">Model developer:</span>
                              <span className="font-medium">
                                {" "}
                                {data.model_developer}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
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
                    <div className="mb-3 ">
                      <label className="text-black text-[14px] roboto block font-medium mb-1">
                        Product Name
                      </label>
                      <div className="flex items-center gap-3">
                        <select
                          name="application_id"
                          value={showAppID}
                          onChange={(e) => setShowAppID(e.target.value)}
                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full  mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none "
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
                          onClick={handleShowModeClick}
                          className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[200px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                        >
                          Show Models
                        </button>
                      </div>
                    </div>

                    {/* <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Models Preview:
                    </h5> */}

                    {showAppID !== "" && editFormData.application_id !== "" && (
                      <>
                        <div className="w-auto flex-wrap flex gap-3 items-center">
                          {editFormData?.models.map((data, index) => (
                            <>
                              <div
                                key={index}
                                className="bg-[#f2f2f2] rounded-md border-2 p-3 w-full
                        max-w-[317px]"
                              >
                                <div>
                                  <button
                                    onClick={() => handleRemoveEditModels(index)}
                                    className="flex  items-center justify-end w-full "
                                  >
                                    <IoCloseCircle size={25} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                                  </button>
                                  <div className="flex gap-2">
                                    <span className="font-bold ">
                                      Model Name:{" "}
                                    </span>
                                    <span className="font-medium">
                                      {data.model_name}
                                    </span>
                                  </div>
                                  <div className="flex gap-2 items-center">
                                    <div className="font-bold">Model Type:</div>
                                    <div>
                                      {data.model_type.map((type, indexType) => (
                                        <span
                                          className="font-medium"
                                          key={indexType}
                                        >
                                          {type},{" "}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="font-bold">
                                      Model version:{" "}
                                    </span>
                                    <span className="font-medium">
                                      {data.model_version}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-bold">
                                      Model source:{" "}
                                    </span>
                                    <span className="font-medium">
                                      {data.model_source}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-bold">
                                      Model developer:
                                    </span>
                                    <span className="font-medium">
                                      {" "}
                                      {data.model_developer}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    handleEditChildModel(data, index)
                                  }
                                  className="border-[#000] border-[1px] bg-[#000000] rounded-lg p-[8px_20px] mt-3 text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                                >
                                  Edit
                                </button>
                              </div>
                              {openEditModel && (
                                <>
                                  <div className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                    <div className="bg-[#fff] lg:w-[30%] w-full flex gap-[16px] flex-col lg:mt-0 mt-[30px] border-[#e6e6e6] rounded-md border-[1px] p-[16px] h-fit">
                                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        Add AI Models Used:
                                      </h5>
                                      <div>
                                        <label className="text-black text-[14px] roboto block font-medium">
                                          Model Name
                                        </label>
                                        <input
                                          data-testid="model_name"
                                          id="model_name"
                                          name="model_name"
                                          type="text"
                                          value={editModelData.model_name}
                                          onChange={handleEditInputChange}
                                          placeholder="Name of the model(s) used by the product"
                                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-black text-[14px] roboto block font-medium">
                                          Model Type
                                        </label>
                                        <input
                                          data-testid="model_type"
                                          id="model_type"
                                          name="model_type"
                                          type="text"
                                          value={editModelTypeData}
                                          onChange={(e) =>
                                            setEditModelTypeData(e.target.value)
                                          }
                                          placeholder="LLM, Image generation, video generation, audio generation/transcription, multi-modal"
                                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                                        />
                                        {editModelTypeData && (
                                          <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                                            {editModelTypeData}
                                            <button
                                              onClick={addEditCategoryData}
                                              className="cursor-pointer"
                                            >
                                              <FaCirclePlus size={20} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                                            </button>
                                          </div>
                                        )}
                                        <div className="flex gap-2 mt-1 flex-wrap">
                                          {editModelData.model_type.map(
                                            (data, index) => (
                                              <div
                                                key={index}
                                                className={`bg-[#f2f2f2] rounded-md h-[36px]  p-3 text-[14px] roboto border-2 font-normal flex
                    gap-3 items-center`}
                                              >
                                                {data}
                                                <button
                                                  onClick={() =>
                                                    removeEditCategoryData(index)
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

                                      <div>
                                        <label className="text-black text-[14px] roboto block font-medium">
                                          Model Version
                                        </label>
                                        <input
                                          data-testid="model_version"
                                          id="model_version"
                                          name="model_version"
                                          type="text"
                                          value={editModelData.model_version}
                                          onChange={handleEditInputChange}
                                          placeholder="Version of the model(s) used"
                                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-black text-[14px] roboto block font-medium">
                                          Model Source
                                        </label>
                                        <input
                                          data-testid="model_source"
                                          id="model_source"
                                          name="model_source"
                                          type="text"
                                          value={editModelData.model_source}
                                          onChange={handleEditInputChange}
                                          placeholder="Open source or Closed source"
                                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                                        />
                                      </div>

                                      <div>
                                        <label className="text-black text-[14px] roboto block font-medium">
                                          Model Developer
                                        </label>
                                        <input
                                          data-testid="model_developer"
                                          id="model_developer"
                                          name="model_developer"
                                          type="text"
                                          value={editModelData.model_developer}
                                          onChange={handleEditInputChange}
                                          placeholder="Company that developed the model or a lead developer"
                                          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                                        />
                                      </div>

                                      <div className="flex gap-[12px] justify-center items-center">
                                        {/* <button className="border-[#000] border-[1px] rounded-lg h-[48px] max-w-[240px] w-full text-black roboto font-medium text-[16px]">
                                      Save Draft
                                    </button> */}
                                        <button
                                          onClick={() => {
                                            setOpenEditModel(false);
                                          }}
                                          className="border-gray-500 border-[1px] bg-gray-500 rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={handleSaveEditModels}
                                          className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                                        >
                                          Save
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                                </>
                              )}
                            </>
                          ))}
                        </div>

                        <div className="flex gap-[12px]">
                          <button
                            onClick={handleCancelEditFormData}
                            className="border-gray-500 border-[1px] bg-gray-500 rounded-lg h-[48px] mt-3 max-w-[240px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleOpenAddModels("edit")}
                            className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] mt-3 max-w-[240px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                          >
                            Add Models
                          </button>
                          <button
                            onClick={handleEditFormSubmit}
                            className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] mt-3 max-w-[240px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                          >
                            Save Models Information
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {openAddModels ? (
                  <>
                    <div className=" justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                      <div className="bg-[#fff] lg:w-[30%] w-full flex gap-[16px] flex-col lg:mt-0 mt-[30px] border-[#e6e6e6] rounded-md border-[1px] p-[16px] h-fit">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                          Add AI Models Used:
                        </h5>
                        <div>
                          <label className="text-black text-[14px] roboto block font-medium">
                            Model Name
                          </label>
                          <input
                            data-testid="model_name"
                            id="model_name"
                            name="model_name"
                            type="text"
                            value={modelsData.model_name}
                            onChange={handleInputChange}
                            placeholder="Name of the model(s) used by the product"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                        </div>

                        <div>
                          <label className="text-black text-[14px] roboto block font-medium">
                            Model Type
                          </label>
                          <input
                            data-testid="model_type"
                            id="model_type"
                            name="model_type"
                            type="text"
                            value={modelTypeData}
                            onChange={(e) => setModelTypeData(e.target.value)}
                            placeholder="LLM, Image generation, video generation, audio generation/transcription, multi-modal"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 mb-2 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                          {modelTypeData && (
                            <div className="flex mb-2 border-2 border-[#00000080] w-fit px-3 py-1 gap-2 rounded-md  items-center ">
                              {modelTypeData}
                              <button
                                onClick={addCategoryData}
                                className="cursor-pointer"
                              >
                                <FaCirclePlus size={20} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                              </button>
                            </div>
                          )}
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {modelsData.model_type.map((data, index) => (
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
                          <label className="text-black text-[14px] roboto block font-medium">
                            Model Version
                          </label>
                          <input
                            data-testid="model_version"
                            id="model_version"
                            name="model_version"
                            type="text"
                            value={modelsData.model_version}
                            onChange={handleInputChange}
                            placeholder="Version of the model(s) used"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                        </div>

                        <div>
                          <label className="text-black text-[14px] roboto block font-medium">
                            Model Source
                          </label>
                          <input
                            data-testid="model_source"
                            id="model_source"
                            name="model_source"
                            type="text"
                            value={modelsData.model_source}
                            onChange={handleInputChange}
                            placeholder="Open source or Closed source"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                        </div>

                        <div>
                          <label className="text-black text-[14px] roboto block font-medium">
                            Model Developer
                          </label>
                          <input
                            data-testid="model_developer"
                            id="model_developer"
                            name="model_developer"
                            type="text"
                            value={modelsData.model_developer}
                            onChange={handleInputChange}
                            placeholder="Company that developed the model or a lead developer"
                            className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                          />
                        </div>

                        <div className="flex gap-[12px] justify-center items-center">
                          {/* <button className="border-[#000] border-[1px] rounded-lg h-[48px] max-w-[240px] w-full text-black roboto font-medium text-[16px]">
                    Save Draft
                  </button> */}
                          <button
                            onClick={() => setOpenAddModels(false)}
                            className="border-gray-500 border-[1px] bg-gray-500 rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddModels}
                            className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    </>
  );
};

export default ApplicationModelPage;
