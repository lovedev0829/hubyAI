import { useState, useEffect } from "react";

const ScrollBar = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            console.log("object==", entry.target.id);
          }
        });
      }
      // {
      //   threshold: 0.1, // Set intersection threshold at 10% of the section visibility
      //   rootMargin: "0px 0px -30% 0px", // Adjust to make the section "appear" earlier
      // }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect(); // Cleanup observer on component unmount
  }, []);

  const handleClick = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hidden md:block">
      <div className="fixed font-[AlteHaasGrotesk] z-10 text-center text-[16px] xl:text-[22px] flex flex-row-reverse rotate-[270deg] top-[462px] -left-[375px] w-[820px] ">
        <div
          className={`border-t-[5px] sm:border-t-[8px] lg:border-t-[10px] ${
            activeSection === "gen-ai"
              ? "border-[#FF7F50] text-[#FF7F50] "
              : "border-[#CFCFCF] text-[#b0b0b0] "
          } hover:cursor-pointer px-[10px] leading-5   lg:pt-[10px]`}
          onClick={() => handleClick("gen-ai")}
        >
          Intro
        </div>
        <div
          className={`border-t-[5px] sm:border-t-[8px] lg:border-t-[10px]  ${
            activeSection === "huby-ai-hq"
              ? "border-[#FF7F50] text-[#FF7F50] "
              : "border-[#CFCFCF] text-[#b0b0b0] "
          } hover:cursor-pointer px-[10px] leading-5  lg:pt-[10px]`}
          onClick={() => handleClick("huby-ai-hq")}
        >
          huby AIverse
        </div>
        {/* <div
          className={`border-t-[5px] sm:border-t-[8px] lg:border-t-[10px]  ${
            activeSection === "huby-ai-hq-info"
              ? "border-[#FF7F50] text-[#FF7F50] "
              : "border-[#CFCFCF] text-[#b0b0b0] "
          } hover:cursor-pointer px-[10px] leading-5  lg:pt-[10px]`}
          onClick={() => handleClick("huby-ai-hq-info")}
        >
          Huby AI HQ Info
        </div> */}
        <div
          className={`border-t-[5px] sm:border-t-[8px] lg:border-t-[10px] ${
            activeSection === "ai-app-info"
              ? "border-[#FF7F50] text-[#FF7F50] "
              : "border-[#CFCFCF] text-[#b0b0b0] "
          } hover:cursor-pointer px-[10px] leading-5  lg:pt-[10px]`}
          onClick={() => handleClick("ai-app-info")}
        >
          huby AI marketplace
        </div>

        <div
          className={`border-t-[5px] sm:border-t-[8px] lg:border-t-[10px]  ${
            activeSection === "huby-ai-curation"
              ? "border-[#FF7F50] text-[#FF7F50] "
              : "border-[#CFCFCF] text-[#b0b0b0] "
          } hover:cursor-pointer px-[10px] leading-5  lg:pt-[10px]`}
          onClick={() => handleClick("huby-ai-curation")}
        >
          huby curation
        </div>

        <div
          className={`border-t-[5px] sm:border-t-[8px] lg:border-t-[10px]  ${
            activeSection === "huby-ai-contributor"
              ? "border-[#FF7F50] text-[#FF7F50] "
              : "border-[#CFCFCF] text-[#b0b0b0] "
          } hover:cursor-pointer px-[10px] leading-5  lg:pt-[10px]`}
          onClick={() => handleClick("huby-ai-contributor")}
        >
          contribute your ideas
        </div>
        {/* <div
          className={`border-t-[5px] sm:border-t-[8px] lg:border-t-[10px]  ${
            activeSection === "huby-ai-role"
              ? "border-[#FF7F50] text-[#FF7F50] "
              : "border-[#CFCFCF] text-[#b0b0b0] "
          } hover:cursor-pointer px-[10px] leading-5  lg:pt-[10px]`}
          onClick={() => handleClick("huby-ai-role")}
        >
          Huby AI Role
        </div> */}
        {/* <div
          className={`border-t-[5px] sm:border-t-[8px] lg:border-t-[10px]  ${
            activeSection === "connect-with-us"
              ? "border-[#FF7F50] text-[#FF7F50] "
              : "border-[#CFCFCF] text-[#b0b0b0] "
          } hover:cursor-pointer px-[10px] leading-5  lg:pt-[10px]`}
          onClick={() => handleClick("connect-with-us")}
        >
          Connect with Us
        </div> */}
      </div>
    </div>
  );
};

export default ScrollBar;
