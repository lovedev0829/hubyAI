import { useState } from "react";
import SignUp from "../../components/Auth/Signup/SignUp";
import Login from "../../components/Auth/Login/Login";
import { useNavigate } from "react-router-dom";
// import Logo from "../../assets/Images/logo-main.png";

const SignupPage = ({ initialTab }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(initialTab);
  const handleSignUp = () => {
    setTab("SignUp");
    navigate("/signup");
  };
  const handleLogin = () => {
    setTab("Login");
    navigate("/login");
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
          Sign up for free or log in
        </h1>
        <div className="border rounded-lg my-[22px] flex">
          <button
            onClick={handleSignUp}
            className={`${
              tab === "SignUp"
                ? "font-bold rounded-s-lg bg-[#6495ED] sm:text-[14px] text-[12px] text-[#fff] w-full py-[10px]"
                : "sm:text-[14px] rounded-lg text-[12px] font-medium font-Inter text-[#464F60]  w-full border-transparent"
            } `}
          >
            Sign up free
          </button>
          <button
            onClick={handleLogin}
            className={`${
              tab === "Login"
                ? "font-bold rounded-e-lg bg-[#6495ED] sm:text-[14px] text-[12px] text-[#fff] w-full py-[10px]"
                : "sm:text-[14px]  rounded-lg text-[12px] font-medium font-Inter text-[#464F60]  w-full border-transparent"
            } `}
          >
            Log In
          </button>
        </div>
        <div className=" w-full">
          {tab === "SignUp" && <SignUp setTab={setTab} />}
          {tab === "Login" && <Login />}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
