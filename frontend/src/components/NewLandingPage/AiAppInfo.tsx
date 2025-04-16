import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { TypeAnimation } from "react-type-animation";
import checkIcon from "../../assets/Images/check_icon.png";
import Slackicon from "../../assets/Images/Slack_icon.png";
// import searchIcon from "../../assets/Images/searchIcon.png";
// import appInfoRow1 from "../../assets/Images/appInfoRow1.png";
// import appInfoRow2 from "../../assets/Images/appInfoRow2.png";
// import appInfoRow3 from "../../assets/Images/appInfoRow3.png";
// import Lock1 from "../../assets/Images/lock1.png";
// import Line from "../../assets/Images/line.png";
// import Durbin from "../../assets/Images/durbin.png";
// import Arrow from "../../assets/Images/arrow.png";
// import Bettery from "../../assets/Images/bettery.png";
// import Admin from "../../assets/Images/admin.png";
// import Triangle from "../../assets/Images/triangle.png";
// import Setting from "../../assets/Images/setting.png";
// import Rouned from "../../assets/Images/rouned.png";
// import Game from "../../assets/Images/game.png";
// import Doller from "../../assets/Images/doller.png";
// import Star1 from "../../assets/Images/star1.png";
// import Timer from "../../assets/Images/timer.png";
// import Layer from "../../assets/Images/layer.png";
// import Adminclock from "../../assets/Images/adminclock.png";
import { useEffect, useRef, useState } from "react";
import Screenshot4 from "../../assets/Images/Screenshot_4.png";
// import { PiCheckCircleDuotone } from "react-icons/pi";

