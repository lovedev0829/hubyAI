import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchDeleteApi, fetchPutApi } from "../../functions/apiFunctions";

// Define an interface for file data
interface FileData {
    label: string;
    path: string;
}

// Define props for the component
interface FilePreviewProps {
    images: Record<string, string>[];
    videos: Record<string, string>[];
    application_id: string;
    marketing_id: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({
    images = [],
    videos = [],
    application_id,
    marketing_id,
}) => {

    console.log(images, "images")
    console.log(videos, "videos")
    const access_user = JSON.parse(localStorage.getItem("access_token") || "{}");
    const navigate = useNavigate();
    const location = useLocation();

    // State for managing payload
    const [payload, setPayload] = useState({
        images,
        videos,
    });

    // Helper function to process API domain URL
    const getApiDomain = (url: string) =>
        url.startsWith("dist/") ? url.replace("dist/", "https://huby.ai/") : url;

    // Helper function to format data into a consistent structure
    const formatData = (data: Record<string, string>[]): FileData[] =>
        data.map((item) => {
            const label = Object.keys(item)[0];
            const path = item[label];
            return { label, path };
        });

    // Derived states for formatted images and videos
    const [formattedImages, setFormattedImages] = useState<FileData[]>([]);
    const [formattedVideos, setFormattedVideos] = useState<FileData[]>([]);

    // Sync payload and formatted data when props change
    useEffect(() => {
        setPayload({ images, videos });
    }, [images, videos]);

    // Format the images and videos when payload changes
    useEffect(() => {
        setFormattedImages(formatData(payload.images));
        setFormattedVideos(formatData(payload.videos));
    }, [payload]);

    // Function to handle file removal
    const handleRemove = async (type: "images" | "videos", indexToRemove: number, filePath: string) => {
        // Filter out the file with the specified index
        const updatedType = payload[type].filter((_, index) => index !== indexToRemove);

        // Update the payload state
        const updatedPayload = {
            ...payload,
            [type]: updatedType,
        };
        setPayload(updatedPayload);

        console.log(updatedPayload, "updatedPayload after removal");
        console.log(filePath, "filePath");

        const path = `/api/applications/${application_id}/marketing/${marketing_id}?file_path=${filePath}`;
        try {
            const response = await fetchDeleteApi(path, access_user, navigate, location);
            console.log("Data deleted successfully", response.data);
        } catch (error) {
            console.error("Failed to delete data:", error);
        }

        const apiPath = `/api/marketing/${marketing_id}`;
        try {
            const putResponse = await fetchPutApi(
                apiPath,
                { application_id: application_id, images: updatedPayload.images, videos: updatedPayload.videos },
                "application/json",
                access_user,
                navigate,
                location
            );
            console.log("Data updated successfully", putResponse.data);
        } catch (error) {
            console.error("Failed to update data:", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Media File Section</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Render images */}
                {formattedImages.map((file, index) => (
                    <div
                        key={file.label}
                        className="relative border rounded-lg p-4 bg-white shadow-md flex flex-col items-center text-center transition-transform transform hover:scale-105"
                    >
                        <button
                            onClick={() => handleRemove("images", index, file.path)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 focus:outline-none"
                            aria-label="Remove file"
                        >
                            <AiOutlineClose size={20} />
                        </button>
                        {/* Check for supported image formats */}
                        {file.path.endsWith(".jpeg") || file.path.endsWith(".jpg") || file.path.endsWith(".png") || file.path.endsWith(".svg") || file.path.endsWith(".webp") ? (
                            <img
                                src={getApiDomain(file.path)}
                                alt={file.label}
                                className="w-24 h-24 object-cover rounded-lg mb-4"
                            />
                        ) : file.path.endsWith(".pdf") ? (
                            <div className="w-24 h-24 flex items-center justify-center bg-red-100 text-red-500 rounded-lg mb-4">
                                <span className="text-xl font-semibold">PDF</span>
                            </div>
                        ) : null}
                        <div className="text-center">
                            <Link to={getApiDomain(file.path)} target="_blank" className="font-medium text-gray-800">
                                {file.label}
                            </Link>
                        </div>
                    </div>
                ))}

                {/* Render videos */}
                {formattedVideos.map((file, index) => (
                    <div
                        key={file.label}
                        className="relative border rounded-lg p-4 bg-white shadow-md flex flex-col items-center text-center transition-transform transform hover:scale-105"
                    >
                        <button
                            onClick={() => handleRemove("videos", index, file.path)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 focus:outline-none"
                            aria-label="Remove file"
                        >
                            <AiOutlineClose size={20} />
                        </button>
                        <div className="w-24 h-24 mb-4">
                            <video
                                src={getApiDomain(file.path)}
                                className="w-full h-full object-cover rounded-lg"
                                controls
                            />
                        </div>
                        <div className="text-center">
                            <Link to={getApiDomain(file.path)} target="_blank" className="font-medium text-gray-800">
                                {file.label}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilePreview;
