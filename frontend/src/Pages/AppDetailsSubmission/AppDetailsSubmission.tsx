import Header from "../../components/Header/Header";
import SubmissionFormLeftSide from "../../components/Reuseable/SubmissionFormLeftSide";
import { useState } from "react";
import { Link } from "react-router-dom";

const AppDetailsSubmission = () => {
  const [application, setApplication] = useState(false);
  const [ownership, setOwnership] = useState(false);
  const [techStack, setTechStack] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <div>
      <Header path="appinfo" />
      <div className="mx-auto container flex lg:flex-row gap-[60px] flex-col items-center sm:p-4 p-[14px] pb-0 ">
        <SubmissionFormLeftSide
          headtitle={" AI App Detail Submission Form(will split later)"}
          paratag={
            "Please fill in the details below to submit your AI application to our store."
          }
        />
        <div className="lg:w-[50%] w-full">
          {/* {application && ( */}
          <div className="flex sm:gap-[40px] gap-[24px] flex-col">
            <h2
              className="text-[20px] roboto font-medium"
              onClick={() => setApplication(!application)}
            >
              Application Details
            </h2>
            {application && (
              <>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Application Name
                  </label>
                  <input
                    id="appName"
                    data-testid="appName"
                    required
                    type="text"
                    name="application"
                    placeholder="Enter Application Name"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Application Description
                  </label>
                  <input
                    data-testid="description"
                    id="description"
                    required
                    name="description"
                    type="text"
                    placeholder="Describe your application"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Application Type
                  </label>
                  <div className="mt-[6px] flex gap-2">
                    <button className="bg-[#F2F2F2] rounded-md text-[14px] p-2 min-w-[64px] font-medium roboto text-black">
                      Chatbot
                    </button>
                    <button className="bg-[#F2F2F2] rounded-md text-[14px] p-2 min-w-[64px] font-medium roboto text-black">
                      API
                    </button>
                    <button className="bg-[#F2F2F2] rounded-md text-[14px] p-2 min-w-[64px] font-medium roboto text-black">
                      Service
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Product Availability
                  </label>
                  <div className="mt-[6px] flex gap-2">
                    <button className="bg-[#F2F2F2] rounded-md text-[14px] p-2 min-w-[64px] font-medium roboto text-black">
                      Prototype
                    </button>
                    <button className="bg-[#F2F2F2] rounded-md text-[14px] p-2 min-w-[64px] font-medium roboto text-black">
                      Beta
                    </button>
                    <button className="bg-[#F2F2F2] rounded-md text-[14px] p-2 min-w-[64px] font-medium roboto text-black">
                      Production
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Access Type
                  </label>
                  <div className="mt-[6px] flex gap-2">
                    <button className="bg-[#F2F2F2] rounded-md text-[14px] p-2 min-w-[64px] font-medium roboto text-black">
                      Website
                    </button>
                    <button className="bg-[#F2F2F2] rounded-md text-[14px] p-2 min-w-[64px] font-medium roboto text-black">
                      iOS App
                    </button>
                    <button className="bg-[#F2F2F2] rounded-md text-[14px] p-2 min-w-[64px] font-medium roboto text-black">
                      Android App
                    </button>
                  </div>
                </div>
                <div className="flex gap-[12px]">
                  <button className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px]">
                    Save
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex sm:gap-[40px] gap-[24px] flex-col">
            <h2
              className="text-[20px] roboto font-medium"
              onClick={() => setOwnership(!ownership)}
            >
              Ownership
            </h2>
            {ownership && (
              <>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Primary Owner Email
                  </label>
                  <input
                    id="appName"
                    data-testid="appName"
                    required
                    type="text"
                    name="application"
                    placeholder="Enter Email Address"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                  <p className="text-[#0000007f]">
                    An OTP will be sent to this address for verification.
                  </p>
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Primary Owner Name
                  </label>
                  <input
                    data-testid="description"
                    id="description"
                    required
                    name="description"
                    type="text"
                    placeholder="Enter Full Name"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Primary Owner Company
                  </label>
                  <input
                    data-testid="description"
                    id="description"
                    required
                    name="description"
                    type="text"
                    placeholder="Enter Company Name (Optional)"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Primary Owner Phone
                  </label>
                  <input
                    data-testid="description"
                    id="description"
                    required
                    name="description"
                    type="text"
                    placeholder="Enter Contact Number (Optional)"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div className="flex gap-[12px]">
                  <button className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px]">
                    Save
                  </button>
                </div>
              </>
            )}
          </div>

          <div>
            <h2
              className="text-[20px] roboto font-medium mb-0"
              onClick={() => setTechStack(!techStack)}
            >
              Tech Stack
            </h2>
            {techStack && (
              <div className="flex sm:gap-[40px] gap-[24px] flex-col">
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Repo URL
                  </label>
                  <input
                    id="appName"
                    data-testid="appName"
                    required
                    type="text"
                    name="application"
                    placeholder="Provide Repo URL if Open Source"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                  <p className="text-[#0000007f]">Optional</p>
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Programming Languages
                  </label>
                  <input
                    data-testid="description"
                    id="description"
                    required
                    name="description"
                    type="text"
                    placeholder="List Programming Languages"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Dependencies
                  </label>
                  <input
                    data-testid="description"
                    id="description"
                    required
                    name="description"
                    type="text"
                    placeholder="Mention Other Technologies Used"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <h2 className="text-[20px] roboto font-semibold">
                  Runtime Requirements
                </h2>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Hardware
                  </label>
                  <input
                    data-testid="description"
                    id="description"
                    required
                    name="description"
                    type="text"
                    placeholder="List Hardware Platforms"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Operating System
                  </label>
                  <input
                    data-testid="description"
                    id="description"
                    required
                    name="description"
                    type="text"
                    placeholder="Specify Supported OS"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    GPU Requirements
                  </label>
                  <input
                    data-testid="description"
                    id="description"
                    required
                    name="description"
                    type="text"
                    placeholder="Specify GPU Requirements"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    CPU Requirements
                  </label>
                  <input
                    data-testid="description"
                    id="description"
                    required
                    name="description"
                    type="text"
                    placeholder="Specify Minimum CPU Requirements"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Memory Requirements
                  </label>
                  <input
                    data-testid="description"
                    id="description"
                    required
                    name="description"
                    type="text"
                    placeholder="Enter RAM Needed"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Disk Space
                  </label>
                  <input
                    data-testid="description"
                    id="description"
                    required
                    name="description"
                    type="text"
                    placeholder="Specify Disk Space Required"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div className="flex gap-[12px]">
                  <button className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px]">
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <h2
              className="text-[20px] roboto font-medium mb-0"
              onClick={() => setMarketing(!marketing)}
            >
              Marketing and Pricing
            </h2>
            {marketing && (
              <div className="flex sm:gap-[40px] gap-[24px] flex-col">
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Demo URL
                  </label>
                  <input
                    id="appName"
                    data-testid="appName"
                    required
                    type="text"
                    name="application"
                    placeholder="Provide Demo URL"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Tutorials
                  </label>
                  <input
                    data-testid="description"
                    id="description"
                    required
                    name="description"
                    type="text"
                    placeholder="Link to Tutorials"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Pricing Model
                  </label>
                  <input
                    data-testid="description"
                    id="description"
                    required
                    name="description"
                    type="text"
                    placeholder="Describe Pricing Model"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div>
                  <label className="text-black text-[14px] roboto block font-medium">
                    Licensing
                  </label>
                  <input
                    data-testid="description"
                    id="description"
                    required
                    name="description"
                    type="text"
                    placeholder="Specify Licensing"
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  />
                </div>
                <div className="flex gap-[12px]">
                  <button className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px]">
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className=" flex justify-center md:flex-row flex-col md:gap-[60px] gap-[30px] md:mb-0 mb-[20px] mt-[60px] md:h-[90px] items-center px-[14px]">
        <p className="lg:text-[20px] text-[18px] roboto mb-0">
          © 2024 huby. All Rights Reserved.
        </p>
        <p className="lg:text-[20px] text-[18px] roboto mb-0">
          Contact Us: contact@appstore.com
        </p>
        <Link
          to="mailto:support@huby.ai"
          className="text-[#D0D0D0] text-[18px] leading-[26px] font-normal hanken-grotesk m-0 md:px-[4px] no-underline"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default AppDetailsSubmission;
