import { useDispatch, useSelector } from "react-redux";
import Image3 from "../../assets/Images/image3.png";
import { RootState } from "../../redux/store";
import { setDescriptionCTA, setPersonalMessage } from "../../redux/slices/documentSlice";
// import NeonEffect from "../Animation/neon/NeonEffect";

const TeamMate = () => {
   const dispatch = useDispatch();
   const descriptionCTA = useSelector((state: RootState) => state.document.descriptionCTA);
   const personalMessage = useSelector((state: RootState) => state.document.personalMessage);

   const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setDescriptionCTA(e.target.value));
   };
   return (
      <div id="slider1-div">
         {/* Add NeonEffect component if needed */}
         {/* <div className="relative"> */}
         {/*   <NeonEffect /> */}
         {/* </div> */}

         <div className="container mx-auto px-4 mt-28">
            <div className="flex flex-wrap lg:flex-nowrap justify-between mt-12 gap-8">
               <div className="w-full lg:w-auto">
                  <textarea
                     value={personalMessage}
                     onChange={(e) => dispatch(setPersonalMessage(e.target.value))}
                     placeholder="Enter a personal message that everyone will be able to read. Use this as an opportunity to share your vision, goals, or simply say hello."
                     rows={5}
                     className="w-full placeholder:text-[#333333]  text-[18px]  md:text-[23px] italic font-normal bg-transparent border-none outline-none resize-none"
                  />
                  <div className="flex gap-6 justify-center mt-6 md:mt-9 items-start">
                     <img src={Image3} alt="Teammate" className="w-16 md:w-auto" />
                     <div className="text-center">
                        <div className="bg-[#00000024] rounded-full w-[70px] md:w-[85px] h-[70px] md:h-[85px] flex justify-center items-center">
                           <svg
                              className="fill-white"
                              width="24"
                              height="24"
                              viewBox="0 0 39 39"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path
                                 d="M38.5655 22.9047H22.5905V39.1047H16.2155V22.9047H0.315528V17.1297H16.2155V0.854684H22.5905V17.1297H38.5655V22.9047Z"
                                 fill="white"
                              />
                           </svg>
                        </div>
                        <p className="text-[10px] md:text-[12px] text-[#333333] italic font-normal mt-2">
                           Invite a teammate
                        </p>
                     </div>
                  </div>
               </div>
               <div className="bg-[#0000008A] rounded-[25px] w-full lg:w-auto max-w-[696px] h-auto p-6 md:p-8 flex flex-col justify-center items-center">
                  <input
                     type="text"
                     value={descriptionCTA}
                     onChange={handleDescriptionChange}
                     className="text-[20px] md:text-[25px] leading-[28px] md:leading-[34px] italic bg-transparent text-white font-normal text-center max-w-[620px] placeholder:text-white focus:outline-none"
                     placeholder="Enter a brief description of the page you chose to feature above|"
                  />
                  <div className="mt-6">
                     <button className="border border-white text-white px-6 md:px-8 py-2 md:py-3 text-center rounded-[21px]">
                        Make a CTA
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default TeamMate;
