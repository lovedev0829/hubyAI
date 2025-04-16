import { fetchGetApi } from "../../functions/apiFunctions";
import React, { useEffect, useState } from "react";
import {
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaDesktop,
  FaWindows,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

interface ApplicationRuntimeProps {
  applicationId: string;
}

const ApplicationRuntime: React.FC<ApplicationRuntimeProps> = ({
  applicationId,
}) => {
  // const access_user = JSON.parse(
  //   localStorage.getItem("access_token") as string
  // );
  const [runtime, setRuntime] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const path = `/api/applications/${applicationId}/runtime`;
        const response = await fetchGetApi(path, undefined, navigate, location);
        // console.log("runtime data", response)
        setRuntime(response?.data);
      } catch (error) {
        const errorMessage = error.error || "Model not Found";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    applicationId && fetchData();
  }, [applicationId]);

  useEffect(() => {
    if (error) {
      // toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <svg
          className="animate-spin h-10 w-10 text-black"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l-1.647 1.647C6.627 20.627 9.373 22 12 22v-4c-1.657 0-3-1.343-3-3v-1.709z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="px-[12px]">
      <h2 className="text-[24px] font-black mulish text-left my-3">
        Product Runtime Requirements
      </h2>
      {runtime !== null ? (
        <div className="mt-[20px] mb-[40px] md:mb-[50px] xl:mb-[80px]">
          <div className=" sm:max-w-full p-6 mt-[20px]  bg-white border border-gray-400  rounded-lg text-black  mx-auto">
            <div className="flex flex-col sm:flex-row justify-around">
              <div className="">
                {/* CPU Requirements */}
                <div>
                  <h2 className="flex items-center text-lg font-semibold mb-2">
                    <FaMicrochip className="mr-2 text-xl" />
                    CPU
                  </h2>
                  <ul className="ml-6 list-disc">
                    {runtime.cpu.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* GPU Requirements */}
                <div>
                  <h2 className="flex items-center text-lg font-semibold mb-2">
                    <FaMicrochip className="mr-2 text-xl" />
                    GPU
                  </h2>
                  <ul className="ml-6 list-disc">
                    {runtime.gpu.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Disk Requirements */}
                <div>
                  <h2 className="flex items-center text-lg font-semibold mb-2">
                    <FaHdd className="mr-2 text-xl" />
                    Disk Space
                  </h2>

                  <ul className="ml-6 list-disc">
                    <li>{runtime.disk}</li>
                  </ul>
                </div>
              </div>
              <div className="">
                {/* Memory Requirements */}
                <div>
                  <h2 className="flex items-center text-lg font-semibold mb-2">
                    <FaMemory className="mr-2 text-xl" />
                    Memory
                  </h2>
                  <ul className="ml-6 list-disc">
                    <li>{runtime.memory}</li>
                  </ul>
                </div>

                {/* Hardware Compatibility */}
                <div>
                  <h2 className="flex items-center text-lg font-semibold mb-2">
                    <FaDesktop className="mr-2 text-xl" />
                    Hardware Compatibility
                  </h2>
                  <ul className="ml-6 list-disc">
                    {runtime.hardware.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Operating System */}
                <div>
                  <h2 className="flex items-center text-lg font-semibold mb-2">
                    <FaWindows className="mr-2 text-xl" />
                    Operating System
                  </h2>
                  <ul className="ml-6 list-disc">
                    {runtime.operating_system.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No Application Runtime Information found for this application.
        </p>
      )}
    </div>
  );
};

export default ApplicationRuntime;
