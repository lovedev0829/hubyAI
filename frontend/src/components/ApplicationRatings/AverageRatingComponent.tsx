// import { useEffect, useState } from "react";
// import Star from "../../assets/Images/Star.png";
// import HalfStar from "../../assets/Images/half-star.png";
// import {
//   calculateAverageRatings,
//   fetchGetApi,
// } from "../../functions/apiFunctions";

// const AverageRatingComponent = ({ applicationId }) => {
//   const initialFormData = {
//     app_ecosystem_rating: null,
//     app_performance_rating: null,
//     app_practicality_rating: null,
//     app_ux_rating: null,
//     proto_impact_rating: null,
//     proto_practicality_rating: null,
//   };
//   const [formData, setFormData] = useState(initialFormData);

//   const handleChange = (key, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const [ratingAppData, setRatingAppData] = useState(null);

//   const fetchRatingData = async () => {
//     try {
//       const path = `/api/applications/ratings/${applicationId}`;
//       const response = await fetchGetApi(path);
//       setRatingAppData(response?.data);
//       console.log(response?.data, "ratinggggggggggggggggggggggggg");
//     } catch (error) {
//       console.error("fetchRatingData Error:", error);
//     }
//   };

//   useEffect(() => {
//     applicationId && fetchRatingData();
//   }, [applicationId]);

//   useEffect(() => {
//     if (ratingAppData) {
//       const rating = calculateAverageRatings(ratingAppData);
//       setFormData({
//         app_ecosystem_rating: rating?.app_ecosystem_rating || 0,
//         app_performance_rating: rating?.app_performance_rating || 0,
//         app_practicality_rating: rating?.app_practicality_rating || 0,
//         app_ux_rating: rating?.app_ux_rating || 0,
//         proto_impact_rating: rating?.proto_impact_rating || 0,
//         proto_practicality_rating: rating?.proto_practicality_rating || 0,
//       });
//       console.log(rating, "avrageeeeeeeee");
//     }
//   }, [ratingAppData]);

//   return (
//     <>
//       <div className="border-b-[1px] border-b-[#000000] pb-[15px]">
//         <div className="p-[2px_13px]">
//           <div className=" mt-[10px]">
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
//                   className="flex items-center justify-between flex-wrap gap-[5px] mt-2"
//                 >
//                   <div className="text-black">{label}</div>
//                   <div className="flex gap-2 items-center">
//                     {[1, 2, 3, 4, 5].map((value) => {
//                       const ratingValue = formData[key];
//                       let starImage = Star;
//                       // const decimalPart = ratingValue - Math.floor(ratingValue);

//                       // if (value <= ratingValue) {
//                       //   // Full Star
//                       //   starImage = Star;
//                       // } else if (
//                       //   value - 0.5 < ratingValue &&
//                       //   decimalPart >= 0.3 &&
//                       //   decimalPart <= 0.7
//                       // ) {
//                       //   // Half Star
//                       //   starImage = HalfStar;
//                       // }

//                       if (value <= ratingValue) {
//                         // Full Star
//                         starImage = Star;
//                       } else if (value - 0.5 <= ratingValue) {
//                         // Half Star
//                         starImage = HalfStar;
//                       }

//                       return (
//                         <label key={value} style={{ cursor: "pointer" }}>
//                           <input
//                             type="radio"
//                             value={value}
//                             checked={formData[key] === value}
//                             onChange={() => handleChange(key, value)}
//                             style={{ display: "none" }}
//                             disabled={true}
//                           />
//                           <img
//                             src={starImage}
//                             alt={`Star ${value}`}
//                             style={{
//                               opacity:
//                                 starImage === Star
//                                   ? formData[key] >= value
//                                     ? 1
//                                     : 0.5
//                                   : 1,
//                               transition: "opacity 0.2s",
//                             }}
//                           />
//                         </label>
//                       );
//                     })}
//                     <div className="text-black">{formData[key]}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AverageRatingComponent;

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  calculateAverageRatings,
  // fetchGetApi,
} from "../../functions/apiFunctions";
import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from 'react-router-dom';

