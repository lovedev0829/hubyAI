
// import { LuAudioLines, LuMessageSquareQuote, LuMessageSquareWarning } from "react-icons/lu";
// import { LuAudioLines } from "react-icons/lu";
import SubmitSpecsTab from "../SubmitSpecsTab/SubmitSpecsTab";
// import Image from "../../Assets/Image/image18.png";
// import Line from "../../Assets/Image/Line 44.png";
// import I5 from "../../Assets/Image/5.png";
import { LuAudioLines } from "react-icons/lu";
import { LuMessageSquareQuote } from "react-icons/lu";
import { LuMessageSquareWarning } from "react-icons/lu"
import { IoMdThumbsDown, IoMdThumbsUp } from "react-icons/io";

const SubmitTabDetails = ({ activeTab }) => {
   return (
      <div>
         {" "}
         {activeTab === "Preview" && (
            <div className="md:flex items-center mt-[100px]">
               <div className="tab-image bg-no-repeat bg-cover flex justify-center py-44 w-full">
                  <LuAudioLines className="text-[30px] md:text-[65px] text-white" />
               </div>
               <div className="tab1-image bg-no-repeat bg-cover flex justify-center py-44 w-full">
                  <LuAudioLines className="text-[30px] md:text-[65px] text-white" />
               </div>
               <div className="tab2-image bg-no-repeat bg-cover flex justify-center py-44 w-full">
                  <LuAudioLines className="text-[30px] md:text-[65px] text-white" />
               </div>
            </div>
         )}
         {activeTab === "Specs" && <SubmitSpecsTab />}
         {activeTab === "Reviews" && (
            <div className="container mx-auto px-4">
               <div className="mt-40">
                  <h2 className="text-[38px] text-[#333333]">
                     huby <span className="font-extrabold">Review</span>
                  </h2>
                  <p className="text-[18px] text-[#333333] w-full max-w-[781px] mt-5 leading-6">
                     Despite facing some challenges such as copyright laws, Suno
                     was a very pleasant app for us to use and continue to
                     experiument with as they continue improving quality and
                     capabilities.
                  </p>
               </div>
               <div className="mt-5">
                  <div className="flex flex-wrap xl:justify-between justify-center gap-4">
                     <div className="bg-[#FFFFFF2E] rounded-[10px]">
                        <div className="  flex items-center justify-center  p-3">
                           <div className="flex justify-center flex-col">
                              <div className=" flex items-center gap-1 justify-end">
                                 <div className="w-0 h-0 border-solid border-transparent border-b-[8px] border-l-[6px] border-r-[6px] border-b-[#00E331]" />
                                 <span className="text-[#00E331] font-extrabold text-[25px]">
                                    2.5
                                 </span>
                              </div>
                              <div className="flex items-center gap-2 pb-6">
                                 <div
                                    className="text-6xl md:text-8xl font-black text-white stroke-2 stroke-black"
                                    style={{
                                       WebkitTextStroke: "2px black",
                                    }}
                                 >
                                    4.4
                                 </div>
                                 <div className="w-[3px] h-16 md:h-24 bg-white rotate-[25deg] transform origin-center" />
                                 <div
                                    className="text-6xl md:text-8xl font-black text-white stroke-2 stroke-black"
                                    style={{
                                       WebkitTextStroke: "2px black",
                                    }}
                                 >
                                    5
                                 </div>
                              </div>
                              <div className="">
                                 <span className="text-[#333333] text-[18px] ">
                                    January 6, 2024
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="bg-[#FFFFFF2E] rounded-[10px] py-2 pl-[32px] pr-36">
                        <p className="text-[#333333] text-[24px]">
                           User reviews
                        </p>
                        <p className="text-[18px] text-[#333333] mt-4 w-full max-w-[292px]">
                           We would like people to try out our latest UI and let
                           us know your thoughts specifically about the
                           onboarding process. Looking forward to hear! We would
                           like people to try out our latest UI.
                        </p>
                     </div>
                     <div className="bg-[#FFFFFF2E] rounded-[10px] p-3">
                        <div>
                           <div className="flex justify-center flex-col">
                              <p className="text-[24px] text-[#333333]">
                                 Feedback request
                              </p>
                              <p className="w-full max-w-[206px] text-[18px] mt-5 text-[#333333]">
                                 We would like people to try out our latest UI
                                 and let us know your thoughts
                              </p>
                              <div className="relative flex justify-center w-full max-w-[159px] mx-auto mt-6 md:mt-10 z-10">
                                 <button className="text-[#333333] px-6 md:px-[28px] py-2 md:py-[11px] z-10 !bg-[#BBBBB7] m-[1.5px] relative rounded-full text-[14px] md:text-[18px] font-normal">
                                    Participate
                                 </button>
                                 <span className="bg-[linear-gradient(#FF6A00,#FFFB00)] block absolute w-full h-full left-0 top-0 rounded-full"></span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div>
                     <p className="text-[18px] text-white mt-14 text-center">
                        Leave a review
                     </p>
                  </div>
                  <div className="flex flex-wrap justify-center lg:gap-[116px] gap-5 mt-12">
                     <div className="bg-[#FFEAD563] p-3 rounded-full border border-orange-400">
                        <IoMdThumbsUp className="text-[40px] text-white" />
                     </div>
                     <div className="bg-[#FFEAD563] p-3 rounded-full border border-orange-400">
                        <IoMdThumbsDown  className="text-[40px] text-white" />
                     </div>
                     <div className="bg-[#FFEAD563] p-3 rounded-full border border-orange-400">
                        <LuMessageSquareQuote  className="text-[40px] text-white" />
                     </div>
                     <div className="bg-[#FFEAD563] p-3 rounded-full border border-orange-400">
                        <LuMessageSquareWarning  className="text-[40px] text-white" />
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default SubmitTabDetails;
