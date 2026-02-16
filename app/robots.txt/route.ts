import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/profile",
          "/profile/history",
          "/profile/vision-mission",
          "/academic",
          "/facilities",
          "/staff",
          "/contact",
          "/school",
          "/admissions",
          "/signup",
          "/registrar",
        ],
        disallow: [
          "/dashboard/",
          "/admin/",
          "/signin",
          "/api/",
          "/_next/",
          "/private/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/profile",
          "/profile/history",
          "/profile/vision-mission",
          "/academic",
          "/facilities",
          "/staff",
          "/contact",
          "/school",
          "/admissions",
          "/signup",
          "/registrar",
        ],
        disallow: [
          "/dashboard/",
          "/admin/",
          "/signin",
          "/api/",
          "/_next/",
          "/private/",
        ],
      },
    ],
    sitemap: "https://www.smpitmasjidsyuhada.sch.id/sitemap.xml",
    host: "https://www.smpitmasjidsyuhada.sch.id",
  };
}
