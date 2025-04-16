import axios, { AxiosResponse } from "axios"; // Import axios library

import config from "../../config.json";
import { toast } from "react-toastify";

const currentEnvironment: string = process.env.VITE_HUBY_ENV || "development";
const configPath: string = `${currentEnvironment}.apiDomain`;
const apiDomain: string = configPath
  .split(".")
  .reduce((obj: any, key: string) => obj?.[key], config);

const googleOauth2Api: string = `${currentEnvironment}.googleOath2Api`;
const googleOauth2ApiPath: string = googleOauth2Api
  .split(".")
  .reduce((obj: any, key: string) => obj?.[key], config);
// const access_user_global = JSON.parse(
//   localStorage.getItem("access_token") as string
// );

const invalidTokenMessage =
  "Invalid or expired access_token. Please login and resubmit your request.";

export const fetchApplicationData = async (
  skip = 0,
  limit = 5
): Promise<any> => {
  try {
    const endpoint: string = `${apiDomain}/api/applications?skip=${skip}&limit=${limit}`; // Corrected variable name
    console.log("Fetching data from endpoint:", endpoint);
    const result: Response = await fetch(endpoint);
    if (!result.ok) {
      throw new Error("Failed to fetch application data");
    }
    const applicationData: any = await result.json();
    //console.log("application data = == = == ==== ", applicationData);
    return applicationData;
  } catch (error) {
    console.log("fetchApplicationData Error:", error.message); // Corrected console.log
    throw error;
  }
};

export const fetchSearchApplications = async (
  path: string,
  data: any
): Promise<AxiosResponse> => {
  try {
    const config = {
      method: "get",
      url: apiDomain + path,
      params: data, // Including data in the body
      withCredentials: false,
      headers: {
        "Content-Type": "application/json", // Setting content type header
      },
    };
    const response: AxiosResponse = await axios.request(config);
    return response;
  } catch (error) {
    console.log("fetchSearchApplications api Error:", error.message);
    throw error;
  }
};

export const fetchLLMSearchApplications = async (
  path: string,
  data: any
): Promise<AxiosResponse> => {
  try {
    const config = {
      method: "post",
      url: apiDomain + path,
      data,
      withCredentials: false,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response: AxiosResponse = await axios.request(config);
    return response;
  } catch (error) {
    console.log("fetchllmSearchApplications API Error:", error.message);
    throw error;
  }
};

export const fetchGetApi = async (
  path: string,
  access_user?: any,
  navigate?: (path: string, options?: { state: any }) => void,
  location?: any
): Promise<AxiosResponse> => {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: apiDomain + path,
      withCredentials: false,
      headers: {
        "Content-Type": "application/json",
        ...(access_user?.access_token && {
          Authorization: `Bearer ${access_user.access_token}`,
        }),
      },
    };
    //console.log("config(headers) in fetchGetApi:", config.headers);
    //console.log("functions.ts: fetchGetApi access_user:", access_user);
    const response = await axios.request(config);
    return response;
  } catch (error: any) {
    if (
      error?.response?.data?.error === invalidTokenMessage &&
      navigate &&
      location
    ) {
      localStorage.clear();
      navigate("/login", { state: { from: location } });
    }

    throw error;
  }
};
export const fetchDeleteApi = async (
  path: string,
  access_user?: any,
  navigate?: (path: string, options?: { state: any }) => void,
  location?: any
): Promise<AxiosResponse> => {
  try {
    const config = {
      method: "delete",
      url: `${apiDomain}${path}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_user.access_token}`,
      },
    };
    const response: AxiosResponse = await axios(config);
    // console.log("Data deleted successfully", response.data);
    return response;
  } catch (error) {
    if (
      error?.response?.data?.error === invalidTokenMessage &&
      navigate &&
      location
    ) {
      localStorage.clear();
      navigate("/login", { state: { from: location } });
    }

    throw error;
  }
};

export const fetchPostApi = async (
  path: string,
  data: any,
  type: string,
  access_user?: any,
  navigate?: (path: string, options?: { state: any }) => void,
  location?: any
): Promise<AxiosResponse> => {
  try {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: apiDomain + path,
      withCredentials: false,
      headers: {
        "Content-Type": type ?? "application/json",
        ...(access_user?.access_token && {
          Authorization: `Bearer ${access_user.access_token}`,
        }),
      },
      data: type === "multipart/form-data" ? data : JSON.stringify(data),
    };

    // Setting the default header for POST requests
    axios.defaults.headers.post["Content-Type"] = type ?? "application/json";

    const response: AxiosResponse = await axios.request(config);
    return response;
  } catch (error: any) {
    if (
      error?.response?.data?.error === invalidTokenMessage &&
      navigate &&
      location
    ) {
      localStorage.clear();
      navigate("/login", { state: { from: location } });
    }

    throw error;
  }
};

