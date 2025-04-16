
import { RootState } from "../../redux/store";
import { FiPlus } from "react-icons/fi";
import { IoIosLink } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setNewsLink, setNewsAnnouncement } from "../../redux/slices/documentSlice";
// import OrbBackground from "../Animation/orbs/OrbEffect";

const News = () => {
   const dispatch = useDispatch();

   const documentState = useSelector((state: RootState) => state.document);

   // Update newsLink in Redux store and local state
   const handleNewsLinkChange = (e) => {
      const value = e.target.value;
      dispatch(setNewsLink(value)); // Dispatch to Redux store
   };

   // Update newsAnnouncement in Redux store and local state
   const handleNewsAnnouncementChange = (e) => {
      const value = e.target.value;
      dispatch(setNewsAnnouncement(value)); // Dispatch to Redux store
   };
   return (
      <>
         {/* <div className="relative">
          <OrbBackground />
          </div> */}
         <div className="container mx-auto px-4">
            <h2 className="font-semibold text-[22px] sm:text-[33px] w-full max-w-[549px] text-[#333333] mt-12 sm:mt-28">
               Share news, events, and any updates
               <span className="font-normal">
                  {" "}
                  about your product with the community.
               </span>
            </h2>
            <p className="w-full max-w-[569px] text-[18px] sm:text-[23px] text-[#333333] mt-4 sm:mt-6">
               This can be anything from announcing your latest feature, to
               promoting a community hackathon or contest.
            </p>

            <div className="flex flex-wrap justify-center items-start gap-6 mt-16 sm:mt-28">
               <button className="flex gap-3 text-white bg-[#000000CC] items-center px-6 py-3 text-[16px] sm:text-[18px] rounded-[10px]">
                  {/* Add a Link */}
                  <input type="text" className="w-full max-w-[100px] text-left bg-transparent focus:outline-none placeholder:text-white" placeholder="Add a Link "
                     value={documentState.news.newsLink}
                     onChange={handleNewsLinkChange}
                  />
                  <IoIosLink className="text-[20px] sm:text-[25px] text-white" />
               </button>
               <button className="flex gap-3 text-white bg-[#000000CC] items-center px-6 py-3 text-[16px] sm:text-[18px] rounded-[10px]">
                  {/* <p className="w-full max-w-[276px] text-left">
                  Create announcement with image, caption, or link.
               </p> */}
                  <input type="text" className="w-full max-w-[276px] text-left bg-transparent focus:outline-none placeholder:text-white" placeholder="Create announcement with image, caption, or link."
                     value={documentState.news.newsAnnouncement}
                     onChange={handleNewsAnnouncementChange}
                  />
                  <FiPlus className="text-[20px] sm:text-[25px] text-white" />
               </button>
            </div>
            <div className="flex flex-col items-start sm:items-end mt-28 sm:mt-40">
               <h2 className="font-semibold text-[22px] sm:text-[33px] w-full max-w-[549px] text-[#333333] text-left sm:text-right">
                  Request focused feedback for your product
               </h2>
               <p className="w-full max-w-[569px] text-[18px] sm:text-[23px] text-[#333333] mt-4 sm:mt-6 text-left sm:text-right">
                  This can be anything from announcing your latest feature, to
                  promoting a community hackathon or contest.
               </p>
            </div>

            <div className="flex justify-center mt-16 sm:mt-28">
               <h2 className="font-semibold text-[22px] md:text-[26px] lg:text-[33px] w-full max-w-[850px] text-[#333333] mt-8 sm:mt-28 leading-[30px] sm:leading-[41px] text-center sm:text-left">
                  Edit this example:{" "}
                  <span className="font-normal">
                     {" "}
                     We recently updated our UI and specifically would like
                     feedback in terms of onboarding experience usability and
                     intuitiveness. Please mention any ideas for improving the
                     navigation system!
                  </span>
               </h2>
            </div>
         </div>
      </>
   );
};

export default News;
