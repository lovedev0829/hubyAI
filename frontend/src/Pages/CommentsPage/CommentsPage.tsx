import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import user from "../../assets/Images/User.png";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { RiArrowDropDownLine } from "react-icons/ri";
import thumup from "../../assets/Images/thumup.png";
import thumdown from "../../assets/Images/thumdown.png";
import startbox from "../../assets/Images/start-box.png";
import { fetchGetApi } from "../../functions/apiFunctions";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const CommentsPage = () => {
  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );
  const [filterAppData, setFilterAppData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const filterAppDataByLoginUser = async () => {
      try {
        const path = "/api/applications/user_owned";
        const response = await fetchGetApi(path, access_user, navigate, location);
        setFilterAppData(response.data);
      } catch (error) {
        console.log("filterData Error:", error);
      }
    };
    filterAppDataByLoginUser();
  }, []);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(10);

  const [showAppID, setShowAppID] = useState("");
  const [commentData, setCommentData] = useState([]);

  const handleShowButton = async () => {
    if (showAppID === "") {
      toast.error("Please select an App Name");
      return;
    }
    try {
      const path = `/api/applications/user_comments/${showAppID}`;
      const response = await fetchGetApi(path, undefined, navigate, location);
      if (response.status === 200) {
        setCommentData(response?.data);
      }
      // console.log("res*****", response);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      setShowAppID("");
      setCommentData([]);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuItemClick = (value: number) => {
    setSelected(value);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  return (
    <div data-testid="comment">
      <Header
        path="/comments"
        toggleSidebar={toggleSidebar}
        data-testid="header"
      />

      <div className="flex" data-testid="sidebar-toggle">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
          isActive="comments"
        />

        <div className="w-full max-w-[1000px] md:!m-auto pt-[42px] pb-[46px] sm:ml-0 !ml-[-116px]  min-h-[84vh] h-full">
          <div>
            <label className="text-black text-[14px] roboto block font-medium mb-1">
              App Name
            </label>
            <div className="flex items-center gap-3 mb-3">
              <select
                name="application_id"
                onChange={(e) => setShowAppID(e.target.value)}
                className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
              >
                <option value="">
                  Select Your App
                </option>
                {filterAppData.map((data: any, index) => (
                  <option key={index} value={data?._id}>
                    {data.application}
                  </option>
                ))}
              </select>
              <button
                onClick={handleShowButton}
                className="border-[#000] border-[1px] bg-[#000000] rounded-lg  text-white roboto font-medium text-[16px] p-[7px_10px]"
              >
                Show
              </button>
            </div>
          </div>
          <h1 className="sm:text-[25px] text-[18px] font-extrabold sm:leading-[16px] mulish text-center my-10">
            Comments and mentions received
          </h1>
          <div className=" sm:mx-[20px]">
            {commentData.map((data, index) => (
              <div
                className="flex sm:gap-[17px] gap-[7px] items-center"
                key={index}
              >
                <img
                  src={user}
                  alt="user-image"
                  data-testid="user-image"
                  className="sm:w-auto w-[30px]"
                />
                <div className="flex items-center lg:gap-[88px] sm:gap-[20px] gap-[7px] border-b-[1px] border-b-[#000] sm:px-[17px] py-[13px]">
                  <div className="">
                    <div>
                      <h6 className="sm:text-[16px] text-[12px] font-normal mulish sm:leading-[16px]">
                        @iamadeveloper
                      </h6>
                      <p
                        className="sm:text-[16px] text-[12px] font-normal mulish sm:leading-[16px]"
                        data-testid="commenttext"
                      >
                        {data.comment}
                      </p>
                    </div>
                    <div className="flex items-center lg:gap-[88px] sm:gap-[20px] gap-[10px]">
                      <div className="flex items-center mg:gap-[66px] sm:gap-[20px] gap-[6px]">
                        <h3
                          className="sm:text-[16px] text-[12px] font-bold sm:leading-[16px] m-0 mulish"
                          data-testid="reply"
                        >
                          Reply
                        </h3>

                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <div>
                            <Menu.Button
                              className="inline-flex w-full justify-center items-center sm:text-[16px] text-[12px] font-bold sm:leading-[16px] mulish"
                              data-testid="menu-button"
                            >
                              {selected} Replies
                              <RiArrowDropDownLine
                                className="-mr-1 h-5 w-5 text-[#33363F]"
                                aria-hidden="true"
                              />
                            </Menu.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-1 mt-2 w-[100px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1">
                                <Menu.Items>
                                  <div>
                                    {[7, 8, 9].map((menuItem, index) => (
                                      <Menu.Item
                                        key={index}
                                        data-testid="menu-item"
                                      >
                                        {({ active }) => (
                                          <a
                                            href="#"
                                            className={classNames(
                                              active
                                                ? "bg-gray-100"
                                                : "text-[#000]",
                                              "block px-2 py-2 sm:text-[16px] text-[12px] font-medium sm:leading-[16px] mulish no-underline hover:text-[#000] hover:bg-transparent"
                                            )}
                                            onClick={() =>
                                              handleMenuItemClick(menuItem)
                                            }
                                          >
                                            {menuItem}
                                          </a>
                                        )}
                                      </Menu.Item>
                                    ))}
                                  </div>
                                </Menu.Items>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                      <div className="flex items-center md:gap-[40px] sm:gap-[20px] gap-[6px]">
                        <button className="flex items-center sm:text-[16px] text-[12px] font-bold sm:leading-[16px] mulish">
                          10
                          <img src={thumup} alt="thumup" data-testid="thumup" />
                        </button>
                        <button className="flex items-center sm:text-[16px] text-[12px] font-bold sm:leading-[16px] mulish">
                          0
                          <img src={thumdown} alt="thumup" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <img
                    src={startbox}
                    alt="startbox"
                    className="sm:w-auto w-[35px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommentsPage;
