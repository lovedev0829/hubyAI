import { useLocation, useNavigate } from "react-router-dom";
import { fetchGetApi } from "../../functions/apiFunctions";
import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// Define the types for the model data
interface Model {
  model_developer: string;
  model_name: string;
  model_source: string;
  model_type: string[];
  model_version: string;
}

interface ModelSectionProps {
  applicationId: string;
}

interface ModelCardProps {
  model: Model;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => (
  <div className="bg-white text-black p-[20px] sm:p-[30px] rounded-lg border border-gray-400  h-full min-h-[200px]">
    <h3 className="text-xl font-medium mb-2">{model.model_name}</h3>
    <p className="text-md mb-1">
      <strong>Developer:</strong> {model.model_developer}
    </p>
    <p className="text-md mb-1">
      <strong>Source:</strong> {model.model_source}
    </p>
    <p className="text-md mb-1">
      <strong>Type:</strong> {model.model_type.join(", ")}
    </p>
    <p className="text-md">
      <strong>Version:</strong> {model.model_version}
    </p>
  </div>
);

const ModelSection: React.FC<ModelSectionProps> = ({ applicationId }) => {
  // const access_user = JSON.parse(
  //   localStorage.getItem("access_token") as string
  // );

  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const path = `/api/applications/${applicationId}/models`;
        const response = await fetchGetApi(path, undefined, navigate, location);
        // console.log("respose model", response)
        setModels(response?.data?.models);
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
    <section className="text-black  sm:max-w-full px-[12px] mt-[20px] h-full min-h-[200px] mb-[40px] md:mb-[50px] xl:mb-[80px]">
      <div className="container mx-auto p-0 ">
        <h2 className="text-[24px] font-black mulish text-left my-3">
          Models Used
        </h2>
        {models.length === 0 ? (
          <p className="text-center text-gray-500">
            No Models Information found for this application.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-[100px] max-h-[550px] overflow-auto pr-[12px]">
            {models?.map((model, index) => (
              <div key={index}>
                <ModelCard model={model} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ModelSection;
