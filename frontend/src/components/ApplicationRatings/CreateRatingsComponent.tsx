import {
  fetchPostApi,
  // fetchGetApi,
} from "../../functions/apiFunctions";
import { useState } from "react";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";
import Star from "../../assets/Images/Star.png";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const CreateRatingsComponent = ({ applicationId, fetchRatingData, Owner }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );
  const user = JSON.parse(localStorage.getItem("userData") as string);
  const useName = user?.first_name + " " + user?.last_name;
  const loginUser = user?.user_id;

  // const [useName, setUserName] = useState("");

  // useEffect(() => {
  //   const findUserName = async (userId) => {
  //     const path = `/api/users/${userId}`;
  //     const response = await fetchGetApi(path);
  //     const user = response?.data;
  //     setUserName(user?.first_name + " " + user?.last_name);
  //   };
  //   findUserName(loginUser);
  // }, [loginUser]);

  const initialCreateRatingData = {
    proto_impact_rating: null,
    proto_practicality_rating: null,
    app_practicality_rating: null,
    app_performance_rating: null,
    app_ux_rating: null,
    app_ecosystem_rating: null,
    comment: "",
    owner_comment_reply: "",
    upvote_downvote: null,
  };
  const [createRatingData, setCreateRatingData] = useState(
    initialCreateRatingData
  );
  const [upvoteDownvote, setUpvoteDownvote] = useState(false);

  const handleChange = (field, value) => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    setCreateRatingData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    const payload = {
      application_id: applicationId,
      ...createRatingData,
    };
    console.log(payload, "payloaddddddddddddddddddddd");

    try {
      const response = await fetchPostApi(
        "/api/applications/ratings",
        payload,
        "application/json",
        access_user,
        navigate,
        location
      );
      // console.log(response, "response******");
      if (response.status === 201) {
        toast.success("App ratings created successfully!");
        fetchRatingData();
      }
      // setFormData(initialFormData);
    } catch (error) {
      console.log("Create Application ratings Error:", error);
      toast.error(error.response.data.error);
      // if (
      //   error.response.data.error ===
      //   "Invalid or expired access_token. Please login and resubmit your request."
      // ) {
      //   navigate("/login");
      // }
      // setFormData(initialFormData);
    }
  };

  return (
    <div>
      <h1 className="text-[20px] font-normal mulish text-left">
        Create Ratings:
      </h1>
      <div className="border-b-[1px] border-b-[#000000] ">
        <div className="flex items-center gap-[8px]">
          <div className="bg-[#66666629] w-[25px] h-[25px] rounded-full"></div>
          <p className="text-[#333333] text-[12px] font-normal mulish m-0">
            {useName}
          </p>
          {/* <span className="bg-[#333333] w-[3px] h-[3px] rounded-full"></span>
          <p className="text-[#333333] text-[12px] font-normal mulish m-0">
            3 days ago
          </p> */}
        </div>
        <div className="p-[2px_13px]">
          <div className="flex mt-[10px] items-center">
            <div>
              {/* Prot Impact Rating */}
              <div className="flex items-center flex-wrap gap-[70px] justify-between">
                <div>Impact Rating (Prototype)</div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value} style={{ cursor: "pointer" }}>
                      <input
                        type="radio"
                        value={value}
                        checked={createRatingData.proto_impact_rating === value}
                        onChange={() =>
                          handleChange("proto_impact_rating", value)
                        }
                        style={{ display: "none" }}
                      />
                      <img
                        src={Star}
                        alt={`Star ${value}`}
                        style={{
                          opacity:
                            createRatingData.proto_impact_rating >= value
                              ? 1
                              : 0.5,
                          transition: "opacity 0.2s",
                        }}
                      />
                    </label>
                  ))}
                  <div>{createRatingData.proto_impact_rating}</div>
                </div>
              </div>

              <div className="flex items-center  flex-wrap gap-[70px] mt-4 justify-between">
                <div>Practicality Rating (Prototype)</div>
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} style={{ cursor: "pointer" }}>
                        <input
                          type="radio"
                          value={value}
                          checked={
                            createRatingData.proto_practicality_rating === value
                          }
                          onChange={() =>
                            handleChange("proto_practicality_rating", value)
                          }
                          style={{ display: "none" }}
                        />
                        <img
                          src={Star}
                          alt={`Star ${value}`}
                          style={{
                            opacity:
                              createRatingData.proto_practicality_rating >=
                              value
                                ? 1
                                : 0.5,
                            transition: "opacity 0.2s",
                          }}
                        />
                      </label>
                    ))}
                  </div>
                  <div>{createRatingData.proto_practicality_rating}</div>
                </div>
              </div>

              <div className="flex items-center  flex-wrap gap-[70px] mt-4 justify-between">
                <div>App Practicality Rating</div>
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} style={{ cursor: "pointer" }}>
                        <input
                          type="radio"
                          value={value}
                          checked={
                            createRatingData.app_practicality_rating === value
                          }
                          onChange={() =>
                            handleChange("app_practicality_rating", value)
                          }
                          style={{ display: "none" }}
                        />
                        <img
                          src={Star}
                          alt={`Star ${value}`}
                          style={{
                            opacity:
                              createRatingData.app_practicality_rating >= value
                                ? 1
                                : 0.5,
                            transition: "opacity 0.2s",
                          }}
                        />
                      </label>
                    ))}
                  </div>
                  <div>{createRatingData.app_practicality_rating}</div>
                </div>
              </div>

              <div className="flex items-center  flex-wrap gap-[70px] mt-4 justify-between">
                <div>App Performance Rating</div>
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} style={{ cursor: "pointer" }}>
                        <input
                          type="radio"
                          value={value}
                          checked={
                            createRatingData.app_performance_rating === value
                          }
                          onChange={() =>
                            handleChange("app_performance_rating", value)
                          }
                          style={{ display: "none" }}
                        />
                        <img
                          src={Star}
                          alt={`Star ${value}`}
                          style={{
                            opacity:
                              createRatingData.app_performance_rating >= value
                                ? 1
                                : 0.5,
                            transition: "opacity 0.2s",
                          }}
                        />
                      </label>
                    ))}
                  </div>
                  <div>{createRatingData.app_performance_rating}</div>
                </div>
              </div>

              <div className="flex items-center  flex-wrap gap-[70px] mt-4 justify-between">
                <div>App UX Rating</div>
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} style={{ cursor: "pointer" }}>
                        <input
                          type="radio"
                          value={value}
                          checked={createRatingData.app_ux_rating === value}
                          onChange={() => handleChange("app_ux_rating", value)}
                          style={{ display: "none" }}
                        />
                        <img
                          src={Star}
                          alt={`Star ${value}`}
                          style={{
                            opacity:
                              createRatingData.app_ux_rating >= value ? 1 : 0.5,
                            transition: "opacity 0.2s",
                          }}
                        />
                      </label>
                    ))}
                  </div>
                  <div>{createRatingData.app_ux_rating}</div>
                </div>
              </div>

              <div className="flex items-center  flex-wrap gap-[70px] mt-4 justify-between">
                <div>App Ecosystem Rating</div>
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} style={{ cursor: "pointer" }}>
                        <input
                          type="radio"
                          value={value}
                          checked={
                            createRatingData.app_ecosystem_rating === value
                          }
                          onChange={() =>
                            handleChange("app_ecosystem_rating", value)
                          }
                          style={{ display: "none" }}
                        />
                        <img
                          src={Star}
                          alt={`Star ${value}`}
                          style={{
                            opacity:
                              createRatingData.app_ecosystem_rating >= value
                                ? 1
                                : 0.5,
                            transition: "opacity 0.2s",
                          }}
                        />
                      </label>
                    ))}
                  </div>
                  <div>{createRatingData.app_ecosystem_rating}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex mt-[10px] items-center gap-2">
          <div
            className="text-[16px] font-bold mulish p-[2px_15px] text-left mt-[6px]"
            data-testid="Ilovinit"
          >
            <input
              type="text"
              value={createRatingData.comment}
              onChange={(e) => handleChange("comment", e.target.value)}
              className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-[330px] mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
            />
          </div>
          <div
            className="text-[16px] font-bold mulish p-[2px_15px] text-left mt-[6px] cursor-pointer"
            onClick={() => {
              setUpvoteDownvote(!upvoteDownvote);
              !upvoteDownvote
                ? handleChange("upvote_downvote", 1)
                : handleChange("upvote_downvote", 0);
            }}
          >
            {upvoteDownvote ? <FaThumbsUp /> : <FaRegThumbsUp />}
          </div>
        </div>

        {Owner === loginUser && (
          <>
            <div className="flex items-center gap-[8px] ml-8 my-2">
              <div className="bg-[#66666629] w-[25px] h-[25px] rounded-full"></div>
              <p className="text-[#333333] text-[12px] font-normal mulish m-0">
                {/* Andrew De La Cruz */}
                <span>Owner Comment Reply</span>
              </p>

              <span className="bg-[#333333] w-[3px] h-[3px] rounded-full"></span>
              <p className="text-[#333333] text-[12px] font-normal mulish m-0">
                3 days ago
              </p>
            </div>
            <div
              className="text-[16px] font-bold mulish p-[2px_15px] text-left my-[6px] ml-8"
              data-testid="Ilovinit"
            >
              <input
                type="text"
                value={createRatingData.owner_comment_reply}
                onChange={(e) =>
                  handleChange("owner_comment_reply", e.target.value)
                }
                className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-[330px] mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
              />
            </div>
          </>
        )}

        <button
          onClick={handleSave}
          className="border-[#000] border-[1px] bg-[#000000] rounded-lg text-white roboto font-medium text-[16px] p-[7px_10px] my-3"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateRatingsComponent;
