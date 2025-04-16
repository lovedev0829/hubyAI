import { useEffect, useState } from "react";
import {
  fetchPostApi,
  fetchPutApi,
  fetchGetApi,
} from "../../functions/apiFunctions";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

// const access_user = JSON.parse(localStorage.getItem("access_token") as string);
// const user = JSON.parse(localStorage.getItem("userData") as string);
// const userFullName = user?.first_name + " " + user?.last_name;
// // console.log(userFullName, "dddddddddddddddddddddddddddd");

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
export const Comment = ({ comment, onReply, onEdit, dataType }) => {
  //const access_user = JSON.parse(
  // localStorage.getItem("access_token") as string
  //);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [useName, setUserName] = useState("");
  const [localTime, setLocalTime] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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
      setUserName(user?.first_name + " " + user?.last_name);
    };
    dataType === "userComment" && findUserName(comment?.created_by);
  }, [dataType]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = (newComment) => {
    onEdit(
      comment.path,
      newComment,
      comment.submission_review_id || comment.user_comment_id
    );
    setIsEditing(false);
  };

  const handleReply = () => {
    setIsReplying(!isReplying);
  };

  const handleReplySubmit = (replyComment) => {
    onReply(comment.path, replyComment);
    setIsReplying(false);
  };

  return (
    <div className="relative ml-4 mt-4 mb-4">
      <div className="p-3 bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700 rounded-[10px] relative">
        <div className="flex justify-between text-gray-700 dark:text-gray-400">
          <div className="flex gap-2">
            <div className="bg-[#66666629] w-[25px] h-[25px] rounded-full"></div>
            <span className="font-bold">
              {capitalizeFirstLetterOfEachWord(
                dataType === "userComment" ? useName : comment.created_by
              )}
            </span>
          </div>
          <button className="font-bold" onClick={handleEdit}>
            Edit
          </button>
        </div>
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
        <div className="flex justify-between text-gray-700 dark:text-gray-400 mt-2">
          <button className="font-bold" onClick={handleReply}>
            Reply
          </button>
          <span>
            {dataType === "userComment" ? localTime : comment.created}
          </span>
        </div>
        {isReplying && (
          <CommentForm
            onSubmit={handleReplySubmit}
            placeholder="Write a reply..."
          />
        )}
        {comment.children.length > 0 && (
          <div className="ml-4">
            {comment.children.map((child) => (
              <Comment
                key={child.path}
                comment={child}
                onReply={onReply}
                onEdit={onEdit}
                dataType={dataType}
              />
            ))}
          </div>
        )}
      </div>
      {/* Vertical Line */}
      <div className="absolute top-0 left-0 w-[2px] h-full bg-[#000]"></div>
      {/* Horizontal Line */}
      {comment.children.length > 0 && (
        <div className="absolute top-1/2 left-0 w-6 h-[2px] bg-[#000]"></div>
      )}
    </div>
  );
};

// Comment form component
export const CommentForm = ({ onSubmit, placeholder, initialComment = "" }) => {
  const [comment, setComment] = useState(initialComment);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment("");
    }
  };

  return (
    <form className="flex items-center gap-3 mb-3 my-2" onSubmit={handleSubmit}>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={placeholder}
        className="border-[#e6e6e6] border-[1px] rounded-[6px] px-[12px] py-[8px] w-full mt-1 placeholder:text-[#00000080] text-[14px] h-[36px] outline-none"
      />
      <button
        type="submit"
        className="border-[#000] border-[1px] bg-[#000000] rounded-lg text-white roboto font-medium text-[16px] p-[7px_10px]"
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
  fetchCommnets,
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
        navigate("/login");
      }
      await fetchPostApi(
        pathUrl,
        payload,
        "application/json",
        access_user,
        navigate,
        location
      );
      fetchCommnets();

      // setComments((prevComments) => [...prevComments, newComment]);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.response.data.error || error.response.data);
    }
  };

  const handleReply = async (parentPath, replyCommentText) => {
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
      fetchCommnets();
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
      fetchCommnets();
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

  return (
    <>
      <div className={dataType === "userComment" ? "" : "mb-[100px]"}>
        {initialComments?.submission_reviews?.length !== 0 ? (
          <div>
            {comments.map((comment) => (
              <Comment
                key={comment.path}
                comment={comment}
                onReply={handleReply}
                onEdit={handleEdit}
                dataType={dataType}
              />
            ))}

            <CommentForm
              onSubmit={handleAddComment}
              placeholder="Write a question/comment..."
            />
          </div>
        ) : (
          <CommentForm
            onSubmit={handleAddComment}
            placeholder="Start a new discussion thread..."
          />
        )}
      </div>
    </>
  );
};

export default CommentTree;
