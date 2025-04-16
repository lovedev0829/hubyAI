import { useDispatch, useSelector } from "react-redux";
import { DownArrowIcon } from "../../assets/Icons/AllSvg";
import { RootState } from "../../redux/store";
import { setSourceType, setPricingType, setModelType, setTraction } from "../../redux/slices/documentSlice";

const Webmobile = () => {
   const dispatch = useDispatch();
   const sourceType = useSelector((state: RootState) => state.document.sourceType);
   const pricingType = useSelector((state: RootState) => state.document.pricingType);
   const modelType = useSelector((state: RootState) => state.document.modelType);
   const traction = useSelector((state: RootState) => state.document.traction);

   const handleSourceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setSourceType(e.target.value));
   };

   const handlePricingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setPricingType(e.target.value));
   };

   const handleModelTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setModelType(e.target.value));
   };

   const handleTractionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setTraction(e.target.value));
   };

   return (
      <div className="container mx-auto px-4">
         <div className="flex flex-wrap pt-[62px] justify-between gap-4 md:gap-6 lg:gap-8">
            <div className="relative flex-shrink-0">
               <button className="text-[#333333] px-[44px] py-[11px] z-10 !bg-[#BBBBB7] m-[1.5px] italic relative rounded-[10px] text-[18px] md:text-[20px] font-medium">
                  Web & Mobile
               </button>
               <span className="bg-[linear-gradient(#FF6A00,#FFFB00)] block absolute w-full h-full left-0 top-0 rounded-[10px]"></span>
            </div>

            {/* Source Type Select */}
            <div className="relative flex-shrink-0 w-full md:w-auto">
               <select
                  value={sourceType}
                  onChange={handleSourceTypeChange}
                  className="w-full border-black border-2 border-dashed bg-transparent rounded-[10px] h-[58px] text-[#333333] pl-[28px] text-[18px] md:text-[20px] italic appearance-none pr-12 cursor-pointer outline-none"
               >
                  <option value="select" className="text-black">
                     Source Type
                  </option>
                  <option value="Open Source" className="text-black">
                     Open Source
                  </option>
                  <option value="Closed Source" className="text-black">
                     Closed Source
                  </option>
               </select>
               <button className="absolute right-6 top-1/2 transform -translate-y-1/2">
                  <DownArrowIcon className="fill-[#333333]" />
               </button>
            </div>

            {/* Pricing Type Select */}
            <div className="relative flex-shrink-0 w-full md:w-auto">
               <select
                  value={pricingType}
                  onChange={handlePricingTypeChange}
                  className="w-full border-black border-2 border-dashed bg-transparent rounded-[10px] h-[58px] text-[#333333] pl-[28px] text-[18px] md:text-[20px] italic appearance-none pr-12 cursor-pointer outline-none"
               >
                  <option value="select" className="text-black">
                     Pricing Type
                  </option>
                  <option value="Pricing A" className="text-black">
                     Pricing A
                  </option>
                  <option value="Pricing B" className="text-black">
                     Pricing B
                  </option>
                  <option value="Pricing C" className="text-black">
                     Pricing C
                  </option>
               </select>
               <button className="absolute right-6 top-1/2 transform -translate-y-1/2">
                  <DownArrowIcon className="fill-[#333333]" />
               </button>
            </div>

            {/* Model Type Select */}
            <div className="relative flex-shrink-0 w-full md:w-auto">
               <select
                  value={modelType}
                  onChange={handleModelTypeChange}
                  className="w-full border-black border-2 border-dashed bg-transparent rounded-[10px] h-[58px] text-[#333333] pl-[28px] text-[18px] md:text-[20px] italic appearance-none pr-12 cursor-pointer outline-none"
               >
                  <option value="select" className="text-black">
                     Model Type
                  </option>
                  <option value="Model 1" className="text-black">
                     Model 1
                  </option>
                  <option value="Model 2" className="text-black">
                     Model 2
                  </option>
                  <option value="Model 3" className="text-black">
                     Model 3
                  </option>
               </select>
               <button className="absolute right-6 top-1/2 transform -translate-y-1/2">
                  <DownArrowIcon className="fill-[#333333]" />
               </button>
            </div>

            {/* Traction Select */}
            <div className="relative flex-shrink-0 w-full md:w-auto">
               <select
                  value={traction}
                  onChange={handleTractionChange}
                  className="w-full border-black border-2 border-dashed bg-transparent rounded-[10px] h-[58px] text-[#333333] pl-[28px] text-[18px] md:text-[20px] italic appearance-none pr-12 cursor-pointer outline-none"
               >
                  <option value="select" className="text-black">
                     Traction
                  </option>
                  <option value="Traction 1" className="text-black">
                     Traction 1
                  </option>
                  <option value="Traction 2" className="text-black">
                     Traction 2
                  </option>
                  <option value="Traction 3" className="text-black">
                     Traction 3
                  </option>
               </select>
               <button className="absolute right-6 top-1/2 transform -translate-y-1/2">
                  <DownArrowIcon className="fill-[#333333]" />
               </button>
            </div>
         </div>
      </div>
   );
};

export default Webmobile;
