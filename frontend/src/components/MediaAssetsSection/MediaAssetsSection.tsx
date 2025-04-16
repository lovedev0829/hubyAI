import React, { useState, useRef, useEffect } from "react";
import { validateFileSize } from "../../functions/helper"; // Utility for file size validation
import {
  fetchPostApi,
  fetchPutApi,
  validateFormData,
} from "../../functions/apiFunctions";
import { toast } from "react-toastify";
import { generateRandomString } from "../../functions/helper";
import { IoCloseCircle } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
// import FilePreview from "../FilePreview/FilePreview";

const MAX_FILE_SIZE_MB = 100;

interface MediaAssetsSectionProps {
  application_id: string;
  marketing_id: string;
  editFormData: any;
  getMarketingData: any;
}
const mediaRequiredFields = [];
const MediaAssetsSection: React.FC<MediaAssetsSectionProps> = ({
  application_id,
  marketing_id,
  editFormData,
  getMarketingData
}) => {
  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );
  const [file, setFile] = useState<File | null>(null);
  console.log(editFormData, 'media FIleeeeee*******')
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileTitle, setFileTitle] = useState<string>("");
  const initialExternalLInkdata = {
    title: "",
    url: "",
    category: "",
  };
  const [externalLInkdata, setexternalLinkdata] = useState(
    initialExternalLInkdata
  );
  const [payload, setPayload] = useState(
    editFormData?.external_media_links ?? []
  );
  const navigate = useNavigate();
  const location = useLocation();


  // const [disableLinkData, setDisableLinkData] = useState(false);
  // const [disableFileData, setDisableFileData] = useState(false);
  // const [asset_type, setAsset_type] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError("");
    }
  }, [error]);

  const handleFileTitle = (e) => {
    const value = e.target.value;
    setFileTitle(value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExternalLinkData = (e) => {
    const { name, value } = e.target;
    setexternalLinkdata({
      ...externalLInkdata,
      [name]: value,
    });
  };

  const AddExternalLink = () => {
    if (validateFormData(externalLInkdata, mediaRequiredFields)) {
      setPayload((pre) => [...pre, externalLInkdata]);
      setexternalLinkdata(initialExternalLInkdata);
    }
  };
  const RemoveExternalLink = (indexToRemove) => {
    const updatedData = payload.filter((_, index) => index !== indexToRemove);
    setPayload(updatedData);
  };

  // useEffect(() => {
  //   setDisableLinkData(fileTitle !== "" || file !== null);
  // }, [fileTitle, file]);
  // useEffect(() => {
  //   setDisableFileData(
  //     externalLInkdata.title !== "" ||
  //       externalLInkdata.url !== "" ||
  //       externalLInkdata.category !== "" ||
  //       payload.length !== 0
  //   );
  // }, [externalLInkdata, payload]);

  const handleUpload = async () => {
    console.log(fileTitle, "|||||");

    setLoading(true);
    try {
      // Validate file size
      if (payload?.length === 0) {
        if (file && !validateFileSize(file, MAX_FILE_SIZE_MB)) {
          throw new Error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        }

        if (!file && !externalLInkdata) {
          throw new Error("No file or external link selected");
        }

        if (!fileTitle.trim()) {
          throw new Error("File title is required");
        }
        if (!file) {
          throw new Error("Pelase select the file");
        }
      }

      if (file) {
        let asset_type: string;
        const fileType = file.type;
        if (fileType.startsWith("image/")) {
          asset_type = "images";
        } else if (fileType === "application/pdf") {
          asset_type = "images";
        } else if (fileType.startsWith("video/")) {
          asset_type = "videos";
        } else {
          throw new Error("Unsupported file type");
        }
        // Create FormData
        const formData = new FormData();
        // Upload file or link
        if (file && fileTitle) {
          formData.append("file", file);
          formData.append("category", asset_type);
          formData.append("title", fileTitle);
          const type = asset_type;
          const prefix = `${asset_type}_${generateRandomString(2)}`;
          const path = `/api/applications/${application_id}/marketing/${marketing_id}/${type}/${prefix}`;
          await fetchPostApi(
            path,
            formData,
            "multipart/form-data",
            access_user,
            navigate,
            location
          );
          // console.log(response, "upload=----=-=-=-")
          setFile(null);
          setFileTitle("");
        }
      }

      if (payload.length !== 0) {
        const path = `/api/marketing/${marketing_id}`;
        await fetchPutApi(
          path,
          { application_id: application_id, external_media_links: payload },
          "application/json",
          access_user,
          navigate,
          location
        );
      }

      await getMarketingData()
      toast.success("Media uploaded");
      // Clear inputs and handle success
      setFile(null);
      setFileTitle("");
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input value
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (!file) return null;

    return (
      <div className="relative mb-4 w-32 h-32 m-3">
        {file.type.startsWith("image/") ? (
          <img
            src={URL.createObjectURL(file)}
            alt={`Selected File`}
            className="w-full h-full object-cover border border-gray-700 rounded"
          />
        ) : file.type === "application/pdf" ? (
          <div className="flex items-center justify-center w-full h-full bg-gray-100 border border-gray-700 rounded">
            <svg
              className="w-12 h-12 text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2H4v20h16V6l-6-4zm-1 12h-2v2h2v-2zm0-4h-2v2h2V10z"
                fill="currentColor"
              />
            </svg>
            <span className="text-xs text-gray-700">{file.name}</span>
          </div>
        ) : file.type.startsWith("video/") ? (
          <video
            src={URL.createObjectURL(file)}
            controls
            className="w-full h-full object-cover border border-gray-700 rounded"
          />
        ) : null}
        <button
          onClick={handleRemoveFile}
          className="absolute top-1 right-1 text-gray-700 bg-white rounded-full p-1 hover:bg-gray-200"
        >
          ×
        </button>
      </div>
    );
  };


  return (
    <div className="m-[14px]">
      <section className="border-[#e6e6e6] rounded-md border-[1px] p-[16px] w-full flex gap-[20px] flex-col lg:mt-0 mt-[30px] h-fit">
        <h2 className="text-lg font-semibold mb-2">Upload Media Assets</h2>
        <div className="mb-4 flex flex-col gap-3 w-full">
          <div>
            <label className="text-black text-[14px] roboto block font-medium">
              File Title:
            </label>
            <input
              type="text"
              placeholder="Enter file title"
              value={fileTitle}
              onChange={handleFileTitle}
              className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[5px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
              // disabled={loading || disableFileData}
              disabled={loading}
            />
          </div>
          <div>
            <label className="text-black text-[14px] roboto block font-medium">
              Upload File (Image, PDF, Video, Max 100MB):
            </label>
            <input
              type="file"
              accept="image/*,application/pdf,video/*"
              onChange={handleFileChange}
              className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[5px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
              ref={fileInputRef} // Attach ref to input
              multiple={false} // Restrict to one file
              // disabled={loading || disableFileData}
              disabled={loading}
            />
            {renderPreview()}
          </div>
          {/* <div>
            <FilePreview images={editFormData?.images} videos={editFormData?.videos} application_id={application_id} marketing_id={marketing_id} />
          </div> */}
          <div>
            <label className="text-black text-[14px] roboto block font-medium ">
              Or Enter External Link:
            </label>
            <div className="my-3">
              <label className="text-black text-[14px] roboto block font-medium">
                Link Title:
              </label>
              <input
                type="text"
                placeholder="Enter Link title"
                name="title"
                value={externalLInkdata.title}
                onChange={handleExternalLinkData}
                className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[5px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                // disabled={loading || disableLinkData}
                disabled={loading}
              />
            </div>



            <div className="flex gap-4 items-end">
              <div>
                <label className="text-black text-[14px] roboto block font-medium">
                  External Link:
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  name="url"
                  value={externalLInkdata.url}
                  onChange={handleExternalLinkData}
                  className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[5px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                  // disabled={loading || disableLinkData}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-black text-[14px] roboto block font-medium">
                  Category:
                </label>

                <select
                  name="category"
                  onChange={handleExternalLinkData}
                  className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                  // disabled={loading || disableLinkData}
                  disabled={loading}
                >
                  <option selected={externalLInkdata.category === ""} value="">
                    Select Category
                  </option>
                  <option value="images">Image/PDF</option>
                  <option value="videos">Video</option>
                </select>
              </div>

              <button
                onClick={AddExternalLink}
                className="border-[1px]  bg-[#000000] border-[#000] rounded-lg h-[48px] max-w-[100px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                // className={` border-[1px] ${
                //   disableLinkData
                //     ? "bg-[#555252] border-[#555252]"
                //     : "bg-[#000000] border-[#000]"
                // } rounded-lg h-[48px] max-w-[100px] w-full text-white roboto font-medium text-[16px]`}
                // disabled={loading || disableLinkData}
                disabled={loading}
              >
                Add Link
              </button>

              {/* <button onClick={AddExternalLink}>+</button> */}
            </div>

            {/* <div className="flex items-center justify-center">
              <input
                type="url"
                name="url"
                placeholder="https://example.com"
                value={externalLInkdata.url}
                onChange={handleExternalLinkData}
                className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[5px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
                disabled={loading} // Disable input during loading
              />

              <button onClick={handleextraLInk}>+</button>
            </div> */}
          </div>
          <div>
            {payload?.map((item, index) => (
              <>
                <div
                  key={index}
                  className="bg-[#f2f2f2] rounded-md border-2 p-3 w-full my-2"
                >
                  <div>
                    <button
                      onClick={() => RemoveExternalLink(index)}
                      className="flex  items-center justify-end w-full"
                    >
                      <IoCloseCircle size={25} className="transform hover:scale-105 hover:shadow-lg transition-all duration-300" />
                    </button>
                    <div className="flex gap-2">
                      <span className="font-bold "> Title:</span>
                      <span className="font-medium break-all">
                        {item.title}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold "> Category:</span>
                      <span className="font-medium break-all">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold "> URL:</span>
                      <span className="font-medium break-all ">{item.url}</span>
                    </div>
                  </div>
                  {/* <button
                    // onClick={() =>
                    //   // handleEditChildModel(data, index)
                    // }
                    className="border-[#000] border-[1px] bg-[#000000] rounded-lg p-[8px_20px] mt-3 text-white roboto font-medium text-[16px]"
                  >
                    Edit
                  </button> */}
                </div>

                {/* <div className="border border-[#000] p-2 m-2">
                  <div className="flex gap-2">
                    <span className="font-bold "> Title:</span>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold "> Category:</span>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold "> URL:</span>
                    <span className="font-medium">{item.url}</span>
                  </div>
                </div> */}
              </>
            ))}
          </div>
          <button
            onClick={handleUpload}
            className="border-[#000] border-[1px]  flex justify-center items-center bg-[#000000] rounded-lg h-[48px] max-w-[150px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
            disabled={loading} // Disable button during loading
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
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
            ) : (
              "Upload/Save"
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default MediaAssetsSection;
