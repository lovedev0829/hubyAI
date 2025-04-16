
// import AppHeader from "../../components/AppHeader/Header"
import Hero from "../../components/Hero/Hero";
import Webmobile from "../../components/WebMobile/Webmobile";
import UploadSlider from "../../components/UploadSlider/UploadSlider";
import TeamMate from "../../components/TeamMate/TeamMate";
import Tab from "../../components/Tab/Tab";
import News from "../../components/News/News";
import Header from "../../components/AppHeader/Header";
import Footer from "../../components/AppFooter/Footer";

const Landing = () => {
   return (
      <div className="bg-[#BBBBB7]">
         <Header />
         <Hero />
         <Webmobile />
         <UploadSlider />
         <TeamMate />
         <Tab />
         <News />
         <Footer />
      </div>
   );
};

export default Landing;
