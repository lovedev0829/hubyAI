import { useState, useRef, useEffect } from "react";
import { PlusWhiteIcon } from "../../assets/Icons/AllSvg";
import { useNavigate, useLocation } from "react-router-dom";
import { createApplicationsDocument, fetchGetApi, updateApplicationsDocument, uploadApplicationLogoUrl } from "../../functions/apiFunctions";
import ProductModel from "../ProductModel/ProductModel";
import { toast } from "react-toastify";

const Hero = () => {
   const access_user = JSON.parse(
      localStorage.getItem("access_token") as string
   );
   const navigate = useNavigate();
   const location = useLocation();
   const fileInputRef = useRef(null);



   // Local state instead of Redux
   const [productName, setProductName] = useState("What’s your product called?|");
   // const [background, setBackground] = useState("");
   // const [logo, setLogo] = useState(null);
   const [previewImage, setPreviewImage] = useState(null);
   const [isEditing, setIsEditing] = useState(false);
   const [isOpen, setIsOpen] = useState(false);
   const [selectedColor, setSelectedColor] = useState(null);
   const [isFirstEntry, setIsFirstEntry] = useState(true);

   const [document_id, setDocument_id] = useState("");
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isLogoUploading, setIsLogoUploading] = useState(false);
   const [isSelected, setIsSelected] = useState(true);


   const colors = [
      { value: "orange", color: "#FFA500" },
      { value: "pink", color: "#FFC0CB" },
      { value: "brown", color: "#A52A2A" },
      { value: "gray", color: "#808080" },
      { value: "black", color: "#000000" },
      { value: "cyan", color: "#00FFFF" },
      { value: "magenta", color: "#FF00FF" },
      { value: "lime", color: "#00FF00" },
      { value: "teal", color: "#008080" },
      { value: "gold", color: "#FFD700" },
   ];



   const [lastAppData, setLastAppData] = useState(null);
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
            const lastId = response.data.length > 0 ? response.data.slice(-1)[0]._id : null;
            setDocument_id(lastId);
            const path2 = `/api/applications/${lastId}`;
            const response2 = await fetchGetApi(path2, undefined, navigate, location);
            console.log("AppData", response2.data);
            // setLastAppData(response2?.data || null);
            setProductName(response2?.data?.application ?? "What’s your product called?|")
            setSelectedColor(response2?.data?.backgroundColor ?? null)
            setPreviewImage(response2?.data?.application_logo_url ?? null)
         } catch (error) {
            // console.error("filterData Error:", error);
         }
      };

      const clearData = () => {
         setLastAppData(null);
         setProductName("What’s your product called?|")
         setSelectedColor(null)
         setPreviewImage(null)
      }
      access_user && !isSelected && filterAppDataByLoginUser();
      access_user && isSelected && clearData();
      !access_user && setIsModalOpen(true);
   }, [isSelected]);

   console.log("lastAppData", lastAppData);

   const handleProductNameChange = async (e) => {
      const application = e.target.value;
      setProductName(application);
      setIsEditing(application.length > 0);
   };

   const handleBackgroundChange = async (color) => {
      setSelectedColor(color);
      setIsOpen(false);
      await updateApplicationsDocument({ backgroundColor: color }, document_id, access_user, navigate, location);

   };

   const handleButtonClick = () => {
      fileInputRef.current.click();
   };

   const handleFileChange = async (event: any) => {
      const file = event.target.files[0];
      if (file) {
         setIsLogoUploading(true); // Start loading

         const logoFormData = new FormData();
         logoFormData.append("file", file);

         try {
            await uploadApplicationLogoUrl(
               logoFormData,
               document_id,
               access_user,
               navigate,
               location
            );
            const reader = new FileReader();
            reader.onload = () => {
               if (typeof reader.result === 'string') {
                  setPreviewImage(reader.result);
               }
            };
            reader.readAsDataURL(file);
         } catch (error) {
            console.error("Error uploading logo:", error);
         } finally {
            setIsLogoUploading(false); // Stop loading
         }
      }
   };



   const handleSave = async () => {
      console.log("Product Saved:", productName);
      if (!access_user) setIsModalOpen(true);
      if (access_user) {
         try {

            const application = productName;
            if (isFirstEntry) {
               // Call handleSaveDraft if it's the first entry
               const response = await createApplicationsDocument({ application }, access_user, navigate, location);
               console.log("Product Saved:", response.data.document_id);
               setDocument_id(response.data.document_id);
               setIsFirstEntry(false);
            } else {
               // Call handleUpdateDraft on subsequent changes
               const response = await updateApplicationsDocument({ application }, document_id, access_user, navigate, location);
               console.log("Product Updated:", response.data.document_id);
            }
         } catch (error) {
            const errorMessage =
               error?.response?.data?.error ||
               error?.response?.data ||
               error.message;
            toast.error(errorMessage);
         }
         setIsEditing(false);
      }
   };


   const handleCloseModal = () => {
      setIsModalOpen(false); // Close the modal
   };

   return (
      <>
         <div className="flex">
            <button
               onClick={() => setIsSelected(true)}
               className={`${isSelected
                  ? "bg-[#000000] text-white"
                  : "bg-[#ffff] text-black"
                  } border-[#000] border-[1px] rounded-l-lg h-[48px] max-w-[240px] w-full roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg hover:z-10 transition-all duration-300`}
            >
               New Product
            </button>

            <button
               onClick={() => setIsSelected(false)}
               className={`${!isSelected
                  ? "bg-[#000000] text-white"
                  : "bg-[#ffff] text-black"
                  } border-[#000] border-[1px] rounded-r-lg h-[48px] max-w-[240px] w-full roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg hover:z-10 transition-all duration-300`}
            >
               Last Product
            </button>
         </div>
         <div className="bg-banner bg-no-repeat bg-cover">
            <div className="container mx-auto px-4">
               <div className="flex flex-wrap items-center justify-between pt-28 pb-[71px] gap-8">
                  <div className="w-full lg:w-auto flex flex-col">
                     <input
                        type="text"
                        value={productName}
                        onChange={handleProductNameChange}
                        // placeholder="What’s your product called?"
                        className="text-white italic text-3xl md:text-5xl p-4 font-semibold bg-transparent border-none outline-none placeholder:text-white"
                     />
                     {isEditing && (
                        <div className="max-w-[70%] text-end">
                           <button
                              onClick={handleSave}
                              className="bg-gray-400 text-black text-xl px-3 py-1 rounded-xl"
                           >
                              Save
                           </button>
                        </div>
                     )}

                     <div className="relative w-[700px] mt-4 md:mt-16">
                        <div
                           className="border-white border-2 border-dashed bg-transparent rounded-[10px] h-[58px] text-white text-[18px] md:text-[20px] italic cursor-pointer outline-none flex items-center justify-between px-4 w-full"
                           onClick={() => setIsOpen(!isOpen)}
                        >
                           <div className="flex items-center gap-2 w-full overflow-hidden whitespace-nowrap">
                              {selectedColor ? (
                                 <>
                                    <span
                                       className="w-6 h-6 rounded-full border-2"
                                       style={{ backgroundColor: selectedColor.color, borderColor: "white" }}
                                    ></span>
                                    <span className="truncate">{selectedColor.value.charAt(0).toUpperCase() + selectedColor.value.slice(1)}</span>
                                 </>
                              ) : (
                                 <span className="truncate">Select the background that best suits the product’s branding.</span>
                              )}
                           </div>
                           <span className="text-white">{isOpen ? "▲" : "▼"}</span>
                        </div>

                        {isOpen && (
                           <ul className="absolute w-full bg-white border border-gray-600 rounded-lg mt-2 shadow-lg z-50 px-8">
                              {colors.map((color) => (
                                 <li
                                    key={color.value}
                                    className={`flex items-center gap-3 p-3 hover:bg-gray-300 cursor-pointer rounded-xl ${selectedColor?.value === color.value ? 'bg-gray-300' : ''}`}
                                    onClick={() => handleBackgroundChange(color)}
                                 >
                                    <span
                                       className="w-10 h-10  rounded-full border-2"
                                       style={{
                                          backgroundColor: color.color,
                                          borderColor: selectedColor?.value === color.value ? "black" : "transparent",
                                       }}
                                    ></span>
                                    <span className="text-black">{color.value.charAt(0).toUpperCase() + color.value.slice(1)}</span>
                                 </li>
                              ))}
                           </ul>
                        )}
                     </div>
                  </div>

                  <div className="w-full lg:w-auto">
                     <div className="flex flex-col items-center">
                        <button
                           className={`${previewImage ? "bg-transparent p-0 h-auto" : "bg-[#0000005C] py-[21px] h-[136px]"} text-white text-[15px] rounded-[10px] w-full max-w-[180px] lg:max-w-[180px] sm:px-[20px] flex flex-col justify-center items-center mx-auto lg:mx-0`}
                           onClick={handleButtonClick}
                           disabled={isLogoUploading} // Disable button while uploading
                        >
                           {isLogoUploading ? (
                              <div className="flex justify-center items-center min-h-[200px]">
                                 <svg
                                    className="animate-spin h-10 w-10 text-black"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                 >
                                    <circle
                                       className="opacity-25"
                                       cx="12"
                                       cy="12"
                                       r="10"
                                       stroke="currentColor"
                                       strokeWidth="4"
                                    ></circle>
                                    <path
                                       className="opacity-75"
                                       fill="currentColor"
                                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l-1.647 1.647C6.627 20.627 9.373 22 12 22v-4c-1.657 0-3-1.343-3-3v-1.709z"
                                    ></path>
                                 </svg>
                              </div>
                           ) : previewImage ? (
                              <img
                                 src={previewImage}
                                 alt="Uploaded Logo"
                                 className="h-[136px] w-[170px] rounded-[10px]"
                              />
                           ) : (
                              <>
                                 Add your logo
                                 <PlusWhiteIcon className="fill-white mt-4" />
                              </>
                           )}
                        </button>
                        <input
                           type="file"
                           ref={fileInputRef}
                           style={{ display: "none" }}
                           onChange={handleFileChange}
                           accept="image/*"
                        />
                     </div>
                  </div>

                  {isModalOpen && (
                     <ProductModel onClose={handleCloseModal} />
                  )}
               </div>
            </div >
         </div >
      </>
   );
};

export default Hero;
