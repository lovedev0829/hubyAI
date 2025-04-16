import { useEffect, useState } from "react";
import {
  fetchPostApi,
  fetchPutApi,
  fetchGetApi,
} from "../../functions/apiFunctions";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
// import { Menu, Transition } from "../..headlessui/react";
// import { RiArrowDropDownLine } from "react-icons/ri";
// import { Fragment } from "react";
import user from "../../assets/Images/user_profile.png";
import thumup from "../../assets/Images/thumup.png";
import thumdown from "../../assets/Images/thumdown.png";
import { getApiDomain } from "../../functions/helper";
// import startbox from "../../assets/Images/start-box.png";
// function classNames(...classes: string[]) {
//   return classes.filter(Boolean).join(" ");
// }

// const access_user = JSON.parse(localStorage.getItem("access_token") as string);
// const user = JSON.parse(localStorage.getItem("userData") as string);
// const userFullName = user?.first_name + " " + user?.last_name;
// console.log(userFullName, "dddddddddddddddddddddddddddd");

export const structureComments = (comments) => {
  const commentMap = {};
  comments.forEach((comment) => {
    commentMap[comment.path] = { ...comment, children: [] };
  });
  const rootComments = [];
  Object.keys(commentMap).forEach((key) => {
    const pathParts = key.split("/").filter(Boolean);
    const parentPath = pathParts.slice(0, -1).join("/");

    if (parentPath) {
      const parentComment = commentMap[`/${parentPath}`];
      if (parentComment) {
        parentComment.children.push(commentMap[key]);
      }
    } else {
      rootComments.push(commentMap[key]);
    }
  });
  return rootComments;
};

export const capitalizeFirstLetterOfEachWord = (string) => {
  return string.replace(/\b\w/g, (char) => char.toUpperCase());
};

