import { FaPlus } from "react-icons/fa6";

const SearchResults = () => {
   return (
      <div className="px-5 lg:px-16 mt-28">
         <div className="flex flex-wrap justify-evenly items-center gap-4">
            <div>
               <h2 className="text-[#333333] text-[50px] font-extrabold w-full max-w-[356px] text-center">
                  All search results
               </h2>
               <p className="text-[18px] italic text-[#333333] font-light mt-6 text-center">
                  Filter by
               </p>
               <div className="flex flex-wrap gap-3">
                  <button className="bg-[#000000C2] text-white text-[13px] px-4 py-3 rounded-full">
                     Video Creation
                  </button>
                  <button className="border-black border text-[#333333] text-[13px] px-4 py-3 rounded-full">
                     Video Creation
                  </button>
               </div>
            </div>
            <div className="flex flex-col  gap-4">
               <div className="bg-[#FF943D] flex flex-wrap lg:gap-5 gap-3 items-center justify-between pl-20 py-3 rounded-[10px] pr-9">
                  <h2 className="text-[25px] text-white font-bold mb-0">
                     RunwayML
                  </h2>
                  <p className="text-[18px] italic w-full max-w-[215px] text-white mb-0">
                     Instantly create images text and video with text
                  </p>
                  <button className="w-[46px] h-[46px] rounded-full bg-white flex justify-center items-center sm:w-[40px] sm:h-[40px]">
                     <FaPlus className="text-2xl text-black" />
                  </button>
                  <p className="text-[15px] font-black text-white mb-0">
                     4.4 rating
                  </p>
               </div>
               <div className="bg-[#FF6A00] flex flex-wrap lg:gap-5 gap-3 items-center justify-between pl-20 py-3 rounded-[10px] pr-9">
                  <h2 className="text-[25px] text-white font-bold mb-0">
                     Luma Labs
                  </h2>
                  <p className="text-[18px] italic w-full max-w-[215px] text-white mb-0">
                     Instantly create images text and video with text
                  </p>
                  <button className="w-[46px] h-[46px] rounded-full bg-white flex justify-center items-center sm:w-[40px] sm:h-[40px]">
                     <FaPlus className="text-2xl text-black" />
                  </button>
                  <p className="text-[15px] font-black text-white mb-0">
                     4.4 rating
                  </p>
               </div>
               <div className="bg-[#FF943D] flex flex-wrap lg:gap-5 gap-3 items-center justify-between pl-20 py-3 rounded-[10px] pr-9">
                  <h2 className="text-[25px] text-white font-bold mb-0">
                     RunwayML
                  </h2>
                  <p className="text-[18px] italic w-full max-w-[215px] text-white mb-0">
                     Instantly create images text and video with text
                  </p>
                  <button className="w-[46px] h-[46px] rounded-full bg-white flex justify-center items-center sm:w-[40px] sm:h-[40px]">
                     <FaPlus className="text-2xl text-black" />
                  </button>
                  <p className="text-[15px] font-black text-white mb-0">
                     4.4 rating
                  </p>
               </div>
               <div className="bg-[#FF6A00] flex flex-wrap lg:gap-5 gap-3 items-center justify-between pl-20 py-3 rounded-[10px] pr-9">
                  <h2 className="text-[25px] text-white font-bold mb-0">
                     Luma Labs
                  </h2>
                  <p className="text-[18px] italic w-full max-w-[215px] text-white mb-0">
                     Instantly create images text and video with text
                  </p>
                  <button className="w-[46px] h-[46px] rounded-full bg-white flex justify-center items-center sm:w-[40px] sm:h-[40px]">
                     <FaPlus className="text-2xl text-black" />
                  </button>
                  <p className="text-[15px] font-black text-white mb-0">
                     4.4 rating
                  </p>
               </div>
               <div className="bg-[#FF943D] flex flex-wrap lg:gap-5 gap-3 items-center justify-between pl-20 py-3 rounded-[10px] pr-9">
                  <h2 className="text-[25px] text-white font-bold mb-0">
                     RunwayML
                  </h2>
                  <p className="text-[18px] italic w-full max-w-[215px] text-white mb-0">
                     Instantly create images text and video with text
                  </p>
                  <button className="w-[46px] h-[46px] rounded-full bg-white flex justify-center items-center sm:w-[40px] sm:h-[40px]">
                     <FaPlus className="text-2xl text-black" />
                  </button>
                  <p className="text-[15px] font-black text-white mb-0">
                     4.4 rating
                  </p>
               </div>
               <div className="bg-[#FF6A00] flex flex-wrap lg:gap-5 gap-3 items-center justify-between pl-20 py-3 rounded-[10px] pr-9">
                  <h2 className="text-[25px] text-white font-bold mb-0">
                     Luma Labs
                  </h2>
                  <p className="text-[18px] italic w-full max-w-[215px] text-white mb-0">
                     Instantly create images text and video with text
                  </p>
                  <button className="w-[46px] h-[46px] rounded-full bg-white flex justify-center items-center sm:w-[40px] sm:h-[40px]">
                     <FaPlus className="text-2xl text-black" />
                  </button>
                  <p className="text-[15px] font-black text-white mb-0">
                     4.4 rating
                  </p>
               </div>
            </div>
           </div>
           {/* <div className="relative bg-gray-900 h-96 flex items-center justify-center overflow-hidden">
    
      <div className="absolute inset-0 flex space-x-4 animate-move">
        {[...Array(15)].map((_, index) => (
          <div
            key={index}
            className={`rounded-full bg-black p-6 flex justify-center items-center ${
              index % 2 === 0 ? 'w-32 h-32' : 'w-24 h-24'
            }`}
          >
            
            <div className="grid grid-cols-3 gap-1">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 ${
                    i % 3 === 0 ? 'bg-yellow-400' : 'bg-pink-500'
                  } rounded-full`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>

   
      <div className="z-10 relative">
        <button className="px-6 py-2 border border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300">
          Explore Full Library
        </button>
      </div>
    </div> */}
      </div>
   );
};

export default SearchResults;
