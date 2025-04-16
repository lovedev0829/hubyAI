import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer"; // Import hook
// import landingLogo from "../../assets/Images/logo-main.png";
// import lockIcon from "../../assets/Images/lockIcon.png";
// import genAiBg1 from "../../assets/Images/genAiBg1.png";
import Hubylogo from "../../assets/Images/hubbylogo.png";
// import genAiBg2 from "../../assets/Images/genAiBg2.png";
// import genAiBg3 from "../../assets/Images/genAiBg3.png";
import Image20 from "../../assets/Images/image20.png"
import Search1 from "../../assets/Images/search1.png"
import Image22 from "../../assets/Images/image22.png"
import Image21 from "../../assets/Images/image21.png"
import Image23 from "../../assets/Images/image23.png"
import downArrowIcon from "../../assets/Images/downArrowIcon.png";
// import { useEffect, useRef } from "react";

// import ImageSlider from "./ImageSlider";

// import Swiper core and required modules
// import {
//    Navigation,
//    Pagination,
//    Scrollbar,
//    A11y,
//    Autoplay,
// } from "swiper/modules";

// import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Link, useNavigate } from "react-router-dom";
// import { PiPlusCircleDuotone } from "react-icons/pi";
import { IoPersonCircleSharp } from "react-icons/io5";
import { RiReactjsLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";

const GenAi = () => {
   const navigate = useNavigate();
   // const [ref1, inView1] = useInView({ triggerOnce: false, threshold: 0.2 });
   const [ref3, inView3] = useInView({ triggerOnce: false, threshold: 0.2 });
   const [ref4, inView4] = useInView({ triggerOnce: false, threshold: 0.2 });

   // const [isVisible, setIsVisible] = useState(false);
   // const textRef = useRef(null);

   // const handleIntersection = (entries) => {
   //    entries.forEach((entry) => {
   //       if (entry.isIntersecting) {
   //          setIsVisible(true);
   //       } else {
   //          setIsVisible(false);
   //       }
   //    });
   // };

   // useEffect(() => {
   //    const observer = new IntersectionObserver(handleIntersection, {
   //       threshold: 0.1,
   //    });

   //    if (textRef.current) {
   //       observer.observe(textRef.current);
   //    }

   //    return () => {
   //       if (textRef.current) {
   //          observer.unobserve(textRef.current);
   //       }
   //    };
   // }, [textRef]);

   // const slides = [
   //    {
   //       src: genAiBg1,
   //       className:
   //          "relative w-full h-full md:h-[140px] lg:h-[180px] xl:h-[265px] top-[55px] sm:top-[104px] md:top-[130px] lg:top-[180px] xl:top-[200px]",
   //       isFlex: false,
   //    },
   //    {
   //       src: genAiBg2,
   //       className:
   //          "relative w-full h-full md:h-[140px] lg:h-[180px] xl:h-[265px] top-[75px] sm:top-[130px] md:top-[215px] lg:top-[316px]",
   //       isFlex: false,
   //    },
   //    {
   //       src: genAiBg2,
   //       className:
   //          "relative w-full h-full md:h-[140px] lg:h-[180px] xl:h-[265px] top-[32px] sm:top-[65px] md:top-[74px] lg:top-[100px] xl:top-[118px]",
   //       isFlex: false,
   //    },
   //    {
   //       src: genAiBg3,
   //       className:
   //          "relative w-full h-full md:h-[140px] lg:h-[180px] xl:h-[265px] top-[50px] sm:top-[100px] md:top-[170px] lg:top-[250px]",
   //       isFlex: true,
   //    },
   //    {
   //       src: genAiBg1,
   //       className:
   //          "relative w-full h-full md:h-[140px] lg:h-[180px] xl:h-[265px] top-[55px] sm:top-[104px] md:top-[130px] lg:top-[180px] xl:top-[200px]",
   //       isFlex: false,
   //    },
   //    {
   //       src: genAiBg2,
   //       className:
   //          "relative w-full h-full md:h-[140px] lg:h-[180px] xl:h-[265px] top-[75px] sm:top-[130px] md:top-[215px] lg:top-[316px]",
   //       isFlex: false,
   //    },
   //    {
   //       src: genAiBg2,
   //       className:
   //          "relative w-full h-full md:h-[140px] lg:h-[180px] xl:h-[265px] top-[32px] sm:top-[65px] md:top-[74px] lg:top-[100px] xl:top-[118px]",
   //       isFlex: false,
   //    },
   //    {
   //       src: genAiBg3,
   //       className:
   //          "relative w-full h-full md:h-[140px] lg:h-[180px] xl:h-[265px] top-[50px] sm:top-[100px] md:top-[170px] lg:top-[250px]",
   //       isFlex: true,
   //    },
   // ];

   return (
      <div>
         <div className="">
            {/* <div className="px-[15px] md:px-[58px] flex justify-between items-center"> */}
            {/*
          <button className="font-[mulish] text-[12px] lg:text-[16px] py-[8px] lg:py-[13px] px-[12px] lg:px-[26px] border-0 rounded-[12px] lg:rounded-[18px] bg-[#303030] hover:bg-[#FF7F50] text-white font-bold">
            Submit your AI
          </button>
*/}
            {/* <Link
            to="https://docs.google.com/forms/d/1Lq_jGH6oZ8lTQK9Co2huVmXr6RQjjXHgYzm7NvqV5eU/"
            className={` hover:bg-[#3D9D9D] hover:border-[1px] hover:border-[#008080] bg-[#0A2239] border-[1px] text-[#fff] rounded-[12px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] md:block hidden no-underline`}
          >
            Submit your AI
          </Link> */}

            {/* <div className="flex bg-[rgba(174,172,167,0.08)] rounded-xl">
            <input
              type="text"
              className="bg-transparent w-[121px] focus:outline-none pl-4 px-2"
            />
            <Link to="/dashboard">
              <img src={lockIcon} alt="" className="w-[21px] py-1 mr-[10px]" />
            </Link>
          </div> */}
            {/* </div> */}

            {/* <motion.div
          ref={ref1}
          initial={{ opacity: 0, y: -50 }}
          animate={inView1 ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.8 }}
        > */}
            {/* <div className="py-[36px] md:py-[15px] lg:py-[0px]">
            <div className="">
              <img
                src={landingLogo}
                alt="landingLogo"
                className="m-auto max-w-[161px] "
              />
            </div>
            <div className="font-[AlteHaasGrotesk] md:max-w-[430px] lg:max-w-[658px] text-[21px] lg:text-[30px] text-center mx-[25px] md:mx-auto py-2">
              The hub for connecting thought and action to propel society with
              impactful AI solutions.
            </div>
          </div> */}
            {/* </motion.div> */}
            <div className="w-full">
               <div className="flex justify-between items-center py-2 !px-4 sm:!px-6 md:!px-8 lg:!px-20">
                  <div>
                     <img src={Hubylogo} alt="Hubylogo" />
                     <p className="text-[#333333] text-[13px] mt-1 font-light">
                        The curated marketplace for generative AI products
                     </p>
                  </div>
                  <div className="flex gap-[14px] sm:gap-[10px]">
                     <button className="w-[46px] h-[46px] rounded-full bg-[#929191] flex justify-center items-center sm:w-[40px] sm:h-[40px]">
                        <RiReactjsLine className="text-3xl" />
                     </button>
                     <div className="relative">
                        <Link to="./Landing" className="w-[46px] h-[46px] rounded-full bg-[#929191] flex justify-center items-center sm:w-[40px] sm:h-[40px]">
                           <FaPlus className="text-2xl text-black" />
                        </Link>
                        <p className="text-[#929191] text-[11px] -ml-[0.15px] absolute whitespace-nowrap mt-1 sm:text-[10px] md:text-[9px]">
                           Save for later
                        </p>
                     </div>
                     <div className="relative">
                        <button onClick={() => navigate("/dashboard")} className="w-[46px] h-[46px] rounded-full bg-[#929191] flex justify-center items-center sm:w-[40px] sm:h-[40px]">
                           <IoPersonCircleSharp className="text-2xl" />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
            <div>
               <div className="xl:hidden block sm:px-0 px-12">
                  <div className="flex justify-center items-center text-center flex-col pt-14 ">
                     <p className="xl:text-[18px] lg:text-[16px] text-[#333333] font-light text-center">Click on the text or press CMD + K to find your next AI.</p>
                     <div className="flex flex-wrap justify-center gap-2">
                        <h1 className="xl:text-[55px] lg:text-[45px] font-extrabold text-[#333333] w-full max-w-[583px] ">Can AI help with my science project?</h1>
                        <Link to="./SearchPage">
                           <img src={Search1} alt="Search1" />
                        </Link>
                     </div>
                     <img src={Image23} alt="Image20" className="mt-8 w-full max-w-[500px] md:max-w-[680px] lg:max-w-[780px]" />
                  </div>
               </div>
            </div>
            <div className="relative lg:block hidden">
               <div className="absolute left-[45%] lg:top-[-29%] xl:top-[-23%]">
                  <img src={Image20} alt="Image20" className="w-[49%] xl:w-auto  xl:block hidden" />
               </div>
               <div className="">
                  <img src={Image21} alt="Image20" className="lg:w-[32%] xl:w-auto xl:block hidden" />
               </div>
               <div className="absolute !top-[37%] right-0">
                  <img src={Image22} alt="Image20" className="lg:w-[68%] xl:w-auto  xl:block hidden" />
               </div>
               <div className="absolute xl:top-[48%] lg:top-[23%] xl:left-[36%] lg:left-[33%] xl:block hidden">
                  <p className="xl:text-[18px] lg:text-[16px] text-[#333333] font-light text-center">Click on the text or press CMD + K to find your next AI.</p>
                  <div className="flex flex-wrap gap-2">
                     <h1 className="xl:text-[55px] lg:text-[45px] font-extrabold text-[#333333] w-full max-w-[583px] mx-auto">Can AI help with my science project?</h1>
                     <Link to="./SearchPage">
                        <img src={Search1} alt="Search1" />
                     </Link>
                  </div>
               </div>
               <div className="absolute top-[85%] right-[-12%] xl:right-[26%]">
                  <img src={Image23} alt="Image20" className="xl:block hidden " />
               </div>
               <div className="top-[127%] right-[6%] absolute  xl:block hidden">
                  <p className="text-[13px] max-w-[215px] w-full text-center font-light">This search is designed to only show the top curated products for your specific use case</p>
               </div>
            </div>
            {/* <div className=" bg-[#141414B2] opacity-85 z-[1]">
               <div className="bg-[#B7490554] ">
                  <div className="relative poppins font-bold leading-[303px]">
                     <Swiper
                        modules={[
                           Navigation,
                           Pagination,
                           Scrollbar,
                           A11y,
                           Autoplay,
                        ]}
                        spaceBetween={10}
                        slidesPerView={4} // Adjust as needed (set to 1 for full-width images)
                        // pagination={{ clickable: true }}
                        // scrollbar={{ draggable: true }}
                        speed={10000}
                        autoplay={{ delay: 100, disableOnInteraction: false }} // Autoplay config
                        // onSwiper={(swiper) => console.log(swiper)}
                        // onSlideChange={() => console.log("slide change")}
                        className="h-[40vw] !-z-10"
                        loop={true}
                     >
                        <div className="grid grid-cols-4 gap-[15px] md:gap-[33px]">
                           {slides.map((slide, index) => (
                              <SwiperSlide key={index}>
                                 <div
                                    className={
                                       slide.isFlex ? "flex justify-end" : ""
                                    }
                                 >
                                    <motion.img
                                       src={slide.src}
                                       alt=""
                                       className={slide.className}
                                       // sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                 </div>
                              </SwiperSlide>
                           ))}
                        </div>
                     </Swiper>
               <div>
               <div
                        ref={textRef}
                        className="absolute text-[75px] sm:text-[147px] md:text-[185px] lg:text-[250px] xl:text-[280px] 2xl:text-[300px] mt-[91px] max-w-[1190px] mx-auto right-0 left-0 pl-[30px] sm:pl-[85px] md:pl-[70px] lg:pl-[100px] xl:pl-[130px] 2xl:pl-[85px] top-[90px] leading-[75px] sm:leading-none text-left"
                     >
                        {/* First line text */}
            {/* <div className="bg-gradient-to-r from-[#FF7F50]/[60] to-[#ECFF11]/[100] bg-clip-text text-transparent">
                           {isVisible && (
                              <TypeAnimation
                                 sequence={["GenAI", 5000]}
                                 speed={10}
                                 repeat={0}
                                 style={{ display: "inline-block" }}
                                 cursor={false}
                              />
                           )}
                        </div> */}

            {/* Second line text */}
            {/* <div className="text-[#C0C0C0]">
                           {isVisible && (
                              <TypeAnimation
                                 sequence={["is here.", 5000]}
                                 speed={10}
                                 repeat={0}
                                 style={{ display: "inline-block" }}
                                 cursor={false}
                              />
                           )}
                        </div> */}
            {/* </div>
                    </div> */}

            {/* <div
              ref={textRef}
              className="absolute text-[75px] sm:text-[147px] md:text-[185px] lg:text-[250px] xl:text-[280px] 2xl:text-[300px] max-w-[1190px] mx-auto right-0 left-0   pl-[30px] sm:pl-[85px] md:pl-[70px] lg:pl-[100px] xl:pl-[130px] 2xl:pl-[85px] top-0 leading-[75px] sm:leading-none text-center"
            >
              <div className="bg-gradient-to-r from-[#FF7F50]/[60] to-[#ECFF11]/[100] bg-clip-text text-transparent mr-[40px] sm:mr-[80px] md:mr-[100px] lg:mr-[160px]">
                {isVisible && (
                  <TypeAnimation
                    sequence={["GenAI", 5000]}
                    speed={20}
                    repeat={0}
                    style={{ display: "inline-block" }}
                    cursor={false}
                  />
                )}
              </div>
              <div className="text-[#C0C0C0]">
                {isVisible && (
                  <TypeAnimation
                    sequence={["is here.", 5000]}
                    speed={20}
                    repeat={0}
                    style={{ display: "inline-block" }}
                    cursor={false}
                  />
                )}
              </div>
            </div> */}
            {/* </div>
                  <div className="flex flex-col items-center justify-center text-white mt-8 pb-12">
                     <div className="text-center mb-6">
                        <h2 className="text-lg font-semibold">
                           huby search for Alnything
                        </h2>
                     </div>
                     <div className="bg-[#FFFFFFD4] p-6 w-full max-w-[876px] rounded-[30px] ">
                        <div className="flex justify-center items-center text-center flex-col">
                           <div className="relative w-full ">
                              <input
                                 type="text"
                                 placeholder="Whats the easiest AI to make a background song for a video, under $20/month?"
                                 className="w-full px-6 py-3 rounded-[15px] text-black focus:outline-none shadow-md bg-[#80808052]"
                              />
                              <div className="absolute top-1/2 right-4 -translate-y-1/2  p-2 rounded-full border-[2px] border-amber-600 focus:outline-none bg-transparent">

                       <IoSearchSharp className="text-amber-600 text-2xl" />
                              </div>
                           </div>
                           <p className="text-[13px] italic mt-3 text-[#252525] mb-0">
                              Simply enter the details of your project or goals
                              and what types of work you want to get done, and
                              let the magic happen.
                           </p>
                        </div>
                     </div>
                     <div className="mt-4 text-[18px] font-light text-white text-center max-w-md">
                        <p>
                           This search is designed to only show the top-rated
                           products for your specific use case
                        </p>
                     </div>
                  </div>
               </div> */}
            {/* </div> */}

            <div
               ref={ref3}
               className="mt-[24%] flex sm:justify-end justify-center mx-auto gap-[20px] sm:gap-[40px] md:gap-[50px] max-w-[250px] sm:max-w-[460px] md:max-w-[560px] lg:max-w-[790px] xl:max-w-[920px]"
            >
               <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={
                     inView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }
                  }
                  transition={{ duration: 0.8 }}
                  className="poppins text-[30px] sm:text-[52px] lg:text-[64px] bg-gradient-to-r from-[#FF7F50]/[60] to-[#ECFF11]/[100] bg-clip-text text-transparent font-bold cursor-pointer"
                  onClick={() => {
                     const element = document.getElementById("huby-ai-hq");
                     if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                     }
                  }}
               >
                  Harness AI
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={
                     inView3 ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }
                  }
                  transition={{ duration: 0.8 }}
                  className="self-end w-[30px] sm:w-[50px] md:-[72px] lg:w-[82px]"
               >
                  <img src={downArrowIcon} alt="" />
               </motion.div>
            </div>

            <div className="max-w-[250px] sm:max-w-[480px] md:max-w-[578px] lg:max-w-[860px] xl:max-w-[1012px] mx-auto text-center sm:my-[60px] my-[30px]">
               <motion.div
                  ref={ref4}
                  initial={{ opacity: 0, y: -50 }}
                  animate={
                     inView4 ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }
                  }
                  transition={{ duration: 0.8 }}
                  className="md:text-[17px] lg:text-[26px] xl:text-[28px] 2xl:text-[30px] font-[inter] text-justify text-wrap "
               >
                  <span className="font-bold">
                     Artificial intelligence is going to affect everyone, for
                     the best and for the worst.{" "}
                  </span>
                  Soon, every single industry will make use of AI in one way or
                  another. It’s transforming the way that we create things and
                  even conceive the ideas. It’s hard to grasp the true negative
                  effects AI will have in a few years, from theories of world
                  domination to more plausible problems like increasing the
                  wealth and literacy gap. We believe that the full positive
                  potential of AI will be achieved only when it is made{" "}
                  <span className="font-bold">
                     accessible, impactful, and safe for all to use.
                  </span>{" "}
                  In this light, the huby AI ecosystem was created with a vision
                  to
                  <span className="font-bold">
                     {" "}
                     expand the benefits of AI for humanity
                  </span>{" "}
                  by empowering people with positive genAI.
               </motion.div>
               {/*
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mulish flex justify-center gap-[16px] md:gap-[25px] text-white sm:pt-[100px] pt-[30px] sm:pb-[60px] pb-[30px]"
          >
            <Link
              to="/vision"
              //className="bg-[#FA780F] hover:bg-[#303030]  text-[14px] md:text-[16px] w-[100px] sm:w-[126px] h-[49px] rounded-[18px] font-bold"
              //className={` hover:bg-[#3D9D9D] hover:border-[1px] hover:border-[#008080] bg-[#FF7F50] border-[1px] text-[#fff] rounded-[12px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] md:block hidden no-underline`}
              className={` hover:bg-[#3D9D9D] hover:border-[1px] hover:border-[#008080] bg-[#FF7F50] border-[1px] text-[#fff] rounded-[12px] font-normal sm:text-[20px] text-[12px] mulish py-[8px] px-[16px] md:block hidden no-underline`}
            >
              Our vision
            </Link>
            <Link
              to="/dashboard"
              //className="bg-[#303030] hover:bg-[#FF7F50] text-[14px] md:text-[16px] w-[130px] sm:w-[161px] h-[49px] rounded-[18px] font-black"
              className={` hover:bg-[#3D9D9D] hover:border-[1px] hover:border-[#008080] bg-[#0A2239] border-[1px] text-[#fff] rounded-[12px] font-normal sm:text-[20px] text-[12px] mulish py-[8px] px-[16px] md:block hidden no-underline`}
            >
              AI Marketplace
            </Link>
          </motion.div>
          */}
            </div>
         </div>
      </div>
   );
};

export default GenAi;
