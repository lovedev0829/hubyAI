import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

const PrototypeDashboardPage = () => {
  return (
    <div>
      <Header path="prototype/dashboard" />
      {/* {Browse Technical Reviews} */}
      <div>
        <div className="border-y-[1px] border-y-[#e6e6e6e] md:py-[62px] py-[40px]">
          <div className="container flex lg:flex-row flex-col">
            <div className="lg:w-[44%] max-w-[500px] w-full m-auto">
              <h2 className="text-[30px] roboto font-bold">
                Browse Technical Reviews
              </h2>
              <p className=" text-[16px] roboto mb-0 text-black">
                Click to view user-submitted technical reviews. Verify/Report
                feedback, or reply directly to a user.
              </p>
            </div>
            <div className="lg:w-[56%] w-full">
              <div className="border-black border rounded-[10px] flex items-center xl:gap-[50px] gap-[20px] p-4 flex-wrap">
                <div className="max-w-[160px] w-full">
                  <div className="flex items-center justify-between gap-[10px]">
                    <div className="w-10 h-10 bg-[#ccc] rounded-full"></div>
                    <h1 className="font-black text-[20px] mb-0">username</h1>
                  </div>
                  <h1 className="text-[27px] font-bold mb-0 text-center mt-1">
                    App Name
                  </h1>
                </div>
                <div>
                  <div className=" flex sm:items-center items-start justify-between gap-[10px] flew-wrap sm:flex-row flex-col">
                    <h1 className="font-black text-[20px]">Feedback Areas:</h1>
                    <button className="bg-[#f47b31] rounded-md font-semibold text-white py-1 px-2">
                      REPLY TO USER
                    </button>
                  </div>
                  <div className="flex items-center md:justify-between justify-start gap-[10px] mt-2 flex-wrap">
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      User Interface
                    </button>
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      Response Time
                    </button>
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      Response Quality
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-black border rounded-[10px] flex items-center xl:gap-[50px] gap-[20px] p-4 flex-wrap">
                <div className="max-w-[160px] w-full">
                  <div className="flex items-center justify-between gap-[10px]">
                    <div className="w-10 h-10 bg-[#ccc] rounded-full"></div>
                    <h1 className="font-black text-[20px] mb-0">username</h1>
                  </div>
                  <h1 className="text-[27px] font-bold mb-0 text-center mt-1">
                    App Name
                  </h1>
                </div>
                <div>
                  <div className=" flex sm:items-center items-start justify-between gap-[10px] flew-wrap sm:flex-row flex-col">
                    <h1 className="font-black text-[20px]">Feedback Areas:</h1>
                    <button className="bg-[#f47b31] rounded-md font-semibold text-white py-1 px-2">
                      REPLY TO USER
                    </button>
                  </div>
                  <div className="flex items-center md:justify-between justify-start gap-[10px] mt-2 flex-wrap">
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      User Interface
                    </button>
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      Response Time
                    </button>
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      Response Quality
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-black border rounded-[10px] flex items-center xl:gap-[50px] gap-[20px] p-4 flex-wrap">
                <div className="max-w-[160px] w-full">
                  <div className="flex items-center justify-between gap-[10px]">
                    <div className="w-10 h-10 bg-[#ccc] rounded-full"></div>
                    <h1 className="font-black text-[20px] mb-0">username</h1>
                  </div>
                  <h1 className="text-[27px] font-bold mb-0 text-center mt-1">
                    App Name
                  </h1>
                </div>
                <div>
                  <div className=" flex sm:items-center items-start justify-between gap-[10px] flew-wrap sm:flex-row flex-col">
                    <h1 className="font-black text-[20px]">Feedback Areas:</h1>
                    <button className="bg-[#f47b31] rounded-md font-semibold text-white py-1 px-2">
                      REPLY TO USER
                    </button>
                  </div>
                  <div className="flex items-center md:justify-between justify-start gap-[10px] mt-2 flex-wrap">
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      User Interface
                    </button>
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      Response Time
                    </button>
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      Response Quality
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-black border rounded-[10px] flex items-center xl:gap-[50px] gap-[20px] p-4 flex-wrap">
                <div className="max-w-[160px] w-full">
                  <div className="flex items-center justify-between gap-[10px]">
                    <div className="w-10 h-10 bg-[#ccc] rounded-full"></div>
                    <h1 className="font-black text-[20px] mb-0">username</h1>
                  </div>
                  <h1 className="text-[27px] font-bold mb-0 text-center mt-1">
                    App Name
                  </h1>
                </div>
                <div>
                  <div className=" flex sm:items-center items-start justify-between gap-[10px] flew-wrap sm:flex-row flex-col">
                    <h1 className="font-black text-[20px]">Feedback Areas:</h1>
                    <button className="bg-[#f47b31] rounded-md font-semibold text-white py-1 px-2">
                      REPLY TO USER
                    </button>
                  </div>
                  <div className="flex items-center md:justify-between justify-start gap-[10px] mt-2 flex-wrap">
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      User Interface
                    </button>
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      Response Time
                    </button>
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      Response Quality
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-black border rounded-[10px] flex items-center xl:gap-[50px] gap-[20px] p-4 flex-wrap">
                <div className="max-w-[160px] w-full">
                  <div className="flex items-center justify-between gap-[10px]">
                    <div className="w-10 h-10 bg-[#ccc] rounded-full"></div>
                    <h1 className="font-black text-[20px] mb-0">username</h1>
                  </div>
                  <h1 className="text-[27px] font-bold mb-0 text-center mt-1">
                    App Name
                  </h1>
                </div>
                <div>
                  <div className=" flex sm:items-center items-start justify-between gap-[10px] flew-wrap sm:flex-row flex-col">
                    <h1 className="font-black text-[20px]">Feedback Areas:</h1>
                    <button className="bg-[#f47b31] rounded-md font-semibold text-white py-1 px-2">
                      REPLY TO USER
                    </button>
                  </div>
                  <div className="flex items-center md:justify-between justify-start gap-[10px] mt-2 flex-wrap">
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      User Interface
                    </button>
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      Response Time
                    </button>
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      Response Quality
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y-[1px] border-y-[#e6e6e6e] md:py-[62px] py-[40px]">
        <div className="container flex lg:flex-row flex-col">
          <div className="lg:w-[44%] max-w-[500px] w-full m-auto">
            <h2 className="text-[30px] roboto font-bold">
              Browse Technical Reviews
            </h2>
            <p className=" text-[16px] roboto mb-0 text-black">
              Click to view user-submitted technical reviews. Verify/Report
              feedback, or reply directly to a user.
            </p>
          </div>
          <div className="lg:w-[56%] w-full">
            <div className=" mt-[50px] border-black border rounded-[10px] max-w-[715px] w-full ml-auto">
              <div className=" flex items-center xl:gap-[50px] gap-[20px] p-4 flex-wrap">
                <div className="max-w-[160px] w-full">
                  <div className="flex items-center justify-between gap-[10px]">
                    <div className="w-10 h-10 bg-[#ccc] rounded-full"></div>
                    <h1 className="font-black text-[20px] mb-0">username</h1>
                  </div>
                  <h1 className="text-[27px] font-bold mb-0 text-center mt-1">
                    App Name
                  </h1>
                </div>
                <div>
                  <div className=" flex sm:items-center items-start justify-between gap-[10px] flew-wrap sm:flex-row flex-col">
                    <h1 className="font-black text-[20px]">Feedback Areas:</h1>
                    <button className="bg-[#f47b31] rounded-md font-semibold text-white py-1 px-2">
                      REPLY TO USER
                    </button>
                  </div>
                  <div className="flex items-center md:justify-between justify-start gap-[10px] mt-2 flex-wrap">
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      User Interface
                    </button>
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      Response Time
                    </button>
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      Response Quality
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-black border-t  p-4">
                <div>
                  <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px] ">
                    User Interface Feedback
                  </button>
                  <p className="text-black leading-5 text-[18px] mt-[10px] mb-0">
                    The user interface of CloudSync Pro is sleek and intuitive,
                    with a clean design that makes navigation a breeze. I
                    particularly appreciate the customizable dashboard that
                    allows users to prioritize their most-used features.
                    However, the color scheme could use some work, as the
                    current pale blue and gray combination feels a bit dull and
                    lacks visual appeal.
                  </p>
                  <div className="text-black font-bold text-[20px] mt-[10px] flex items-center gap-2 sm:flex-row flex-col">
                    <p className="mb-0">Did the user leave a valid review?</p>
                    <div className="flex items-center gap-3">
                      <button className="bg-[#00807f] text-white px-1 rounded-md">
                        YES
                      </button>
                      <button className="bg-[#cf2028] text-white px-1 rounded-md">
                        NO
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 mb-5">
                  <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px] ">
                    Response Time Feedback
                  </button>
                  <p className="text-black leading-5 text-[18px] mt-[10px] mb-0">
                    CloudSync Pro's response time is impressively quick, with
                    most actions executing within milliseconds. File syncing
                    across devices is nearly instantaneous, even for larger
                    files. The only noticeable lag occurs when initially loading
                    very large directories (100,000+ files), but this is
                    understandable given the volume of data being processed.
                  </p>
                  <div className="text-black font-bold text-[20px] mt-[10px] flex items-center gap-2 sm:flex-row flex-col">
                    <p className="mb-0">Did the user leave a valid review?</p>
                    <div className="flex items-center gap-3">
                      <button className="bg-[#00807f] text-white px-1 rounded-md">
                        YES
                      </button>
                      <button className="bg-[#cf2028] text-white px-1 rounded-md">
                        NO
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y-[1px] border-y-[#e6e6e6e] md:py-[62px] py-[40px]">
        <div className="container flex lg:flex-row flex-col">
          <div className="lg:w-[44%] max-w-[500px] w-full m-auto">
            <h2 className="text-[30px] roboto font-bold">
              Browse Technical Reviews
            </h2>
            <p className=" text-[16px] roboto mb-0 text-black">
              Click to view user-submitted technical reviews. Verify/Report
              feedback, or reply directly to a user.
            </p>
          </div>
          <div className="lg:w-[56%] w-full">
            <div className=" mt-[50px] border-black border rounded-[10px] max-w-[715px] w-full ml-auto">
              <div className=" flex items-center xl:gap-[50px] gap-[20px] p-4 flex-wrap">
                <div className="max-w-[160px] w-full">
                  <div className="flex items-center justify-between gap-[10px]">
                    <div className="w-10 h-10 bg-[#ccc] rounded-full"></div>
                    <h1 className="font-black text-[20px] mb-0">username</h1>
                  </div>
                  <h1 className="text-[27px] font-bold mb-0 text-center mt-1">
                    App Name
                  </h1>
                </div>
                <div>
                  <div className=" flex sm:items-center items-start justify-between gap-[10px] flew-wrap sm:flex-row flex-col">
                    <h1 className="font-black text-[20px]">Feedback Areas:</h1>
                    <button className="bg-[#f47b31] rounded-md font-semibold text-white py-1 px-2">
                      REPLY TO USER
                    </button>
                  </div>
                  <div className="flex items-center md:justify-between justify-start gap-[10px] mt-2 flex-wrap">
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      User Interface
                    </button>
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      Response Time
                    </button>
                    <button className="bg-[#252525] rounded-[5px] font-bold text-white text-[18px] p-[3px_7px]">
                      Response Quality
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-black border-t  p-4">
                <div className="flex items-center gap-[10px] mb-3 sm:flex-row flex-col">
                  <h1 className="mb-0  sm:max-w-[270px] max-w-full whitespace-nowrap w-full sm:text-[35px] text-[27px]">
                    Send a message:
                  </h1>
                  <p className="mb-0 text-[17px] leading-5">
                    Scroll up to see user feedback. Please make sure your reply
                    adheres to our&nbsp;
                    <span className="underline">messaging guidelines.</span>
                  </p>
                </div>
                <textarea className="border border-black w-full h-[250px] rounded-md mb-3"></textarea>
                <button className="bg-[#f47b31] rounded-md font-semibold text-white py-1 px-2 flex ms-auto">
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrototypeDashboardPage;
