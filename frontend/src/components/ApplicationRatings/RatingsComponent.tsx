// // import { useState } from "react";
// import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
// import Star from "../../assets/Images/Star.png";
// import { useEffect, useState } from "react";
// import { fetchGetApi } from "@/functions/apiFunctions";

// // import downdouble from "../../assets/Images/down-double.png";

// const RatingsComponent = ({ rating }) => {
//   const access_user = JSON.parse(
//     localStorage.getItem("access_token") as string
//   );

//   const user = JSON.parse(localStorage.getItem("userData") as string);
//     const loginUser = user?.user_id

//   const [userName, setUserName] = useState("");
//   useEffect(() => {
//     const findUserName = async (userId) => {
//       const path = `/api/users/${userId}`;
//       const response = await fetchGetApi(path, access_user);
//       const user = response?.data;
//       setUserName(user?.first_name + " " + user?.last_name);
//     };
//     findUserName(rating?.created_by);
//   }, [rating?.created_by]);

//   return (
//     <>
//       <div className="border-b-[1px] border-b-[#000000] py-[15px]">
//         <div className="flex items-center gap-[8px]">
//           <div className="bg-[#66666629] w-[25px] h-[25px] rounded-full"></div>
//           <p className="text-[#333333] text-[12px] mulish m-0 font-bold">
//             {/* {rating.created_by} */}
//             {userName}
//           </p>
//           <span className="bg-[#333333] w-[3px] h-[3px] rounded-full"></span>
//           <p className="text-[#333333] text-[12px] font-normal mulish m-0">
//             {new Date(rating.created * 1000).toLocaleDateString()}
//           </p>
//         </div>
//         <div className="p-[2px_13px]">
//           <div className="flex mt-[10px] items-center">
//             <div>
//               {[
//                 { label: "Prot Impact Rating", key: "proto_impact_rating" },
//                 {
//                   label: "Proto Practicality Rating",
//                   key: "proto_practicality_rating",
//                 },
//                 {
//                   label: "App Practicality Rating",
//                   key: "app_practicality_rating",
//                 },
//                 {
//                   label: "App Performance Rating",
//                   key: "app_performance_rating",
//                 },
//                 { label: "App UX Rating", key: "app_ux_rating" },
//                 {
//                   label: "App Ecosystem Rating",
//                   key: "app_ecosystem_rating",
//                 },
//               ].map(({ label, key }) => (
//                 <div
//                   key={key}
//                   className="flex items-center flex-wrap gap-[5px] mt-4"
//                 >
//                   <div>{label}</div>
//                   {[1, 2, 3, 4, 5].map((value) => (
//                     <label key={value} style={{ cursor: "pointer" }}>
//                       <input
//                         type="radio"
//                         value={value}
//                         checked={rating[key] === value}
//                         //   onChange={() => handleChange(key, value)}
//                         style={{ display: "none" }}
//                       />
//                       <img
//                         src={Star}
//                         alt={`Star ${value}`}
//                         style={{
//                           opacity: rating[key] >= value ? 1 : 0.5,
//                           transition: "opacity 0.2s",
//                         }}
//                       />
//                     </label>
//                   ))}
//                   <div>{rating[key]}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="flex mt-[10px] items-center gap-2">
//             <div className="text-[16px] font-bold mulish p-[2px_15px] text-left mt-[6px]">
//               <input
//                 type="text"
//                 value={rating.comment}
//                 //   onChange={(e) => handleChange("comment", e.target.value)}
//                 className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
//               />
//             </div>
//             <div className="text-[16px] font-bold mulish p-[2px_15px] text-left mt-[6px] cursor-pointer">
//               {rating.upvote_downvote === 1 ? (
//                 <FaThumbsUp />
//               ) : (
//                 <FaRegThumbsUp />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default RatingsComponent;