export const fetchPutApi = async (
  path: string,
  data: any,
  type?: string,
  access_user?: any,
  navigate?: (path: string, options?: { state: any }) => void,
  location?: any
): Promise<AxiosResponse> => {
  try {
    const config = {
      method: "put",
      maxBodyLength: Infinity,
      url: apiDomain + path,
      withCredentials: false,
      headers: {
        "Content-Type": type ?? "application/json",
        ...(access_user?.access_token && {
          Authorization: `Bearer ${access_user.access_token}`,
        }),
      },
      data: type === "multipart/form-data" ? data : JSON.stringify(data),
    };

    // Make the PUT request
    const response: AxiosResponse = await axios.request(config);
    return response;
  } catch (error: any) {
    if (
      error?.response?.data?.error === invalidTokenMessage &&
      navigate &&
      location
    ) {
      console.log("Invalid token detected, redirecting to login...");
      localStorage.clear();
      navigate("/login", { state: { from: location } });
    }
    throw error;
  }
};

export const getUserDataByEmail = async (
  email: string,
  access_user: any
): Promise<AxiosResponse<any>> => {
  try {
    const userData: AxiosResponse<any> = await axios.get(
      `${apiDomain}/api/users/user?email=${email}`,
      { headers: { Authorization: `Bearer ${access_user.access_token}` } }
    );
    return userData;
  } catch (error) {
    if (error?.response?.data?.error === invalidTokenMessage) {
      localStorage.clear();
      window.location.href = "/login";
    }
    console.log("getUserDataByEmail Error:", error.message);
    throw error;
  }
};

export const fetchGoogleInfoApi = async (
  access_token: string
): Promise<any> => {
  try {
    const userInfo: AxiosResponse = await axios.get(googleOauth2ApiPath, {
      headers: { Authorization: `Bearer ${access_token}` }, // Corrected variable name
    });
    return userInfo.data;
  } catch (error) {
    console.log("fetchGoogleInfoApi Error:", error.message);
    throw error;
  }
};

export const getUserProfileImage = async (
  path: any,
  access_user: any
): Promise<any> => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: apiDomain + path,
      withCredentials: false,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${access_user?.access_token}`,
      },
    };

    const getImage = await axios.request(config);
    const imageUrl = getImage?.data?.user_icon_url;
    if (imageUrl && !imageUrl.startsWith("http")) {
      return apiDomain + imageUrl;
    }
    return imageUrl;
    //return apiDomain + getImage?.data?.user_icon_url;
  } catch (error) {
    // if (error?.response?.data?.error === invalidTokenMessage) {
    //   window.location.href = "/login";
    // }
    console.log(error);
    throw error;
  }
};

export const createOwnerID = async (
  data: any,
  access_user: any,
  navigate?: (path: string, options?: { state: any }) => void,
  location?: { pathname: string }
) => {
  const response = await fetchPostApi(
    "/api/applications/ownership",
    data,
    "application/json",
    access_user,
    navigate,
    location
  );
  return response.data;
};

export const getApplicationOwnerShip = async (path: any, access_user: any) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: apiDomain + path,
      withCredentials: false,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_user?.access_token}`,
      },
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    if (error?.response?.data?.error === invalidTokenMessage) {
      localStorage.clear();
      window.location.href = "/login";
    }
    console.log(error);
    throw error;
  }
};

export const updateApplicationOwnerShip = async (
  path: any,
  data: any,
  access_user: any,
  navigate?: (path: string, options?: { state: any }) => void,
  location?: { pathname: string }
) => {
  const response = await fetchPutApi(
    path,
    data,
    "application/json",
    access_user,
    navigate,
    location
  );
  return response;
};
export const createApplicationReviewRequest = async (
  data: any,
  access_user: any,
  navigate?: (path: string, options?: { state: any }) => void,
  location?: { pathname: string }
) => {
  const response = await fetchPostApi(
    "/api/applications/review_requests",
    data,
    "application/json",
    access_user,
    navigate,
    location
  );
  return response.data;
};

