import {
  fetchPostApi,
  // fetchPostApi,
} from "../../functions/apiFunctions";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ReviewResponseForm = ({
  applicationId,
  reviewTopics,
  reviewerEmail,
  request_note,
}) => {
  // const access_user = JSON.parse(
  //   localStorage.getItem("access_token") as string
  // );
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setReviews(reviewTopics.map((topic) => ({ topic, review: "" })));
  }, [reviewTopics]);

  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleReviewChange = (index, value) => {
    const newReviews = [...reviews];
    newReviews[index].review = value;
    setReviews(newReviews);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    for (let review of reviews) {
      if (!review.review.trim()) {
        toast.error(`Please provide a review for ${review.topic}`);
        return;
      }
    }

    const data = {
      application_id: applicationId,
      reviewer_email: reviewerEmail,
      reviews,
    };
    console.log("Submitting data:", data);
    setSubmitted(true);

    try {
      const response = await fetchPostApi(
        `/api/applications/${applicationId}/reviews`,
        data,
        "application/json",
        undefined,
        navigate,
        location
      );
      console.log("object, 454", response);
      if (response.status === 201) {
        toast.success("Review Submited Successfully!");
      }
      setReviews([]);
    } catch (error) {
      console.log("Review Response Submit Error:", error);
      toast.error(error.response.data.error);
      setReviews([]);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
        <h5>Thank you for your review!</h5>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-4 bg-white shadow rounded"
      >
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-center mb-4">Review Form</h1>
          <p>{request_note}</p>
        </div>
        {reviews.map((review, index) => (
          <div key={index} className="mb-4">
            <label className="text-black text-[14px] roboto block font-medium">
              {review.topic}
              <textarea
                className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-2 mb-3 placeholder:text-[#00000080] text-[14px] h-[100px] outline-none"
                value={review.review}
                onChange={(e) => handleReviewChange(index, e.target.value)}
              />
            </label>
          </div>
        ))}
        <button
          type="submit"
          className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px] transform hover:scale-105 hover:shadow-lg hover:z-10 transition-all duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReviewResponseForm;
