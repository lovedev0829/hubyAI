
import SubmitHeader from '../../components/SubmitHeader/SubmitHeader'
import SubmitHero from '../../components/SubmitHero/SubmitHero'
import BrowserMobile from '../../components/BrowserMobile/BrowserMobile'
import SubmitSlider from '../../components/SubmitSlider/SubmitSlider'
import Submitpeople from '../../components/Submitpeople/Submitpeople'
import SubmitNews from '../../components/SubmitNews/SubmitNews'
import SubmitTab from '../../components/SubmitTab/SubmitTab'

const Submitpage = () => {
  return (
    <div className="bg-[#BBBBB7]">
      <SubmitHeader />
      <SubmitHero />
      <BrowserMobile />
      <SubmitSlider/>
      <Submitpeople />
      <SubmitTab/>
      <SubmitNews/>
    </div>
  )
}

export default Submitpage