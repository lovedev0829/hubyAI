import { motion } from "framer-motion";
import searchIcon from "../../assets/Images/searchIcon.png";

const HubyAiContributor = () => {
  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <div>
      <div className="text-center md:pt-[150px] py-[80px] bg-[#252525] px-[40px] md:px-[60px]">
        <motion.img
          src={searchIcon}
          alt=""
          className="mx-auto mb-[40px]"
          initial="hidden"
          whileInView="visible"
          variants={animationVariants}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="poppins text-[16px] sm:text-[26px] md:text-[30px] lg:text-[34px] xl:text-[38px] font-bold  md:max-w-[725px] mx-auto text-white"
          initial="hidden"
          whileInView="visible"
          variants={animationVariants}
          transition={{ duration: 0.5 }}
        >
          Be more than a consumer of AI. Be an innovator. Be a contributor.
        </motion.div>

        <div className="font-[AlteHaasGrotesk] flex flex-col md:flex-row justify-between gap-[20px] 2xl:gap-[50px] py-[70px] md:py-[100px] md:px-[20px] lg:px-[50px] text-left">
          <motion.div
            className="bg-white text-[#252525] hover:!scale-110 transition-all p-[15px] md:p-[12px] lg:p-[25px] xl:p-[30px] rounded-[10px] flex flex-col gap-[13px]"
            initial="hidden"
            whileInView="visible"
            variants={animationVariants}
            transition={{ duration: 0.5 }}
          >
            <div className="md:text-[20px] lg:text-[24px] xl:text-[28px] 2xl:text-[30px] font-bold">
              Join the feedback loop.
            </div>
            <div className="xl:text-[20px] 2xl:text-[22px]">
              Co-create the AI of tomorrow. Share your voice and ideas, and
              watch them be implemented into new and potentially revolutionary
              AI startups.
            </div>
          </motion.div>

          <motion.div
            className="bg-white text-[#252525] hover:!scale-110 transition-all p-[15px] md:p-[12px] lg:p-[25px] xl:p-[30px] rounded-[10px] flex flex-col gap-[13px]"
            initial="hidden"
            whileInView="visible"
            variants={animationVariants}
            transition={{ duration: 0.5 }}
          >
            <div className="md:text-[20px] lg:text-[24px] xl:text-[28px] 2xl:text-[30px] font-bold">
              Measure your impact and progress.
            </div>
            <div className="xl:text-[20px] 2xl:text-[22px]">
              Build your reputation and earn rewards through meaningful
              opportunities and challenges that support you, the community, or
              the larger vision.
            </div>
          </motion.div>

          <motion.div
            className="bg-white text-[#252525] hover:!scale-110 transition-all p-[15px] md:p-[12px] lg:p-[25px] xl:p-[30px] rounded-[10px] flex flex-col gap-[13px]"
            initial="hidden"
            whileInView="visible"
            variants={animationVariants}
            transition={{ duration: 0.5 }}
          >
            <div className="md:text-[20px] lg:text-[24px] xl:text-[28px] 2xl:text-[30px] font-bold">
              Share your work
            </div>
            <div className="xl:text-[20px] 2xl:text-[22px]">
              Showcase what you're working on—from personal projects to new
              business ventures—and how you use AI.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HubyAiContributor;
