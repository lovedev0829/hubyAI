import { useState } from "react";
// import Logo from "../../assets/Images/logo-main.png";
import { fetchGetApi } from "../../functions/apiFunctions";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const validateEmail = (value: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (value.length === 0) {
      setEmailError("E-mail is required");
      return false;
    } else if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handleForgotPassword = async () => {
    try {
      const isValidEmail = validateEmail(email);
      if (isValidEmail) {
        setLoading(true);
        const path = `/api/users/forgot_password/${email}`;
        const response = await fetchGetApi(path, undefined, navigate, location);
        toast.success(response?.data?.message);
        setLoading(false);
        setEmail("");
        navigate("/login");
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
          Forgot Password
        </h1>

        <div>
          <div className="relative border-[1px] border-[#666565] rounded mt-[28px]">
            <input
              value={email}
              data-testid="email-input"
              onChange={handleEmailChange}
              type="text"
              id="emailAddressf"
              className="block rounded p-[40px_18px_10px_18px]   w-full sm:text-[18px] text-[15px] text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder="Enter the email address you used to signup for huby"
            />
            <label
              htmlFor="emailAddressf"
              className="absolute sm:text-[18px] text-[15px] text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-[17px] z-10 origin-[0] start-2.5 peer-focus:text-black peer-focus:dark:text-black font-semibold peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto !left-[18px]"
            >
              Email Address
            </label>
          </div>
        </div>
        {emailError && <span className="text-[red]">{emailError}</span>}

        <button
          className={`w-full sm:text-[20px] text-[18px] flex justify-center items-center py-3 bg-[#282c34] text-white rounded mt-[36px] font-bold ${loading ? "cursor-not-allowed opacity-50" : ""
            }`}
          onClick={handleForgotPassword}
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

export default ForgotPasswordPage;