// Comment component
export const Comment = ({
  comment,
  onReply,
  onEdit,
  onUpDownVote,
  dataType,
}) => {
  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // console.log(location, "location===========");
  });

  const userData = JSON.parse(localStorage.getItem("userData") as string);
  const loginUser = userData?.user_id;
  const loginUserName = userData?.first_name + " " + userData?.last_name;
  const [isEditing, setIsEditing] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [isReplies, setIsReplies] = useState(false);
  const [userName, setUserName] = useState("");
  const [localTime, setLocalTime] = useState("");
  // const [selected, setSelected] = useState<number>(10);
  const [upVoteStatus, setUpVoteStatus] = useState(false);
  const [downVoteStatus, setDownVoteStatus] = useState(false);

  useEffect(() => {
    setUpVoteStatus(comment?.votes?.up_vote_users.includes(loginUserName));
  }, [comment?.votes?.up_vote_users]);
  useEffect(() => {
    setDownVoteStatus(comment?.votes?.down_vote_users.includes(loginUserName));
  }, [comment?.votes?.down_vote_users]);

  useEffect(() => {
    const formatDate = () => {
      const date = new Date(comment?.created * 1000); // Convert seconds to milliseconds

      // Format options
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Use 24-hour format, set to true if you want 12-hour format
      };

      // Get formatted date and time
      setLocalTime(date.toLocaleString("en-US", options).replace(",", ""));
    };
    dataType === "userComment" && formatDate();
  }, [comment?.created]);

  useEffect(() => {
    const findUserName = async (userId) => {
      const path = `/api/users/${userId}`;
      const response = await fetchGetApi(path, undefined, navigate, location);
      const user = response?.data;
      console.log("DD user is:", user);

      setUserName(user?.first_name + " " + user?.last_name);
    };
    dataType === "userComment" && findUserName(comment?.created_by);
  }, [dataType]);

  const handleEdit = () => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = (newComment) => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    onEdit(
      comment.path,
      newComment,
      comment.submission_review_id || comment.user_comment_id
    );
    setIsEditing(false);
  };

  const handleReply = () => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    setIsReply(!isReply);
    if (isReplies) {
      setIsReplies(false);
    }
  };
  const handleReplies = () => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    setIsReplies(!isReplies);
    if (isReply) {
      setIsReply(false);
    }
  };

  const handleReplySubmit = (replyComment) => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    onReply(comment.path, replyComment);
    setIsReply(false);
  };

  const handleUpDownVote = (value) => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    onUpDownVote(
      value,
      comment.submission_review_id || comment.user_comment_id
    );
  };
  // const handleMenuItemClick = (value: number) => {
  //   setSelected(value);
  // };

  return (
    <>
      <div className="relative my-3 sm:my-0 sm:m-4 ">
        <div
          className={`flex sm:gap-[17px] gap-[6px] justify-center items-center p-2 sm:p-3 bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700 rounded-[10px] relative ${dataType === "userComment" ? "max-w-[650px]" : "max-w-[550px]"
            }`}
        >
          <img
            src={
              comment.user_icon_url
                ? `${getApiDomain()}${comment.user_icon_url}`
                : user
            }
            alt="user-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = user;
            }}
            data-testid="user-image"
            className="w-[50px] h-[50px] object-cover rounded-full"
          />
          <div className="flex  items-center lg:gap-[88px] sm:gap-[20px] gap-[7px] border-b-[1px] border-b-[#000] sm:px-[17px] py-[13px]">
            <div className="">
              <div>
                <div className="flex justify-between text-gray-700 dark:text-gray-400">
                  <span className="font-bold">
                    {/* {capitalizeFirstLetterOfEachWord(
                      dataType === "userComment" ? userName : comment.created_by
                    )} */}
                    {dataType === "userComment" || dataType === "viewStatus"
                      ? comment.user_name || userName
                      : comment.created_by}
                  </span>

                  {/* {dataType === "userComment"
                    ? comment.created_by === loginUser
                    : comment.created_by === loginUserName && (
                        <button className="font-bold" onClick={handleEdit}>
                          Edit
                        </button>
                      )} */}

                  {dataType === "userComment"
                    ? comment?.created_by === loginUser && (
                      <button className="font-bold" onClick={handleEdit}>
                        Edit
                      </button>
                    )
                    : comment?.created_by === loginUserName && (
                      <button className="font-bold" onClick={handleEdit}>
                        Edit
                      </button>
                    )}
                </div>
                {/* <button>Edit</button> */}
                {isEditing ? (
                  <CommentForm
                    onSubmit={handleSave}
                    placeholder="Edit your comment..."
                    initialComment={comment.comment}
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    {comment.comment}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-center lg:gap-[88px] sm:gap-[20px] gap-[10px]">
                <div className="flex items-center mg:gap-[66px] sm:gap-[20px] gap-[6px]">
                  <button
                    className="sm:text-[16px] text-[12px] font-bold sm:leading-[16px] m-0 mulish"
                    data-testid="reply"
                    onClick={handleReply}
                  >
                    Reply
                  </button>
                  <button
                    className="sm:text-[16px] text-[12px] font-bold sm:leading-[16px] m-0 mulish whitespace-nowrap"
                    data-testid="reply"
                    onClick={handleReplies}
                  >
                    {comment.children.length} Replies
                  </button>
                </div>
                <div className="flex items-center md:gap-[40px] sm:gap-[20px] gap-[6px]">
                  {dataType === "userComment" && (
                    <>
                      <button
                        className="flex items-center sm:text-[16px] text-[12px] font-bold sm:leading-[16px] mulish"
                        onClick={() => handleUpDownVote(1)}
                      >
                        {comment?.votes?.up_votes}
                        <img
                          src={thumup}
                          alt="thumup"
                          data-testid="thumup"
                          className="ml-1"
                          style={{ opacity: upVoteStatus ? "100%" : "60%" }}
                        />
                      </button>
                      <button
                        className="flex items-center sm:text-[16px] text-[12px] font-bold sm:leading-[16px] mulish"
                        onClick={() => handleUpDownVote(-1)}
                      >
                        {comment?.votes?.down_votes}
                        <img
                          src={thumdown}
                          alt="thumup"
                          className="ml-1"
                          style={{ opacity: downVoteStatus ? "100%" : "50%" }}
                        />
                      </button>
                    </>
                  )}
                  <span className="text-xs">
                    {dataType === "userComment" ? localTime : comment.created}
                  </span>
                </div>
              </div>
            </div>
            {/* <img src={startbox} alt="startbox" className="sm:w-auto w-[35px]" /> */}
          </div>
        </div>
        {isReply && (
          <CommentForm
            onSubmit={handleReplySubmit}
            placeholder="Write a reply..."
          />
        )}
        {isReplies && comment.children.length > 0 && (
          <div className="ml-5">
            {comment.children.map((child) => (
              <Comment
                key={child.path}
                comment={child}
                onReply={onReply}
                onEdit={onEdit}
                onUpDownVote={onUpDownVote}
                dataType={dataType}
              />
            ))}
          </div>
        )}

        {/* Vertical Line */}
        {/* <div className="absolute top-0 left-0 w-[2px] h-full bg-[#000]"></div> */}
        {/* Horizontal Line */}
        {/* {comment.children.length > 0 && (
          <div className="absolute top-1/2 left-0 w-6 h-[2px] bg-[#000]"></div>
        )} */}
      </div>
    </>
  );
};

// Comment form component
export const CommentForm = ({ onSubmit, placeholder, initialComment = "" }) => {
  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );
  const navigate = useNavigate();
  const location = useLocation();

  const [comment, setComment] = useState(initialComment);

  const handleChange = (e) => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment("");
    }
  };

  return (
    <form
      className="flex items-center gap-3 mb-3 my-2 "
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={comment}
        onChange={handleChange}
        placeholder={placeholder}
        className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
      />
      <button
        type="submit"
        className="border-[#000] border-[1px] bg-[#000000] rounded-lg text-white roboto font-medium text-[16px] p-[7px_10px] transform hover:scale-105 hover:shadow-lg transition-all duration-300"
      >
        Send
      </button>
    </form>
  );
};

