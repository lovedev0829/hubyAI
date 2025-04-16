import  { useState } from "react";
import { FaGithub, FaMobileScreenButton } from "react-icons/fa6";
import { IoCloud } from "react-icons/io5";
import { RiComputerLine } from "react-icons/ri";
import { TbBulbFilled } from "react-icons/tb";
import Image17 from "../../assets/Images/image17.png"
const SubmitSpecsTab = () => {
   const [activeTab, setActiveTab] = useState("overview");
   return (
      <>
         <div className="container mx-auto px-4">
            <div className="flex justify-center gap-5 mt-28 flex-wrap ">
               <div className="relative w-full sm:w-auto">
                  <button
                     onClick={() => setActiveTab("overview")}
                     className={`text-white px-6 md:px-[44px] py-2 md:py-[8px] z-10 !bg-[#BBBBB7] m-[1.5px] relative rounded-[10px] text-[14px] md:text-[30px] font-medium w-full sm:w-auto ${
                        activeTab === "overview" ? "bg-[#FF6A00]" : ""
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
                     className={`text-white px-6 md:px-[44px] py-2 md:py-[8px] z-10 !bg-[#BBBBB7] m-[1.5px] relative rounded-[10px] text-[14px] md:text-[30px] font-medium w-full sm:w-auto ${
                        activeTab === "technical" ? "bg-[#FF6A00]" : ""
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
                     className={`text-white px-6 md:px-[44px] py-2 md:py-[8px] z-10 !bg-[#BBBBB7] m-[1.5px] relative rounded-[10px] text-[14px] md:text-[30px] font-medium w-full sm:w-auto ${
                        activeTab === "pricing" ? "bg-[#FF6A00]" : ""
                     }`}
                  >
                     Pricing
                  </button>
                  {activeTab === "pricing" && (
                     <span className="bg-[linear-gradient(#FF6A00,#FFFB00)] block absolute w-full h-full left-0 top-0 rounded-[10px]"></span>
                  )}
               </div>
               <div className="relative w-full sm:w-auto">
                  <button
                     onClick={() => setActiveTab("Benchmarks")}
                     className={`text-white px-6 md:px-[44px] py-2 md:py-[8px] z-10 !bg-[#BBBBB7] m-[1.5px] relative rounded-[10px] text-[14px] md:text-[30px] font-medium w-full sm:w-auto ${
                        activeTab === "Benchmarks" ? "bg-[#FF6A00]" : ""
                     }`}
                  >
                     Benchmarks
                  </button>
                  {activeTab === "Benchmarks" && (
                     <span className="bg-[linear-gradient(#FF6A00,#FFFB00)] block absolute w-full h-full left-0 top-0 rounded-[10px]"></span>
                  )}
               </div>
            </div>
            <div>
               {activeTab === "overview" && (
                  <div className="mt-24">
                     <div className="flex flex-wrap justify-between items-center">
                        <div>
                           <p className="text-[38px] text-[#666666]">
                              Suno is best for
                           </p>
                           <p className="text-[38px] text-[#666666] font-extrabold">
                              ease of use and fast iterations.
                           </p>
                           <p className="text-[18px] text-[#666666] w-full mt-5 max-w-[768px]">
                              Suno doesn't directly create songs in the way a
                              human songwriter might. It's more of a tool to
                              *assist* in the songwriting process. To use it
                              most effectively, it should be combined with
                              existing workflows as seen in the resources
                              section or tools like DAWs. For maximum quality
                              results, ensure you plan out each stage of the
                              song creation process and us eSuno to your
                              project’s specifcations.
                           </p>
                        </div>
                        <div className="flex gap-7">
                           <div className="!bg-[#FFFFFF2E] p-8 rounded-[25px] flex justify-center">
                              <TbBulbFilled className="text-white text-[38px]" />
                           </div>
                           <div className="!bg-[#FFFFFF2E] p-8 rounded-[25px] flex justify-center">
                              <FaMobileScreenButton className="text-white text-[38px]" />
                           </div>
                        </div>
                     </div>
                     <div>
                        <div className="flex  justify-center gap-6 md:gap-12 mt-20">
                           <div className="flex flex-wrap items-center gap-[30px]">
                              <p className="text-center sm:text-left text-white">
                                 Designed for:
                              </p>
                              <div className="border-white py-3 px-6 border-2 border-dashed bg-transparent rounded-[10px] cursor-pointer">
                                 <p className="text-white text-[16px] sm:text-[18px] md:text-[20px] italic mb-0">
                                    Marketing Professionals
                                 </p>
                              </div>
                              <div className="border-white py-3 px-6 border-2 border-dashed bg-transparent rounded-[10px] cursor-pointer">
                                 <p className="text-white text-[16px] sm:text-[18px] md:text-[20px] italic mb-0">
                                    Musicians
                                 </p>
                              </div>
                              <div className="border-white py-3 px-6 border-2 border-dashed bg-transparent rounded-[10px] cursor-pointer">
                                 <p className="text-white text-[16px] sm:text-[18px] md:text-[20px] italic mb-0">
                                    Filmmakers
                                 </p>
                              </div>
                              <div className="border-white py-3 px-6 border-2 border-dashed bg-transparent rounded-[10px] cursor-pointer">
                                 <p className="text-white text-[16px] sm:text-[18px] md:text-[20px] italic mb-0">
                                    Filmmakers
                                 </p>
                              </div>
                              <div className="border-white py-3 px-6 border-2 border-dashed bg-transparent rounded-[10px] cursor-pointer">
                                 <p className="text-white text-[16px] sm:text-[18px] md:text-[20px] italic mb-0">
                                    Creatives
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="flex justify-center mt-12 sm:mt-20 px-4">
                        <div className="bg-[#FFFFFF2E] p-6 sm:p-10 rounded-[25px] w-full sm:w-auto">
                           <p className="text-white text-[18px] sm:text-[24px] font-semibold mb-0">
                              Features
                           </p>
                           <div className="flex flex-wrap gap-4 sm:gap-3 mt-5">
                              <div className="px-6 py-3 bg-[#000000B0] rounded-full w-full sm:w-auto text-center">
                                 <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                    AI music generation
                                 </p>
                              </div>
                              <div className="px-6 py-3 bg-[#000000B0] rounded-full w-full sm:w-auto text-center">
                                 <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                    Instrumental
                                 </p>
                              </div>
                              <div className="px-6 py-3 bg-[#000000B0] rounded-full w-full sm:w-auto text-center">
                                 <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                    Custom mode
                                 </p>
                              </div>
                              <div className="px-6 py-3 bg-[#000000B0] rounded-full w-full sm:w-auto text-center">
                                 <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                    Public library
                                 </p>
                              </div>
                              <div className="px-6 py-3 bg-[#000000B0] rounded-full w-full sm:w-auto text-center">
                                 <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                    Persona
                                 </p>
                              </div>
                           </div>
                           <div className="flex flex-wrap gap-4 sm:gap-3 mt-5">
                              <div className="px-6 py-3 bg-[#000000B0] rounded-full w-full sm:w-auto text-center">
                                 <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                    Intuitive interface
                                 </p>
                              </div>
                              <div className="px-6 py-3 bg-[#000000B0] rounded-full w-full sm:w-auto text-center">
                                 <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                    Idea generator
                                 </p>
                              </div>
                              <div className="px-6 py-3 bg-[#000000B0] rounded-full w-full sm:w-auto text-center">
                                 <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                    Covers
                                 </p>
                              </div>
                              <div className="px-6 py-3 bg-[#000000B0] rounded-full w-full sm:w-auto text-center">
                                 <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                    Cover art
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                     <p className="text-white text-[18px] text-center mt-24">
                        Available via:
                     </p>
                     <div className="flex flex-wrap justify-center gap-8 md:gap-20 mt-12">
                        <div className="w-full sm:w-auto">
                           <div className="bg-[#FFFFFF2E] p-8 rounded-[25px] flex justify-center">
                              <IoCloud className="text-white text-[38px]" />
                           </div>
                        </div>

                        <div className="w-full sm:w-auto">
                           <div className="!bg-[#FFFFFF2E] p-8 rounded-[25px] flex justify-center">
                              <FaMobileScreenButton className="text-white text-[38px]" />
                           </div>
                        </div>
                        <div className="w-full sm:w-auto">
                           <div className="bg-[#FFFFFF2E] p-8 rounded-[25px] flex justify-center">
                              <RiComputerLine className="text-white text-[38px]" />
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
                              <p className="text-white text-[18px] sm:text-[24px]">
                                 Powered By
                              </p>
                              <div className="lg:flex gap-4 sm:gap-3 mt-5">
                                 <div className="px-6 py-3 bg-[#000000B0] rounded-[25px]">
                                    <p className="text-white text-[16px] sm:text-[18px] font-bold mb-0">
                                       Bark
                                    </p>
                                    <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                       Developed by Suno
                                    </p>
                                    <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                       Text-to-Audio
                                    </p>
                                    <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                       Open Source
                                    </p>
                                    <p className="text-white text-[16px] sm:text-[18px] font-bold">
                                       v4
                                    </p>
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
                                          <div className="px-6 py-3 bg-[#000000B0] rounded-full text-center">
                                             <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                                Open
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex justify-center mt-12 sm:mt-20 px-4">
                                    <div className="bg-[#FFFFFF2E] py-6 px-7 rounded-[25px]">
                                       <p className="text-white text-[18px] sm:text-[24px]  mb-0">
                                          Programming Languages
                                       </p>
                                       <div className="lg:flex gap-4 sm:gap-3 mt-5">
                                          <div className="px-6 py-3 bg-[#000000B0] rounded-full text-center">
                                             <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                                Jupyter Notebook
                                             </p>
                                          </div>
                                          <div className="px-6 py-3 bg-[#000000B0] rounded-full flex justify-center items-center">
                                             <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                                Python
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex justify-center mt-12 sm:mt-20 px-4">
                                    <div className="bg-[#FFFFFF2E] py-6 px-7 rounded-[25px]">
                                       <p className="text-white text-[18px] sm:text-[24px]  mb-0">
                                          Dependencies
                                       </p>
                                       <div className="lg:flex  gap-4 lg:gap-3 mt-5">
                                          <div className="px-6 py-3 bg-[#000000B0] rounded-full  text-center">
                                             <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                                PyTorch
                                             </p>
                                          </div>
                                          <div className="px-6 py-3 bg-[#000000B0] rounded-full text-center">
                                             <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                                FFmpeg
                                             </p>
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
                                          <div className="px-6 py-3 bg-[#000000B0] rounded-full  text-center">
                                             <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                                None
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex justify-center mt-12 sm:mt-6 px-4">
                                    <div className="bg-[#FFFFFF2E] py-6 px-7 rounded-[25px] ">
                                       <p className="text-white text-[18px] sm:text-[24px] ">
                                          Operating Systems
                                       </p>
                                       <div className="lg:flex gap-4 sm:gap-3 mt-5">
                                          <div className="px-6 py-3 bg-[#000000B0] rounded-full text-center">
                                             <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                                Windows
                                             </p>
                                          </div>
                                          <div className="px-6 py-3 bg-[#000000B0] rounded-full text-center">
                                             <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                                Linux
                                             </p>
                                          </div>
                                          <div className="px-6 py-3 bg-[#000000B0] rounded-full  text-center">
                                             <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                                MacOS
                                             </p>
                                          </div>
                                          <div className="px-6 py-3 bg-[#000000B0] rounded-full  text-center">
                                             <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                                iOS
                                             </p>
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
                                          <div className="px-6 flex gap-2 py-3 bg-[#000000B0] rounded-full  text-center">
                                             <p className="text-[#FF8C00] text-[16px] sm:text-[18px]">
                                                Github
                                             </p>
                                             <FaGithub className="text-[20px] sm:text-[25px]  mb-0" />
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="xl:flex">
                                 <div className="flex justify-center mt-12 sm:mt-6 px-4">
                                    <div className="bg-[#FFFFFF2E] py-6 px-7 rounded-[25px] ">
                                       <p className="text-white text-[18px] sm:text-[24px] ">
                                          Local Runtime
                                       </p>
                                       <div className="lg:flex gap-4 sm:gap-3 mt-5">
                                          <div className="px-6 flex gap-12 py-3 bg-[#000000B0] rounded-full text-center">
                                             <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                                Minimum GPU:
                                             </p>
                                             <p className="text-white text-[16px] sm:text-[18px] font-bold mb-0">
                                                8GB VRAM
                                             </p>
                                          </div>
                                          <div className="px-6 flex gap-12 py-3 bg-[#000000B0] rounded-full  text-center">
                                             <p className="text-white text-[16px] sm:text-[18px] mb-0">
                                                Optimal GPU:
                                             </p>
                                             <p className="text-white text-[16px] sm:text-[18px] font-bold mb-0">
                                                12GB VRAM
                                             </p>
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
                  <div className="mt-20">
                     <div className="flex flex-wrap justify-center items-center gap-[81px]">
                        <div>
                           <p className="text-[25px] w-full max-w-[266px] font-medium leading-[31px] text-[#333333]">The pricing is fair and the free tier offers a fair amount of generations, so you can experiment without spending a dollar. </p>
                        </div>
                        <div>
                           <img src={Image17} alt="" />
                        </div>
                     </div>
                </div>
               )}
            </div>
         </div>
      </>
   );
};

export default SubmitSpecsTab;