// export const filterAppDataByLoginUser = (data) => {
//   // console.log("Check data filterAppDataByLoginUser ", data);

//   try {
//     const user = JSON.parse(localStorage.getItem("userData"));
//     let filteredData = data.filter((item) => {
//       return item?.created_by === user?.user_id;
//     });
//     // console.log("Chehchhke", filteredData);

//     return filteredData;
//   } catch (error) {
//     console.log("filterData Error:", error);
//   }
// }

export const validateFormData = (formData: any, fieldsToValidate: string[]) => {
  const formatFieldName = (field: string) => {
    return field
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  for (let field of fieldsToValidate) {
    const value = formData[field];

    // If field doesn't exist in formData, skip validation
    if (value === undefined || value === null) {
      continue;
    }

    // If field is an empty string, show error
    if (typeof value === "string" && !value.trim()) {
      toast.error(
        `Please enter a valid value for ${
          field === "application_id" || field === "application"
            ? "Product Name"
            : formatFieldName(field)
        } field.`
      );
      return false;
    }

    // If field is empty array, show error
    if (Array.isArray(value) && value.length === 0) {
      toast.error(
        `Please enter a valid value for ${formatFieldName(field)} field.`
      );
      return false;
    }

    // If field is an object with subfields, check for empty values in the subfields
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const subFields = Object.keys(value);
      for (let subField of subFields) {
        if (typeof value[subField] === "string" && !value[subField].trim()) {
          toast.error(
            `Please enter a valid value for ${formatFieldName(
              subField
            )} field in ${formatFieldName(field)}.`
          );
          return false;
        }
      }
    }
  }

  return true;
};

export const createApplicationsDocument = async (
  data: any,
  access_user: any,
  navigate?: (path: string, options?: { state: any }) => void,
  location?: { pathname: string }
) => {
  const payloadData = {
    collection: "applications",
    document: data,
  };
  const response = await fetchPostApi(
    "/api/create_document",
    payloadData,
    "application/json",
    access_user,
    navigate,
    location
  );
  return response;
};
export const updateApplicationsDocument = async (
  data: any,
  id: string,
  access_user: any,
  navigate?: (path: string, options?: { state: any }) => void,
  location?: { pathname: string }
) => {
  const payloadData = {
    collection: "applications",
    document_id: id,
    document: data,
  };
  const response = await fetchPutApi(
    "/api/update_document",
    payloadData,
    "application/json",
    access_user,
    navigate,
    location
  );
  return response;
};

// export const validateFormData = (formData: any) => {
//   const requiredFields = Object.keys(formData);

//   for (let field of requiredFields) {
//     const value = formData[field];

//     // make fields optional
//     if (
//       field === "secondary_owner_name" ||
//       field === "secondary_owner_id" ||
//       field === "secondary_owner_email" ||
//       field === "secondary_owner_phone" ||
//       field === "marketing_id"
//     ) {
//       continue;
//     }

//     if (typeof value === "string" && !value.trim()) {
//       toast.error(
//         `Please enter a valid value for ${field === "application_id" || field === "application"
//           ? "App Name"
//           : field
//         } field.`
//       );
//       return false;
//     }

//     if (Array.isArray(value) && value.length === 0) {
//       toast.error(`Please enter a valid value for ${field} field.`);
//       return false;
//     }

//     if (typeof value === "object" && value !== null && !Array.isArray(value)) {
//       const subFields = Object.keys(value);
//       console.log("subFields value is: ", subFields);
//       for (let subField of subFields) {
//         console.log("value[subField] is = ", value[subField]);
//         if (typeof value[subField] === "string" && !value[subField].trim()) {
//           toast.error(`Please enter a valid value for ${subField} field in ${field}.`);
//           return false;
//         }
//       }
//     }
//   }

//   return true;
// };

export const uploadApplicationLogoUrl = async (
  data: any,
  application_id: string,
  access_user: any,
  navigate?: (path: string, options?: { state: any }) => void,
  location?: { pathname: string }
) => {
  const res = await fetchPostApi(
    `/api/applications/${application_id}/logo`,
    data,
    "multipart/form-data",
    access_user,
    navigate,
    location
  );
  // console.log(res, "*-***-*-*-**-*-*-*-***");
  if (res.status === 201) {
    const updateAppLogo = await fetchPutApi(
      `/api/applications/${application_id}`,
      {
        application_logo_url: res?.data?.application_logo_url,
      },
      "application/json",
      access_user,
      navigate,
      location
    );
    if (updateAppLogo.status === 200)
      toast.success("Application logo updated Successfully!");
  }
};