const AiAppInfo = () => {
   const [ref4, inView4] = useInView({ triggerOnce: false, threshold: 0.2 });

   const RoleOption = ({ title }) => (
      <button className="border-1 border-[#FA780F] hover:bg-[#FA780F] rounded-xl text-sm py-[11px] px-[8px] m-[5px]">
         <span className=" ">{title}</span>
      </button>
   );

   const animationVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
   };
   /*
  const cardAnimation = {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.8 },
  };
*/
   const [isVisible, setIsVisible] = useState(false);
   const textRef = useRef(null);

   const handleIntersection = (entries) => {
      entries.forEach((entry) => {
         if (entry.isIntersecting) {
            setIsVisible(true);
         } else {
            setIsVisible(false);
         }
      });
   };

   useEffect(() => {
      const observer = new IntersectionObserver(handleIntersection, {
         threshold: 0.1,
      });

      if (textRef.current) {
         observer.observe(textRef.current);
      }

      return () => {
         if (textRef.current) {
            observer.unobserve(textRef.current);
         }
      };
   }, [textRef]);
   return (
      <div>
         <div className="bg-[#252525] pt-16">
            <div className="px-6 md:px-12 lg:pl-[145px]">
               {/* Heading */}
               <h2 className="text-[32px] md:text-[50px] lg:text-[75px] font-bold max-w-full lg:max-w-[1267px] font-[Poppins] text-white">
                  How can the future of AI be aligned with humans?
               </h2>

               {/* Content Section */}
               <div className="lg:flex mt-8">
                  {/* Left Section */}
                  <div className="mt-8 lg:mt-[57px] lg:pr-[88px]">
                     <p className="text-[16px] md:text-[18px] text-white max-w-full lg:max-w-[392px]">
                        Artificial intelligence is going to affect everyone, for
                        the best and for the worst. Soon, every single industry
                        will make use of AI in one way or another. It’s
                        transforming the way that we create things and even
                        conceive the ideas. It’s hard to grasp the true negative
                        effects AI will have in a few years, from theories of
                        world domination to more plausible problems like
                        increasing the wealth and literacy gap. We believe that
                        the full positive potential of AI will be achieved only
                        when it is made accessible, impactful, and safe for all
                        to use. In this light, the huby AI curation system was
                        created with a vision to expand the benefits of AI for
                        humanity by empowering people with positive genAI.
                     </p>
                     <div className="flex justify-start lg:justify-end items-center mt-4 pb-12">
                        <button className="italic text-[11px] bg-[#1A1A1A7D] py-[11px] px-[35px] rounded-full text-white">
                           Read more
                        </button>
                     </div>
                  </div>

                  {/* Right Section */}
                  <div className="bg-[#BA4D00B8] mt-8 lg:mt-[57px] px-6 md:px-[50px] lg:px-[134px] py-10 w-full flex justify-center items-center text-center">
                     <div>
                        <h2 className="text-[28px] md:text-[50px] lg:text-[70px] font-light text-white max-w-full lg:max-w-[736px]">
                           We believe that{" "}
                           <span className="font-black">curation is key.</span>
                        </h2>
                        <p className="text-[14px] md:text-[18px] mt-6 lg:mt-12 text-white max-w-full lg:max-w-[741px]">
                           We are building a system designed to holistically
                           analyze AI solutions and uncover their true value to
                           individuals and society. Our standardized
                           methodology, built upon key criteria, forms the
                           backbone of our curation process. By accurately
                           assessing an app's position, we help it either
                           increase product acceptance or gain the visibility it
                           deserves if groundbreaking. While AI enables
                           efficient and comprehensive analysis, final decisions
                           are grounded in personal testing and experience. Each
                           AI solution receives a base rating that evolves with
                           user feedback, continuously refining our system.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Footer Section */}
               <div className="flex flex-wrap">
                  {/* Left Block */}
                  <div className="bg-[#A34400BD] flex justify-center items-center text-center py-8 px-6 md:py-[88px] md:px-[105px] w-full lg:w-auto">
                     <div>
                        <img
                           src={Slackicon}
                           alt="Slack Icon"
                           className="mx-auto"
                        />
                        <p className="text-[13px] mt-4 md:mt-6 text-white max-w-[172px] mx-auto">
                           Stay tuned with the latest AI and much more on our
                           Slack channel
                        </p>
                     </div>
                  </div>
                  {/* <div className="flex flex-wrap gap-4 justify-center items-center">
                     <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src={Lock1} alt="Lock1" />
                     </div>
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src={Durbin} alt="Durbin" className="w-[22px]" />
                     </div>
                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src={Arrow} alt="Arrow" className="w-[37px]" />
                     </div>
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src={Bettery} alt="Bettery" className="w-[35px]" />
                     </div>
                     <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src={Admin} alt="Admin" className="w-[80px]" />
                     </div>
                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src={Line} alt="Line" className="w-[24px]" />
                     </div>
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img
                           src={Triangle}
                           alt="Triangle"
                           className="w-[38px]"
                        />
                     </div>
                     <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src={Setting} alt="Setting" className="w-[18px]" />
                     </div>
                     <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src={Rouned} alt="Rouned" className="w-[45px]" />
                     </div>
                     <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src={Game} alt="Game" className="w-[17px]" />
                     </div>
                     <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src={Doller} alt="Doller" className="w-[24px]" />
                     </div>
                     <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src={Star1} alt="Star1" className="w-[21px]" />
                     </div>
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src={Timer} alt="Timer" className="w-[23px]" />
                     </div>
                     <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img src={Layer} alt="Layer" className="w-[18px]" />
                     </div>
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                        <img
                           src={Adminclock}
                           alt="Adminclock"
                           className="w-[37px]"
                        />
                     </div>
                  </div> */}

                  {/* Learn More Button */}
                  <div className="flex flex-wrap justify-center items-center mx-auto py-6 lg:py-12">
  <div className=" ">
    <img 
      src={Screenshot4} 
      alt="Screenshot4" 
      className=" xl:mt-[-208px]" 
    />
  </div>
  <div className="w-full flex justify-center mt-6">
    <button className="italic text-[11px] bg-[#FFFFFF47] py-[11px] px-[35px] rounded-full text-white">
      Learn more
    </button>
  </div>
