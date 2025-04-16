
import Image4 from "../../assets/Images/image4.png";
import Image5 from "../../assets/Images/image5.png";
import Image6 from "../../assets/Images/image6.png";

const SubmitNews = () => {
   return (
      <>
         <div className="container mx-auto px-4 mt-[130px]">
            <h2 className="text-[50px] text-white font-black">News</h2>
            <div className="flex flex-wrap xl:justify-between justify-center gap-3 mt-12 ">
               <div className="news-image bg-no-repeat bg-cover px-16 pt-20 pb-10 rounded-[10px]">
                  <p className="w-full max-w-[243px] text-[18px] text-white leading-[37px]">
                     Participate in our contest by Jan 31, 2024 for a chance to
                     win $10,000!
                  </p>
               </div>
               <div className="news1-image bg-no-repeat bg-cover px-16 pt-20 pb-10 rounded-[10px]">
                  <p className="w-full max-w-[243px] text-[18px] text-white leading-[37px]">
                     Android, Meet Suno
                  </p>
               </div>
               <div className="news2-image bg-no-repeat bg-cover px-16 pt-20 pb-10 rounded-[10px]">
                  <p className="w-full max-w-[296px] text-[18px] text-white leading-[37px]">
                     Ensuring Content Integrity: Suno Partners with Audible
                     Magic for User Uploads
                  </p>
               </div>
            </div>
            <div className="flex flex-wrap py-24 justify-center items-center gap-[50px]">
               <img src={Image4} alt="" />
               <img src={Image5} alt="" />
               <img src={Image6} alt="" />
            </div>
         </div>
      </>
   );
};

export default SubmitNews;
