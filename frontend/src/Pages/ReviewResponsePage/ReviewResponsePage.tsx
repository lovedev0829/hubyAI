import { fetchGetApi } from "../../functions/apiFunctions";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import ReviewResponseForm from "../../components/ReviewResponse/ReviewResponseForm";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReviewResponsePage = () => {
  // const access_user = JSON.parse(
  //   localStorage.getItem("access_token") as string
  // );

  const initialRequestData = {
    application_id: "",
    created: 0,
    created_by: "",
    request_note: "Dear friend,",
    reveiew_request_id: "",
    review_topics: [],
    reviewer_emails: ["sasas", "asasasas"],
  };

  const [applicationId, setApplicationId] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [requestData, setRequestData] = useState(initialRequestData);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get the query string from the URL
    const queryString = window.location.search;
    // Parse the query string
    const urlParams = new URLSearchParams(queryString);
    // Get the parameters
    const applicationId = urlParams.get("application_id");
    const reviewerEmail = urlParams.get("reviewer_email");

    // Set the state with the extracted parameters
    setApplicationId(applicationId);
    setReviewerEmail(reviewerEmail);
  }, []);

  console.log(applicationId, reviewerEmail);

  useEffect(() => {
    const getReviewRequestData = async () => {
      try {
        const path = `/api/applications/${applicationId}/review_requests?reviewer_email=${reviewerEmail}`;
        const response = await fetchGetApi(path, undefined, navigate, location);
        console.log(response, "88898989");
        setRequestData(response.data);
      } catch (error) {
        console.log("filterData Error:", error);
      }
    };
    if (applicationId && reviewerEmail) {
      getReviewRequestData();
    }
  }, [applicationId, reviewerEmail]);

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
        isActive="reviewResponse"
      />
      <div className="flex justify-center" data-testid="sidebar-toggle">
        <div className="w-full max-w-[80%] min-h-[84vh]">
          <div className="flex lg:flex-row flex-col sm:p-4 p-[14px] pb-0 mt-[60px] mb-5 gap-[70px]">
            <div className="lg:w-[50%] w-full">
              <div className="mb-3">
                <h1 className="md:text-[40px] sm:text-[30px] text-[26px] roboto font-bold mb-4">
                  Create Review Response
                </h1>
                <p className="mt-[24px] text-[16px] roboto mb-0 text-black">
                  Upload and register your AI application on Huby
                </p>
              </div>
            </div>

            {/* {for create app} */}
            <div className="p-[16px] lg:w-[50%] w-full flex  gap-[20px] flex-col lg:mt-0 mt-[30px] h-fit mb-[100px]">
              <ReviewResponseForm
                applicationId={requestData.application_id}
                reviewTopics={requestData.review_topics}
                reviewerEmail={reviewerEmail}
                request_note={requestData.request_note}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReviewResponsePage;
