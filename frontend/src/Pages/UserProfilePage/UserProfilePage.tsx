import { ChangeEvent, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import rocket from "../../../src/assets/Images/rocket.png";
import bulb from "../../../src/assets/Images/bulb.png";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../../components/Footer/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  fetchPostApi,
  fetchPutApi,
  fetchGetApi,
  getUserProfileImage,
} from "../../functions/apiFunctions";
import { toast } from "react-toastify";

interface UserData {
  created: string;
  created_by: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  sso_user_id: string;
  updated: string;
  updated_by: string;
  user_icon_url: string;
  user_id: string;
  verification: string;
}

interface ApiResponse {
  data: {
    file_url?: string;
  };
}

const UserProfilePage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const userData: UserData = JSON.parse(
    localStorage.getItem("userData") || "{}"
  );

  const access_user: string = JSON.parse(
    localStorage.getItem("access_token") || "{}"
  );

  const initialEditName = userData?.first_name + " " + userData?.last_name;
  const [filterAppData, setFilterAppData] = useState([]);
  const [imageData, setImageData] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editName, setEditName] = useState(initialEditName);
  const [profileImage, setProfileImage] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getUserProfile = async () => {
      const userData: { user_id: string } | null = JSON.parse(
        localStorage.getItem("userData") || "null"
      );
      const access_user: string | null = JSON.parse(
        localStorage.getItem("access_token") || "null"
      );
      if (userData && access_user) {
        const image: string = await getUserProfileImage(
          `/api/users/${userData.user_id}`,
          access_user
        );
        setProfileImage(image);
      }
    };
    getUserProfile();
  }, []);
  useEffect(() => {
    localStorage.setItem("isEdit", JSON.stringify(isEdit));
  }, [isEdit]);

  useEffect(() => {
    const filterAppDataByLoginUser = async () => {
      try {
        const path = "/api/applications/user_owned";
        const response = await fetchGetApi(
          path,
          access_user,
          navigate,
          location
        );
        setFilterAppData(response.data);
      } catch (error) {
        console.log("filterData Error:", error);
      }
    };
    filterAppDataByLoginUser();
  }, []);

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
    if (isEdit) {
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
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      // toast.info("No image file selected");
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

      if (imageUpload?.data?.file_url) {
        const updateData = {
          user_icon_url: imageUpload.data.file_url,
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
          const updatedUserData = {
            ...userData,
            user_icon_url: imageUpload.data.file_url,
          };
          localStorage.setItem("userData", JSON.stringify(updatedUserData));
          toast.success("Image Uploaded Successfully!");
          setImageData("");
          navigate("/");
        }
      }
    } catch (error: any) {
      toast.error(` ${error.response?.data?.error}`);
      setImageData("");
      setImageFile(null);
    }
  };

  const handleClickOnEdit = () => {
    setIsEdit(true);
  };

  const updateUserName = async () => {
    if (editName === "") {
      setEditName(initialEditName);
      return;
    }
    const [newFirstName, newLastName] = editName.split(" ");
    if (
      newFirstName === userData.first_name &&
      newLastName === userData.last_name
    ) {
      setEditName(initialEditName);
      return;
    }
    try {
      const updateData = {
        first_name: editName.split(" ")[0],
        last_name: editName.split(" ")[1],
      };
      const response = await fetchPutApi(
        "/api/users/" + userData.user_id,
        updateData,
        "application/json",
        access_user,
        navigate,
        location
      );
      if (response.status === 201) {
        const updatedUserData = {
          ...userData,
          first_name: updateData.first_name,
          last_name: updateData.last_name,
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        toast.success("User Name Updated Successfully!");
        navigate("/");
      }
      setEditName(initialEditName);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClickOnSave = async () => {
    await handleUploadImage();
    await updateUserName();
    setIsEdit(false);
  };

  return (
    <div>
      <div>
        <Header path="/userprofile" />
        <div>
          <div className="bg-[#61696E] w-full xl:p-[60px_170px] sm:p-[60px_20px] p-[30px_16px] flex sm:flex-row flex-col items-center xl:gap-[40px] gap-[20px] justify-center">
            <div className="flex flex-row xl:gap-[40px] gap-[20px] ">
              <div className="mt-[100px] w-[100px] h-[100px] mx-auto relative">
                {isEdit && (
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="mx-auto w-[100px] h-[100px] absolute rounded-full top-[-88px] left-[49.5%] translate-x-[-50%] opacity-0 pointer-events-auto z-10"
                  />   
                )}
                {
                  imageData ? (
                    <img
                      src={imageData}
                      alt="Profile Image"
                      className="mx-auto w-[100px] h-[100px] rounded-full object-cover absolute top-[-88px] left-[49.5%] translate-x-[-50%] shadow-[rgba(100,100,111,0.2)_0px_2px_8px_1px] border-[#dbdbdb] border-[2px] cursor-pointer"
                    />
                  ) : !profileImage.includes("someone.png") ? (
                    <img
                      src={profileImage}
                      alt="Profile Image"
                      className="mx-auto w-[100px] h-[100px] rounded-full object-cover absolute top-[-88px] left-[49.5%] translate-x-[-50%] shadow-[rgba(100,100,111,0.2)_0px_2px_8px_1px] border-[#dbdbdb] border-[2px] cursor-pointer"
                    />
                  ) : (
                    <div className="text-[80px] absolute top-[-88px] bg-[#9F9F9F] w-[100px] h-[100px] rounded-full left-[49.5%] translate-x-[-50%] z-[1] cursor-pointer"></div>
                  )
                  // <div className="bg-[#9F9F9F] w-[100px] h-[100px] rounded-full"></div>
                }
              </div>

              <div className="xl:w-[760px] sm:w-[70%] w-[50%]">
                {isEdit && (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                )}
                {!isEdit && (
                  <h3 className="text-[#fff] text-[24px] font-bold sm:leading-[32px] roboto">
                    {userData?.first_name + " " + userData?.last_name}
                  </h3>
                )}
                <div className="flex gap-[6px] items-center sm:mt-[12px] mt-[6px]">
                  <button className="bg-[#9F9F9F] text-[#000] text-[12px] font-normal sm:leading-[16px] p-[2px_4px] roboto rounded-[2px]">
                    Expert
                  </button>
                  <button className="bg-[#9F9F9F] text-[#000] text-[12px] font-normal sm:leading-[16px] p-[2px_4px] roboto rounded-[2px]">
                    Innovator
                  </button>
                </div>
                <p className="sm:mt-[12px] mt-[6px] text-[#fff] text-[16px] font-normal sm:leading-[24px] roboto">
                  Passionate about technology and design
                </p>
              </div>
            </div>

            {isEdit && (
              <button
                className="bg-[#000] text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto p-[12px_40px] rounded-[8px]"
                onClick={() => {
                  console.log("opooop");
                  navigate("/changepassword", { state: { from: location } });
                }}
              >
                Change Password
              </button>
            )}
            <button
              className="bg-[#000] text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto p-[12px_40px] rounded-[8px]"
              data-testid="EditProfile"
              onClick={isEdit ? handleClickOnSave : handleClickOnEdit}
            >
              {isEdit ? "Save" : "Edit"} Profile
            </button>
          </div>

          <div className="xl:p-[60px_170px] sm:p-[60px_20px] p-[30px_16px]">
            <h1 className="sm:text-[40px] text-[32px] font-bold sm:leading-[48px] roboto text-center">
              User Profile
            </h1>
            <div className="flex sm:flex-row flex-col gap-[20px] items-center sm:mt-[60px] mt-[30px]">
              <div className="border-[1px] border-[#E6E6E6] rounded-[6px] p-[16px] h-[124px] md:w-[50%] w-full">
                <p className="text-[#808080] text-[16px] font-normal sm:leading-[24px] roboto m-0">
                  Reputation Score
                </p>
                <h3 className="sm:text-[28px] text-[20px] font-medium sm:leading-[36px] roboto mt-[4px] mb-0">
                  950
                </h3>
                <h6 className="text-[16px] font-normal sm:leading-[24px] roboto mt-[4px] mb-0">
                  +25
                </h6>
              </div>
              <div className="border-[1px] border-[#E6E6E6] rounded-[6px] p-[16px] h-[124px] md:w-[50%] w-full">
                <p className="text-[#808080] text-[16px] font-normal sm:leading-[24px] roboto m-0">
                  Reputation Score
                </p>
                <h3 className="sm:text-[28px] text-[20px] font-medium sm:leading-[36px] roboto m-0 mt-[4px] mb-0">
                  B1, B2, B3
                </h3>
              </div>
            </div>
          </div>

          <div className="xl:p-[60px_170px] sm:p-[60px_20px] p-[30px_16px] flex md:flex-row flex-col items-center lg:gap-[60px] md:gap-0 gap-[40px] justify-center w-full">
            <div className="md:w-[50%] w-full">
              <h1
                className="sm:text-[40px] text-[32px] font-bold sm:leading-[48px] roboto md:text-left text-center"
                data-testid="Edit Profile"
              >
                Edit Profile
              </h1>
              <p className="text-[16px] font-normal sm:leading-[24px] md:mt-[24px] sm:mt-[12px] mt-[6px] mb-0 roboto md:text-left text-center">
                Update your profile information
              </p>
            </div>
            <div className="md:w-[50%] w-full">
              <div className="flex flex-col">
                <label className="text-[14px] font-medium sm:leading-[20px] mb-[4px] roboto">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter your location"
                  className="p-[8px_12px] border-[1px] border-[#E6E6E6] rounded-[6px] text-[14px] font-normal placeholder:text-[#808080] placeholder:text-[14px] placeholder:font-normal placeholder:sm:leading-[20px] roboto placeholder:roboto"
                />
              </div>
              <div className="flex flex-col sm:mt-[40px] mt-[20px]">
                <label className="text-[14px] font-medium sm:leading-[20px] mb-[4px]">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Enter your company affiliation"
                  className="p-[8px_12px] border-[1px] border-[#E6E6E6] rounded-[6px] text-[14px] font-normal placeholder:text-[#808080] placeholder:text-[14px] placeholder:font-normal placeholder:sm:leading-[20px] roboto placeholder:roboto"
                />
              </div>
              <button className="text-[#fff] text-[16px] font-medium sm:leading-[24px] roboto p-[12px_69px] bg-[#000] rounded-[8px] sm:mt-[40px] mt-[20px] text-center sm:w-auto w-full">
                Save Changes
              </button>
            </div>
          </div>

          <div className="xl:p-[60px_170px] sm:p-[60px_20px] p-[30px_16px] flex md:flex-row flex-col items-center lg:gap-[60px] md:gap-0 gap-[40px] justify-center w-full">
            <div className="md:w-[50%] w-full">
              <h1 className="sm:text-[40px] text-[32px] font-bold sm:leading-[48px] roboto md:text-left text-center">
                Bio Section
              </h1>
              <p className="text-[16px] font-normal sm:leading-[24px] md:mt-[24px] sm:mt-[12px] mt-[6px] mb-0 roboto md:text-left text-center">
                Highlighting user expertise and interests
              </p>
            </div>
            <div className="md:w-[50%] w-full">
              <div className="border-[1px] border-[#E6E6E6] rounded-[6px] p-[16px] flex sm:flex-row flex-col sm:items-center gap-[16px]">
                <div className="bg-[#ECECEC] w-[100px] h-[100px] sm:mr-0 mr-auto"></div>
                <div>
                  <h6 className="text-[20px] font-medium sm:leading-[28px] roboto m-0">
                    Expertise
                  </h6>
                  <p className="text-[16px] font-normal sm:leading-[24px] roboto mt-[8px] mb-0">
                    Software Development, UI/UX Design, Product Management
                  </p>
                </div>
              </div>
              <div className="border-[1px] border-[#E6E6E6] rounded-[6px] p-[16px] flex sm:flex-row flex-col sm:items-center gap-[16px] md:mt-[40px] mt-[20px]">
                <div className="bg-[#ECECEC] w-[100px] h-[100px] sm:mr-0 mr-auto"></div>
                <div>
                  <h6 className="text-[20px] font-medium sm:leading-[28px] roboto m-0">
                    Interests
                  </h6>
                  <p className="text-[16px] font-normal sm:leading-[24px] roboto mt-[8px] mb-0">
                    Artificial Intelligence, IoT, Virtual Reality
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:p-[60px_170px] sm:p-[60px_20px] p-[30px_16px] flex md:flex-row flex-col items-center lg:gap-[60px] md:gap-0 gap-[40px] justify-center w-full">
            <div className="md:w-[50%] w-full">
              <h1 className="sm:text-[40px] text-[32px] font-bold sm:leading-[48px] roboto md:text-left text-center">
                Activity Section
              </h1>
              <p className="text-[16px] font-normal sm:leading-[24px] md:mt-[24px] sm:mt-[12px] mt-[6px] mb-0 roboto md:text-left text-center">
                User's recent actions and interactions
              </p>
            </div>
            <div className="md:w-[50%] w-full flex sm:flex-row flex-col gap-[40px] items-center">
              <div className="md:w-[50%] w-full text-center">
                <img src={rocket} alt="rocket" className="m-auto" />
                <h3 className="sm:text-[20px] text-[18px] font-normal sm:leading-[28px] roboto sm:mt-[20px] mt-[10px] mb-0">
                  Official Launch
                </h3>
                <p className="text-[#808080] text-[16px] font-normal sm:leading-[24px] roboto mt-[8px] mb-0">
                  New Product XYZ launched
                </p>
                <h1 className="sm:text-[28px] text-[20px] font-medium sm:leading-[36px] roboto sm:mt-[20px] mt-[10px] mb-0">
                  5 Stars
                </h1>
              </div>
              <div className="md:w-[50%] w-full text-center">
                <img src={bulb} alt="bulb" className="m-auto" />
                <h3 className="sm:text-[20px] text-[18px] font-normal sm:leading-[28px] roboto sm:mt-[20px] mt-[10px] mb-0">
                  Prototype
                </h3>
                <p className="text-[#808080] text-[16px] font-normal sm:leading-[24px] roboto mt-[8px] mb-0">
                  Innovative Idea ABC
                </p>
                <h1 className="sm:text-[28px] text-[20px] font-medium sm:leading-[36px] roboto sm:mt-[20px] mt-[10px] mb-0">
                  Positive Feedback
                </h1>
              </div>
            </div>
          </div>

          <div className="w-full sm:my-[60px] my-[30px]">
            <h1 className="sm:text-[40px] text-[32px] font-bold sm:leading-[48px] roboto text-center mb-0">
              Recent Activity
            </h1>
            <p className="text-[16px] font-normal sm:leading-[24px] roboto text-center md:mt-[24px] sm:mt-[12px] mt-[6px] mb-0">
              Stay updated with community interactions
            </p>
            <div className="grid md:grid-cols-2 grid-cols-1 md:gap-[40px] sm:gap-[30px] gap-[15px] xl:px-[100px] md:px-[40px] px-[20px] md:mt-[60px] mt-[30px]">
              {filterAppData.map((data) => (
                <div className="border-[1px] border-[#E6E6E6] rounded-[6px] py-[12px] ">
                  <div className="flex gap-[8px] items-center px-[12px]">
                    <div className="bg-[#ECECEC] w-[32px] h-[32px] rounded-full"></div>
                    <div className="">
                      <h3 className="text-[14px] font-medium sm:leading-[20px] roboto my-0">
                        {data?.application}
                      </h3>
                      <p className="text-[#808080] text-[12px] font-normal sm:leading-[16px] roboto">
                        2 hours ago - Online
                      </p>
                    </div>
                    <button className="ml-auto">
                      <PiDotsThreeOutlineFill />
                    </button>
                  </div>
                  <div>
                    <Link to={`/edit/appinfo?app_id=${data?._id}`}>
                      <div className="slider-container">
                        <Slider {...settings}>
                          <div>
                            <div className="bg-[#ECECEC] w-full h-[300px]">
                              <p className="text-[12px] font-normal sm:leading-[16px] text-center">
                                Image here
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="bg-[#ECECEC] w-full h-[300px]">
                              <p className="text-[12px] font-normal sm:leading-[16px] text-center">
                                Image here
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="bg-[#ECECEC] w-full h-[300px]">
                              <p className="text-[12px] font-normal sm:leading-[16px] text-center">
                                Image here
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="bg-[#ECECEC] w-full h-[300px]">
                              <p className="text-[12px] font-normal sm:leading-[16px] text-center">
                                Image here
                              </p>
                            </div>
                          </div>
                        </Slider>
                      </div>
                    </Link>
                  </div>
                  <div className="px-[12px]">
                    <h6
                      className="text-[16px] font-normal sm:leading-[24px] roboto sm:mt-[12px] mt-[6px] mb-0"
                      data-testid="Greatdiscussion"
                    >
                      Great discussion on the latest trends!
                    </h6>
                    <div className="flex gap-[6px] items-center mt-[8px]">
                      <button className="text-[12px] font-normal sm:leading-[16px] roboto p-[2px_4px] bg-[#EBEBEB] rounded-[2px] border-[0.5px] border-[#D4D4D4]">
                        Community
                      </button>
                      <button className="text-[12px] font-normal sm:leading-[16px] roboto p-[2px_4px] bg-[#EBEBEB] rounded-[2px] border-[0.5px] border-[#D4D4D4]">
                        Trends
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default UserProfilePage;
