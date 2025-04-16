import { motion } from "framer-motion";
import reactIcon from "../../assets/Images/ReactIcon.png";
import southFlorida from "../../assets/Images/southFlorida.png";
import bayArea from "../../assets/Images/bayArea.png";
import findaFocus from "../../assets/Images/findaFocus.png";
import join from "../../assets/Images/join.png";
import countribute from "../../assets/Images/countribute.png";
import hubyAIverseBg1 from "../../assets/Images/hubyAIverseBg1.png";
import hubyAIverseBg2 from "../../assets/Images/hubyAIverseBg2.png";
import hubyAIverseBg3 from "../../assets/Images/hubyAIverseBg3.png";
import hubyAIFounderLogo from "../../assets/Images/hubyAIFounderLogo.png";
import hubyAIFounderBg from "../../assets/Images/hubyAIFounderBg.png";

// const cardVariants = {
//   hidden: {
//     opacity: 1,
//     y: 50, // start the card 50px below
//   },
//   visible: {
//     opacity: 1,
//     y: 0, // move it to its original position
//     transition: {
//       // type: "spring", // smooth spring-like animation
//       type: "", // smooth spring-like animation
//       // stiffness: 100, // lower stiffness for a softer motion
//       damping: 15, // damping for more control
//       // duration: 0.6, // same duration
//     },
//   },
// };

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const scrollVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};
const animationVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const HubyAiHqInfo = () => {
  return (
    <div className="hubinfo mt-[50px]">
      <div className="sm:max-w-[567px] lg:max-w-[950px] mx-auto md:py-[50px] py-[30px]">
        <div>
          <img src={reactIcon} alt="" className="mx-auto" />
        </div>
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          className="poppins md:text-[30px] lg:text-[40px] xl:text-[48px] text-[27px] sm:max-w-[510px] lg:max-w-[875px] text-center mx-auto px-3 "
        >
          <span className="text-[#FF7F50] font-bold">3</span> ways{" "}
          <span className="poppins bg-gradient-to-r from-[#FF7F50]/[60] to-[#ECFF11]/[100] bg-clip-text text-transparent font-bold">
            huby AIverse{" "}
          </span>
          is designed for you to{" "}
          <span className="font-bold">get the most out of AI</span>
        </motion.div>
      </div>
      <div className="font-[AlteHaasGrotesk]">
        <div className="">
          <div
            className={`bg-[url(${hubyAIverseBg1})] bg-no-repeat bg-[length:600px_600px] md:bg-[length:auto_auto] bg-center lg:bg-right `}
          >
            <motion.div
              variants={titleVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              className=" flex flex-col gap-[20px] md:py-[230px] py-[45px] mx-auto px-[20px] md:px-[200px] 2xl:px-[250px] items-center md:items-start"
            >
              <div className="md:ml-[122px] text-[#FF7F50] text-[38px] lg:text-[48px] font-bold">
                1
              </div>
              <div className="">
                <div className="text-[24px] md:text-[36px] lg:text-[42px] xl:text-[48px] poppins max-w-[300px] sm:max-w-[390px]">
                  Learn what
                  <span className="bg-gradient-to-r from-[#FF7F50]/[60] to-[#ECFF11]/[100] bg-clip-text text-transparent font-bold">
                    {" "}
                    matters to you.
                  </span>
                </div>
                <div className="md:text-[18px] lg:text-[20px] xl:text-[22px] font-[inter] max-w-[290px]">
                  Our community doesn't just provide news and insights about AI;
                  it offers opportunities for you to apply your knowledge in
                  ways that are meaningful to you.
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:mx-[100px] md:mx-[80px] mx-[20px] gap-[21px] justify-between py-[40px]">
            {[
              {
                title: "Gain essential AI insights",
                description:
                  "From AI tips & hacks to macro insights or technical knowledge, learn something new that you can apply.",
                buttonText: "Learn something",
                url: "https://join.slack.com/t/hubyaiverse/shared_invite/zt-2scwievzq-PLdw3rf5_zfLorjy42ZZRQ",
              },
              {
                title: "Upcoming online event",
                description:
                  "An interactive session: “Why everyone must adopt AI?”",
                buttonText: "Sign up",
                url: "https://docs.google.com/forms/d/1-kDE4dF9ofF975j1UckNxOE1WKCXlbPrPryDkAUNWdU/",
              },
              {
                title: "Learn how others are using AI",
                description:
                  "Connect with people in your industry and find out the best solutions and use cases today.",
                buttonText: "Join now",
                url: "https://join.slack.com/t/hubyaiverse/shared_invite/zt-2scwievzq-PLdw3rf5_zfLorjy42ZZRQ",
              },
              {
                title: "Be the first to try the newest AI’s.",
                description:
                  "Work with incredible and lesser-known AI solutions, some that haven’t even been released yet, in our beta community.",
                buttonText: "Join now",
                url: "https://docs.google.com/forms/d/1U_EMmFvcN2gsUpmLOo1y7ClOI95zgUCctH73T1GnGhI/",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                variants={animationVariants}
                transition={{ duration: 0.5 }}
                className="flex flex-col hover:!scale-110 transition-all duration-[400ms] ease-in justify-between text-white bg-[#252525] max-w-[333px] p-[18px] lg:p-[24px] rounded-2xl mx-auto"
              >
                <div className="">
                  <div className="md:text-[24px] xl:text-[30px] mb-[14px] font-bold">
                    {card.title}
                  </div>
                  <div className="md:text-[16px] xl:text-[22px]">
                    {card.description}
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    className="mulish border border-white hover:bg-[#FF7F50] hover:!border-[#FF7F50] py-[6px] px-[16px] lg:px-[20px] rounded-lg xl:rounded-xl my-[14px]"
                    onClick={() => window.open(card.url, "_blank")}
                  >
                    {card.buttonText}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="">
          <div className={`bg-[url(${hubyAIverseBg2})] bg-no-repeat bg-center`}>
            <motion.div
              variants={titleVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-[20px] md:py-[260px] py-[45px] mx-auto px-[20px] md:px-[100px] 2xl:px-[250px] items-center"
            >
              <div className="md:mr-[122px] text-[#FF7F50] text-[48px] font-bold mx-auto ">
                2
              </div>
              <div className="">
                <div className="text-[24px] md:text-[36px] lg:text-[42px] xl:text-[48px] poppins max-w-[300px] md:max-w-[560px]">
                  <span className="bg-gradient-to-r from-[#FF7F50]/[60] to-[#ECFF11]/[100] bg-clip-text text-transparent font-bold">
                    {" "}
                    Achieve more{" "}
                  </span>{" "}
                  through connections.
                </div>
                <div className="md:text-[18px] lg:text-[20px] xl:text-[22px] font-[inter] max-w-[300px] md:max-w-[650px]">
                  Maximize your potential by collaborating with the right people
                  in AI. Join an engaged network of amazing individuals with
                  diverse skills.
                </div>
              </div>
            </motion.div>
          </div>
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:mx-[100px] md:mx-[80px] mx-[20px] gap-[21px]  justify-between py-[40px]">
            {[
              {
                title: "Networking",
                description:
                  "Meet the right people for whatever you’re working on in AI.",
                buttonText: "Network",
                url: "https://join.slack.com/t/hubyaiverse/shared_invite/zt-2scwievzq-PLdw3rf5_zfLorjy42ZZRQ",
              },
              {
                title: "Bay Area locals",
                description: "Connect with other great minds from the Valley.",
                buttonText: "Join now",
                background: bayArea,
                url: "https://join.slack.com/t/hubyaiverse/shared_invite/zt-2scwievzq-PLdw3rf5_zfLorjy42ZZRQ",
              },
              {
                title: "South Florida locals",
                description:
                  "A place to network and collaborate with local Miamians for everything AI.",
                buttonText: "Join now",
                background: southFlorida,
                url: "https://join.slack.com/t/hubyaiverse/shared_invite/zt-2scwievzq-PLdw3rf5_zfLorjy42ZZRQ",
              },
              {
                title: "Find a focus group",
                description:
                  "A working or learning group: a close circle of peers that will help you reach your AI goals.",
                buttonText: "Sign up",
                background: findaFocus,
                url: "https://docs.google.com/forms/d/1txPlUVJW61Bz2xZ8YMkEV8Vkrkn_ul9yUjEt-xKqbhE/",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                variants={animationVariants}
                transition={{ duration: 0.5 }}
                className={`flex flex-col hover:!scale-110 transition-all duration-500 ease-in justify-between text-white max-w-[333px] p-[18px] lg:p-[24px] rounded-2xl mx-auto ${
                  card.background
                    ? `bg-[url(${card.background})] bg-cover`
                    : "bg-[#252525]"
                }`}
              >
                <div className="">
                  <div className="md:text-[24px] xl:text-[30px] mb-[14px] font-bold">
                    {card.title}
                  </div>
                  <div className="md:text-[16px] xl:text-[22px]">
                    {card.description}
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    className="mulish border border-white hover:bg-[#FF7F50] hover:!border-[#FF7F50] py-[6px] px-[16px] lg:px-[20px] rounded-lg xl:rounded-xl my-[14px]"
                    onClick={() => window.open(card.url, "_blank")}
                  >
                    {card.buttonText}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="">
          <div
            className={`bg-[url(${hubyAIverseBg3})] bg-no-repeat bg-[length:900px_800px] bg-[-230px]`}
          >
            <motion.div
              variants={titleVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-[20px] md:py-[260px] py-[45px] mx-auto px-[20px] md:px-[100px] 2xl:px-[250px] items-center md:items-end"
            >
              <div className="md:mr-[342px] text-[#FF7F50] text-[48px] font-bold ">
                3
              </div>
              <div className="">
                <div className="text-[24px] md:text-[36px] lg:text-[42px] xl:text-[48px] poppins max-w-[300px] md:max-w-[590px]">
                  Take action to
                  <span className="bg-gradient-to-r from-[#FF7F50]/[60] to-[#ECFF11]/[100] bg-clip-text text-transparent font-bold">
                    {" "}
                    leverage your expertise.{" "}
                  </span>
                </div>
                <div className="md:text-[18px] lg:text-[20px] xl:text-[22px] font-[inter] max-w-[300px] md:max-w-[510px]">
                  Now more than ever, there are opportunities to capitalize on
                  emerging technologies. Move beyond theory—experiment with AI,
                  implement it, create apps, and use your expertise to make a
                  real impact.
                </div>
              </div>
            </motion.div>
          </div>
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:mx-[100px] md:mx-[80px] mx-[20px] gap-[21px] justify-between py-[40px]">
            {[
              {
                title: "Contribute your unique insights to shape future tech.",
                description:
                  "Give your input to help founders improve emerging AIs.",
                buttonText: "Begin",
                background: countribute,
                url: "https://docs.google.com/forms/d/1U_EMmFvcN2gsUpmLOo1y7ClOI95zgUCctH73T1GnGhI/",
              },
              {
                title: "Join exciting projects",
                description:
                  "Our first community project is live: a collective mural.",
                buttonText: "Participate",
                background: join,
                url: "https://huby.ai",
              },
              {
                title: "Become a huby AIverse leader",
                description:
                  "Contribute your expertise in a meaningful way, from writing articles to mentoring AI startups.",
                buttonText: "Apply now",
                url: "https://docs.google.com/forms/d/1zxoH9NhrRf2wkfKidugkBJ-OkQ2wwLpTPmur8TVI99Y/",
              },
              {
                title: "Build the future with us",
                description:
                  "We’re open to collaborating with any organization, startup, or individual with a shared goal to expand the benefits of AI to humanity. Let’s explore potential synchronies!",
                buttonText: "Reach out",
                url: "https://calendly.com/gl-huby/30min",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                variants={animationVariants}
                transition={{ duration: 0.5 }}
                className={`flex flex-col hover:!scale-110 transition-all duration-500 ease-in justify-between text-white max-w-[333px] p-[18px] lg:p-[24px] rounded-2xl mx-auto ${
                  card.background
                    ? `bg-[url(${card.background})] bg-cover`
                    : "bg-[#252525]"
                }`}
              >
                <div className="">
                  <div className="md:text-[24px] xl:text-[30px] mb-[14px] font-bold">
                    {card.title}
                  </div>
                  <div className="md:text-[16px] xl:text-[22px]">
                    {card.description}
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    className="mulish border border-white hover:bg-[#FF7F50] hover:!border-[#FF7F50] py-[6px] px-[16px] lg:px-[20px] rounded-lg xl:rounded-xl my-[14px]"
                    onClick={() => window.open(card.url, "_blank")}
                  >
                    {card.buttonText}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="xl:py-[200px] md:py-[100px] py-[80px] px-[22px] sm:px-[70px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={scrollVariants}
          className={`bg-[url(${hubyAIFounderBg})] bg-cover flex flex-col md:gap-[50px] gap-[25px] text-white max-w-[1238px] mx-auto text-center px-[24px] sm:px-[50px] lg:px-[100px] xl:px-[166px] py-[78px] p-[20px] rounded-[25px]`}
        >
          <img
            src={hubyAIFounderLogo}
            alt="hubyAIFounderLogo"
            className="max-w-[60px] md:max-w-[101px] mx-auto"
          />
          <div className="poppins xl:text-[64px] sm:text-[34px] text-[25px] font-bold">
            huby AI founders network
          </div>
          <div className="font-[AlteHaasGrotesk] xl:text-[27px] md:text-[24px] text-[16px]  ">
            Accelerate your AI startup's success by becoming part of a
            specialized global network of emerging AI companies. Collaborate
            with like-minded founders, learn from others, receive support, and
            potentially integrate with other AI teams. Access personalized
            opportunities to make your venture more impactful and increase
            adoption. Build, engage, and scale your community as you grow your
            startup. Leverage collective expertise, exclusive resources, and an
            engaged network to achieve your goals faster.
          </div>
          <div className="mulish flex flex-col md:flex-row justify-center items-center gap-12 md:gap-16">
            <div className="bg-[#2E2E2E] py-[16px] md:py-[25px] px-[18px] md:px-[35px] rounded-[15px]">
              <div className="sm:text-[18px] xl:text-[22px] tracking-[-1px] mb-[16px] max-w-[208px] text-center md:text-start">
                Become a member of the network and group chat.
              </div>
              <button
                className="text-[12px] hover:bg-[#FF7F50] hover:!border-[#FF7F50] xl:text-[14px] inline-block border py-[8px] xl:py-[10px] px-[16px] xl:px-[20px] rounded-[13px] xl:rounded-[15px] "
                onClick={() =>
                  window.open(
                    "mailto:support@huby.ai&subject=AI Founders Network&body=Hi, I'm an AI founder in genAI area. I would like to join/network with fellow founders.",
                    "_blank"
                  )
                }
              >
                Join now
              </button>
            </div>
            <div className="bg-[#2E2E2E] py-[16px] md:py-[25px] px-[18px] md:px-[35px] rounded-[15px]">
              <div className="sm:text-[18px] xl:text-[22px] tracking-[-1px] mb-[16px] max-w-[208px] text-center md:text-start">
                Tell us about your venture for a chance to be featured.
              </div>
              <button
                className="text-[12px] hover:bg-[#FF7F50] hover:!border-[#FF7F50] xl:text-[14px] inline-block border py-[8px] xl:py-[10px] px-[16px] xl:px-[20px] rounded-[13px] xl:rounded-[15px]"
                onClick={() =>
                  window.open(
                    "https://docs.google.com/forms/d/1Lq_jGH6oZ8lTQK9Co2huVmXr6RQjjXHgYzm7NvqV5eU",
                    "_blank"
                  )
                }
              >
                Share your venture
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HubyAiHqInfo;
