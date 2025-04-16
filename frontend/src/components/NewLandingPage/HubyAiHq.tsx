// import { motion } from "framer-motion";
// import { useInView } from "react-intersection-observer";
// import birthDayPop from "../../assets/Images/birthDayPop.png";
// import hubyAiHqTitle from "../../assets/Images/hubyAiHqTitle.png";
// import hubyAIVerse from "../../assets/Images/hubyAIVerse.png";
//import checkIcon from "../../assets/Images/check_icon.png";
// import hubyAiHqNews from "../../assets/Images/hubyAiHqNews.png";
// import Spline from "@splinetool/react-spline";
//import hubyAIVerseMsg from "../../assets/Images/hubyAIVerseMsg.png";
// import Aiverse from "../../assets/Images/aiverse.png";
import Rouned1 from "../../assets/Images/rouned1.png"
import Rouned6 from "../../assets/Images/rouned6.png"
import Rouned7 from "../../assets/Images/rouned7.png"
import Rouned4 from "../../assets/Images/rouned4.png"
import Rouned8 from "../../assets/Images/rouned8.png"
import Rouned5 from "../../assets/Images/rouned5.png"
// import Swiper core and required modules
import {
   Navigation,
   Pagination,
   Scrollbar,
   A11y,
   Autoplay,
} from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
// import { Navigation } from "swiper";
// import Plus from "../../assets/Images/plus.png";

