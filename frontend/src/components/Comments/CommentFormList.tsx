// import { useEffect, useState, FormEvent, ChangeEvent } from "react";

// // Define interfaces for Comment and CommentForm props
// interface CommentType {
//   path: string;
//   comment: string;
//   replies: CommentType[];
//   id?: string; // Optional ID
// }

// interface CommentFormProps {
//   addComment?: (comment: string, path: string) => void;
//   addReply?: (reply: string, parentPath: string) => void;
//   parentPath?: string;
// }

// interface CommentProps {
//   comment: CommentType;
//   addReply: (reply: string, parentPath: string) => void;
// }

// interface CommentListProps {
//   comments: CommentType[];
//   addReply: (reply: string, parentPath: string) => void;
// }

// const TestPage = () => {
//   const [comments, setComments] = useState<CommentType[]>([]);

//   // Function to check if the initial state is blank
//   const isInitialStateBlank = () => comments.length === 0;

//   const addComment = (comment: string, path: string) => {
//     const newComment: CommentType = {
//       path: path,
//       comment: comment,
//       replies: [],
//     };
//     console.log(newComment, "newwwwwwcommmmmm");
//     setComments([...comments, newComment]);
//     console.log(comments, "adddddddddddd");
//   };

//   const addReply = (reply: string, parentPath: string) => {
//     const newComments = comments.map((comment) => {
//       if (comment.path === parentPath) {
//         const newReply: CommentType = {
//           path: `${parentPath}/${(comment.replies?.length || 0) + 1}`,
//           comment: reply,
//           replies: [],
//         };
//         console.log(
//           { ...comment, replies: [...(comment.replies || []), newReply] },
//           "1111111111111111111"
//         );
//         return { ...comment, replies: [...(comment.replies || []), newReply] };
//       } else if (comment.replies.length) {
//         comment.replies = comment.replies.map((subReply) => {
//           if (subReply.path === parentPath) {
//             const newReply: CommentType = {
//               path: `${parentPath}/${(subReply.replies?.length || 0) + 1}`,
//               comment: reply,
//               replies: [],
//             };
//             console.log(
//               {
//                 ...subReply,
//                 replies: [...(subReply.replies || []), newReply],
//               },
//               "22222222222222222222222222"
//             );
//             return {
//               ...subReply,
//               replies: [...(subReply.replies || []), newReply],
//             };
//           } else {
//             console.log(subReply, "33333333333333333");
//             return subReply;
//           }
//         });
//       }
//       return comment;
//     });
//     setComments(newComments);
//   };

//   const CommentForm = ({
//     addComment,
//     addReply,
//     parentPath = null,
//   }: CommentFormProps) => {
//     const [comment, setComment] = useState("");

//     const handleSubmit = (e: FormEvent) => {
//       e.preventDefault();
//       if (parentPath) {
//         addReply?.(comment, parentPath);
//       } else {
//         const newPath = `/${comments.length + 1}`;
//         addComment(comment, newPath);
//       }
//       setComment("");
//     };

//     const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
//       setComment(e.target.value);
//     };

//     return (
//       <form onSubmit={handleSubmit} className="mb-4">
//         <textarea
//           value={comment}
//           onChange={handleChange}
//           className="w-full p-2 border rounded-md"
//           rows={3}
//           placeholder="Add a comment..."
//         />
//         <button
//           type="submit"
//           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
//         >
//           Submit
//         </button>
//       </form>
//     );
//   };

//   const Comment = ({ comment, addReply }: CommentProps) => {
//     const [showReplyForm, setShowReplyForm] = useState(false);

//     return (
//       <div className="mb-4 pl-4 border-l-2">
//         <p>{comment.comment}</p>
//         <button
//           onClick={() => setShowReplyForm(!showReplyForm)}
//           className="text-blue-500"
//         >
//           Reply
//         </button>
//         {showReplyForm && (
//           <CommentForm addReply={addReply} parentPath={comment.path} />
//         )}
//         {comment.replies?.map((reply) => (
//           <Comment key={reply.path} comment={reply} addReply={addReply} />
//         ))}
//       </div>
//     );
//   };

//   const CommentList = ({ comments, addReply }: CommentListProps) => {
//     return (
//       <div>
//         {comments.map((comment) => (
//           <Comment key={comment.path} comment={comment} addReply={addReply} />
//         ))}
//       </div>
//     );
//   };

//   useEffect(() => {
//     console.log(comments, "/*//*/*//*/*/*/");
//   }, [comments]);

//   return (
//     <div className="p-4">
//       {/* Show "Add Comment" form if initial state is blank */}
//       {isInitialStateBlank() ? (
//         <CommentForm addComment={addComment} />
//       ) : (
//         <>
//           <CommentForm addComment={addComment} />
//           <CommentList comments={comments} addReply={addReply} />
//         </>
//       )}
//     </div>
//   );
// };