// CommentTree component
export const CommentTree = ({
  initialComments,
  applicationId,
  fetchComments,
  dataType,
}) => {
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );
  const user = JSON.parse(localStorage.getItem("userData") as string);
  const userFullName = user?.first_name + " " + user?.last_name;

  useEffect(() => {
    setComments(structureComments(initialComments));
  }, [initialComments]);

  const handleAddComment = async (commentText) => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    const newComment = {
      path: `/${Date.now()}`,
      created_by: userFullName, // replace with actual user data
      comment: commentText,
      created: new Date().toLocaleString(),
      children: [],
    };

    try {
      const payload = {
        application_id: applicationId,
        path: newComment.path,
        comment: newComment.comment,
      };

      const pathUrl =
        dataType !== "userComment"
          ? "/api/applications/submission_reviews"
          : "/api/applications/user_comments";

      if (!applicationId) {
        toast.error("Please select an App Name");
        return;
      }
      console.log(!access_user, "adadadadadadadadadad");
      if (!access_user) {
        navigate("/login", { state: { from: location } });
      }
      await fetchPostApi(
        pathUrl,
        payload,
        "application/json",
        access_user,
        navigate,
        location
      );
      fetchComments();

      // setComments((prevComments) => [...prevComments, newComment]);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.response.data.error || error.response.data);
    }
  };

  const handleReply = async (parentPath, replyCommentText) => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    const newComment = {
      path: `${parentPath}/${Date.now()}`,
      created_by: userFullName, // replace with actual user data
      comment: replyCommentText,
      created: new Date().toLocaleString(),
      children: [],
    };

    try {
      const payload = {
        application_id: applicationId,
        path: newComment.path,
        comment: newComment.comment,
      };
      const pathUrl =
        dataType !== "userComment"
          ? "/api/applications/submission_reviews"
          : "/api/applications/user_comments";

      await fetchPostApi(
        pathUrl,
        payload,
        "application/json",
        access_user,
        navigate,
        location
      );
      fetchComments();
      // setComments((prevComments) => {
      //   const addReply = (comments) => {
      //     return comments.map((c) => {
      //       if (c.path === parentPath) {
      //         return { ...c, children: [...c.children, newComment] };
      //       }
      //       return { ...c, children: addReply(c.children) };
      //     });
      //   };
      //   return addReply(prevComments);
      // });
    } catch (error) {
      console.error("Error replying to comment:", error);
      toast.error(error.response.data.error || error.response.data);
    }
  };

  const handleEdit = async (path, newCommentText, submissionReviewsId) => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    try {
      const payload = {
        application_id: applicationId,
        comment: newCommentText,
        created: new Date().toLocaleString(),
        created_by: userFullName,
        path,
        submission_reviews_id: submissionReviewsId,
      };

      const pathUrl =
        dataType !== "userComment"
          ? `/api/submission_reviews/${submissionReviewsId}`
          : `/api/user_comments/${submissionReviewsId}`;

      await fetchPutApi(pathUrl, payload, "application/json", access_user, navigate, location);
      fetchComments();
      // setComments((prevComments) =>
      //   prevComments.map((comment) =>
      //     comment.path === path
      //       ? { ...comment, comment: newCommentText }
      //       : comment
      //   )
      // );
    } catch (error) {
      console.error("Error editing comment:", error);
      toast.error(error.response.data.error || error.response.data);
    }
  };

  const handleUpDownVote = async (value, userCommentId) => {
    if (!access_user) {
      navigate("/login", { state: { from: location } });
    }
    try {
      const path = `/api/applications/${applicationId}/comments/${userCommentId}/vote   `;
      const payload = { up_down_vote: value };
      const response = await fetchPostApi(
        path,
        payload,
        "application/json",
        access_user,
        navigate,
        location
      );
      console.log(response, "upvote----");
      fetchComments();
    } catch (error) { }
  };

  return (
    <>
      <div className={"mb-[100px]"}>
        {initialComments?.submission_reviews?.length !== 0 ? (
          <div>
            {comments.map((comment) => (
              <Comment
                key={comment.path}
                comment={comment}
                onReply={handleReply}
                onEdit={handleEdit}
                onUpDownVote={handleUpDownVote}
                dataType={dataType}
              />
            ))}

            {applicationId && (
              <CommentForm
                onSubmit={handleAddComment}
                placeholder="Write a question/comment..."
              />
            )}
          </div>
        ) : (
          applicationId && (
            <CommentForm
              onSubmit={handleAddComment}
              placeholder="Start a new discussion thread..."
            />
          )
        )}
      </div>
    </>
  );
};

export default CommentTree;
