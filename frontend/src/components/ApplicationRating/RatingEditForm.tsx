import { fetchPutApi, validateFormData } from "../../functions/apiFunctions";
import { toast } from "react-toastify";
import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RatingEditForm = ({ rating, setShowAppID }) => {
  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );
  const initialFormData = {
    app_ecosystem_rating: "",
    app_performance_rating: "",
    app_practicality_rating: "",
    app_ux_rating: "",
    application_id: "",
    comment: "",
    created: 1723629629,
    created_by: "",
    owner_comment_reply: "",
    proto_impact_rating: "",
    proto_practicality_rating: "",
    rating_id: "",
    upvote_downvote: 0,
  };

  const [editFormData, setEditFormData] = useState(initialFormData);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    setEditFormData({ ...rating });
  }, [rating]);

  const handleEditInputChange = (event: any) => {
    const { name, value } = event.target;
    if (name === "application_id") {
      const selectedValue = JSON.parse(value);
      setEditFormData({
        ...editFormData,
        application_id: selectedValue?._id,
      });
    } else {
      setEditFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const ratingRequiredFields = [];
  const handleEditFormSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // console.log(editFormData, "090990909");

    if (validateFormData(editFormData, ratingRequiredFields)) {
      try {
        const response = await fetchPutApi(
          `/api/ratings/${editFormData.rating_id}`,
          editFormData,
          "application/json",
          access_user,
          navigate,
          location
        );
        // console.log(response, "response******");
        if (response.status === 200) {
          toast.success("App Source Updated successfully!");
        }
      } catch (error) {
        console.log("Update Application Source Error:", error);
        toast.error(error.response.data.error || error.response.data);
        setEditFormData(initialFormData);
        setShowAppID("");
      }
    }
  };

  const handleCancelEditFormData = () => {
    setEditFormData(initialFormData);
    setShowAppID("");
  };

  return (
    <>
      <div>
        <label className="text-black text-[14px] roboto block font-medium">
          Prototype Impact Rating (if prototype)
        </label>
        <input
          data-testid="proto_impact_rating"
          id="proto_impact_rating"
          required
          name="proto_impact_rating"
          type="number"
          value={editFormData.proto_impact_rating}
          onChange={handleEditInputChange}
          placeholder="Enter the impact rating"
          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
        />
      </div>
      <div>
        <label className="text-black text-[14px] roboto block font-medium">
          Prototype Practicality Rating (if a prototype)
        </label>
        <input
          data-testid="proto_practicality_rating"
          id="proto_practicality_rating"
          required
          name="proto_practicality_rating"
          type="number"
          value={editFormData.proto_practicality_rating}
          onChange={handleEditInputChange}
          placeholder="Enter practicality rating"
          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
        />
      </div>
      <div>
        <label className="text-black text-[14px] roboto block font-medium">
          Application Rating
        </label>
        <input
          data-testid="app_practicality_rating"
          id="app_practicality_rating"
          required
          name="app_practicality_rating"
          type="text"
          value={editFormData.app_practicality_rating}
          onChange={handleEditInputChange}
          placeholder="Enter the practicality rating"
          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
        />
      </div>
      <div>
        <label className="text-black text-[14px] roboto block font-medium">
          Performance Rating
        </label>
        <input
          data-testid="app_performance_rating"
          id="app_performance_rating"
          required
          name="app_performance_rating"
          type="text"
          value={editFormData.app_performance_rating}
          onChange={handleEditInputChange}
          placeholder="Enter the performance rating"
          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
        />
      </div>
      <div>
        <label className="text-black text-[14px] roboto block font-medium">
          User Experience Rating
        </label>
        <input
          data-testid="app_ux_rating"
          id="app_ux_rating"
          required
          name="app_ux_rating"
          type="text"
          value={editFormData.app_ux_rating}
          onChange={handleEditInputChange}
          placeholder="Enter the user experience rating"
          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
        />
      </div>
      <div>
        <label className="text-black text-[14px] roboto block font-medium">
          Ecosystem Rating
        </label>
        <input
          data-testid="app_ecosystem_rating"
          id="app_ecosystem_rating"
          required
          name="app_ecosystem_rating"
          type="text"
          value={editFormData.app_ecosystem_rating}
          onChange={handleEditInputChange}
          placeholder="How good is the ecosystem around this app?"
          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
        />
      </div>
      <div>
        <label className="text-black text-[14px] roboto block font-medium">
          Comment
        </label>
        <input
          data-testid="comment"
          id="comment"
          required
          name="comment"
          type="text"
          value={editFormData.comment}
          onChange={handleEditInputChange}
          placeholder="Any note you want enter"
          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
        />
      </div>
      <div>
        <label className="text-black text-[14px] roboto block font-medium">
          App Owner Reply (if any)
        </label>
        <input
          data-testid="owner_comment_reply"
          id="owner_comment_reply"
          required
          name="owner_comment_reply"
          type="text"
          value={editFormData.owner_comment_reply}
          onChange={handleEditInputChange}
          placeholder="Reply to be entered by the app owner (if any)."
          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
        />
      </div>

      <div>
        <label className="text-black text-[14px] roboto block font-medium">
          Up/Down Vote
        </label>
        <input
          data-testid="upvote_downvote"
          id="upvote_downvote"
          required
          name="upvote_downvote"
          type="number"
          value={editFormData.upvote_downvote}
          onChange={handleEditInputChange}
          placeholder=""
          className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px]"
        />
      </div>

      <div className="flex gap-[12px]">
        <button
          onClick={handleCancelEditFormData}
          className="border-gray-500 border-[1px] bg-gray-500 rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px]"
        >
          Cancel
        </button>
        <button
          onClick={handleEditFormSubmit}
          className="border-[#000] border-[1px] bg-[#000000] rounded-lg h-[48px] max-w-[240px] w-full text-white roboto font-medium text-[16px]"
        >
          Save App
        </button>
      </div>
    </>
  );
};

export default RatingEditForm;
