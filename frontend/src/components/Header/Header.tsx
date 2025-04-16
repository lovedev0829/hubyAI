import React, { useEffect, useState } from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
// import Bookmark from "../../assets/Images/bookmark.png";
import Logo from "../../assets/Images/logo-main.png";
import User from "../../assets/Images/user_profile.png";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { getUserProfileImage } from "../../functions/apiFunctions";
import { IoMenu } from "react-icons/io5";

interface HeaderProps {
  path: string;
  toggleSidebar?: any;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Header: React.FC<HeaderProps> = ({ path, toggleSidebar }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const access_token: string | null = JSON.parse(
    localStorage.getItem("access_token") || "null"
  );

  const handleLogout = () => {
    localStorage.clear();
  };

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

  return (
    <>
      <div
        className="flex justify-between items-center sm:p-[0px_19px_0px_28px] p-[0px_14px] border-b-[#66666629] border-b-[1px] bg-white sticky top-0 z-[2]"
        data-testid="header"
      >
        <div className="flex items-center gap-5">
          {path !== "home" && (
            <div onClick={toggleSidebar} className="cursor-pointer">
              <IoMenu className="md:min-w-[35px] max-w-[25px] md:min-h-[35px] max-h-[25px]" />
            </div>
          )}

          <Link to="/dashboard">
            <img
              src={Logo}
              alt="Logo"
              className="sm:max-w-[146px] max-w-[100px]"
            />
          </Link>
        </div>
        <div className="flex items-center sm:gap-[8px] gap-[4px]">
          {/* <Link
          to="/comments"
          className={` hover:bg-[#3D9D9D] hover:border-[1px] hover:border-[#008080] text-[#fff] rounded-[12px] ${
            path === "/comments"
              ? "bg-[#FF7F50] border-[1px] border-[#FF8356]"
              : "bg-[#0A2239]"
          } border-[1px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] md:block hidden no-underline`}
        >
          Comments
        </Link> */}
          {/* <Link
          to="/prototypedetails"
          className={` hover:bg-[#3D9D9D] hover:border-[1px] hover:border-[#008080] text-[#fff] rounded-[12px] ${
            path === "/prototypedetails"
              ? "bg-[#FF7F50] border-[1px] border-[#FF8356]"
              : "bg-[#0A2239]"
          } border-[1px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] md:block hidden no-underline`}
        >
          Prototype Details Page
        </Link> */}
          {/* <Link
          to="/review-request"
          className={` hover:bg-[#3D9D9D] hover:border-[1px] hover:border-[#008080] text-[#fff] rounded-[12px] ${
            path === "reviewRequest"
              ? "bg-[#FF7F50] border-[1px] border-[#FF8356]"
              : "bg-[#0A2239]"
          } border-[1px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] md:block hidden no-underline`}
        >
          Review Request Page
        </Link> */}
          {/* <Link
          to="/edit-appinfo"
          className={` hover:bg-[#3D9D9D] hover:border-[1px] hover:border-[#008080] text-[#fff] rounded-[12px] ${
            path === "edit-appinfo"
              ? "bg-[#FF7F50] border-[1px] border-[#FF8356]"
              : "bg-[#0A2239]"
          } border-[1px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] md:block hidden no-underline`}
        >
          Edit AppInfo Page
        </Link> */}
          {/* <Link
          to="/prototype/dashboard"
          className={` hover:bg-[#3D9D9D] hover:border-[1px] hover:border-[#008080] text-[#fff] rounded-[12px] ${
            path === "prototype/dashboard"
              ? "bg-[#FF7F50] border-[1px] border-[#FF8356]"
              : "bg-[#0A2239]"
          } border-[1px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] md:block hidden no-underline`}
        >
          Prototype Dashboard Page
        </Link> */}
          {/* <Link
          to="/appdetails"
          className={` hover:bg-[#3D9D9D] hover:border-[1px] hover:border-[#008080] text-[#fff] rounded-[12px] ${
            path === "appdetails"
              ? "bg-[#FF7F50] border-[1px] border-[#FF8356]"
              : "bg-[#0A2239]"
          } border-[1px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] md:block hidden no-underline`}
        >
          App Details
        </Link> */}
          <Link
            to="/appinfo"
            className={` hover:bg-[#3D9D9D] hover:border-[1px] hover:border-[#008080] ${path === "appinfo"
              ? "bg-[#FF7F50] border-[1px] border-[#FF8356]"
              : "bg-[#0A2239]"
              } border-[1px] text-[#fff] rounded-[12px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] md:block hidden no-underline`}
          >
            Submit a Product
          </Link>
          <Link
            to="/prototypehub"
            className={` hover:bg-[#3D9D9D] hover:border-[1px] hover:border-[#008080] text-[#fff] rounded-[12px] ${path === "prototypehub"
              ? "bg-[#FF7F50] border-[1px] border-[#FF8356]"
              : "bg-[#0A2239]"
              } border-[1px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] md:block hidden no-underline`}
          >
            Prototype hub
          </Link>
          {!access_token && (
            <Link
              to="/login"
              // className="border-[1px] border-[#0A2239] bg-[#7E858A] text-[#fff] rounded-[12px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] md:block hidden no-underline"
              className="bg-[#0A2239] text-[#fff] rounded-[12px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] md:block hidden no-underline"
            >
              Login
            </Link>
          )}
          {!access_token && (
            <Link
              to="/signup"
              className="bg-[#0A2239] text-[#fff] rounded-[12px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] md:block hidden no-underline"
            >
              Sign up
            </Link>
          )}
          {/*
          access_token && (
            <button className="flex">
              <img
                src={Bookmark}
                alt="Bookmark"
                className="sm:w-[35px] w-[25px]"
              />
            </button>
          )
          */}

          <Menu as="div" className="relative text-left sm:h-[36px] h-[30px]">
            <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white hover:bg-gray-50">
              <img
                src={
                  profileImage && !profileImage.includes("someone.png")
                    ? profileImage
                    : User
                }
                alt="User"
                className="sm:w-[36px] sm:h-[36px] w-[30px] h-[30px] rounded-[50%]"
              />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-[13px] w-[144px] origin-top-right rounded-[17px] bg-[#D9D9D9] focus:outline-none p-[12px_11px_12px_10px]">
                <div className="">
                  {!access_token && (
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/signup"
                          className={classNames(
                            active ? "text-[#000]" : "text-[#000]",
                            "block py-2 text-[18px] font-normal text-center no-underline"
                          )}
                        >
                          SignUp
                        </a>
                      )}
                    </Menu.Item>
                  )}
                  {!access_token && (
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/login"
                          className={classNames(
                            active ? "text-[#000]" : "text-[#000]",
                            "block py-2 text-[18px] font-normal text-center no-underline"
                          )}
                        >
                          Login
                        </a>
                      )}
                    </Menu.Item>
                  )}
                  {/* {access_token && (
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/update-profile"
                        className={classNames(
                          active ? "text-[#000]" : "text-[#000]",
                          "block py-2 text-[18px] font-normal text-center no-underline"
                        )}
                      >
                        Update Profile
                      </a>
                    )}
                  </Menu.Item>
                )} */}
                  {access_token && (
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/userprofile"
                          className={classNames(
                            active ? "text-[#000]" : "text-[#000]",
                            "block py-2 text-[18px] font-normal text-center no-underline"
                          )}
                        >
                          Profile Page
                        </a>
                      )}
                    </Menu.Item>
                  )}
                  {access_token && (
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="/"
                          className={classNames(
                            active ? "text-[#000]" : "text-[#000]",
                            "block py-2 text-[18px] font-normal text-center no-underline"
                          )}
                          onClick={handleLogout}
                        >
                          Sign out
                        </a>
                      )}
                    </Menu.Item>
                  )}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          <div className="relative sm:hidden flex justify-center items-center">
            <button
              onClick={() => setOpen(!open)}
              className="text-[22px]"
              data-testid="mobilemenu-btn"
            >
              <HiOutlineMenuAlt3 />
            </button>
            {open && (
              <div className="bg-[#D9D9D9] shadow-[0px_9px_24px_-13px_#3333331A] absolute top-[47px] w-[150px] right-0 rounded-[10PX] flex sm:flex-row flex-col sm:gap-[10px] gap-[8px] p-[8px_10px]">
                <div className="flex items-center sm:gap-2 gap-[4px]"></div>
                {access_token && (
                  <Link
                    to="/appdetails"
                    className={`bg-[#0A2239] text-[#fff] hover:bg-[#3D9D9D] hover:border-[1px] hover:border-[#008080]  ${path === "appdetails"
                      ? "bg-[#FF7F50] border-[1px] border-[#FF8356]"
                      : "bg-[#0A2239]"
                      } rounded-[12px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] no-underline text-center`}
                  >
                    Product Details
                  </Link>
                )}
                {access_token && (
                  <Link
                    to="/prototypehub"
                    className={`bg-[#0A2239] text-[#fff] hover:bg-[#3D9D9D] hover:border-[1px] hover:border-[#008080]  ${path === "prototypehub"
                      ? "bg-[#FF7F50] border-[1px] border-[#FF8356]"
                      : "bg-[#0A2239]"
                      } rounded-[12px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] no-underline text-center`}
                  >
                    Prototype hub
                  </Link>
                )}
                {access_token && (
                  <Link
                    to="/appinfo"
                    className={`bg-[#0A2239] hover:bg-[#3D9D9D] hover:border-[1px] hover:border-[#008080]  ${path === "appinfo"
                      ? "bg-[#FF7F50] border-[1px] border-[#FF8356]"
                      : "bg-[#0A2239]"
                      } text-[#fff] rounded-[12px] sm:h-[32px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] no-underline text-center`}
                  >
                    Submit a Product
                  </Link>
                )}
                {!access_token && (
                  <Link
                    to="/login"
                    className="border-[1px] border-[#0A2239] bg-[#7E858A] text-[#fff] rounded-[12px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] text-center no-underline"
                  >
                    Login
                  </Link>
                )}
                {!access_token && (
                  <Link
                    to="/signup"
                    className="bg-[#0A2239] text-[#fff] rounded-[12px] font-normal sm:text-[14px] text-[12px] mulish py-[8px] px-[16px] no-underline text-center"
                  >
                    Sign up
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
