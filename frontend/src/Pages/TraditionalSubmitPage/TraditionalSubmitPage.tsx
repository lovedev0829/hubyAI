import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const TraditionalSubmitPage = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/appinfo"); // Navigates back to the previous page
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  return (
    <>
      <Header path="appinfo" toggleSidebar={toggleSidebar} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        isActive="applicationMarketing"
      />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome!
          </h1>
          {/* <p className="text-gray-600 mb-6">This is the new page. Use the button below to go back.</p> */}
          <button
            onClick={handleNavigation}
            className="border-[#000] border-[1px]  flex justify-center items-center bg-[#000000] rounded-lg h-[48px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg transition-all duration-300 px-3"
          >
            Enter the product info traditional way
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TraditionalSubmitPage;
