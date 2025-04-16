import { motion } from "framer-motion";
// import reactIcon from "../../assets/Images/ReactIcon.png";
import checkIcon from "../../assets/Images/check_icon.png";
import Lock from "../../assets/Images/lock.png"
import Add from "../../assets/Images/add.png"
import Bgstar from "../../assets/Images/bg-star.png"
import Impactful from "../../assets/Images/impactful.png"
import Ecosystem from "../../assets/Images/ecosystem.png"
import Bgcuration from "../../assets/Images/hubby-curation.png"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const HubyAiCuration = () => {
  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
       <div className="max-w-[1138px] pt-[40px] md:pt-[80px] pb-[120px] md:pb-[180px] mx-[20px] sm:mx-auto rounded-[10px] text-[#ffffff]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={animationVariants}
            transition={{ duration: 0.5 }}
          >
            {/* <img src={reactIcon} alt="" className="mx-auto" /> */}
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={animationVariants}
            transition={{ duration: 0.5 }}
            className="poppins text-[20px] sm:text-[30px] text-[#252525]  max-w-[400px] sm:max-w-[523px] md:max-w-[500px] lg:max-w-[625px] xl:max-w-[1220px] text-center mx-auto py-[36px]"
          >
            <span className="poppins text-[#252525] font-bold">
              {" "}
              huby curation
            </span>{" "}
            powers both the creation and the discovery of the{" "}
            <span className="font-bold"> best genAI.</span>
        </motion.div>
        <div className="grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-center gap-2 mt-10">
         <div className="flex justify-center items-center">
          <div className="bg-[#333333] rounded-full w-[124px] h-[124px] flex flex-col justify-center items-center text-center">
            <img src={Lock} alt="lock" />
            <p className="text-[13px] text-[#FDD0B5] font-semibold text-center mt-1">Safe & Private</p>
          </div>
         </div>
        <div className="flex justify-center items-center">
          <div className="bg-[#333333] rounded-full w-[124px] h-[124px] flex flex-col justify-center items-center text-center">
            <img src={Bgstar} alt="lock" />
            <p className="text-[13px] text-[#FDD0B5] font-semibold text-center mt-1">High Quality</p>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="bg-[#333333] rounded-full w-[124px] h-[124px] flex flex-col justify-center items-center text-center">
            <img src={Add} alt="lock" />
            <p className="text-[13px] text-[#FDD0B5] font-semibold text-center mt-1">Accessibile</p>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="bg-[#333333] rounded-full w-[124px] h-[124px] flex flex-col justify-center items-center text-center">
            <img src={Impactful} alt="lock" />
            <p className="text-[13px] text-[#FDD0B5] font-semibold text-center mt-1">Impactful</p>
          </div>
         </div>
        <div className="flex justify-center items-center">
          <div className="bg-[#333333] rounded-full w-[124px] h-[124px] flex flex-col justify-center items-center text-center">
            <img src={Ecosystem} alt="lock" />
            <p className="text-[13px] text-[#FDD0B5] font-semibold text-center mt-1">Ecosystem</p>
           </div>
        </div>
        </div>
        <div className="flex justify-center">
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-4 xl:justify-between justify-center mt-20">
          <div className="bg-curation bg-no-repeat bg-cover rounded-[10px] h-full max-h-[381px] w-full max-w-[621px]">
             <p className="max-w-[624px] w-full text-white text-[14px] sm:text-[18px] pt-14 pb-2 pl-6">At huby, we are developing a genAI curation system designed to holistically analyze AI solutions and uncover their true value to individuals and society. Our standardized methodology, built upon key criteria, forms the backbone of our curation process. By accurately assessing an app's position, we help it either increase product acceptance or gain the visibility it deserves if groundbreaking. While AI enables efficient and comprehensive analysis, final decisions are grounded in personal testing and experience. Each AI solution receives a base rating that evolves with user feedback, continuously refining our system.</p>
          </div>
          <div>
             <img src={Bgcuration} alt="Bgcuration" className="h-full max-h-[381px] w-full max-w-[621px]" />
          </div>
        </div>
        </div>
{/* 
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={animationVariants}
            transition={{ duration: 0.5 }}
            className="font-[AlteHaasGrotesk] sm:text-[16px] md:text-[18px] lg:text-[22px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[850px] xl:max-w-[906px] text-center mx-auto text-[#ffffff]"
          >
            At huby, we are developing a genAI curation system designed to
            holistically analyze AI solutions and uncover their true value to
            individuals and society. Our standardized methodology, built upon
            key criteria, forms the backbone of our curation process. By
            accurately assessing an app's position, we help it either increase
            product acceptance or gain the visibility it deserves if
            groundbreaking. While AI enables efficient and comprehensive
            analysis, final decisions are grounded in personal testing and
            experience. Each AI solution receives a base rating that evolves
            with user feedback, continuously refining our system.
          </motion.div> */}
        </div>
      <div className="hubinfo bg-[#252525] ">
        {/* <div className="max-w-[1138px] pt-[40px] md:pt-[80px] pb-[120px] md:pb-[180px] mx-[20px] sm:mx-auto rounded-[10px] text-[#ffffff]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={animationVariants}
            transition={{ duration: 0.5 }}
          >
            <img src={reactIcon} alt="" className="mx-auto" />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={animationVariants}
            transition={{ duration: 0.5 }}
            className="poppins text-[20px] sm:text-[26px] md:text-[32px] lg:text-[40px] xl:text-[64px] max-w-[400px] sm:max-w-[523px] md:max-w-[500px] lg:max-w-[625px] xl:max-w-[982px] text-center mx-auto py-[36px]"
          >
            <span className="poppins bg-gradient-to-r from-[#FF7F50]/[50] via-[#FF7F50] to-[#ECFF11]/[100] bg-clip-text text-transparent font-bold">
              {" "}
              huby curation
            </span>{" "}
            powers both the creation and the discovery of the{" "}
            <span className="font-bold"> best genAI.</span>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={animationVariants}
            transition={{ duration: 0.5 }}
            className="font-[AlteHaasGrotesk] sm:text-[16px] md:text-[18px] lg:text-[22px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[850px] xl:max-w-[906px] text-center mx-auto text-[#ffffff]"
          >
            At huby, we are developing a genAI curation system designed to
            holistically analyze AI solutions and uncover their true value to
            individuals and society. Our standardized methodology, built upon
            key criteria, forms the backbone of our curation process. By
            accurately assessing an app's position, we help it either increase
            product acceptance or gain the visibility it deserves if
            groundbreaking. While AI enables efficient and comprehensive
            analysis, final decisions are grounded in personal testing and
            experience. Each AI solution receives a base rating that evolves
            with user feedback, continuously refining our system.
          </motion.div>
        </div> */}
        <div className="bg-[#FFFBF6] rounded-[10px] font-[AlteHaasGrotesk] mx-[20px] sm:mx-[60px] lg:mx-[80px] xl:mx-[150px]">
          <div className="">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={animationVariants}
              transition={{ duration: 0.5 }}
              className="poppins text-[#E5461A] text-[22px] sm:text-[30px] md:text-[36px] lg:text-[46px] xl:text-[48px] font-bold text-center pt-[50px] md:pt-[100px] lg:pt-[130px]"
            >
              The curation process
            </motion.div>
            <div className="py-[50px] md:py-[100px] px-[16px] md:px-[25px]">
              <div className="max-w-[450px] sm:max-w-[550px] md:max-w-[600px] lg:max-w-[890px] mx-auto mb-[30px] md:mb-[60px]">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={animationVariants}
                  transition={{ duration: 0.5 }}
                  className="text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[33px] text-[#666666] font-bold"
                >
                  1. Submission of an AI solution
                </motion.div>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={animationVariants}
                  transition={{ duration: 0.5 }}
                  className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] text-[#252525] md:ml-[40px] py-[24px]"
                >
                  Developers can showcase their unique AI solutions,
                  highlighting their value and functionality compared to
                  competitors, and gain access to a community of engaged AI
                  users. AI enthusiasts can contribute by submitting their
                  favorite apps to increase their visibility within the
                  community and earn rewards. We accept any submission—from
                  prototypes and betas to established solutions.
                </motion.div>
              </div>
              <div className="max-w-[450px] sm:max-w-[550px] md:max-w-[600px] lg:max-w-[890px] mx-auto mb-[30px]">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={animationVariants}
                  transition={{ duration: 0.5 }}
                  className="text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[33px] text-[#666666] font-bold"
                >
                  2. huby approval process
                </motion.div>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={animationVariants}
                  transition={{ duration: 0.5 }}
                  className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] text-[#252525] md:ml-[40px] py-[24px]"
                >
                  Each app undergoes the Huby approval process to ensure it
                  meets our benchmarks for safety, impact, and quality. If an
                  app is not approved, developers receive actionable feedback to
                  help them improve. For users, this guarantees access to only
                  the highest quality and safest solutions that offer unique
                  value.
                </motion.div>
              </div>
            </div>

            <div className="bg-[#FF7F50] py-[30px] md:py-[44px] -mx-[20px] sm:-mx-[60px] lg:-mx-[80px] xl:-mx-[150px]">
              <div className="max-w-[283px] text-[18px] md:text-[20px] lg:text-[30px] leading-[34px] text-[#ffffff] md:ml-[100px] font-bold text-center mb-2">
                huby criteria for exceptional AI
              </div>
              <div className=" md:mx-20 lg:mx-32">
                <Swiper
                  // install Swiper modules
                  modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                  spaceBetween={50}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  // scrollbar={{ draggable: true }}
                  // onSwiper={(swiper) => console.log(swiper)}
                  // onSlideChange={() => console.log("slide change")}
                  // autoplay={{ delay: 3000, disableOnInteraction: false }}
                  className="text-center font-bold "
                >
                  <SwiperSlide className="w-[280px] mb-[80px] ">
                    <div className="text-[#CC2C00] text-[36px] sm:text-[50px] md:text-[50px] lg:text-[120px] xl:text-[200px]">
                      Safe
                    </div>
                    <div className="text-[#ffffff] md:text-[20px] lg:text-[30px]">
                      Privacy, ethics, security
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div>
                      <div className="text-[#CC2C00] text-[36px] sm:text-[50px] md:text-[50px] lg:text-[120px] xl:text-[200px]">
                        Valuable
                      </div>
                      <div className="text-[#ffffff] md:text-[20px] lg:text-[30px]">
                        Solving a true problem, Unique differentiation,
                        Cost-effective
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div>
                      <div className="text-[#CC2C00] text-[36px] sm:text-[50px] md:text-[50px] lg:text-[120px] xl:text-[200px]">
                        Quality
                      </div>
                      <div className="text-[#ffffff] md:text-[20px] lg:text-[30px]">
                        Output quality, Reliability, Experience Quality (UI/UX)
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div>
                      <div className="text-[#CC2C00] text-[36px] sm:text-[50px] md:text-[50px] lg:text-[120px] xl:text-[200px]">
                        Practical
                      </div>
                      <div className="text-[#ffffff] md:text-[20px] lg:text-[30px]">
                        Privacy, Security, Transparency
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div>
                      <div className="text-[#CC2C00] text-[36px] sm:text-[50px] md:text-[50px] lg:text-[120px] xl:text-[200px]">
                        Impactful
                      </div>
                      <div className="text-[#ffffff] md:text-[20px] lg:text-[30px]">
                        Vision and mission, Measurable impact, Scalable impact
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
              <div className="flex justify-center md:justify-end md:mr-[100px]">
                <div className="flex text-[#252525] bg-[rgba(162,162,162,0.19)] h-[40px] rounded-xl w-full max-w-[280px] sm:max-w-[320px] items-center md:mb-[0px] my-[40px]">
                  <input
                    type="text"
                    className="bg-transparent flex-1 placeholder:text-[#252525] placeholder:text-[12px] w-[85%] text-ellipsis focus:outline-none px-3"
                    placeholder="What do you think is most important or missing?"
                  />
                  <div className="bg-[#FA780F] rounded-full flex-shrink-0 mr-[10px] my-[10px] w-[30px] h-[30px] flex items-center justify-center ">
                    <img src={checkIcon} alt="" className="p-[5px] " />
                  </div>
                </div>
              </div>
            </div>

            <div className="py-[40px] md:py-[60px] px-[16px] md:px-[25px]">
              <div className="max-w-[450px] sm:max-w-[550px] md:max-w-[600px] lg:max-w-[890px] mx-auto mb-[30px] md:mb-[60px]">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={animationVariants}
                  transition={{ duration: 0.5 }}
                  className="text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[33px] text-[#666666] font-bold"
                >
                  3. Assignment of composite rating
                </motion.div>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={animationVariants}
                  transition={{ duration: 0.5 }}
                  className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] text-[#252525] md:ml-[40px] py-[24px]"
                >
                  Regardless of approval status, each app is assigned a rating
                  by the Huby curation team across various dimensions,
                  culminating in a composite score. This helps developers
                  understand their standing and allows users to easily assess
                  the overall value of an app.
                </motion.div>
              </div>
              <div className="max-w-[450px] sm:max-w-[550px] md:max-w-[600px] lg:max-w-[890px] mx-auto mb-[30px] md:mb-[60px]">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={animationVariants}
                  transition={{ duration: 0.5 }}
                  className="text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[33px] text-[#666666] font-bold"
                >
                  4. Solution published on the marketplace
                </motion.div>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={animationVariants}
                  transition={{ duration: 0.5 }}
                  className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] text-[#252525] md:ml-[40px] py-[24px]"
                >
                  Upon approval, the app is published on our marketplace,
                  boosting its visibility among target users. Users benefit from
                  a personalized browsing experience, making it easy to find
                  apps that meet their specific needs.
                </motion.div>
              </div>
              <div className="max-w-[450px] sm:max-w-[550px] md:max-w-[600px] lg:max-w-[890px] mx-auto  md:mb-[60px]">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={animationVariants}
                  transition={{ duration: 0.5 }}
                  className="text-[18px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[33px] text-[#666666] font-bold"
                >
                  5. Continuous feedback and growth
                </motion.div>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  variants={animationVariants}
                  transition={{ duration: 0.5 }}
                  className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] text-[#252525] md:ml-[40px] py-[24px]"
                >
                  The solution becomes part of an ongoing feedback loop, where
                  engaged users help shape its rating and its future with their
                  expert insights—whether for core functionality or new
                  features. This deepens the connection between the solution and
                  its user base, enhancing user experience and ultimately
                  leading to a higher-quality solution.
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubyAiCuration;
