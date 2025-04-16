import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setMainCTA, setSliderFiles } from "../../redux/slices/documentSlice";

const UploadSlider: React.FC = () => {
   const dispatch = useDispatch();
   const mainCTA = useSelector((state: RootState) => state.document.mainCTA);
   // const sliderFiles = useSelector((state: RootState) => state.document.sliderFiles);

   const [files, setFiles] = useState<File[]>([]);


   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;

      const selectedFiles = Array.from(event.target.files);

      if (files.length + selectedFiles.length > 5) {
         alert("You can upload a maximum of 5 files.");
         return;
      }

      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "video/mp4", "video/webm", "video/ogg"];
      const validFiles = selectedFiles.filter(file => allowedTypes.includes(file.type));

      if (validFiles.length === 0) {
         alert("Only images (jpg, png, gif) and videos (mp4, webm, ogg) are allowed.");
         return;
      }

      dispatch(setSliderFiles([...files, ...validFiles]));

      setFiles(prevFiles => [...prevFiles, ...validFiles]);
   };

   const handleMainCTAChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      dispatch(setMainCTA(value));
   };

   const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
   };

   return (
      <div className="relative" id="slider-div">
         <div className="container mx-auto px-4 relative z-10">
            <h2 className="italic leading-10 text-[22px] md:text-[33px] text-[#333333] text-center font-semibold max-w-[836px] w-full mx-auto mt-12 md:mt-24 relative z-10">
               Submit a brief two-liner stating your app's description and value proposition.
            </h2>

            {/* Main CTA Input */}
            <div className="relative flex justify-center w-full max-w-[370px] mx-auto mt-6 md:mt-10 z-10">
               <input
                  type="text"
                  value={mainCTA}
                  onChange={handleMainCTAChange}
                  className="text-[#333333] px-6 md:px-[44px] py-2 w-full md:py-[11px] z-10 !bg-[#BBBBB7] m-[1.5px] italic relative rounded-full text-[14px] md:text-[15px] font-normal focus:outline-none placeholder-black"
                  placeholder="Enter your main CTA for your website"
               />
               <span className="bg-[linear-gradient(#FF6A00,#FFFB00)] block absolute w-full h-full left-0 top-0 rounded-full"></span>
            </div>

            {/* Slider Container */}
            <div className="flex flex-col items-center justify-center mt-10 bg-[#0000008A] rounded-md text-white">
               <div className="slider-container w-full h-[50svh] sm:h-[80svh]">
                  <Slider {...settings}>
                     {files.map((file, index) => (
                        <div key={index} className="flex justify-center w-full">
                           {file.type.startsWith("image/") ? (
                              <img
                                 src={URL.createObjectURL(file)}
                                 alt={file.name}
                                 className="w-full h-[50svh] sm:h-[80svh] object-cover bg-cover rounded-md"
                              />
                           ) : (
                              <video
                                 src={URL.createObjectURL(file)}
                                 controls
                                 className="w-full h-[50svh] sm:h-[80svh] object-cover bg-cover rounded-md"
                              />
                           )}
                        </div>
                     ))}

                     {/* Upload Slot */}
                     {files.length < 5 && (
                        <div className="mt-8 md:mt-16 rounded-[10px] p-6 md:p-0 flex flex-col items-center">
                           <p className="text-[16px] md:text-[23px] font-light leading-[21px] w-full max-w-[616px] text-white text-center mx-auto mt-12 md:mt-[100px]">
                              Upload a main demo video of your product and any screenshots of UI or featured pages. You may also submit a marketing video here.
                           </p>
                           <div className="flex items-center justify-center">
                              <label className="text-[100px] md:text-[150px] font-normal text-white text-center mt-4 md:mt-0 cursor-pointer">
                                 +
                                 <input type="file" multiple accept="image/*,video/*" className="hidden w-full" onChange={handleFileChange} />
                              </label>
                           </div>
                           <p className="text-white italic text-[11px] md:text-[13px] font-light text-center mt-4">
                              Maximum 5 files. Only jpeg, png, gif, mp4, webm, ogg supported.
                           </p>
                        </div>
                     )}
                  </Slider>
               </div>
            </div>
         </div>
      </div>
   );
};

export default UploadSlider;
