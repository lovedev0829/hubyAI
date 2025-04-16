import { fetchGetApi } from "../../functions/apiFunctions";
import React, { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

interface SourceInformationProps {
  applicationId: string;
}

const SourceInformation: React.FC<SourceInformationProps> = ({
  applicationId,
}) => {
  //const access_user = JSON.parse(
  //localStorage.getItem("access_token") as string
  //);
  const [sourceData, setSourceData] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const path = `/api/applications/source/${applicationId}`;
        const response = await fetchGetApi(path, undefined, navigate, location);
        if (response.status === 200) {
          setSourceData(response?.data);
        }
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
        {" "}
        Source Information
      </h2>
      {sourceData !== null ? (
        <div className="mt-[20px] mb-[40px] md:mb-[50px] xl:mb-[80px]">
          <div className="  bg-white rounded-xl border border-gray-400 max-w-full p-6 mt-[20px] ">
            <div>
              <p>
                <strong>Source Type:</strong> {sourceData.source_type}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Programming Languages:</h3>
              <ul className="flex space-x-4 list-disc">
                {sourceData.programming_languages.map((lang, index) => (
                  <li key={index} className="flex items-center ">
                    {lang}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Dependencies:</h3>
              <ul className="flex flex-wrap space-x-4">
                {sourceData.dependencies.map((dep, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span>{dep}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center space-x-2">
              <FaGithub className="text-gray-800" />
              <a
                href={sourceData.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Repository
              </a>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No Application Source Information found for this application.
        </p>
      )}
    </div>
  );
};

export default SourceInformation;