</div>
               </div>
            </div>
         </div>

         <div className="bg-[#252525] text-white md:p-[50px] p-[16px]">
            <div className="text-center mt-[100px]">
               <motion.div
                  className="mulish text-[30px] italic"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
               >
                  coming soon
               </motion.div>
               <motion.div
                  className="font-[AlteHaasGrotesk] text-[28px] lg:text-[38px] font-bold py-[10px]"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
               >
                  More than a marketplace.
               </motion.div>
               <div
                  ref={textRef}
                  className="poppins xl:text-[80px] md:text-[42px] text-[25px] bg-gradient-to-r from-[#FF7F50]/[50] via-[#FF7F50] to-[#ECFF11]/[100] bg-clip-text text-transparent font-bold"
               >
                  {isVisible && (
                     <TypeAnimation
                        sequence={["Explore ", 5000]}
                        speed={50}
                        repeat={0}
                        style={{ display: "inline-block" }}
                        cursor={false}
                     />
                  )}
               </div>

               <motion.div
                  className="text-[24px] lg:text-[38px] font-[inter] max-w-[600px] lg:max-w-[818px] mx-auto py-[30px]"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
               >
                  Easily discover & engage with{" "}
                  <span className="font-bold">
                     personalized, trustworthy, and powerful AI solutions.
                  </span>
               </motion.div>
               <motion.div
                  className="font-[AlteHaasGrotesk] lg:text-[30px] sm:text-[20px] text-[16px] sm:max-w-[600px] lg:max-w-[880px] text-justify mx-auto md:py-[60px] py-[20px] p-[16px]"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
               >
                  While everyone knows and loves ChatGPT, have you explored
                  Hunch.tools or Eraser.io? With thousands of new AI apps
                  emerging daily, it's nearly impossible to try them all. That's
                  why we've created a dedicated marketplace for AI
                  solutions—spotlighting innovative, growing tools that offer
                  capabilities beyond what ChatGPT provides. Here, you can earn
                  money, gain visibility, and build your reputation by working
                  with and helping shape powerful AI solutions. So many people
                  are doing incredible things with AI, and this is your place to
                  be part of it.
               </motion.div>
            </div>
            <motion.div
               ref={ref4}
               animate={inView4 ?? "visible"}
               variants={animationVariants}
               transition={{ duration: 1, delay: 0.8 }}
               className="sm:max-w-[565px] lg:max-w-[1203px] mx-auto bg-[#303030]  my-[100px] p-2 rounded-xl shadow-2xl"
            >
               <div className="flex justify-between items-center sm:px-4 px-2 gap-[24px] py-[14px] lg:flex-row flex-col">
                  <div className="font-[AlteHaasGrotesk] text-[22px]">
                     What's your role?
                  </div>
                  <div className="hidden lg:block">
                     <div className="grid sm:grid-cols-5 grid-cols-2 gap-2 ">
                        <RoleOption title="AI user" />
                        <RoleOption title="AI developer" />
                        <RoleOption title="Professional" />
                        <RoleOption title="Tech enthusiast" />
                        <RoleOption title="Content creator" />
                     </div>
                     <div className="grid sm:grid-cols-4 grid-cols-2 gap-2">
                        <RoleOption title="Business owner" />
                        <RoleOption title="AI newcomer" />
                        <RoleOption title="AI founder" />
                        <motion.div
                           initial={{ opacity: 0 }}
                           animate={inView4 ? { opacity: 1 } : { opacity: 0 }}
                           transition={{ duration: 1 }}
                           className="border flex items-center justify-around m-[5px] mulish text-xs py-1.5 bg-[#ECECEC] text-[#666666] rounded-lg"
                        >
                           <input
                              className="bg-transparent w-[70%] py-[3px] focus:outline-none placeholder:text-[#666666]"
                              type="text"
                              placeholder="Tell us about yourself!"
                           />

                           <div className="bg-[#FA780F] rounded-full">
                              <img
                                 src={checkIcon}
                                 alt="Check Icon"
                                 className="w-3 m-1"
                              />
                           </div>
                        </motion.div>
                     </div>
                  </div>

                  {/* for small devices */}
                  <div className="block lg:hidden">
                     <div className="grid grid-cols-2 gap-1 ">
                        {[
                           "AI user",
                           "AI developer",
                           "Professional",
                           "Tech enthusiast",
                           "Content creator",
                           "Business owner",
                           "Business owner",
                           "AI founder",
                        ].map((titleName) => (
                           <RoleOption title={titleName} />
                        ))}

                        <motion.div
                           initial={{ opacity: 0 }}
                           animate={inView4 ? { opacity: 1 } : { opacity: 0 }}
                           transition={{ duration: 1 }}
                           className="border flex items-center justify-between m-[5px] px-3 mulish col-span-2 text-xs py-1.5 bg-[#ECECEC] text-[#666666] rounded-lg"
                        >
                           <input
                              className="bg-transparent w-[70%] py-[3px] focus:outline-none placeholder:text-[#666666]"
                              placeholder="Tell us about yourself!"
                           />
                           <div className="bg-[#FA780F] rounded-full">
                              <img
                                 src={checkIcon}
                                 alt="Check Icon"
                                 className="w-3 m-1"
                              />
                           </div>
                        </motion.div>
                     </div>
                  </div>
                  <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="mulish border hover:bg-[#ffffff] hover:text-[#000000] rounded-xl py-[8px] px-[12px] cursor-pointer"
                     onClick={() =>
                        window.open(
                           "https://docs.google.com/forms/d/1U_EMmFvcN2gsUpmLOo1y7ClOI95zgUCctH73T1GnGhI",
                           "_blank"
                        )
                     }
                  >
                     Request early access
                  </motion.div>
               </div>
            </motion.div>
            {/*
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <img src={searchIcon} alt="" className="mx-auto mb-[40px]" />
          <div className="font-[AlteHaasGrotesk] text-[24px] lg:text-[38px] font-bold max-w-[500px] lg:max-w-[715px] mx-auto mb-[70px]">
            Find the AI solutions you didn’t know how much you’d love...
          </div>
        </motion.div>
        <div className="bg-white mx-[20px]">
          <div className="grid xl:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 py-[30px] px-[20px] lg:px-[50px] rounded-[10px] gap-y-[50px]">
            {Array(6)
              .fill(appInfoRow1)
              .map((src, index) => (
                <motion.img
                  key={index}
                  src={src}
                  alt=""
                  className="mx-auto"
                  // initial={{ opacity: 0, y: 20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                  {...cardAnimation}
                />
              ))}
            {Array(6)
              .fill(appInfoRow2)
              .map((src, index) => (
                <motion.img
                  key={index}
                  src={src}
                  alt=""
                  className="mx-auto"
                  // initial={{ opacity: 0, y: 20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // transition={{ duration: 0.5, delay: 1.4 + (index + 6) * 0.1 }}
                  {...cardAnimation}
                />
              ))}
            {Array(6)
              .fill(appInfoRow3)
              .map((src, index) => (
                <motion.img
                  key={index}
                  src={src}
                  alt=""
                  className="mx-auto"
                  // initial={{ opacity: 0, y: 20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // transition={{ duration: 0.5, delay: 1.4 + (index + 12) * 0.1 }}
                  {...cardAnimation}
                />
              ))}
            {Array(6)
              .fill(appInfoRow1)
              .map((src, index) => (
                <motion.img
                  key={index}
                  src={src}
                  alt=""
                  className="mx-auto"
                  // initial={{ opacity: 0, y: 20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                  {...cardAnimation}
                />
              ))}
            {Array(6)
              .fill(appInfoRow2)
              .map((src, index) => (
                <motion.img
                  key={index}
                  src={src}
                  alt=""
                  className="mx-auto"
                  // initial={{ opacity: 0, y: 20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // transition={{ duration: 0.5, delay: 1.4 + (index + 6) * 0.1 }}
                  {...cardAnimation}
                />
              ))}
          </div>
          <div className="font-[AlteHaasGrotesk] text-black md:mx-[80px] sm:mx-[45px] mx-[16px] py-[30px] text-center">
            <div className="md:text-[28px] lg:text-[38px] text-[25px]">
              and many more coming soon to you.
            </div>
            <div className="flex justify-between items-center flex-wrap">
              <div className="mulish text-[12px] lg:text-[22px] italic max-w-[240px] lg:max-w-[690px] text-start py-[30px] lg:py-[50px]">
                Check out some of our favorite GenAI solutions above. And please
                feel free to share your favorites with us on the right!
              </div>
              <div className="flex gap-2 items-center bg-[rgba(162,162,162,0.19)] h-[30px] lg:h-[47px] justify-between max-w-[220px] lg:max-w-[320px] w-full rounded-xl p-[10px] relative">
                <input
                  type="text"
                  className="bg-transparent placeholder:text-[12px] focus:outline-none w-[85%] pl-3"
                  placeholder="Enter a URL of your favorite AI solution(s)!"
                />
                <div className="bg-[#FA780F] min-w-[20px] min-h-[20px] rounded-full mr-[10px] my-[10px] absolute right-0">
                  <img src={checkIcon} alt="" className="p-[5px]" />
                </div>
              </div>
            </div>
          </div>
        </div> */}
            <div className=" bg-[#FF7F50] mx-[20px] lg:max-w-[950px] lg:mx-auto rounded-[15px] mt-[80px] mb-[40px] py-[30px]">
               <div className="text-white px-[10px] md:px-[50px] lg:px-[100px] ">
                  <div className="mulish italic text-[17px] sm:text-[25px]">
                     We are launching our first curated drop of AI!
                  </div>
                  <div className="poppins text-[24px] md:text-[32px] lg:text-[48px]">
                     Top solutions for{" "}
                     <span className="font-bold"> developers</span>
                  </div>
                  <div className="flex-wrap sm:flex justify-between mt-[25px]">
                     <div className="flex gap-2 flex-wrap md:justify-start justify-center">
                        <button
                           className="py-[8px] px-[12px] rounded-[15px] text-black hover:!text-white bg-white hover:!bg-[#252525]"
                           onClick={() =>
                              window.open(
                                 "mailto:support@huby.ai?subject=huby AI first curated drop&body=Hi, I'm interested in getting involved in huby's first curated drop of AI products.",
                                 "_blank"
                              )
                           }
                        >
                           Get updates
                        </button>
                        <button
                           className="py-[8px] px-[12px] rounded-[15px] bg-[#252525] hover:bg-white hover:text-[#252525]"
                           onClick={() =>
                              window.open(
                                 "https://docs.google.com/forms/d/1Lq_jGH6oZ8lTQK9Co2huVmXr6RQjjXHgYzm7NvqV5eU/",
                                 "_blank"
                              )
                           }
                        >
                           Submit your AI
                        </button>
                     </div>
                     <div className="flex bg-[#252525] h-[40px] rounded-xl px-[10px] mt-2 md:mt-0 justify-center">
                        <input
                           type="text"
                           className="bg-transparent pr-[7px] sm:pr-[10px] md:pr-[20px] text-[10px] sm:text-[18px] focus:outline-none pl-2"
                           placeholder="What category should we curate next?"
                        />
                        <div className="bg-[#FA780F] rounded-full  my-[10px] p-[5px] md:p-[6px] lg:p-[5px]">
                           <img src={checkIcon} alt="" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AiAppInfo;