const HubyAiHq = () => {
  //  const [ref1, inView1] = useInView({ triggerOnce: false, threshold: 0.2 });
  //  const [ref2, inView2] = useInView({ triggerOnce: false, threshold: 0.2 });
  //  const [ref3, inView3] = useInView({ triggerOnce: false, threshold: 0.2 });
   //const [ref4, inView4] = useInView({ triggerOnce: false, threshold: 0.2 });
   // const [ref5, inView5] = useInView({ triggerOnce: false, threshold: 0.2 });

  //  const animationVariants = {
  //     hidden: { opacity: 0, y: 50 },
  //     visible: { opacity: 1, y: 0 },
  // };
 

   /*
  const RoleOption = ({ title }) => (
    <button className="border-1 border-[#FA780F] hover:bg-[#FF7F50] hover:text-white rounded-xl text-sm py-[11px] px-[8px] m-[5px]">
      <span className=" ">{title}</span>
    </button>
  );
*/
   return (
     <div>
       <div className="pl-36 mt-24">
         <h2 className="tex-[55px] text-[#FF6A00]"> AI of the Week</h2>
         <p className="text-[18px] w-full max-w-[659px] text-[#252525]">While everyone knows and loves ChatGPT, have you explored Hunch.tools or Eraser.io? With thousands of new AI apps emerging daily, it's nearly impossible to try them all. That's why we've created a dedicated marketplace for AI solutions—spotlighting innovative, growing tools that offer capabilities beyond what ChatGPT provides. Here, you can earn money, gain visibility, and build your reputation by working with and helping shape powerful AI solutions. So many people are doing incredible things with AI, and this is your place to be part of it.</p>
       </div>
       <div className="relative mt-16 2xl:block hidden">
         <div>
             <img src={Rouned1} alt="Rouned1" className="w-[740px]"/>
         </div>
         <div className="absolute top-[2%] !left-[33%]">
             <img src={Rouned6} alt="Rouned6" className="w-[232px]"/>
         </div>
         <div className="absolute top-[-15%] left-[45%]">
             <img src={Rouned7} alt="Rouned6" className="!w-[643px]"/>
         </div>
         <div className="absolute top-[-22%] right-0">
             <img src={Rouned4} alt="Rouned6" className="w-[442px]"/>
          </div>
          <div className="absolute bottom-[-2%] left-[35%]">
             <img src={Rouned8} alt="Rouned6" className="w-[442px]"/>
         </div>
         <div className="absolute bottom-[5%] right-[3%]">
             <img src={Rouned5} alt="Rouned5" className="w-[481px]"/>
          </div>
      </div>
         <div className="container mx-auto px-4 mt-48">
            {/* <motion.div
          ref={ref1}
          initial="hidden"
          animate={inView1 ? "visible" : "hidden"}
          variants={animationVariants}
          transition={{ duration: 0.8 }}
          className="mulish text-[24px] lg:text-[30px] italic"
        >
          <motion.img
            src={birthDayPop}
            alt="Birthday Pop"
            className="inline-block"
            initial={{ rotate: -10 }}
            animate={inView1 ? { rotate: 0 } : { rotate: -10 }}
            transition={{ duration: 1 }}
          />{" "}
          <span>celebrating the launch of</span>
        </motion.div> */}
            {/* <div>
          <p className="text-[18px] poppins text-[#333333] mx-auto mt-10">Reach your potential within</p>
      </div> */}
            {/* <div
          ref={ref2}
          initial="hidden"
          animate={inView2 ? "visible" : "hidden"}
          variants={animationVariants}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="my-4 mx-6 relative"
        >
          <img
            src={hubyAIVerse}
            alt="Huby AIverse  Title"
            className="mx-auto"
          />
              <img
            src={Aiverse}
            alt="Huby AIverse  Title"
            className="mx-auto"
          />
          <h2 className="!text-[70px] sm:!text-[100px] md:!text-[100px] font-black text-[#FF7F50] poppins absolute top-0 left-0 right-0">AIverse</h2>
        </div> */}
            <div className="flex flex-wrap justify-center gap-3 items-center my-14">
               <div>
                  <p className="text-[55px] text-[#333333] w-full max-w-[621px] mb-0">
                     Choose your role within
                  </p>
                  <h2 className="!text-[70px] sm:!text-[100px] md:!text-[100px] font-black text-[#FF7F50] poppins mb-0">
                     AIverse
                  </h2>
               </div>
               <div>
                  <p className="text-[18px] text-[#333333] w-full max-w-[574px]">
                     We believe that truly harnessing AI goes beyond
                     discussion—it’s about taking action. Building our personal
                     skills. Advancing our careers. Growing our businesses.
                     Supporting the local community. We bring together people
                     from all industries, each contributing a unique
                     perspective. From AI beginners to experts, we solve
                     problems together—from learning how to best implement AI to
                     shaping innovations like the next ChatGPT. Whether you’re
                     here for 5 minutes to discover your new favorite AI tool, a
                     month to achieve your next business milestone, or a
                     lifetime to lead the AI revolution, we invite you to join
                     us in the AIverse.
                  </p>
               </div>
            </div>

            {/* <div className="h-[210px] md:h-[500px] max-w-[95%] mx-auto">
          <Spline scene="https://prod.spline.design/ZcOLf1iqFK0q4sS3/scene.splinecode" />
        </div> */}

            {/* <motion.div
          ref={ref2}
          initial="hidden"
          animate={inView2 ? "visible" : "hidden"}
          variants={animationVariants}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:text-[38px] md:text-[28px] text-[22px] max-w-[493px] lg:max-w-[875px] pb-[50px] mx-auto poppins"
        >
          The community for{" "}
          <span className="text-[#E5461A] font-semibold">
            everyone to get the most out of AI.
          </span>
        </motion.div> */}

            {/* <motion.div
          ref={ref3}
          initial="hidden"
          animate={inView3 ? "visible" : "hidden"}
          variants={animationVariants}
          transition={{ duration: 1, delay: 0.6 }}
          className="md:max-w-[569px] lg:max-w-[700px] xl:max-w-[1084px] mx-auto text-center lg:text-[30px] md:text-[18px] text-[16px] text-[#252525] font-[AlteHaasGrotesk]"
        >
          <span className="font-bold">
            We believe that truly harnessing AI goes beyond discussion—it’s
            about taking action. Building our personal skills. Advancing our
            careers. Growing our businesses. Supporting the local community.{" "}
          </span>
          We bring together people from all industries, each contributing a
          unique perspective. From AI beginners to experts, we solve problems
          together—from learning how to best implement AI to shaping innovations
          like the next ChatGPT. Whether you’re here for 5 minutes to discover
          your new favorite AI tool, a month to achieve your next business
          milestone, or a lifetime to lead the AI revolution, we invite you to
          join us.
          We believe that truly harnessing AI goes beyond discussion—it’s about taking action. Building our personal skills. Advancing our careers. Growing our businesses. Supporting the local community. We bring together people from all industries, each contributing a unique perspective. From AI beginners to experts, we solve problems together—from learning how to best implement AI to shaping innovations like the next ChatGPT. Whether you’re here for 5 minutes to discover your new favorite AI tool, a month to achieve your next business milestone, or a lifetime to lead the AI revolution, we invite you to join us in the AIverse.
        </motion.div> */}
            {/*
        <motion.div
          ref={ref4}
          animate={inView4 ?? "visible"}
          variants={animationVariants}
          transition={{ duration: 1, delay: 0.8 }}
          className="sm:max-w-[565px] lg:max-w-[1018px] mx-auto bg-[#FFFBF6] my-[100px] py-[15px] px-[26px] rounded-xl shadow-2xl"
        >
          <div className="flex justify-between items-center gap-[18px] lg:flex-row flex-col">
            <div className="font-[AlteHaasGrotesk] text-[22px] md:w-[21%]">
              What's your role?
            </div>
            <div className="hidden lg:block">
              <div className="grid lg:grid-cols-5 grid-cols-2 ">
                <RoleOption title="AI user" />
                <RoleOption title="AI developer" />
                <RoleOption title="Professional" />
                <RoleOption title="Tech enthusiast" />
                <RoleOption title="Content creator" />
              </div>
              <div className="grid lg:grid-cols-4 grid-cols-2 ">
                <RoleOption title="Business owner" />
                <RoleOption title="AI newcomer" />
                <RoleOption title="AI founder" />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView4 ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="border flex items-center justify-around m-[5px] mulish text-xs py-1.5 bg-[#ECECEC] rounded-lg"
                >
                  <input
                    className="bg-transparent w-[80%] py-[3px] focus:outline-none"
                    type="text"
                    placeholder="Tell us about yourself!"
                  />
                  <div className="bg-[#FA780F] rounded-full">
                    <img src={checkIcon} alt="Check Icon" className="w-3 m-1" />
                  </div>
                </motion.div>
              </div>
            </div>


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
                  className="border flex items-center justify-between m-[5px] px-3 mulish col-span-2 text-xs py-1.5 bg-[#ECECEC] rounded-lg"
                >
                  <input
                    className="bg-transparent w-[70%] py-[3px] focus:outline-none"
                    placeholder="Tell us about yourself!"
                  />
                  <div className="bg-[#FA780F] rounded-full">
                    <img src={checkIcon} alt="Check Icon" className="w-3 m-1" />
                  </div>
                </motion.div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mulish border lg:w-[11%] border-black hover:bg-[#252525] hover:text-white font-bold rounded-xl py-[8px] px-[12px] "
              onClick={() =>
                (window.location.href = "https://hubysaicommunity.slack.com")
              }
            >
              join now
            </motion.button>
          </div>
        </motion.div>
        */}
         </div>

         <div className="mt-16">
         <Swiper
  modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
  spaceBetween={10}
  slidesPerView={4} // Default number of slides
  speed={10000}
  autoplay={{ delay: 100, disableOnInteraction: false }}
  loop={true}
  breakpoints={{
    320: { slidesPerView: 1 }, // 1 slide for very small screens
    640: { slidesPerView: 2 }, // 2 slides for small screens
    768: { slidesPerView: 2 }, // 3 slides for tablets
    1024: { slidesPerView: 4 }, // 4 slides for desktops
  }}
>
  <SwiperSlide>
    <button className="bg-[#252525] text-white rounded-lg text-[20px] italic py-2 px-4 whitespace-nowrap">
      Join Miami group
    </button>
  </SwiperSlide>
  <SwiperSlide>
    <button className="bg-[#252525] text-white rounded-lg text-[20px] italic py-2 px-4 whitespace-nowrap">
      Join an event
    </button>
  </SwiperSlide>
  <SwiperSlide>
    <button className="bg-[#252525] text-white rounded-lg text-[20px] italic py-2 px-4 whitespace-nowrap">
      Provide feedback
    </button>
  </SwiperSlide>
  <SwiperSlide>
    <button className="bg-[#252525] text-white rounded-lg text-[20px] italic py-2 px-4 whitespace-nowrap">
      Projects
    </button>
  </SwiperSlide>
  <SwiperSlide>
    <button className="bg-[#252525] text-white rounded-lg text-[20px] italic py-2 px-4 whitespace-nowrap">
      Join newsletter
    </button>
  </SwiperSlide>
  <SwiperSlide>
    <button className="bg-[#252525] text-white rounded-lg text-[20px] italic py-2 px-4 whitespace-nowrap">
      Collaboration
    </button>
  </SwiperSlide>
</Swiper>

<Swiper
  modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
  spaceBetween={0}
  slidesPerView={4}
  speed={10000}
  autoplay={{ delay: 100, disableOnInteraction: false }}
  loop={true}
  className="mt-4"
  breakpoints={{
    320: { slidesPerView: 1 }, // 1 slide for very small screens
    640: { slidesPerView: 2 }, // 2 slides for small screens
    768: { slidesPerView: 2 }, // 3 slides for tablets
    1024: { slidesPerView: 4 }, // 4 slides for desktops
  }}
>
  <SwiperSlide>
    <button className="bg-[#252525] text-white rounded-lg text-[20px] italic py-2 px-4 whitespace-nowrap">
      Join a focus group
    </button>
  </SwiperSlide>
  <SwiperSlide>
    <button className="bg-[#252525] text-white rounded-lg text-[20px] italic py-2 px-4 whitespace-nowrap">
      Speak at an event
    </button>
  </SwiperSlide>
  <SwiperSlide>
    <button className="bg-[#252525] text-white rounded-lg text-[20px] italic py-2 px-4 whitespace-nowrap">
      Participate in a project
    </button>
  </SwiperSlide>
  <SwiperSlide>
    <button className="bg-[#252525] text-white rounded-lg text-[20px] italic py-2 px-4 whitespace-nowrap">
      AI founders network
    </button>
  </SwiperSlide>
  <SwiperSlide>
    <button className="bg-[#252525] text-white rounded-lg text-[20px] italic py-2 px-4 whitespace-nowrap">
      Mentor a startup
    </button>
  </SwiperSlide>
  <SwiperSlide>
    <button className="bg-[#252525] text-white rounded-lg text-[20px] italic py-2 px-4 whitespace-nowrap">
      Collaboration
    </button>
  </SwiperSlide>
</Swiper>

      </div>
         {/* 
      <div className="flex py-[120px] flex-wrap">
        <motion.img
          ref={ref5}
          initial="hidden"
          animate={inView5 ? "visible" : "hidden"}
          variants={animationVariants}
          transition={{ duration: 1 }}
          src={hubyAIVerseMsg}
          alt="Huby AIverse message"
          className="px-0 w-full xl:w-auto "
        />
        <div className="poppins mt-14 xl:mt-0 text-[24px] md:text-[28px] lg:text-[32px] xl:text-[48px] font-semibold max-w-[300px] xl:max-w-[353px] self-center mx-auto">
          Locate the right resources to help you achieve your goals.
        </div>
      </div>
      */}
      </div>
   );
};

export default HubyAiHq;
