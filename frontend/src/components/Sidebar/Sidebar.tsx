import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

// Define the type for the props
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isActive: string;
}
const userData = localStorage.getItem("userData");
//console.log("userData from localStorage:", userData);
const privilege = userData ? JSON.parse(userData).privilege : undefined;
//const { privilege } = JSON.parse(localStorage.getItem("userData") as string);
//console.log("privilege is:", privilege);
const regexValidation = /(sysadmin|admin|support)/;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isActive }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(isOpen);

  useEffect(() => {
    setSidebarOpen(isOpen);
  }, [isOpen]);
  return (
    // <div
    //   className={`flex gap-[10px]  ${isOpen ? "open" : ""}`}
    //   data-testid="sidebar"
    // >
    //   <div>
    //     <IoMenu className="md:min-w-[35px] max-w-[25px] md:min-h-[35px] max-h-[25px]" />
    //   </div>
    <div
      className={
        sidebarOpen
          ? " bg-[#FAF2DE]  max-w-[250px] rounded-[10px_10px_0px_0px] transition ease-in-out duration-700 transform sm:translate-x-0 translate-x-[1px] md:pt-[29px] pt-[10px] w-full  absolute sm:px-0 px-[10px] z-[2] h-screen"
          : "translate-x-[-260px]  max-w-[250px]  transition ease-in-out duration-700 transform bg-[#FAF2DE] rounded-[10px_10px_0px_0px] md:pt-[29px] pt-[10px] h-screen absolute z-[2]"
      }
    >
      <div onClick={onClose} className="flex justify-end sm:hidden p-[10px]">
        <button className="text-[#000] ">
          <IoClose />
        </button>
      </div>
      <ul
        role="list"
        className="flex flex-col gap-[15px] sm:p-[0px_16px_0px_14px] p-[0px_10px_0px_10px] w-full h-full"
      >
        <li>
          <Link
            to="/appinfo"
            className={`${isActive == "App info"
                ? "bg-[#FF7F50] text-[#fff] text-[14px] font-bold rounded-[6px] "
                : "text-[#0A2239] text-[14px] font-bold border-b-[1px] border-b-[#0A2239]"
              } hanken-grotesk text-center py-[7px] px-[1px] w-full no-underline m-auto flex justify-center`}
          >
            Basic Info
          </Link>
        </li>
        <li>
          <Link
            to="/application/marketing"
            className={`${isActive == "applicationMarketing"
                ? "bg-[#FF7F50] text-[#fff] text-[14px] font-bold rounded-[6px] py-[7px]"
                : "text-[#0A2239] text-[14px] font-bold border-b-[1px] border-b-[#0A2239] pb-[7px]"
              } hanken-grotesk text-center px-[10px] w-full no-underline m-auto flex justify-center`}
          >
            Marketing
          </Link>
        </li>
        <li>
          <Link
            to="/application/model"
            className={`${isActive == "applicationModel"
                ? "bg-[#FF7F50] text-[#fff] text-[14px] font-bold rounded-[6px] py-[7px]"
                : "text-[#0A2239] text-[14px] font-bold border-b-[1px] border-b-[#0A2239] pb-[7px]"
              } hanken-grotesk text-center px-[10px] w-full no-underline m-auto flex justify-center`}
          >
            Models
          </Link>
        </li>

        <li>
          <Link
            to="/application/runtime"
            className={`${isActive == "applicationRunTime"
                ? "bg-[#FF7F50] text-[#fff] text-[14px] font-bold rounded-[6px] py-[7px]"
                : "text-[#0A2239] text-[14px] font-bold border-b-[1px] border-b-[#0A2239] pb-[7px]"
              } hanken-grotesk text-center px-[10px] w-full no-underline m-auto flex justify-center`}
          >
            Runtime
          </Link>
        </li>
        <li>
          <Link
            to="/application/source"
            className={`${isActive == "applicationSource"
                ? "bg-[#FF7F50] text-[#fff] text-[14px] font-bold rounded-[6px] py-[7px]"
                : "text-[#0A2239] text-[14px] font-bold border-b-[1px] border-b-[#0A2239] pb-[7px]"
              } hanken-grotesk text-center px-[10px] w-full no-underline m-auto flex justify-center`}
          >
            Source
          </Link>
        </li>
        <li>
          <Link
            to="/application/ownership"
            className={`${isActive == "applicationOwnership"
                ? "bg-[#FF7F50] text-[#fff] text-[14px] font-bold rounded-[6px] py-[7px]"
                : "text-[#0A2239] text-[14px] font-bold border-b-[1px] border-b-[#0A2239] pb-[7px]"
              } hanken-grotesk text-center px-[10px] w-full no-underline m-auto flex justify-center`}
          >
            Ownership
          </Link>
        </li>
        <li>
          <Link
            to="/preview"
            className={`${isActive == "Product Preview"
                ? "bg-[#FF7F50] text-[#fff] text-[14px] font-bold rounded-[6px] mt-[10px]"
                : "text-[#0A2239] text-[14px] font-bold border-b-[1px] border-b-[#0A2239]"
              } hanken-grotesk text-center py-[7px] px-[10px] w-full no-underline m-auto flex justify-center`}
          >
            Product Preview
          </Link>
        </li>
        <li>
          <Link
            to="/viewstatus"
            className={`${isActive == "View Submission status"
                ? "bg-[#FF7F50] text-[#fff] text-[14px] font-bold rounded-[6px] mt-[10px]"
                : "text-[#0A2239] text-[14px] font-bold border-b-[1px] border-b-[#0A2239]"
              } hanken-grotesk text-center py-[7px] px-[10px] w-full no-underline m-auto flex justify-center`}
          >
            Submission Status
          </Link>
        </li>

        <li>
          <Link
            to="/application/review/request"
            className={`${isActive == "reviewRequest"
                ? "bg-[#FF7F50] text-[#fff] text-[14px] font-bold rounded-[6px] py-[7px]"
                : "text-[#0A2239] text-[14px] font-bold border-b-[1px] border-b-[#0A2239] pb-[7px]"
              } hanken-grotesk text-center px-[10px] w-full no-underline m-auto flex justify-center`}
          >
            Review Request
          </Link>
        </li>
        {/*
        <li>
          <Link
            to="/application/review/response"
            className={`${
              isActive == "reviewResponse"
                ? "bg-[#FF7F50] text-[#fff] text-[14px] font-bold rounded-[6px] py-[7px]"
                : "text-[#0A2239] text-[14px] font-bold border-b-[1px] border-b-[#0A2239] pb-[7px]"
            } hanken-grotesk text-center px-[10px] w-full no-underline m-auto flex justify-center`}
          >
            Review Response
          </Link>
        </li>
        */}
        <li>
          <Link
            to="/application/review/show/response"
            className={`${isActive == "viewReviewResponse"
                ? "bg-[#FF7F50] text-[#fff] text-[14px] font-bold rounded-[6px] py-[7px]"
                : "text-[#0A2239] text-[14px] font-bold border-b-[1px] border-b-[#0A2239] pb-[7px]"
              } hanken-grotesk text-center px-[10px] w-full no-underline m-auto flex justify-center`}
          >
            Review Response
          </Link>
        </li>
        <li>
          <Link
            to="/comments"
            className={`${isActive == "UserComments"
                ? "bg-[#FF7F50] text-[#fff] text-[14px] font-bold rounded-[6px] py-[7px]"
                : "text-[#0A2239] text-[14px] font-bold border-b-[1px] border-b-[#0A2239] pb-[7px]"
              } hanken-grotesk text-center px-[10px] w-full no-underline m-auto flex justify-center`}
          >
            Comments
          </Link>
        </li>
        {regexValidation.test(privilege) && (
          <li>
            <Link
              to="/application/rating"
              className={`${isActive == "applicationRating"
                  ? "bg-[#FF7F50] text-[#fff] text-[14px] font-bold rounded-[6px] py-[7px]"
                  : "text-[#0A2239] text-[14px] font-bold border-b-[1px] border-b-[#0A2239] pb-[7px]"
                } hanken-grotesk text-center px-[10px] w-full no-underline m-auto flex justify-center`}
            >
              Rating
            </Link>
          </li>
        )}
        {/* <li>
          <Link
            to="/application/usercomments"
            className={`${
              isActive == "UserComments"
                ? "bg-[#FF7F50] text-[#fff] text-[14px] font-bold rounded-[6px] py-[7px]"
                : "text-[#0A2239] text-[14px] font-bold border-b-[1px] border-b-[#0A2239] pb-[7px]"
            } hanken-grotesk text-center px-[10px] w-full no-underline m-auto flex justify-center`}
          >
            Application User Comments
          </Link>
        </li> */}
      </ul>
    </div>
    // </div>
  );
};

export default Sidebar;
