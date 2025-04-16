import { RiReactjsLine } from "react-icons/ri";
import Hubbylogo from "../../assets/Images/hubbylogo1.png";
import { FaPlus } from "react-icons/fa6";
import { IoPersonCircleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import Serach1 from "../../assets/Images/search1.png";

const SearchHeader = () => {
   return (
      <>
         <div className="px-5 lg:px-16 py-4">
            <div className="flex flex-wrap justify-between">
               <div className="flex  items-end">
                  <img src={Hubbylogo} alt="Hubbylogo" />
                  <p className="text-[18px] text-[#333333] font-bold mb-0">
                     Search
                  </p>
               </div>
               <div className="flex gap-[14px] sm:gap-[10px]">
                  <button className="w-[46px] h-[46px] rounded-full bg-[#929191] flex justify-center items-center sm:w-[40px] sm:h-[40px]">
                     <RiReactjsLine className="text-3xl" />
                  </button>
                  <div className="relative">
                     <Link
                        to="./Landing"
                        className="w-[46px] h-[46px] rounded-full bg-[#929191] flex justify-center items-center sm:w-[40px] sm:h-[40px]"
                     >
                        <FaPlus className="text-2xl text-black" />
                     </Link>
                     <p className="text-[#929191] text-[11px] -ml-[20.15px] absolute whitespace-nowrap mt-1 sm:text-[10px] md:text-[9px]">
                        Submit a product
                     </p>
                  </div>
                  <div className="relative">
                     <button className="w-[46px] h-[46px] rounded-full bg-[#929191] flex justify-center items-center sm:w-[40px] sm:h-[40px]">
                        <IoPersonCircleSharp className="text-2xl" />
                     </button>
                  </div>
               </div>
            </div>
         </div>
           <div className="px-5 lg:px-16">
           <div className="flex flex-wrap justify-center items-center pt-28">
            <h2 className="text-[24px] sm:text-[28px] md:text-[30px] lg:text-[45px] xl:text-[55px] text-[#333333] font-extrabold w-full max-w-[833px]">
               What is the best AI tool for making videos under $20?|
            </h2>
            <img src={Serach1} alt="Serach1" />
         </div>
         <div className="flex flex-wrap justify-center gap-4 items-center mt-4">
            <button className="flex gap-2 items-center justify-between px-4 py-2 bg-[#000000C2] text-white rounded-full border-2 ">
               <span className="text-[13px]">Open Source</span>
               <FaPlus className="font-black"/>
               </button>
               <button className="flex gap-2 items-center justify-between px-4 py-2 bg-[#000000C2] text-white rounded-full border-2 ">
               <span className="text-[13px]">Easy to use</span>
               <FaPlus className="font-black"/>
               </button>
               <button className="flex gap-2 items-center justify-between px-4 py-2 bg-[#000000C2] text-white rounded-full border-2 ">
               <span className="text-[13px]">For businesses</span>
               <FaPlus className="font-black"/>
               </button>
               <button className="flex gap-2 items-center justify-between px-4 py-2 bg-[#000000C2] text-white rounded-full border-2 ">
               <span className="text-[13px]">Free</span>
               <FaPlus className="font-black"/>
            </button>
         </div>
       </div>
      </>
   );
};

export default SearchHeader;
