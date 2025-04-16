import HubyAiHqInfo from "../../components/NewLandingPage/HubyAiHqInfo";
import GenAi from "../../components/NewLandingPage/GenAi";
import HubyAiHq from "../../components/NewLandingPage/HubyAiHq";
import AiAppInfo from "../../components/NewLandingPage/AiAppInfo";
import HubyAiCuration from "../../components/NewLandingPage/HubyAiCuration";
import HubyAiContributor from "../../components/NewLandingPage/HubyAiContributor";
import HubyAiRole from "../../components/NewLandingPage/HubyAiRole";
import ScrollBar from "../../components/NewLandingPage/ScrollBar";
import Footer from "../../components/Landingfooter/Footer";

const NewLandingPage = () => {
  return (
    <div>
      <ScrollBar />
      
      <section id="gen-ai">
        <GenAi />
        
      </section>

      <section id="huby-ai-hq">
        <HubyAiHq />
        <HubyAiHqInfo />
      </section>

      <section id="ai-app-info">
        <AiAppInfo />
      </section>

      <section id="huby-ai-curation">
        <HubyAiCuration />
      </section>

      <section id="huby-ai-contributor">
        <HubyAiContributor />
        <HubyAiRole />
      </section>
      <section>
        <Footer/>
      </section>
    </div>
  );
};

export default NewLandingPage;
