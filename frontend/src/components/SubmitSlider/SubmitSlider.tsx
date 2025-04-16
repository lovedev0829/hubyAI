
import Sliderimage from "../../assets/Images/sliderimage.png"

const SubmitSlider = () => {
    return (
        <div className='container mx-auto px-4'>
            <div className='mt-16'>
                <h2 className='text-[33px] text-white leading-[41px] text-center w-full max-w-[836px] mx-auto'>Instantly create full, four-minute AI-generated songs in seconds with your text.</h2>
                <div className="relative flex justify-center w-full max-w-[213px] mx-auto mt-6 md:mt-10 z-10">
                    <button className="text-white px-6 md:px-[28px] py-2 md:py-[11px] z-10 !bg-[#BBBBB7] m-[1.5px] relative rounded-full text-[14px] md:text-[15px] font-normal">
                        Make your first song
                    </button>
                    <span className="bg-[linear-gradient(#FF6A00,#FFFB00)] block absolute w-full h-full left-0 top-0 rounded-full"></span>
                </div>
            </div>
            <div className='flex justify-center mt-20'>
                <img src={Sliderimage} alt="" />
            </div>
            <div className='flex flex-wrap items-center justify-center md:gap-14 gap-6 mt-20'>
                <div>
                    <p className='w-full max-w-[695px] text-left text-white text-[40px] md:text-[55px] leading-[55px] font-bold'>Get inspired by people’s creations with Suno</p>
                </div>
                <div className='bg-[#00000075] px-[22px] py-[11px] rounded-full'>
                    <p className='text-center text-white italic text-[18px]'>Explore creations</p>
                </div>
            </div>
        </div>
    )
}

export default SubmitSlider