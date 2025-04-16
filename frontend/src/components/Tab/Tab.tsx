import { useState } from "react";
import TabDetails from "../TabDetails/TabDetails";

const Tab = () => {
   const [activeTab, setActiveTab] = useState("Preview");
   return (
      <>
         <div className="container mx-auto mt-10 md:mt-28 px-4">
            <div>
               <div className="flex flex-wrap justify-between md:justify-evenly items-center">
                  <div
                     onClick={() => setActiveTab("Preview")}
                     className="flex-1 text-center"
                  >
                     <h2
                        className={`font-black text-[24px] md:text-[50px] drop-shadow-[0px_4px_15.9px_#00000029] border-b-2 cursor-pointer pb-2 ${
                           activeTab === "Preview"
                              ? "text-white border-b-white"
                              : "text-[#FFFFFF85] border-b-transparent"
                        }`}
                     >
                        Preview
                     </h2>
                  </div>

                  <div
                     onClick={() => setActiveTab("Specs")}
                     className="flex-1 text-center"
                  >
                     <h2
                        className={`font-black text-[24px] md:text-[50px] drop-shadow-[0px_4px_15.9px_#00000029] border-b-2 cursor-pointer pb-2  ${
                           activeTab === "Specs"
                              ? "text-white border-b-white"
                              : "text-[#FFFFFF85] border-b-transparent"
                        }`}
                     >
                        Specs
                     </h2>
                  </div>

                  <div
                     onClick={() => setActiveTab("Resources")}
                     className="flex-1 text-center"
                  >
                     <h2
                        className={`font-black text-[24px] md:text-[50px] drop-shadow-[0px_4px_15.9px_#00000029] border-b-2 cursor-pointer pb-2 ${
                           activeTab === "Resources"
                              ? "text-white border-b-white"
                              : "text-[#FFFFFF85] border-b-transparent"
                        }`}
                     >
                        Resources
                     </h2>
                  </div>
               </div>
            </div>
         </div>

         <TabDetails activeTab={activeTab} />
      </>
   );
};

export default Tab;
