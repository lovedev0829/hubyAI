import config from "../../config.json";

export const generateRandomString = (length: number): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export function getApiDomain(): string {
  const currentEnvironment: string =
    process.env.VITE_HUBY_ENV || "development";
  const configPath: string = `${currentEnvironment}.apiDomain`;
  const apiDomain: string = configPath
    .split(".")
    .reduce((obj: any, key: string) => obj?.[key], config);

  return apiDomain;
}

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const convertToYouTubeEmbedUrl = (url: string): any => {
  const youtubeUrlPattern =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:embed\/|v\/|watch\?v=)|youtu\.be\/)([^"&?\/\s]{11})/;

  const match = url.match(youtubeUrlPattern);
  if (match && match[4]) {
    const videoId = match[4];
    return { status: true, newUrl: `https://www.youtube.com/embed/${videoId}` };
  }

  return { status: false };
};
