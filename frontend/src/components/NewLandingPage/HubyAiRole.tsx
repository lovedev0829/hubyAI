import { motion } from "framer-motion";
import hubyAiRoleUserIcon from "../../assets/Images/hubyAiRoleUserIcon.png";
import { useEffect, useRef, useState } from "react";
import { TypeAnimation } from "react-type-animation";

const HubyAiRole = () => {
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
      <div className="py-[50px] md:py-[100px] lg:py-[150px] px-[30px] sm:px-[50px] md:px-[70px] lg:px-[80px] xl:px-[20px]">
        <div className="text-center flex flex-col gap-[16px]">
          <motion.img
            src={hubyAiRoleUserIcon}
            alt=""
            className="mx-auto"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }} // Animation for the icon
          />
          <div
            className="poppins text-[26px] sm:text-[40px] lg:text-[50px] xl:text-[64px] text-[#E5461A] font-bold"
            ref={textRef}
          >
            {isVisible && (
              <TypeAnimation
                sequence={["Choose your role.", 5000]}
                speed={20}
                repeat={0}
                style={{ display: "inline-block" }}
                cursor={false}
              />
            )}
          </div>
          <motion.div
            className="font-[AlteHaasGrotesk] text-[18px] sm:text-[26px] lg:text-[32px] xl:text-[48px] sm:max-w-[550px] lg:max-w-[675px] xl:max-w-[1043px] mx-auto"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }} // Animation for the subtitle
          >
            We’re eager to hear your input and would love to implement some of
            your ideas.
          </motion.div>
        </div>

        <div className="grid grid-cols-1 px-[10px] sm:px-[80px] md:px-0 md:grid-cols-3 gap-[20px] md:gap-[30px] lg:gap-[30px] xl:gap-[50px] 2xl:gap-[96px] lg:!gap-y-[50px] xl:!gap-y-[70px] text-[#ffffff] pt-[50px] md:pt-[100px] pb-[30px]">
          {[
            {
              title: "Collaborate or partner with us!",
              buttonText: "Explore possibilities",
              delay: 0.3,
              url: "mailto:support@huby.ai&subject=Collaboration/partnership with huby&body=Hi, I'm interesting in collaborating/partnering with you.",
            },
            {
              title: "Speak at an event or host your own.",
              buttonText: "Propose your idea",
              delay: 0.4,
              url: "mailto:support@huby.ai&subject=Proposing an idea&body=Hi, here's an idea that I would like to propose.",
            },
            {
              title: "Send us a message!",
              buttonText: "Contact us",
              delay: 0.5,
              url: "mailto:support@huby.ai&subject=Contacting huby",
            },
            {
              title: "Have a virtual coffee with us.",
              buttonText: "Schedule",
              delay: 0.6,
              rowSpan: 2,
              url: "mailto:support@huby.ai&subject=Interested in virtual coffee",
            },
            {
              title: "Any ideas or suggestions for huby?",
              buttonText: "Share your thoughts",
              url: "mailto:support@huby.ai&subject=Sharing some ideas",
              delay: 0.7,
            },
            {
              title: "Apply for an internship or part-time position.",
              buttonText: "Reach out",
              delay: 0.8,
              url: "mailto:support@huby.ai&subject=Interest in internship at huby&body=Hi, I'm interested in doing internship at huby. Attached is my resume (attach).",
            },
            {
              title: "Send us a message!",
              buttonText: "Contact us",
              delay: 0.9,
              url: "mailto:support@huby.ai&subject=Contact huby",
            },
            {
              title: "Apply for a role on the founding team.",
              buttonText: "Reach out",
              delay: 1.0,
              url: "mailto:support@huby.ai&subject=Founding team role&body=Hi, I'm interested in joining the huby team. Attached is my resume (attach it).",
            },
          ].map((card, index) => (
            <div
              key={index}
              className={`bg-[#000000] flex flex-col hover:!scale-110 transition-all p-[24px] lg:p-[26px] xl:p-[30px] gap-[30px] rounded-[15px] justify-between ${
                card.rowSpan ? "row-span-2" : ""
              }`}
            >
              <div className="mulish text-[16px] lg:text-[20px] xl:text-[25px]">
                {card.title}
              </div>
              <div className="mx-auto">
                <button
                  className="mulish text-[12px] lg:text-[14px] border border-white hover:!border-[#E5461A] px-[12px] lg:px-[20px] py-[8px] lg:py-[13px] rounded-[10px] lg:rounded-[15px] hover:bg-[#E5461A] "
                  onClick={() => window.open(card.url, "_blank")}
                >
                  {card.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HubyAiRole;
