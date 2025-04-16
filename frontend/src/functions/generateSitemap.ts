import config from "../../config.json";

const currentEnvironment: string =
  process.env.VITE_HUBY_ENV || "development";
const configPath: string = `${currentEnvironment}.apiDomain`;
const apiDomain: string = configPath
  .split(".")
  .reduce((obj: any, key: string) => obj?.[key], config);

const routes = [
  "/",
  "/about",
  "/contact-us",
  "/update-profile",
  "/appdetails",
  "/appinfo",
  "/viewstatus",
  "/comments",
  "/prototypehub",
  "/userprofile",
  "/prototypedetail",
];

const generateSitemap = () => {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  routes.forEach((route) => {
    sitemap += `<url>\n`;
    sitemap += `  <loc>${apiDomain}${route}</loc>\n`;
    sitemap += `</url>\n`;
  });
  sitemap += "</urlset>";

  const blob = new Blob([sitemap], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sitemap.xml";
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
};

export default generateSitemap;
