import Rating from "../../assets/Images/4.4 rating.png";

const TopResult = () => {
   return (
      <div className="px-5 lg:px-16 mt-28">
         <h2 className="text-[30px] text-[#333333] font-bold">Top Result</h2>
         <div className="Top-result bg-no-repeat bg-cover rounded-[10px] mt-4">
            <div className="flex flex-wrap justify-between items-center px-16 py-10">
               <div>
                  <h2 className="text-[50px] text-white font-medium">
                     Luma Labs
                  </h2>
                  <p className="text-[18px] text-white italic w-full max-w-[628px]">
                     This app is highlighted becuase of its versatility, from
                     being able to generate new images to also having 3d
                     generation and video technologies. It is a great place to
                     start exploring the possibilities.
                  </p>
               </div>
               <div>
                  <img src={Rating} alt="Rating" />
               </div>
               </div>
               <div className="flex justify-end items-end pt-[20%] pr-16 pb-14">
                   <button className="bg-[#000000C2] text-[13px] text-white rounded-full px-4 py-3">Explore Luma Labs</button>
               </div>
         </div>
      </div>
   );
};

export default TopResult;
