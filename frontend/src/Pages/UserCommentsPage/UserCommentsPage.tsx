import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Footer from "../../components/Footer/Footer";
import { toast } from "react-toastify";
import { fetchGetApi } from "../../functions/apiFunctions";
import { CommentTree } from "../../components/Comments/structureComments";
import { useLocation, useNavigate } from "react-router-dom";
// import CommentFormList from "../../components/Comments/CommentFormList";

const UserCommentsPage = () => {
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
        console.error("filterData Error:", error);
      }
    };
    filterAppDataByLoginUser();
  }, []);

  // const [startDate, setStartDate] = useState<Date>(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  //   const initialStatusData = {
  //     approved_by: "",
  //     approved_date: "",
  //     last_reviewed_by: "",
  //     last_reviewed_date: "",
  //     submission_reviews: [],
  //     submitted_by: "",
  //     submitted_date: "",
  //   };

  const [showAppID, setShowAppID] = useState("");
  const [statusData, setStatusData] = useState([]);

  const handleShowButton = async () => {
    if (showAppID === "") {
      toast.error("Please select an App Name");
      return;
    }
    try {
      const path = `/api/applications/user_comments/${showAppID}`;
      const response = await fetchGetApi(path, undefined, navigate, location);
      if (response.status === 200) {
        setStatusData(response.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
      setShowAppID("");
      setStatusData([]);
      // setCommentData([]);
    }
  };

  const d: Date = new Date();
  d.getHours();
  d.getMinutes();
  d.getSeconds();
  // useEffect(() => {
  //   // setStartDate(d);
  // }, []);

  // const currTime: string = new Date().toLocaleTimeString();

  const toggleSidebar = () => {
    console.log(!isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);
  // console.log(startDate);

  // const structuredComments = structureComments(statusData?.submission_reviews);
  // console.log(structuredComments, "weeeeeeeeeeee");
  // useEffect(() => {
  //   console.log(structuredComments, "structuredComments//*//*/*/*/");
  //   console.log(statusData, "4545544554445");
  // }, [statusData]);

  return (
    <div>
      <Header path="viewstatus" toggleSidebar={toggleSidebar} />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        isActive="UserComments"
        data-testid="sidebar"
      />
      <div className="flex justify-center" data-testid="sidebar-toggle">
        <div className="w-full max-w-[80%] h-auto mb-20">
          <div className="flex lg:flex-row flex-col sm:p-4 p-[14px] pb-0 mt-[60px] mb-5 gap-[70px]">
            <div className=" border-[#e6e6e6] rounded-md border-[1px] p-[16px] w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] h-fit">
              <h1 className="md:text-[40px] sm:text-[30px] text-[26px] roboto font-bold">
                Add/Update User Comments
              </h1>


              <div className="border-[#e6e6e6]  border-[1px] p-[16px]  w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>
                  <div>
                    <label className="text-black text-[14px] roboto block font-medium mb-1">
                      App Name
                    </label>
                    <div className="flex items-center gap-3 mb-3">
                      <select
                        name="application_id"
                        value={showAppID}
                        onChange={(e) => setShowAppID(e.target.value)}
                        className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                      >
                        <option selected={showAppID === ""} value="">
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
                        className="border-[#000] border-[1px] bg-[#000000] rounded-lg  text-white roboto font-medium text-[16px] p-[7px_10px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                      >
                        Show
                      </button>
                    </div>
                  </div>
                  <h1
                    className="sm:text-[25px] text-[20px] font-extrabold leading-[16px] text-center my-4"
                    data-testid="ViewStatus"
                  >
                    User Comments
                  </h1>

                  <CommentTree
                    applicationId={showAppID}
                    initialComments={statusData}
                    fetchComments={handleShowButton}
                    dataType="userComment"
                  />

                  {/* <p className="bg-[#D9D9D9] rounded-[10px] text-[14px] font-normal leading-[17px] text-[#000] p-[15px_7px_15px_10px] mt-2 max-w-[330px] focus:outline-none"></p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserCommentsPage;
