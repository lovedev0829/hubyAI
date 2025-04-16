
import Image3 from "../../assets/Images/image3.png"
import Image9 from "../../assets/Images/image9.png"
import { MdArrowForwardIos } from 'react-icons/md'

const Submitpeople = () => {
    return (
        <div className='container mx-auto px-4 pb-10'>
            <div className='flex flex-wrap justify-evenly items-center mt-28 gap-2'>
                <div>
                    <p className='text-[23px] text-white text-center leading-[34px] w-full max-w-[421px]'>“We made Suno for anyone to be able to make great music. Enjoy!”</p>
                    <div className='flex flex-wrap justify-center gap-4 mt-6'>
                        <img src={Image3} alt="" />
                        <img src={Image9} alt="" />

                    </div>
                </div>
                <div className='bg-image bg-no-repeat bg-cover py-16 rounded-[25px] '>
                    <p className='w-full max-w-[620px] text-[24px] leading-[34px] text-white text-center'>Be one of the first to try our latest feature: advanced editing.</p>
                    <div className='flex justify-center mt-[20px]'>
                        <button className='text-[18px] text-white border border-white px-4 py-3 rounded-[21px] text-center'>try it free</button>
                    </div>
                </div>

            </div>
            <div className='bg-[#00000040] mt-20 py-[44px] rounded-[10px]'>
                <div className='flex flex-wrap justify-evenly items-end'>
                    <div className='flex flex-wrap gap-20'>
                        <div className='flex flex-wrap gap-2 items-center'>
                            <img src={Image9} alt="" className='w-[60px]' />
                            <p className='text-[13px] leading-[13px] w-full max-w-[167px] text-white'>“This was a perfect solution for a new project im working on.”</p>
                        </div>
                        <div className='flex flex-wrap gap-2 items-center'>
                            <img src={Image9} alt="" className='w-[60px]' />
                            <p className='text-[13px] leading-[13px] w-full max-w-[167px] text-white'>“Does anyone know how to make the version even longer?”</p>
                        </div>
                        <div className='flex flex-wrap gap-2 items-center'>
                            <img src={Image9} alt="" className='w-[60px]' />
                            <p className='text-[13px] leading-[13px] w-full max-w-[167px] text-white'>“Does anyone know how to make the version even longer?””</p>
                        </div>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <p className='text-[18px] font-extrabold text-white'>Join the discussion</p>
                        <MdArrowForwardIos className='text-white text-3xl font-bold' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Submitpeople