import { FaCamera } from "react-icons/fa";
import { DownArrowIcon } from "../../assets/Icons/AllSvg";
import { MdKeyboardArrowDown, MdMessage } from "react-icons/md";
// import { LuAudioLines } from "react-icons/lu";
import SpecsTab from "../SpecsTab/SpecsTab";
import { useRef, useState } from "react";
import { LuAudioLines } from "react-icons/lu";
import { useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
import { setCaptionImageFile, setCaptionAudioFile } from "../../redux/slices/documentSlice";

const TabDetails = ({ activeTab }) => {
   const dispatch = useDispatch();
   // const captionImageFile = useSelector((state: RootState) => state.document.captionImageFile);
   // const captionAudioFile = useSelector((state: RootState) => state.document.captionAudioFile);
   const [image, setImage] = useState(null);
   const fileInputRef = useRef(null);

   const handleButtonClick = () => {
      fileInputRef.current.click();  // Triggers the file input for image selection
   };

   const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
         setImage(URL.createObjectURL(file));  // Preview image
         dispatch(setCaptionImageFile(file));  // Dispatch file to Redux store
      } else {
         alert("Please select an image file (JPG, PNG, GIF).");
      }
   };

   const [audio, setAudio] = useState(null);  // To store the audio file
   const fileInputRef2 = useRef(null);  // Ref for file input for audio

   const handleButtonClick2 = () => {
      fileInputRef2.current.click();  // Triggers the file input for audio selection
   };

   const handleFileChange2 = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith('audio/')) {
         const audioURL = URL.createObjectURL(file);
         setAudio(audioURL);  // Set audio URL for preview
         dispatch(setCaptionAudioFile(file));  // Dispatch file to Redux store
      } else {
         alert('Please upload a valid audio file.');
      }
   };

   return (
      <div className="mt-8">
         {activeTab === "Preview" && (
            <div className=" flex justify-center items-center">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#0000005E] rounded-lg w-full">
                  <div className="flex flex-col items-center lg:border border-white p-6 md:p-8">
                     {/* Camera & Arrow Icon */}
                     <div className="py-4">
                        <div className="flex gap-3 justify-center">
                           <FaCamera className="text-[45px] md:text-[65px] text-white" />
                           <button>
                              <MdKeyboardArrowDown className="fill-white text-[20px] md:text-[25px]" />
                           </button>
                        </div>
                        <div className="flex justify-between items-center w-full mt-4">
                           <i className="fas fa-camera text-lg md:text-xl text-white"></i>
                           <i className="fas fa-chevron-down text-white text-lg md:text-xl"></i>
                        </div>
                     </div>

                     {/* Upload Button or Image Preview */}
                     <div
                        className="w-[250px] h-[250px] md:w-[300px] md:h-[150px] border-2 border-dashed border-white flex bg-[#7E039A0D] justify-center items-center rounded-lg cursor-pointer"
                        onClick={handleButtonClick}
                     >
                        {image ? (
                           <img
                              src={image}
                              alt="Uploaded Preview"
                              className="w-full h-full object-cover rounded-md"
                           />
                        ) : (
                           <button className="text-white text-[50px] md:text-[75px]">+</button>
                        )}
                        <input
                           type="file"
                           accept="image/*"
                           ref={fileInputRef}
                           className="hidden"
                           onChange={handleFileChange}
                        />
                     </div>

                     <p className="mt-4 text-white text-center text-sm md:text-[15px] font-normal">Add a caption</p>
                  </div>

                  <div className="flex flex-col items-center p-6 md:p-8 w-full">
                     {/* Message Icon & Dropdown */}
                     <div className="py-4 w-full">
                        <div className="flex gap-3 justify-center">
                           <MdMessage className="text-[40px] md:text-[65px] text-white" />
                           <button>
                              <MdKeyboardArrowDown className="fill-white text-[20px] md:text-[25px]" />
                           </button>
                        </div>
                        <div className="flex justify-between items-center w-full mt-4">
                           <i className="fas fa-comment text-base md:text-xl text-white"></i>
                           <i className="fas fa-chevron-down text-base md:text-xl text-white"></i>
                        </div>

                        <div className="mt-6 w-full h-auto md:h-24 border-2 border-dashed bg-[#7E039A0D] border-white rounded-lg flex flex-col justify-center px-8 py-4 pmd:py-14">
                           <p className="text-white text-[13px] md:text-[15px] text-right">
                              <span className="font-bold">Prompt:</span> Enter
                              the prompt here
                           </p>
                           <p className="text-white text-[13px] md:text-[15px] mt-2">
                              <span className="font-bold">Response:</span> Enter
                              the sample response here
                           </p>
                        </div>
                        <p className="mt-4 text-white text-center text-[13px] md:text-[15px] font-normal">
                           Add a caption
                        </p>
                     </div>
                  </div>

                  <div className="flex flex-col items-center lg:border p-4 md:p-8">
                     {/* Audio Icon and Dropdown */}
                     <div className="py-4">
                        <div className="flex gap-3 justify-center">
                           <LuAudioLines className="text-[40px] md:text-[65px] text-white" />
                           <button>
                              <DownArrowIcon className="fill-white w-4 md:w-6" />
                           </button>
                        </div>
                        <div className="flex justify-between items-center w-full mt-4">
                           <i className="fas fa-waveform text-lg md:text-xl text-white"></i>
                           <i className="fas fa-chevron-down text-white"></i>
                        </div>

                        {/* Upload Button */}
                        <div
                           className="mt-4 px-8 w-[250px] h-[250px] md:w-[300px] md:h-[150px]  border-2 border-dashed border-white flex bg-[#7E039A0D] justify-center items-center rounded-lg cursor-pointer"
                           onClick={handleButtonClick2} // Open file picker on click
                        >
                           {audio ? (
                              <div className="w-full h-full flex flex-col justify-center items-center">
                                 <audio controls className="w-full">
                                    <source src={audio} type="audio/mp3" />
                                    Your browser does not support the audio element.
                                 </audio>
                              </div>
                           ) : (
                              <button className="text-white text-[50px] md:text-[75px]">+</button>
                           )}
                           <input
                              type="file"
                              accept="audio/*" // Accept only audio files
                              ref={fileInputRef2}
                              className="hidden"
                              onChange={handleFileChange2} // Handle file change
                           />
                        </div>

                        <p className="mt-4 text-white text-center text-sm md:text-[15px] font-normal">
                           Add a caption
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         )}
         {activeTab === "Specs" && <SpecsTab />}
         {activeTab === "Resources" && (
            <p className="text-white text-xl">This is the Resources content.</p>
         )}
      </div>
   );
};

export default TabDetails;
