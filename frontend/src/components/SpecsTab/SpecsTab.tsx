import { useState } from "react";
// import { PlusIcon } from "../../assets/Icons/AllSvg";
import { FiPlus } from "react-icons/fi";
import { IoCloud } from "react-icons/io5";
import { FaMobileScreenButton } from "react-icons/fa6";
import { RiComputerLine } from "react-icons/ri";
import { IoIosArrowDown, IoIosLink } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import {
   setDesignedFor,
   setAvailability,
   addFeature,
   setPoweredBy,
   setSource,
   setProgrammingLanguages,
   setDependencies,
   setApi,
   setOperatingSystems,
   setRepository,
   setLocalRuntime,
   setPricingLink,
   addPricingTier,
   setPricingScreenshot,
} from "../../redux/slices/documentSlice";
import { RootState } from "../../redux/store";

const SpecsTab = () => {
   const dispatch = useDispatch();
   const documentState = useSelector((state: RootState) => state.document);
   const [activeTab, setActiveTab] = useState("overview");

   // Availability Toggles
   const toggleAvailability = (key) => {
      dispatch(setAvailability({ key, value: !documentState.availability[key] }));
   };

   // Feature handling
   const [feature, setFeature] = useState("");
   const handleAddFeature = () => {
      if (feature.trim()) {
         dispatch(addFeature(feature));
         setFeature("");
      }
   };

   const [poweredByData, setPoweredByData] = useState({
      name: '',
      developedBy: '',
      type: '',
      license: '',
      version: '',
   });

   const handlePoweredByDataChange = (e) => {
      const { name, value } = e.target;
      const updatedData = {
         ...poweredByData,
         [name]: value,
      };
      // Update local state
      setPoweredByData(updatedData);
      // Dispatch to update the Redux store
      dispatch(setPoweredBy(updatedData));
   };


   const [programmingLanguages, setProgrammingLanguagesLocal] = useState(["", ""]);
   const handleProgrammingLanguagesChange = (index, event) => {
      const updatedLanguages = [...programmingLanguages];
      updatedLanguages[index] = event.target.value;
      setProgrammingLanguagesLocal(updatedLanguages);
      dispatch(setProgrammingLanguages(updatedLanguages)); // Update the Redux store
   };

   const [dependencies, setDependenciesLocal] = useState(["", ""]);
   const handleDependenciesChange = (index, event) => {
      const updatedDependencies = [...dependencies];
      updatedDependencies[index] = event.target.value;
      setDependenciesLocal(updatedDependencies);
      dispatch(setDependencies(updatedDependencies)); // Update the Redux store
   };

   const [operatingSystems, setOperatingSystemsLocal] = useState(["", "", "", ""]);
   const handleOperatingSystemsChange = (index, event) => {
      const updatedOperatingSystems = [...operatingSystems];
      updatedOperatingSystems[index] = event.target.value;
      setOperatingSystemsLocal(updatedOperatingSystems);
      dispatch(setOperatingSystems(updatedOperatingSystems)); // Update the Redux store
   };

   const [localRuntime, setLocalRuntimeLocal] = useState({
      minGpu: "",
      optimalGpu: "",
   });
   const handleLocalRuntimeChange = (key, event) => {
      const updatedLocalRuntime = { ...localRuntime, [key]: event.target.value };
      setLocalRuntimeLocal(updatedLocalRuntime);
      dispatch(setLocalRuntime(updatedLocalRuntime)); // Update the Redux store
   };


   const [pricingLink, setPricingLinkLocal] = useState("");
   const [tier, setTier] = useState("");
   const [image, setImage] = useState(null); // Keeping this for preview purposes
   const tiers = useSelector((state: RootState) => state.document.pricing.tiers);
   const handleAddTier = () => {
      if (tier) {
         dispatch(addPricingTier({ name: tier }));
         setTier(""); // Clear the input after adding the tier
      }
   };
   const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
         setImage(URL.createObjectURL(file)); // For preview purposes
         dispatch(setPricingScreenshot(file)); // Dispatch the file to Redux directly
      }
   };

   const handlePricingLinkChange = (e) => {
      setPricingLinkLocal(e.target.value);
      dispatch(setPricingLink(e.target.value)); // Dispatch to Redux
   };



   // const [tier, setTier] = useState("");
   // const [tiers, setTiers] = useState([]);
   // const handleAddTier = () => {
   //    if (tier.trim() !== "") {
   //       setTiers([...tiers, { name: tier }]);
   //       setTier("");
   //    }
   // };
   // const [image, setImage] = useState(null);
   // const handleImageUpload = (e) => {
   //    const file = e.target.files[0];
   //    if (file) {
   //       setImage(URL.createObjectURL(file)); // Set the image preview
   //    }
   // };
   return (
      <div className="container mx-auto px-4">
         <div>
            <div className="flex justify-center gap-5 mt-28 flex-wrap sm:flex-nowrap">
               <div className="relative w-full sm:w-auto">
                  <button
                     onClick={() => setActiveTab("overview")}
                     className={`text-white px-6 md:px-[44px] py-2 md:py-[8px] z-10 !bg-[#BBBBB7] m-[1.5px] relative rounded-[10px] text-[14px] md:text-[30px] font-medium w-full sm:w-auto ${activeTab === "overview" ? "bg-[#FF6A00]" : ""
                        }`}
                  >
                     Overview
                  </button>
                  {activeTab === "overview" && (
                     <span className="bg-[linear-gradient(#FF6A00,#FFFB00)] block absolute w-full h-full left-0 top-0 rounded-[10px]"></span>
                  )}
               </div>
               <div className="relative w-full sm:w-auto">
                  <button
                     onClick={() => setActiveTab("technical")}
                     className={`text-white px-6 md:px-[44px] py-2 md:py-[8px] z-10 !bg-[#BBBBB7] m-[1.5px] relative rounded-[10px] text-[14px] md:text-[30px] font-medium w-full sm:w-auto ${activeTab === "technical" ? "bg-[#FF6A00]" : ""
                        }`}
                  >
                     Technical Stuff
                  </button>
                  {activeTab === "technical" && (
                     <span className="bg-[linear-gradient(#FF6A00,#FFFB00)] block absolute w-full h-full left-0 top-0 rounded-[10px]"></span>
                  )}
               </div>
               <div className="relative w-full sm:w-auto">
                  <button
                     onClick={() => setActiveTab("pricing")}
                     className={`text-white px-6 md:px-[44px] py-2 md:py-[8px] z-10 !bg-[#BBBBB7] m-[1.5px] relative rounded-[10px] text-[14px] md:text-[30px] font-medium w-full sm:w-auto ${activeTab === "pricing" ? "bg-[#FF6A00]" : ""
                        }`}
                  >
                     Pricing
                  </button>
                  {activeTab === "pricing" && (
                     <span className="bg-[linear-gradient(#FF6A00,#FFFB00)] block absolute w-full h-full left-0 top-0 rounded-[10px]"></span>
                  )}
               </div>
            </div>
            {/* Tab Content */}
            <div className="mt-10">
               {activeTab === "overview" && (
                  <div>
                     <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-20">
                        <div className="flex flex-wrap items-center gap-3">
                           <p className="text-center sm:text-left">
                              Designed for:
                           </p>
                           <div className="border-white py-3 px-6 border-2 border-dashed bg-transparent rounded-[10px] cursor-pointer">
                              {/* <p className="text-[#333333] text-[16px] sm:text-[18px] md:text-[20px] italic mb-0">
                                 Marketing Professionals
                              </p> */}
                              <input
                                 type="text"
                                 value={documentState.designedFor}
                                 onChange={(e) => dispatch(setDesignedFor(e.target.value))}
                                 placeholder="Marketing Professionals"
                                 className="text-[#333333] bg-transparent text-[16px] sm:text-[18px] md:text-[20px] italic mb-0 placeholder:text-[#333333] focus:outline-none"
                              />
                           </div>
                        </div>
                        <div className="border-white flex justify-center items-center text-center py-3 px-6 border-2 border-dashed bg-transparent rounded-[10px] cursor-pointer">
                           <FiPlus className="text-[#333333] text-[30px] sm:text-[38px]" />
                        </div>
                     </div>
                     <div>
                        <p className="text-[#333333] text-center text-[18px] md:text-[20px] mt-20">
                           Select the availability of your product
                        </p>
                     </div>
                     <div className="flex flex-wrap justify-center gap-8 md:gap-20 mt-12">
                        {[
                           { key: "web", label: "Web", icon: <IoCloud className="text-white text-[38px]" /> },
                           { key: "mobile", label: "Mobile", icon: <FaMobileScreenButton className="text-white text-[38px]" /> },
                           { key: "local", label: "Local", icon: <RiComputerLine className="text-white text-[38px]" /> },
                           { key: "api", label: "API", icon: <IoCloud className="text-white text-[38px]" /> },
                        ].map(({ key, label, icon }) => (
                           <label key={key} className={`cursor-pointer p-4 ${documentState.availability[key] ? "border-white border-2 border-dashed rounded-[10px]" : ""}`}>
                              <div className="bg-[#FFFFFF2E] p-8 rounded-[25px] flex justify-center cursor-pointer">
                                 {icon}
                              </div>
                              <input type="checkbox" checked={documentState.availability[key]} onChange={() => toggleAvailability(key)} className="mt-3 hidden" />
                              <p className="text-[#333333] text-center text-[16px] sm:text-[18px] mt-3">{label}</p>
                           </label>
                        ))}
                     </div>
                     <div className="flex justify-center mt-12 sm:mt-20 px-4">
                        <div className="bg-[#FFFFFF2E] p-6 sm:p-10 rounded-[25px] w-full sm:w-auto">
                           <p className="text-white text-[18px] sm:text-[24px] font-semibold">
                              Features
                           </p>
                           <div className="flex flex-wrap gap-4 sm:gap-3 mt-5">
                              <div className="px-6 py-3 bg-[#000000B0] rounded-full text-center">
                                 {/* <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                    Add a feature|
                                 </p> */}
                                 <input type="text" className="text-white w-full sm:max-w-[129px] bg-transparent text-[16px] sm:text-[18px] mb-0 placeholder:text-white sm:text-left text-center focus:outline-none" placeholder="Add a feature|" value={feature}
                                    onChange={(e) => setFeature(e.target.value)} />
                              </div>
                              <div className="px-6 py-3 bg-[#000000B0] rounded-full flex justify-center items-center w-full sm:w-auto">
                                 <FiPlus className="text-white text-[28px] sm:text-[33px]" onClick={handleAddFeature} />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
               {activeTab === "technical" && (
                  <div >
                     <div className="flex  justify-center">
                        <div className="lg:flex justify-center items-center mt-12 sm:mt-20 px-4 gap-[27px] ">
                           <div className="bg-[#FFFFFF2E] p-6 sm:p-8 rounded-[25px]">
                              <p className="text-white text-[18px] sm:text-[24px]">Powered By</p>
                              <div className="lg:flex gap-4 sm:gap-3 mt-5">
                                 <div className="px-6 py-3 bg-[#000000B0] rounded-[25px]">
                                    <input
                                       type="text"
                                       name="name"
                                       value={documentState.poweredBy.name}
                                       onChange={handlePoweredByDataChange}
                                       className="text-white bg-transparent text-[16px] sm:text-[18px] mb-2 placeholder:text-white focus:outline-none"
                                       placeholder="Bark"
                                    />
                                    <input
                                       type="text"
                                       name="developedBy"
                                       value={documentState.poweredBy.developedBy}
                                       onChange={handlePoweredByDataChange}
                                       className="text-white bg-transparent text-[16px] sm:text-[18px] mb-2 placeholder:text-white focus:outline-none"
                                       placeholder="Developed by Suno"
                                    />
                                    <input
                                       type="text"
                                       name="type"
                                       value={documentState.poweredBy.type}
                                       onChange={handlePoweredByDataChange}
                                       className="text-white bg-transparent text-[16px] sm:text-[18px] mb-2 placeholder:text-white focus:outline-none"
                                       placeholder="Text-to-Audio"
                                    />
                                    <input
                                       type="text"
                                       name="license"
                                       value={documentState.poweredBy.license}
                                       onChange={handlePoweredByDataChange}
                                       className="text-white bg-transparent text-[16px] sm:text-[18px] mb-2 placeholder:text-white focus:outline-none"
                                       placeholder="Open Source"
                                    />
                                    <input
                                       type="text"
                                       name="version"
                                       value={documentState.poweredBy.version}
                                       onChange={handlePoweredByDataChange}
                                       className="text-white bg-transparent text-[16px] sm:text-[18px] mb-2 placeholder:text-white focus:outline-none"
                                       placeholder="v4"
                                    />
                                 </div>
                              </div>
                           </div>


                           <div>
                              <div className="xl:flex">
                                 <div className="flex justify-center mt-12 sm:mt-20 px-4">
                                    <div className="bg-[#FFFFFF2E] py-6 px-7  rounded-[25px] ">
                                       <p className="text-white text-[18px] sm:text-[24px] ">
                                          Source
                                       </p>
                                       <div className=" mt-5">
                                          <div className="">
                                             {/* <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                                Open
                                             </p> */}
                                             <input type="text" className="px-6 py-3 bg-[#000000B0] rounded-full text-center text-white w-full  text-[16px] sm:text-[18px] mb-0 placeholder:text-white focus:outline-none" placeholder="Open"
                                                value={documentState.source}
                                                onChange={(e) => dispatch(setSource(e.target.value))}
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex justify-center mt-12 sm:mt-20 px-4">
                                    <div className="bg-[#FFFFFF2E] py-6 px-7 rounded-[25px]">
                                       <p className="text-white text-[18px] sm:text-[24px] mb-0 whitespace-nowrap">
                                          Programming Languages
                                       </p>
                                       <div className="flex lg:flex-row flex-col items-center justify-center gap-4 sm:gap-3 mt-5">
                                          <input
                                             type="text"
                                             className="text-white px-6 py-3 bg-[#000000B0] rounded-full text-[16px] w-full max-w-[1000px] text-center sm:text-[18px] placeholder:text-white focus:outline-none"
                                             placeholder="Jupyter Notebook"
                                             value={programmingLanguages[0]}
                                             onChange={(e) => handleProgrammingLanguagesChange(0, e)}
                                          />
                                          <input
                                             type="text"
                                             className="text-white px-6 py-3 bg-[#000000B0] rounded-full text-[16px] w-full max-w-[1000px] text-center sm:text-[18px] placeholder:text-white focus:outline-none"
                                             placeholder="Python"
                                             value={programmingLanguages[1]}
                                             onChange={(e) => handleProgrammingLanguagesChange(1, e)}
                                          />
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex justify-center mt-12 sm:mt-20 px-4">
                                    <div className="bg-[#FFFFFF2E] py-6 px-7 rounded-[25px]">
                                       <p className="text-white text-[18px] sm:text-[24px] mb-0">
                                          Dependencies
                                       </p>
                                       <div className="flex lg:flex-row flex-col items-center gap-4 lg:gap-3 mt-5">
                                          <div>
                                             <input
                                                type="text"
                                                className="text-white px-6 py-3 bg-[#000000B0] rounded-full text-[16px] text-center w-full max-w-[1000px] sm:text-[18px] mb-0 placeholder:text-white focus:outline-none"
                                                placeholder="PyTorch"
                                                value={dependencies[0]}
                                                onChange={(e) => handleDependenciesChange(0, e)}
                                             />
                                          </div>
                                          <div>
                                             <input
                                                type="text"
                                                className="text-white px-6 py-3 bg-[#000000B0] rounded-full text-[16px] text-center w-full max-w-[1000px] sm:text-[18px] mb-0 placeholder:text-white focus:outline-none"
                                                placeholder="FFmpeg"
                                                value={dependencies[1]}
                                                onChange={(e) => handleDependenciesChange(1, e)}
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="xl:flex">
                                 <div className="flex justify-center mt-12 sm:mt-6 px-4">
                                    <div className="bg-[#FFFFFF2E] py-6 px-7  rounded-[25px] ">
                                       <p className="text-white text-[18px] sm:text-[24px]  mb-0">
                                          API
                                       </p>
                                       <div className=" mt-5">
                                          <div>

                                             <input type="text" className="text-white px-6 py-3 bg-[#000000B0] rounded-full text-center text-[16px] w-full max-w-[1000px] sm:text-[18px] mb-0 placeholder:text-white focus:outline-none" placeholder="None"
                                                value={documentState.api}
                                                onChange={(e) => dispatch(setApi(e.target.value))}
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex justify-center mt-12 sm:mt-6 px-4">
                                    <div className="bg-[#FFFFFF2E] py-6 px-7 rounded-[25px]">
                                       <p className="text-white text-[18px] sm:text-[24px]">
                                          Operating Systems
                                       </p>
                                       <div className="flex lg:flex-row flex-col gap-4 sm:gap-3 mt-5 items-center">
                                          <div>
                                             <input
                                                type="text"
                                                className="text-white px-6 py-3 bg-[#000000B0] rounded-full text-[16px] text-center w-full max-w-[1000px] sm:text-[18px] mb-0 placeholder:text-white focus:outline-none"
                                                placeholder="Windows"
                                                value={operatingSystems[0]}
                                                onChange={(e) => handleOperatingSystemsChange(0, e)}
                                             />
                                          </div>
                                          <div>
                                             <input
                                                type="text"
                                                className="text-white px-6 py-3 bg-[#000000B0] rounded-full text-[16px] text-center w-full max-w-[1000px] sm:text-[18px] mb-0 placeholder:text-white focus:outline-none"
                                                placeholder="Linux"
                                                value={operatingSystems[1]}
                                                onChange={(e) => handleOperatingSystemsChange(1, e)}
                                             />
                                          </div>
                                          <div>
                                             <input
                                                type="text"
                                                className="text-white px-6 py-3 bg-[#000000B0] rounded-full text-[16px] text-center w-full max-w-[1000px] sm:text-[18px] mb-0 placeholder:text-white focus:outline-none"
                                                placeholder="MacOS"
                                                value={operatingSystems[2]}
                                                onChange={(e) => handleOperatingSystemsChange(2, e)}
                                             />
                                          </div>
                                          <div>
                                             <input
                                                type="text"
                                                className="text-white px-6 py-3 bg-[#000000B0] rounded-full text-[16px] text-center w-full max-w-[1000px] sm:text-[18px] mb-0 placeholder:text-white focus:outline-none"
                                                placeholder="iOS"
                                                value={operatingSystems[3]}
                                                onChange={(e) => handleOperatingSystemsChange(3, e)}
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex justify-center mt-12 sm:mt-6 px-4">
                                    <div className="bg-[#FFFFFF2E] py-6 px-7 rounded-[25px]">
                                       <p className="text-white text-[18px] sm:text-[24px] ">
                                          Repository
                                       </p>
                                       <div className="flex gap-4 sm:gap-3 mt-5">
                                          <div >

                                             <input type="text" className="text-white px-6 py-3 bg-[#000000B0] rounded-full text-center text-[16px] w-full max-w-[1000px] sm:text-[18px] mb-0 placeholder:text-white focus:outline-none" placeholder="Add a link"
                                                value={documentState.repository}
                                                onChange={(e) => dispatch(setRepository(e.target.value))}
                                             />
                                             {/* <FaGithub className="text-[20px] sm:text-[25px]  mb-0" /> */}
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="xl:flex">
                                 <div className="flex justify-center mt-12 sm:mt-6 px-4">
                                    <div className="bg-[#FFFFFF2E] py-6 px-7 rounded-[25px]">
                                       <p className="text-white text-[18px] sm:text-[24px]">Local Runtime</p>
                                       <div className="flex lg:flex-row flex-col items-center gap-4 sm:gap-3 mt-5">
                                          <div className="px-6 xl:flex justify-between gap-12 py-3 bg-[#000000B0] rounded-full text-center">
                                             <p className="text-white text-center justify-center xl:flex items-center text-[16px] sm:text-[18px] mb-0 whitespace-nowrap">
                                                Minimum GPU:
                                             </p>

                                             <input
                                                type="text"
                                                className="text-white xl:!text-right !text-center rounded-full text-[16px] w-full max-w-[1000px] sm:text-[18px] bg-transparent mb-0 placeholder:text-white focus:outline-none"
                                                placeholder="8GB VRAM"
                                                value={localRuntime.minGpu}
                                                onChange={(e) => handleLocalRuntimeChange("minGpu", e)}
                                             />
                                          </div>
                                          <div className="px-6 xl:flex gap-12 py-3 bg-[#000000B0] rounded-full text-center">
                                             <p className="text-white text-center justify-center xl:flex items-center text-[16px] sm:text-[18px] mb-0 whitespace-nowrap">
                                                Optimal GPU:
                                             </p>

                                             <input
                                                type="text"
                                                className="text-white xl:!text-right !text-center rounded-full text-[16px] w-full max-w-[1000px] bg-transparent sm:text-[18px] mb-0 placeholder:text-white focus:outline-none"
                                                placeholder="12GB VRAM"
                                                value={localRuntime.optimalGpu}
                                                onChange={(e) => handleLocalRuntimeChange("optimalGpu", e)}
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
               {activeTab === "pricing" && (
                  <div>
                     <div className="flex justify-center mt-20">
                        <div className="px-6 flex gap-8 items-center py-3 bg-[#000000B0] rounded-full w-full sm:w-auto text-center">
                           <input
                              type="text"
                              className="text-white text-[16px] sm:text-[18px] mb-0 bg-transparent placeholder:text-white focus:outline-none w-full max-w-[235px]"
                              placeholder="Add a link to pricing page"
                              value={pricingLink}
                              onChange={handlePricingLinkChange}
                           />
                           <IoIosLink className="text-[20px] sm:text-[25px] text-white" />
                        </div>
                     </div>

                     <div className="flex flex-wrap mt-24 justify-center 2xl:gap-40 xl:gap-20px lg:gap-10 md:gap-6 gap-4 items-center">
                        <div>
                           <p className="text-[#333333] text-[16px] sm:text-[23px]">
                              Enter pricing tiers manually
                           </p>
                           <div className="flex gap-6 items-start">
                              <div className="mt-5">
                                 <div className="px-6 py-3 bg-[#000000B0] rounded-[25px] w-full sm:w-auto">
                                    <div className="h-[200px] w-full max-w-[300px] overflow-y-auto">
                                       {tiers.slice(0, 3).map((tierItem, index) => (
                                          <div key={index} className="px-6 mt-2 py-3 bg-black rounded-full w-full sm:w-auto text-center">
                                             <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                                {tierItem.name}
                                             </p>
                                          </div>
                                       ))}
                                       <div className="overflow-y-auto">
                                          {tiers.slice(3).map((tierItem, index) => (
                                             <div key={index} className="px-6 mt-2 py-3 bg-black rounded-full w-full sm:w-auto text-center">
                                                <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                                   {tierItem.name}
                                                </p>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                    <div className="px-6 py-3 bg-black flex justify-center items-center mt-6 rounded-full w-full sm:w-auto text-center">
                                       <IoIosArrowDown className="text-white text-[16px] sm:text-[18px]" />
                                    </div>
                                 </div>
                              </div>
                              <div className="px-6 mt-5 flex gap-8 items-center py-3 bg-[#000000B0] rounded-[25px] w-full sm:w-auto text-center">
                                 <input
                                    type="text"
                                    value={tier}
                                    onChange={(e) => setTier(e.target.value)}
                                    className="text-white text-[16px] bg-transparent sm:text-[18px] mb-0 focus:outline-none w-full max-w-[94px] placeholder:text-white"
                                    placeholder="Add a tier"
                                 />
                                 <FiPlus
                                    className="text-[20px] sm:text-[25px] text-white cursor-pointer"
                                    onClick={handleAddTier}
                                 />
                              </div>
                           </div>
                        </div>

                        <div>
                           <p className="text-[#333333] text-[16px] sm:text-[30px]">or</p>
                        </div>

                        <div className="px-6 mt-5 py-11 bg-[#0000008A] rounded-[25px] w-full sm:w-auto text-center">
                           <p className="text-white text-[16px] sm:text-[18px]">
                              Upload a screenshot of your pricing tiers
                           </p>
                           <div className="flex justify-center mt-4">
                              <label htmlFor="file-upload" className="cursor-pointer">
                                 <FiPlus className="text-[20px] sm:text-[63px] text-white text-center" />
                              </label>
                              <input
                                 type="file"
                                 id="file-upload"
                                 className="hidden"
                                 accept="image/*"
                                 onChange={handleImageUpload}
                              />
                           </div>
                           {image && (
                              <div
                                 className="mt-4 w-full h-[200px] rounded-[15px] bg-cover bg-center"
                                 style={{ backgroundImage: `url(${image})` }} // Image used as background for preview
                              />
                           )}
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};
export default SpecsTab;