const AverageRatingComponent = ({ /*applicationId*/ ratingsData }) => {
  const initialFormData = {
    app_ecosystem_rating: null,
    app_performance_rating: null,
    app_practicality_rating: null,
    app_ux_rating: null,
    proto_impact_rating: null,
    proto_practicality_rating: null,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [ratingAppData, setRatingAppData] = useState(null);

  // const navigate = useNavigate();
  // const location = useLocation();

  // const fetchRatingData = async () => {
  //   try {
  //     const path = `/api/applications/ratings/${applicationId}`;
  //     const response = await fetchGetApi(path, undefined, navigate, location);
  //     setRatingAppData(response?.data);
  //     // console.log(response?.data, "ratinggggggggggggggggggggggggg");
  //   } catch (error) {
  //     console.error("fetchRatingData Error:", error);
  //   }
  // };

  // useEffect(() => {
  //   applicationId && fetchRatingData();
  // }, [applicationId]);

  useEffect(() => {
    setRatingAppData(ratingsData)
  }, [ratingsData])

  useEffect(() => {
    if (ratingAppData) {
      const rating = calculateAverageRatings(ratingAppData);
      // console.log("//////////////////////", rating)
      setFormData({
        app_ecosystem_rating: rating?.app_ecosystem_rating || 0,
        app_performance_rating: rating?.app_performance_rating || 0,
        app_practicality_rating: rating?.app_practicality_rating || 0,
        app_ux_rating: rating?.app_ux_rating || 0,
        proto_impact_rating: rating?.proto_impact_rating || 0,
        proto_practicality_rating: rating?.proto_practicality_rating || 0,
      });
      // console.log(rating, "averageeeeeeeee");
    }
  }, [ratingAppData]);

  const calculateOverallRating = () => {
    const ratings = [
      Number(formData.app_ecosystem_rating) || 0,
      Number(formData.app_performance_rating) || 0,
      Number(formData.app_practicality_rating) || 0,
      Number(formData.app_ux_rating) || 0,
      Number(formData.proto_impact_rating) || 0,
      Number(formData.proto_practicality_rating) || 0,
    ];
    const validRatings = ratings.filter((r) => r > 0); // Filter out zeros or invalid numbers
    const total = validRatings.reduce((sum, rating) => sum + rating, 0);
    return validRatings.length > 0
      ? (total / validRatings.length).toFixed(1)
      : 0; // Ensure not to divide by zero
  };

  const averageRating = calculateOverallRating();

  const attributes = [
    {
      name: "Impact Rating (prototype)",
      score: Number(formData.proto_impact_rating) || 0,
    },
    {
      name: "Practicality Rating (prototype)",
      score: Number(formData.proto_practicality_rating) || 0,
    },
    {
      name: "Practicality  Rating",
      score: Number(formData.app_practicality_rating) || 0,
    },
    {
      name: "Performance Rating",
      score: Number(formData.app_performance_rating) || 0,
    },
    { name: "UX Rating", score: Number(formData.app_ux_rating) || 0 },
    {
      name: "Ecosystem Rating",
      score: Number(formData.app_ecosystem_rating) || 0,
    },
  ];

  return (
    <div className="py-6 px-6 bg-white rounded-md shadow-md max-w-full mx-auto flex flex-col sm:flex-row items-center justify-center">
      {/* {/ Ratings Section /} */}
      <div className="sm:w-[20%] h-full mb-4">
        <div className="flex justify-center">
          <span className="text-3xl font-bold mb-2">{averageRating} ★</span>
        </div>
      </div>

      {/* {/ Attributes Section /} */}
      <div className="w-[80%] flex justify-around gap-x-[12px] lg:gap-x-[40px] xl:gap-x-[12px] gap-y-[10px] flex-wrap ">
        {attributes.map((attr, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 max-w-[100px]"
          >
            <div className="w-24 h-24">
              <CircularProgressbar
                value={attr.score * 20}
                text={attr.score.toFixed(1)}
                styles={buildStyles({
                  textSize: "24px",
                  pathColor: "#4CAF50",
                  textColor: "#4CAF50",
                  trailColor: "#eaeaea",
                })}
              />
            </div>
            <p className="text-sm text-center">{attr.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AverageRatingComponent;
