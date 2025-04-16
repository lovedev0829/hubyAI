import React, { useState, ChangeEvent } from "react";
import { LiaUserCircleSolid } from "react-icons/lia";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchPostApi,
  fetchPutApi,
} from "../../../functions/apiFunctions";

interface UserData {
  user_id: string;
}

interface ApiResponse {
  data: {
    filename?: string;
  };
}

const UpdateProfile: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageData, setImageData] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const userData: UserData = JSON.parse(
    localStorage.getItem("userData") || "{}"
  );
  const access_user: string = JSON.parse(
    localStorage.getItem("access_token") || "{}"
  );

  const convertBase64ToBlob = (base64Data: string): Blob => {
    const byteString = atob(base64Data.split(",")[1]);
    const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const details = reader.result as string;
        setImageData(details);
        const blob = convertBase64ToBlob(details);
        const blobUrl = URL.createObjectURL(blob);
        setImageData(blobUrl);
        localStorage.setItem("profileImg", blobUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // console.log("object=======", imageData);

  const handleUploadImage = async () => {
    if (!imageFile) {
      toast.error("No image file selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const imageUpload: ApiResponse = await fetchPostApi(
        `/api/users/${userData.user_id}/savepicture`,
        formData,
        "multipart/form-data",
        access_user,
        navigate,
        location
      );

      if (imageUpload?.data?.filename) {
        const updateData = {
          user_icon_url: `/assets/images/users/${imageUpload.data.filename}`,
        };

        const updateUrl: ApiResponse = await fetchPutApi(
          `/api/users/${userData.user_id}`,
          updateData,
          "application/json",
          access_user,
          navigate,
          location
        );

        if (updateUrl?.data) {
          toast.success("Image Uploaded Successfully!");
          navigate("/");
        }
      }
    } catch (error: any) {
      toast.error(` ${error.response?.data?.error}`);
    }
  };

  return (
    <>
      <div className="max-w-[530px] m-[2%_auto] sm:p-[30px] p-[16px] shadow-[rgba(0,_0,_0,0.2)_0px_7px_29px_0px] rounded">
        <h1 className="text-[#282c34] sm:text-[30px] text-[25px] font-bold">
          Update Profile
        </h1>
        <div className="mt-[100px] mx-auto relative">
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="mx-auto w-[80px] h-[80px] absolute rounded-full top-[-88px] left-[49.5%] translate-x-[-50%] opacity-0 pointer-events-auto z-10"
          />
          {imageData ? (
            <img
              src={imageData}
              alt="Upload"
              className="mx-auto w-[80px] h-[80px] rounded-full object-cover absolute top-[-88px] left-[49.5%] translate-x-[-50%] shadow-[rgba(100,100,111,0.2)_0px_2px_8px_1px] border-[#dbdbdb] border-[2px]"
            />
          ) : (
            <button className="text-[80px] absolute top-[-88px] rounded-full left-[49.5%] translate-x-[-50%] z-[1]">
              <LiaUserCircleSolid />
            </button>
          )}
        </div>

        <button
          className="w-full sm:text-[20px] text-[18px] flex justify-center items-center py-3 bg-[#282c34] text-white rounded mt-[36px] font-bold"
          onClick={handleUploadImage}
        >
          Upload Image
        </button>
      </div>
    </>
  );
};

export default UpdateProfile;