// export default TestPage;

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import {
  fetchPostApi,
  fetchGetApi,
} from "../../functions/apiFunctions";
import { useLocation, useNavigate } from "react-router-dom";

// Define interfaces for Comment and CommentForm props
interface CommentType {
  path: string;
  comment: string;
  replies: CommentType[];
  id?: string; // Optional ID
}

interface CommentFormProps {
  addComment?: (comment: string, path: string) => void;
  addReply?: (reply: string, parentPath: string) => void;
  parentPath?: string;
}

interface CommentProps {
  comment: CommentType;
  addReply: (reply: string, parentPath: string) => void;
}

interface CommentListProps {
  comments: CommentType[];
  addReply: (reply: string, parentPath: string) => void;
}

const CommentFormList = ({ showAppID }) => {
  const access_user = JSON.parse(
    localStorage.getItem("access_token") as string
  );
  const applicationId = showAppID;
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check if the initial state is blank
  const isInitialStateBlank = () => comments.length === 0;

  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const path = `/api/applications/${applicationId}/submission-status`;
        const response = await fetchGetApi(path, undefined, navigate, location);
        // Assuming the API returns data in a format similar to the example you provided
        const fetchedComments = response.data.submission_reviews.map(
          (review: any) => ({
            path: review.path,
            comment: review.comment,
            replies: review.replies,
          })
        );
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const addComment = async (comment: string, path: string) => {
    try {
      const payload = {
        application_id: applicationId,
        path: path,
        comment: comment,
        replies: [],
      };
      await fetchPostApi(
        "/api/applications/submission_reviews",
        payload,
        "application/json",
        access_user,
        navigate,
        location
      );
      // Update state to add the comment locally
      setComments([...comments, { path, comment, replies: [] }]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const addReply = async (reply: string, parentPath: string) => {
    try {
      const payload = {
        application_id: applicationId,
        path: parentPath,
        comment: reply,
        replies: [],
      };
      await fetchPostApi(
        "/api/applications/submission_reviews",
        payload,
        "application/json",
        access_user,
        navigate,
        location
      );
      // Update state to add the reply locally
      const updatedComments = comments.map((comment) => {
        if (comment.path === parentPath) {
          const newReply: CommentType = {
            path: `${parentPath}/${(comment.replies?.length || 0) + 1}`,
            comment: reply,
            replies: [],
          };
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        } else if (comment.replies.length) {
          comment.replies = comment.replies.map((subReply) => {
            if (subReply.path === parentPath) {
              const newReply: CommentType = {
                path: `${parentPath}/${(subReply.replies?.length || 0) + 1}`,
                comment: reply,
                replies: [],
              };
              return {
                ...subReply,
                replies: [...(subReply.replies || []), newReply],
              };
            }
            return subReply;
          });
        }
        return comment;
      });
      setComments(updatedComments);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const CommentForm = ({
    addComment,
    addReply,
    parentPath = null,
  }: CommentFormProps) => {
    const [comment, setComment] = useState("");

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (parentPath) {
        addReply?.(comment, parentPath);
      } else {
        const newPath = `/${comments.length + 1}`;
        addComment(comment, newPath);
      }
      setComment("");
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setComment(e.target.value);
    };

    return (
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={comment}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          rows={3}
          placeholder="Add a comment..."
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-[#7CE68D] text-black rounded-md"
        >
          Submit
        </button>
      </form>
    );
  };

  const Comment = ({ comment, addReply }: CommentProps) => {
    const [showReplyForm, setShowReplyForm] = useState(false);

    return (
      <div className="mb-4 pl-4 border-l-2">
        <p>{comment.comment}</p>
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-[#3a994a]"
        >
          Reply
        </button>
        {showReplyForm && (
          <CommentForm addReply={addReply} parentPath={comment.path} />
        )}
        {comment.replies?.map((reply) => (
          <Comment key={reply.path} comment={reply} addReply={addReply} />
        ))}
      </div>
    );
  };

  const CommentList = ({ comments, addReply }: CommentListProps) => {
    return (
      <div>
        {comments.map((comment) => (
          <Comment key={comment.path} comment={comment} addReply={addReply} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      {/* Show "Add Comment" form if initial state is blank */}
      {loading ? (
        <p>Loading...</p>
      ) : isInitialStateBlank() ? (
        <CommentForm addComment={addComment} />
      ) : (
        <>
          <CommentList comments={comments} addReply={addReply} />
          <CommentForm addComment={addComment} />
        </>
      )}
    </div>
  );
};

export default CommentFormList;
