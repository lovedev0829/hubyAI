import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import office365 from "../../../assets/Images/Office365.png";
import googleicon from "../../../assets/Images/google.png";
import SlackLogo from "../../../assets/Images/SlackLogo.png";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  fetchPostApi,
  fetchGoogleInfoApi,
  getUserDataByEmail,
} from "../../../functions/apiFunctions";
import axios from "axios";
import config from "../../../../config.json";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../../authConfig";
// import { signupRequest } from "../../../authConfig";

interface SignUpProps {
  setTab: (tab: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ setTab }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectFrom = location.state?.from;
  const redirectUrl =
    redirectFrom?.pathname === "/appdetails"
      ? redirectFrom?.pathname + redirectFrom?.search
      : "/";

  const currentEnvironment: string = process.env.VITE_HUBY_ENV || "development";

  const slackClientId: string = `${currentEnvironment}.slackClientId`
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

  const slackClientSecret: string = `${currentEnvironment}.slackClientSecret`
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

  const slackScope: string = `${currentEnvironment}.slackScope`
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

  const slackUserScope: string = `${currentEnvironment}.slackUserScope`
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

  const slackRedirectUriSignup: string =
    `${currentEnvironment}.slackRedirectUriSignup`
      .split(".")
      .reduce((obj: any, key: string) => obj?.[key], config);
  const slackOAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${slackClientId}&scope=${slackScope}&user_scope=${slackUserScope}&redirect_uri=${slackRedirectUriSignup}`;

  useEffect(() => {
    const fetchSlackToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      // const code =
      //   "7619559647154.7605707595239.959be38f53be457187b2a34251fb3f6f376678b687c03bf4477850d7bcc8eb12";
      // console.log("code:", code);

      if (code) {
        try {
          // Exchange the authorization code for an access token
          const response = await axios.post(
            "https://slack.com/api/oauth.v2.access",
            null,
            {
              params: {
                client_id: slackClientId,
                client_secret: slackClientSecret,
                code: code,
                redirect_uri: slackRedirectUriSignup,
              },
            }
          );

          const { authed_user } = response.data;
          // console.log("Access_Token:", authed_user.access_token);
          // console.log("authed_user:", authed_user);

          if (authed_user) {
            // Use the access token to get user details
            const userInfoResponse = await axios.post(
              "https://slack.com/api/users.info",
              new URLSearchParams({
                user: authed_user.id,
                token: authed_user.access_token, // Pass the token as a POST parameter
              }).toString(),
              {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded", // Set content type for form data
                },
              }
            );

            const { user } = userInfoResponse.data;
            // console.log("userInfoResponse", userInfoResponse);

            // console.log("User Email:", user.profile.email);
            // console.log("User First Name:", user.profile.first_name);
            // console.log("User Last Name:", user.profile.last_name);
            // console.log("User Image:", user.profile.image_original);

            // if()

            const oauth2Data = {
              first_name: user.profile.first_name,
              last_name: user.profile.email,
              email: user.profile.email,
              sso_source: "Slack",
              sso_user_id: "",
              created: "",
              created_by: "",
              updated: "",
              updated_by: "",
              access_token: authed_user.access_token,
              // time_to_live: e.expires_in,
              verification: "V",
            };

            const resSignup = await fetchPostApi(
              "/api/users/signup",
              oauth2Data,
              "application/json",
              undefined,
              navigate,
              location
            );

            if (resSignup.data) {
              toast.success(`Sign up Successful!`);
              setTab("Login");
              navigate("/login");
            }

            // You can now use user information and the token in your app
          }
        } catch (error) {
          console.error("Error fetching Slack token:", error);
          toast.error(`${error.response.data.error}`);
        }
      }
    };

    fetchSlackToken();
  }, []);

  const { instance } = useMsal();

  const handleOffice365SignUp = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      //console.log("Signup 365 successful:", response);

      const office365SignupData = {
        first_name: response?.account?.name?.split(" ")[0],
        last_name: response?.account?.name?.split(" ")[1],
        email: response?.account?.username,
        sso_source: "Ofiice365",
        sso_user_id: "",
        created: "",
        created_by: "",
        updated: "",
        updated_by: "",
        access_token: response?.accessToken,
        // time_to_live: e.expires_in,
        verification: "V",
      };

      const resSignup = await fetchPostApi(
        "/api/users/signup",
        office365SignupData,
        "application/json",
        undefined,
        navigate,
        location
      );

      if (resSignup.data) {
        // console.log(resSignup.data, "Google signup response");
        // toast.success(`Sign up Successful!`);
        const office365LoginData = {
          email: response?.account?.username,
          sso_source: "Ofiice365",
          access_token: response?.accessToken,
        };

        const loginresponse = await fetchPostApi(
          "/api/users/login",
          office365LoginData,
          "application/json",
          undefined,
          navigate,
          location
        );
        if (loginresponse.data) {
          // console.log(loginresponse.data, "Google login response");
          localStorage.setItem("logindata", JSON.stringify(loginresponse.data));
        }

        const tokenData = {
          authorization_code: loginresponse.data.authorization_code,
          user_id: loginresponse.data.user_id,
        };

        const token_data = await fetchPostApi(
          "/api/auth/token",
          tokenData,
          "application/json",
          undefined,
          navigate,
          location
        );
        // console.log("email before calling /api/auth/token: ", email);
        if (token_data) {
          // console.log(token_data, "Data received from /api/auth/token");

          setLoading(false);
          const { access_token, refresh_token } = token_data.data;
          // const accessTokenExpire = new Date().getTime() + 15  60  1000;
          // const refreshTokenExpire =
          //   new Date().getTime() + 24  60  60 * 1000;
          localStorage.setItem(
            "access_token",
            JSON.stringify({ access_token })
          );
          localStorage.setItem(
            "refresh_token",
            JSON.stringify({ refresh_token })
          );
        }
        const access_token = JSON.parse(localStorage.getItem("access_token"));
        // console.log(
        //   office365LoginData.email,
        //   access_token,
        //   "email and access_token to retrieve the user by email"
        // );
        const getUser_by_email = await getUserDataByEmail(
          office365LoginData.email,
          access_token
        );
        const userData = getUser_by_email.data[0];
        // console.log(userData, "user data post successful login");
        localStorage.setItem("userData", JSON.stringify(userData));
        // const expiryTime = new Date().getTime() + 15  60  1000;
        // localStorage.setItem("expiryTime", expiryTime.toString());

        // const isVerified = userData.verification;
        // console.log(
        //   isVerified,
        //   redirectUrl,
        //   "isVerified and redirectUrl values"
        // );
        // if (isVerified === "V") {
        //   // toast.success("You've successfully verified your email address.");
        //   toast.success("Login Successful!");
        //   navigate(redirectUrl);
        // } else {
        //   toast.warning(
        //     ` Please verify your account using the email that we just sent on the email address ${email} you provided`
        //   );
        // }
        toast.success("Login Successful!");
        navigate(redirectUrl);
      }
    } catch (error) {
      console.error("Signup 365 failed:", error);
    }
  };
  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  const oauthSignup = useGoogleLogin({
    onSuccess: async (e: any) => {
      try {
        const response = await fetchGoogleInfoApi(e?.access_token);

        const oauth2Data = {
          first_name: response.given_name,
          last_name: response.family_name,
          email: response.email,
          sso_source: "Google",
          sso_user_id: "",
          privilege: "",
          user_icon_url: response.picture,
          created: "",
          created_by: "",
          updated: "",
          updated_by: "",
          access_token: e.access_token,
          time_to_live: e.expires_in,
          verification: "V",
        };

        // console.log(oauth2Data, "signup payload");

        const resSignup = await fetchPostApi(
          "/api/users/signup",
          oauth2Data,
          "application/json",
          undefined,
          navigate,
          location
        );

        if (resSignup.data) {
          // console.log(resSignup.data, "Google signup response");
          // toast.success(`Sign up Successful!`);
          const googleLoginData = {
            email: response.email,
            sso_source: "Google",
            access_token: e.access_token,
          };
          // console.log(
          //   "email before being set from googleLoginData.email is: ",
          //   email,
          //   "and googleLoginData.email is: ",
          //   googleLoginData.email
          // );

          setEmail(googleLoginData.email); // email needs to be set before it can be used in getUserDetailByEmail below
          // console.log("email after being set setEmail is: ", email);
          // console.log(googleLoginData, "login payload");
          // console.log(
          //   "email right before the login using login payload: ",
          //   email
          // );
          const loginresponse = await fetchPostApi(
            "/api/users/login",
            googleLoginData,
            "application/json",
            undefined,
            navigate,
            location
          );
          if (loginresponse.data) {
            // console.log(loginresponse.data, "Google login response");
            localStorage.setItem(
              "logindata",
              JSON.stringify(loginresponse.data)
            );
          }

          const tokenData = {
            authorization_code: loginresponse.data.authorization_code,
            user_id: loginresponse.data.user_id,
          };

          const token_data = await fetchPostApi(
            "/api/auth/token",
            tokenData,
            "application/json",
            undefined,
            navigate,
            location
          );
          // console.log("email before calling /api/auth/token: ", email);
          if (token_data) {
            // console.log(token_data, "Data received from /api/auth/token");

            setLoading(false);
            const { access_token, refresh_token } = token_data.data;
            // const accessTokenExpire = new Date().getTime() + 15  60  1000;
            // const refreshTokenExpire =
            //   new Date().getTime() + 24  60  60 * 1000;
            localStorage.setItem(
              "access_token",
              JSON.stringify({ access_token })
            );
            localStorage.setItem(
              "refresh_token",
              JSON.stringify({ refresh_token })
            );
          }
          const access_token = JSON.parse(localStorage.getItem("access_token"));
          // console.log(
          //   googleLoginData.email,
          //   access_token,
          //   "email and access_token to retrieve the user by email"
          // );
          const getUser_by_email = await getUserDataByEmail(
            googleLoginData.email,
            access_token
          );
          const userData = getUser_by_email.data[0];
          // console.log(userData, "user data post successful login");
          localStorage.setItem("userData", JSON.stringify(userData));
          // const expiryTime = new Date().getTime() + 15  60  1000;
          // localStorage.setItem("expiryTime", expiryTime.toString());

          // const isVerified = userData.verification;
          // console.log(
          //   isVerified,
          //   redirectUrl,
          //   "isVerified and redirectUrl values"
          // );
          // if (isVerified === "V") {
          //   // toast.success("You've successfully verified your email address.");
          //   toast.success("Login Successful!");
          //   navigate(redirectUrl);
          // } else {
          //   toast.warning(
          //     ` Please verify your account using the email that we just sent on the email address ${email} you provided`
          //   );
          // }
          toast.success("Login Successful!");
          navigate(redirectUrl);
        }
      } catch (error) {
        toast.error(`${error.response.data.error}`);
      }
    },
  });

  const userData = {
    first_name: firstName,
    last_name: firstName,
    email: email,
    phone: "",
    user_icon_url: "/static/images/users/someone.png",
    password: password,
    sso_user_id: "",
    created: "",
    created_by: "",
    updated: "",
    updated_by: "",
  };

  const handleSignUp = async () => {
    const isValidName = validateFirstName(firstName);
    const isValidEmail = validateEmail(email);
    const isValidPass = validatePassword(password);

    if (!isValidName || !isValidEmail || !isValidPass) return;
    try {
      setLoading(true);
      const response = await fetchPostApi(
        "/api/users/signup",
        userData,
        "application/json",
        undefined,
        navigate,
        location
      );

      if (response.data) {
        toast.success(
          `Sign up Successful! Please verify your account using the email that we just sent to ${email}.`
        );
        setFirstName("");
        setEmail("");
        setLoading(false);
        setPassword("");
        setTab("Login");
        navigate("/login");
      }
    } catch (error) {
      toast.error(` ${error}`);
      setLoading(false);
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

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

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
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

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFirstName = event.target.value;
    setFirstName(newFirstName);
    validateFirstName(newFirstName);
  };

  const validateFirstName = (value: string) => {
    if (value.length === 0) {
      setFirstNameError("First Name is required");
      return false;
    } else {
      setFirstNameError("");
      return true;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSignUp();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [firstName, email, password]);

  return (
    <>
      <div>
        <div>
          <div className="relative border-[1px] border-[#666565] rounded mt-[28px]">
            <input
              value={firstName}
              onChange={handleFirstNameChange}
              type="text"
              id="fullname"
              className="block rounded p-[25px_18px_10px_18px] w-full sm:text-[18px] text-[15px] text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="fullname"
              className="absolute sm:text-[18px] text-[15px] text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-[17px] z-10 origin-[0] start-2.5 peer-focus:text-black peer-focus:dark:text-black font-semibold peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto !left-[18px]"
            >
              Full Name
            </label>
          </div>
          {firstNameError && (
            <span className="text-[red]">{firstNameError}</span>
          )}
        </div>
        <div>
          <div className="relative border-[1px] border-[#666565] rounded mt-[28px]">
            <input
              value={email}
              onChange={handleEmailChange}
              type="text"
              id="workemail"
              placeholder=" "
              className="block rounded px-[18px] pt-[25px] pb-[10px] w-full sm:text-[18px] text-[15px] text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label
              htmlFor="workemail"
              className="absolute sm:text-[18px] text-[15px] text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-[17px] z-10 origin-[0] start-2.5 peer-focus:text-black peer-focus:dark:text-black font-semibold peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto !left-[18px]"
            >
              Work Email
            </label>
          </div>
        </div>
        {emailError && <span className="text-[red]">{emailError}</span>}
        <div>
          <div className="relative border-[1px] border-[#666565] rounded mt-4 flex items-center ">
            <input
              value={password}
              placeholder=" "
              onChange={handlePasswordChange}
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              className="block rounded px-[18px] pt-[25px] pb-[10px] w-full sm:text-[18px] text-[15px] text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
              htmlFor="password"
              className="absolute sm:text-[18px] text-[15px] text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-[17px] z-10 origin-[0] start-2.5 peer-focus:text-black peer-focus:dark:text-black font-semibold peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto !left-[18px]"
            >
              Password
            </label>
          </div>
          {passwordError && (
            <span className="text-[red] block">{passwordError}</span>
          )}
          <label className="mt-[8px] text-[#696969] text-[16px] font-semibold">
            Use 8 or more characters
          </label>
        </div>

        <button
          className={`w-full sm:text-[20px] text-[18px] flex justify-center items-center py-3 bg-[#282c34] text-white rounded mt-[36px] font-bold ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={handleSignUp}
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
            "Create account"
          )}
        </button>
        <div className="my-[20px] relative">
          <p className="text-[#bec2ca] text-[18px] text-center bg-white relative w-[180px] mx-auto z-[1]">
            or continue with
          </p>
          <span className="bg-[#bec2ca] h-[1px] w-full block absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]"></span>
        </div>

        <div className="flex sm:flex-row flex-col items-center gap-[20px]">
          <button
            data-testid="google-oauth-button"
            className="flex justify-center items-center gap-[20px] shadow-[0_10px_32px_6px_rgba(0,0,0,0.1)] px-[20px] py-[15px] rounded sm:w-full w-[50%] font-semibold text-[#696969] text-[20px]"
            onClick={() => oauthSignup()}
          >
            <img src={googleicon} alt="googleicon" className="w-[15%]" />
            Google
          </button>

          <button className="sm:w-full w-[50%]" onClick={handleOffice365SignUp}>
            <img
              src={office365}
              alt="office365"
              className="w-full shadow-[0_10px_32px_6px_rgba(0,0,0,0.1)] rounded px-[20px] py-[16.8px]"
            />
          </button>

          {/* <button className="sm:w-full w-[50%]">
            <img
              src={SlackLogo}
              alt="SlackLogo"
              className="w-full shadow-[0_10px_32px_6px_rgba(0,0,0,0.1)] px-[20px] py-[15.1px] rounded"
            />
          </button> */}
          <Link
            to={slackOAuthUrl}
            // target="_blank"
            className="sm:w-full w-[50%]"
          >
            <img
              src={SlackLogo}
              alt="SlackLogo"
              className="w-full shadow-[0_10px_32px_6px_rgba(0,0,0,0.1)] px-[20px] py-[15.1px] rounded"
            />
          </Link>
        </div>
        <p className="text-[#696969] font-semibold sm:text-[18px] text-[15px] mt-[20px]">
          By registering, you agree to our{" "}
          <a href="#" className="text-[#553dcd] underline">
            Terms of Service
          </a>{" "}
          and you acknowledge that you have read and understand our{" "}
          <a href="#" className="text-[#553dcd] underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </>
  );
};

export default SignUp;