import { useState } from "react";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import Star from "../../assets/Images/Star.png";
import {
  fetchPutApi,
  // fetchGetApi,
} from "../../functions/apiFunctions";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const RatingsComponent = ({ rating, fetchRatingData, Owner }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );
  const user = JSON.parse(localStorage.getItem("userData") as string);
  const loginUser = user?.user_id;

  // const [userName, setUserName] = useState("");
  // const [ownerName, setOwnerName] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    app_ecosystem_rating: rating?.app_ecosystem_rating || 0,
    app_performance_rating: rating?.app_performance_rating || 0,
    app_practicality_rating: rating?.app_practicality_rating || 0,
    app_ux_rating: rating?.app_ux_rating || 0,
    proto_impact_rating: rating?.proto_impact_rating || 0,
    proto_practicality_rating: rating?.proto_practicality_rating || 0,
    comment: rating?.comment || "",
    upvote_downvote: rating?.upvote_downvote || 0,
    owner_comment_reply: rating?.owner_comment_reply || "",
    rater_name: rating?.rater_name || "",
  });

  // useEffect(() => {
  //   const findUserName = async (userId) => {
  //     const path = `/api/users/${userId}`;
  //     const response = await fetchGetApi(path);
  //     const user = response?.data;
  //     setUserName(user?.first_name + " " + user?.last_name);
  //   };
  //   findUserName(rating?.created_by);
  //   console.log(userName, ";;;;;;;;;;;;;;;");
  // }, [rating?.created_by]);
  // useEffect(() => {
  //   const findUserName = async (userId) => {
  //     const path = `/api/users/${userId}`;
  //     const response = await fetchGetApi(path);
  //     const user = response?.data;
  //     setOwnerName(user?.first_name + " " + user?.last_name);
  //   };
  //   findUserName(Owner);
  // }, [Owner]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleOwnerCommentReply = async () => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    if (rating?.created_by === loginUser || Owner === loginUser) {
      const { owner_comment_reply } = formData;
      const payload = {
        application_id: rating.application_id,
        owner_comment_reply,
      };

      try {
        const pathUrl = `/api/ratings/${rating?.rating_id}/reply`;
        const response = await fetchPutApi(
          pathUrl,
          payload,
          "application/json",
          access_user,
          navigate,
          location
        );
        if (response.status === 200) {
          toast.success("Owner Comment Reply Updated successfully!");
          setIsEditMode(false);
          fetchRatingData();
        }
      } catch (error) {
        toast.error(error.response.data.error || error.response.data);

        console.error("Failed to update rating:", error);
      }
    }
  };

  const handleEditSubmitRating = async () => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    if (rating?.created_by === loginUser || Owner === loginUser) {
      const payload = {
        ...formData,
        application_id: rating.application_id,
        created: rating.created,
        created_by: rating.created_by,
      };
      try {
        const pathUrl = `/api/ratings/${rating?.rating_id}`;
        const response = await fetchPutApi(
          pathUrl,
          payload,
          "application/json",
          access_user,
          navigate,
          location
        );
        if (response.status === 200) {
          toast.success("App Rating Updated successfully!");
          setIsEditMode(false);
          fetchRatingData();
        }
      } catch (error) {
        toast.error(error.response.data.error || error.response.data);

        console.error("Failed to update rating:", error);
      }
    }
  };

  const handleEditRating = () => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    setIsEditMode(true);
  };

  return (
    <>

      <div className=" py-[15px]">
        <div className="flex items-center gap-[8px]">
          <div className="bg-[#66666629] w-[25px] h-[25px] rounded-full"></div>
          <p className="text-[#333333] text-[12px] mulish m-0 font-bold">
            {formData.rater_name}
          </p>
          <span className="bg-[#333333] w-[3px] h-[3px] rounded-full"></span>
          <p className="text-[#333333] text-[12px] font-normal mulish m-0">
            {new Date(rating.created * 1000).toLocaleDateString()}
          </p>
        </div>
        <div className="p-[2px_13px]">
          <div className="flex mt-[10px] items-center">
            <div>
              {[
                { label: "Proto. Impact Rating", key: "proto_impact_rating" },
                {
                  label: "Proto Practicality Rating",
                  key: "proto_practicality_rating",
                },
                {
                  label: "App Practicality Rating",
                  key: "app_practicality_rating",
                },
                {
                  label: "App Performance Rating",
                  key: "app_performance_rating",
                },
                { label: "App UX Rating", key: "app_ux_rating" },
                { label: "App Ecosystem Rating", key: "app_ecosystem_rating" },
              ].map(({ label, key }) => (
                <div
                  key={key}
                  className="flex items-center flex-wrap gap-[20px] sm:gap-[70px] justify-between mt-4"
                >
                  <div>{label}</div>
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2 ">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <label key={value} style={{ cursor: "pointer" }}>
                          <input
                            type="radio"
                            value={value}
                            checked={formData[key] === value}
                            onChange={() => handleChange(key, value)}
                            style={{ display: "none" }}
                            disabled={!isEditMode}
                          />
                          <img
                            src={Star}
                            alt={`Star ${value}`}
                            style={{
                              opacity: formData[key] >= value ? 1 : 0.5,
                              transition: "opacity 0.2s",
                            }}
                          />
                        </label>
                      ))}
                    </div>
                    <div>{formData[key]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex mt-[10px] items-center gap-4">
            <div className="text-[16px] font-bold mulish  text-left mt-[6px]">
              <input
                type="text"
                value={formData?.comment}
                onChange={(e) => handleChange("comment", e.target.value)}
                className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-[330px] mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                disabled={!isEditMode}
              />
            </div>
            <div
              className="text-[16px] font-bold mulish text-left mt-[6px] cursor-pointer"
              onClick={() => {
                if (isEditMode) {
                  handleChange(
                    "upvote_downvote",
                    formData?.upvote_downvote === 1
                      ? formData.upvote_downvote - 1
                      : 1
                  );
                }
              }}
            >
              {formData.upvote_downvote === 1 ? (
                <div className="flex justify-center gap-2">
                  <FaThumbsUp />
                  {/* <span>{formData.upvote_downvote}</span> */}
                </div>
              ) : (
                <div className="flex justify-center gap-2">
                  <FaRegThumbsUp />
                  {/* <span>{formData.upvote_downvote}</span> */}
                </div>
              )}
            </div>
          </div>
          {Owner === loginUser && (
            <div className="items-center gap-[8px] ml-8 mt-3">
              <div className="flex items-center gap-3">
                <div className="bg-[#66666629] w-[25px] h-[25px] rounded-full"></div>
                <p className="text-[#333333] text-[12px] font-normal mulish m-0">
                  {/* Andrew De La Cruz */}
                  {/* <span>{ownerName}</span> */}
                </p>

                {/* <span className="bg-[#333333] w-[3px] h-[3px] rounded-full"></span> */}
                {/* <p className="text-[#333333] text-[12px] font-normal mulish m-0">
                3 days ago
              </p> */}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="text-[16px] font-bold mulish p-[2px_15px] text-left my-[6px] ml-8"
                  data-testid="Ilovinit"
                >
                  <input
                    type="text"
                    value={formData.owner_comment_reply}
                    onChange={(e) =>
                      handleChange("owner_comment_reply", e.target.value)
                    }
                    className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-[330px] mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
                    disabled={rating?.created_by === loginUser && !isEditMode}
                  />
                </div>

                {rating?.created_by === loginUser && isEditMode && (
                  <button
                    onClick={handleOwnerCommentReply}
                    className="border-[#000] border-[1px] bg-[#000000] rounded-lg text-white roboto font-medium text-[16px] p-[7px_10px] my-3"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          )}

          {rating?.created_by === loginUser && (
            <div className="flex gap-2 mt-2">
              {isEditMode ? (
                <>
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="border-gray-500 border-[1px] bg-gray-500 rounded-lg text-white roboto font-medium text-[16px] p-[7px_10px] my-3 transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSubmitRating}
                    className="border-[#000] border-[1px] bg-[#000000] rounded-lg text-white roboto font-medium text-[16px] p-[7px_10px] my-3 transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditRating}
                  className="border-[#000] border-[1px] bg-[#000000] rounded-lg text-white roboto font-medium text-[16px] p-[7px_10px] my-3 transform hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  Edit
                </button>
              )}
            </div>
          )}
        </div>
      </div>

    </>
  );
};

export default RatingsComponent;
