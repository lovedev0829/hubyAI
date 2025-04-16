import { useEffect, useState } from "react";
// import Logo from "../../assets/Images/logo-main.png";
import { fetchPostApi, fetchPutApi } from "../../functions/apiFunctions";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const ChangePasswordPage = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setconfirmPasswordError] = useState<
    string | null
  >(null);
  const [currentPasswordError, setcurrentPasswordError] = useState<
    string | null
  >(null);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectFrom = location.state?.from;
  const previousPage = redirectFrom?.pathname;
  console.log("previousPage", previousPage);

  const userData: { email: string } | null = JSON.parse(
    localStorage.getItem("userData") || "null"
  );
  const email = userData?.email;

  const getDefaultUserId = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const idFromUrl = urlParams.get("user_id");

    if (idFromUrl) {
      return idFromUrl; // Return userId from URL param if it exists
    }

    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        if (userData?.user_id) {
          return userData.user_id; // Return userId from localStorage if valid
        }
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
      }
    }

    return ""; // Default value if neither source has userId
  };

  const userId = getDefaultUserId();
  console.log("userId", userId);
  useEffect(() => {
    if (userId === "") {
      navigate("/login");
    }
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prevState) => !prevState);
  };
  const toggleCurrentPasswordVisibility = () => {
    setIsCurrentPasswordVisible((prevState) => !prevState);
  };
  const validatePassword = (value: string) => {
    if (value.length === 0) {
      setPasswordError("Password is required");
      return false;
    } else if (value.length < 8) {
      setPasswordError("Password must be 8 or more characters");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const verifyWithLogin = async (value) => {
    try {
      const logInData = {
        email,
        password: value,
      };
      const response = await fetchPostApi(
        "/api/users/login",
        logInData,
        "application/json",
        undefined,
        navigate,
        location
      );
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {}
  };

  const verifyConfirmPassword = (value: string) => {
    if (value.length === 0) {
      setconfirmPasswordError("Password is required");
      return false;
    } else if (value.length < 8) {
      setconfirmPasswordError("Password must be 8 or more characters");
      return false;
    } else if (value !== password) {
      setconfirmPasswordError(
        "Confirm Password does not match with New Password"
      );
      return false;
    } else {
      setconfirmPasswordError("");
      return true;
    }
  };
  const verifyCurrentPassword = async (value: string) => {
    if (value.length === 0) {
      setcurrentPasswordError("Password is required");
      return false;
    } else if (value.length < 8) {
      setcurrentPasswordError("Password must be 8 or more characters");
      return false;
    } else if (value.length > 8) {
      const isVerified = await verifyWithLogin(value);
      if (!isVerified) {
        setcurrentPasswordError("Your Current Password is worng");
        return false;
      }
      setcurrentPasswordError("");
      return true;
    } else {
      setcurrentPasswordError("");
      return true;
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };
  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPassword = event.target.value;
    setConfirmPassword(newPassword);
    verifyConfirmPassword(newPassword);
  };
  const handleCurrentPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPassword = event.target.value;
    setCurrentPassword(newPassword);
    verifyCurrentPassword(newPassword);
  };

  const handleSubmit = async () => {
    try {
      if (previousPage === "/userprofile") {
        const isValidPass = validatePassword(password);
        const isVerifyPass = password === confirmPassword;
        const isVerifyCurrentPass = verifyCurrentPassword(currentPassword);
        if (isValidPass && isVerifyPass && userId && isVerifyCurrentPass) {
          setLoading(true);
          const data = {
            new_password: password,
          };
          const path = `/api/users/${userId}/change_password`;
          const response = await fetchPutApi(path, data, undefined, undefined, navigate, location);
          toast.success(response?.data?.message);
          setLoading(false);
          setPassword("");
          setConfirmPassword("");
          navigate("/login");
        }
      } else {
        const isValidPass = validatePassword(password);
        const isVerifyPass = password === confirmPassword;

        if (isValidPass && isVerifyPass && userId) {
          setLoading(true);
          const data = {
            new_password: password,
          };
          const path = `/api/users/${userId}/change_password`;
          const response = await fetchPutApi(path, data, undefined, undefined, navigate, location);
          toast.success(response?.data?.message);
          setLoading(false);
          setPassword("");
          setConfirmPassword("");
          navigate("/login");
        }
      }
    } catch (error) {
      toast.error(error.response.data.error || error.response.data);
      navigate("/login");
    }
  };

  return (
    <div>
      <div className="max-w-[530px] m-[2%_auto] sm:p-[30px] p-[16px] shadow-[rgba(0,_0,_0,0.2)_0px_7px_29px_0px] rounded">
        {/* <div className="flex justify-center mb-4">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="sm:max-w-[146px] max-w-[100px]"
                    />
                </div> */}

        <h1 className="text-[#282c34] sm:text-[30px] text-[25px] font-bold">
          Change Password
        </h1>

        <div>
          {previousPage === "/userprofile" && (
            <>
              <div className="relative border-[1px] border-[#666565] rounded mt-4 flex items-center ">
                <input
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                  id="currentPassword"
                  type={isCurrentPasswordVisible ? "text" : "password"}
                  className="block rounded px-[18px] pt-[25px] pb-[10px] w-full sm:text-[18px] text-[15px] text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder="Enter your current password"
                />
                <button
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                  onClick={toggleCurrentPasswordVisibility}
                  data-testid="toggle-password-button"
                >
                  {isCurrentPasswordVisible ? (
                    <FaRegEye className="text-[20px] text-[#282c34]" />
                  ) : (
                    <FaRegEyeSlash className="text-[20px] text-[#282c34]" />
                  )}
                </button>
                <label
                  htmlFor="currentPassword"
                  className="absolute sm:text-[18px] text-[15px] text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-[17px] z-10 origin-[0] start-2.5 peer-focus:text-black peer-focus:dark:text-black font-semibold peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto !left-[18px]"
                >
                  Current Password
                </label>
              </div>
              {currentPasswordError && (
                <span className="text-[red] block my-2">
                  {currentPasswordError}
                </span>
              )}
            </>
          )}

          <div className="relative border-[1px] border-[#666565] rounded mt-4 flex items-center ">
            <input
              value={password}
              onChange={handlePasswordChange}
              id="newPassword"
              type={isPasswordVisible ? "text" : "password"}
              className="block rounded px-[18px] pt-[25px] pb-[10px] w-full sm:text-[18px] text-[15px] text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <button
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
              onClick={togglePasswordVisibility}
              data-testid="toggle-password-button"
            >
              {isPasswordVisible ? (
                <FaRegEye className="text-[20px] text-[#282c34]" />
              ) : (
                <FaRegEyeSlash className="text-[20px] text-[#282c34]" />
              )}
            </button>
            <label
              htmlFor="newPassword"
              className="absolute sm:text-[18px] text-[15px] text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-[17px] z-10 origin-[0] start-2.5 peer-focus:text-black peer-focus:dark:text-black font-semibold peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto !left-[18px]"
            >
              New Password
            </label>
          </div>
          {passwordError && (
            <span className="text-[red] block my-2">{passwordError}</span>
          )}

          <div className="relative border-[1px] border-[#666565] rounded mt-4 flex items-center ">
            <input
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              id="confirmPassword"
              type={isConfirmPasswordVisible ? "text" : "password"}
              className="block rounded px-[18px] pt-[25px] pb-[10px] w-full sm:text-[18px] text-[15px] text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <button
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
              onClick={toggleConfirmPasswordVisibility}
              data-testid="toggle-password-button"
            >
              {isConfirmPasswordVisible ? (
                <FaRegEye className="text-[20px] text-[#282c34]" />
              ) : (
                <FaRegEyeSlash className="text-[20px] text-[#282c34]" />
              )}
            </button>
            <label
              htmlFor="confirmPassword"
              className="absolute sm:text-[18px] text-[15px] text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-[17px] z-10 origin-[0] start-2.5 peer-focus:text-black peer-focus:dark:text-black font-semibold peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto !left-[18px]"
            >
              Confirm Password
            </label>
          </div>
          {confirmPasswordError && (
            <span className="text-[red] block my-2">
              {confirmPasswordError}
            </span>
          )}
          <label className="mt-[8px] text-[#696969] text-[16px] font-semibold">
            Use 8 or more characters
          </label>
        </div>

        <button
          className={`w-full sm:text-[20px] text-[18px] flex justify-center items-center py-3 bg-[#282c34] text-white rounded mt-[36px] font-bold ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={handleSubmit}
          data-testid="login-button"
          disabled={loading}
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
            "Submit"
          )}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