export const calculateAverageRatings = (ratings) => {
  const sums = {
    app_ecosystem_rating: 0,
    app_performance_rating: 0,
    app_practicality_rating: 0,
    app_ux_rating: 0,
    proto_impact_rating: 0,
    proto_practicality_rating: 0,
  };
  ratings?.forEach((rating) => {
    sums.app_ecosystem_rating += rating.app_ecosystem_rating;
    sums.app_performance_rating += rating.app_performance_rating;
    sums.app_practicality_rating += rating.app_practicality_rating;
    sums.app_ux_rating += rating.app_ux_rating;
    sums.proto_impact_rating += rating.proto_impact_rating;
    sums.proto_practicality_rating += rating.proto_practicality_rating;
  });
  const count = ratings?.length;
  const averages = {
    app_ecosystem_rating: (sums.app_ecosystem_rating / count).toFixed(1),
    app_performance_rating: (sums.app_performance_rating / count).toFixed(1),
    app_practicality_rating: (sums.app_practicality_rating / count).toFixed(1),
    app_ux_rating: (sums.app_ux_rating / count).toFixed(1),
    proto_impact_rating: (sums.proto_impact_rating / count).toFixed(1),
    proto_practicality_rating: (sums.proto_practicality_rating / count).toFixed(
      1
    ),
  };

  return averages;
};

export const convertImageUrl = (url: string) => {
  return apiDomain + `/${url}`;
};

// export const uploadApplicationMarketing = async (
//   marketing_id: string,
//   application_id: string,
//   formData: FormData,
//   type: string,
//   prefix: string,
//   access_user: any
// ): Promise<any> => {
//   try {
//     const config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: `${apiDomain}/api/applications/${application_id}/marketing/${marketing_id}/${type}/${prefix}`,
//       data: formData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${access_user?.access_token}`,
//       },
//     };
//     const response = await axios.request(config);
//     return response.data;
//   } catch (error) {
//     if (error?.response?.data?.error === invalidTokenMessage) {
//       localStorage.removeItem("access_token");
//       window.location.href = "/login";
//     }
//     throw error;
//   }
// };

// export const getApplicationModels = async (applicationId, access_user) => {
//   try {
//     let config = {
//       method: "get",
//       maxBodyLength: Infinity,
//       url: apiDomain + "/api/applications/" + applicationId + "/models",
//       withCredentials: false,
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${access_user?.access_token}`,
//       },
//     };
//     const respo = await axios.request(config);
//     return respo.data;
//   } catch (error) {
//     if (error?.response?.data?.error === invalidTokenMessage) {
//       localStorage.removeItem("access_token");
//       window.location.href = "/login";
//     }
//     console.log(error);
//     throw error.response.data;
//   }
// };

// export const getApplicationRuntime = async (applicationId, access_user) => {
//   try {
//     let config = {
//       method: "get",
//       maxBodyLength: Infinity,
//       url: apiDomain + "/api/applications/" + applicationId + "/runtime",
//       withCredentials: false,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${access_user?.access_token}`,
//       },
//     };
//     const respo = await axios.request(config);
//     return respo.data;
//   } catch (error) {
//     if (error?.response?.data?.error === invalidTokenMessage) {
//       localStorage.removeItem("access_token");
//       window.location.href = "/login";
//     }
//     console.log(error);
//     throw error.response.data;
//   }
// };

// export const fetchPostApi = async (
//   path: string,
//   data: any,
//   type: any
// ): Promise<AxiosResponse> => {
//   try {
//     const jdata: string = JSON.stringify(data);

//     const config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: apiDomain + path,
//       withCredentials: false,
//       headers: {
//         "Content-Type": type,
//       },
//       data: jdata,
//     };

//     axios.defaults.headers.post["Content-Type"] = type || "application/json";
//     const response: AxiosResponse = await axios.request(config);
//     return response;
//   } catch (error) {
//     if (error?.response?.data?.error === invalidTokenMessage) {
//       localStorage.removeItem("access_token");
//       window.location.href = "/login";
//     }
//     console.log("fetch post api Error:", error);
//     throw error;
//   }
// };
