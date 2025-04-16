
import Image7 from "../../assets/Images/image7.png";
import Image8 from "../../assets/Images/image8.png";
import Image44 from "../../assets/Images/4.4.png";

const SubmitHero = () => {
   return (
      <div className="bg-banner bg-no-repeat bg-cover">
         <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-20">
               <div>
                  <img src={Image7} alt="" />
               </div>
               <div>
                  <img src={Image44} alt="" />
                  <p className="text-white text-[18px] italic text-right drop-shadow:[0px_4px_4px_#00000040] mt-3">
                     huby Rating
                  </p>
               </div>
               <div>
                  <img src={Image8} alt="" />
                  <p className="text-white text-[18px] italic text-center drop-shadow:[0px_4px_4px_#00000040] mt-3 w-full max-w-[168px]">
                     Most Innovative Product of 2024{" "}
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default SubmitHero;
