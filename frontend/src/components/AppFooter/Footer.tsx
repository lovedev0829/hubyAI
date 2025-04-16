

import Image4 from "../../assets/Images/image4.png";
import Image5 from "../../assets/Images/image5.png";
import Image6 from "../../assets/Images/image6.png";
const Footer = () => {
  return (
   <div className="container mx-auto pb-40 px-4">
   <div className="flex justify-center mt-12 sm:mt-28">
      <div className="grid grid-cols-1 sm:grid-cols-3 justify-center items-center gap-[33px]">
         <img src={Image4} alt="" />
         <img src={Image5} alt="" />
         <img src={Image6} alt="" />
      </div>                                               
   </div>

   <div className="flex justify-center mt-16 sm:mt-28">
      <div className="relative">
         <a href="./Submitpage"
            className="text-[#FFFFFF85] px-6 sm:px-[44px] border-[2px]  border-orange-500 py-6 sm:py-9 z-10 !bg-[#BBBBB7] m-[1.5px]
      relative rounded-full text-[20px] sm:text-[38px] font-bold no-underline"
         >
            Submit for review
         </a>

         {/* <span className="bg-[linear-gradient(#FF6A00,#FFFB00)] block absolute w-full h-full left-0 top-0 rounded-full"></span> */}
      </div>
      {/* <div className="relative hidden ">
         <button
            className="text-[#333333] px-6 sm:px-[44px] py-2 sm:py-[8px] z-10 !bg-[#BBBBB7] m-[1.5px]
      relative rounded-full text-[14px] sm:text-[15px] font-normal"
         >
            Enter URL of a page you want to feature
         </button>
         <span className="bg-[linear-gradient(#FF6A00,#FFFB00)] block absolute w-full h-full left-0 top-0 rounded-full"></span>
      </div> */}
   </div>
   <div className="flex justify-center mt-6 sm:mt-24">
      <p className="text-[12px] sm:text-[13px] italic text-[#333333]">
         Complete Resources section first*
      </p>
   </div>
</div>
  )
}

export default Footer