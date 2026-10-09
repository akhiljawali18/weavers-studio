/** @type {import('next').NextConfig} */
//const nextConfig = {};

// module.exports = nextConfig;
const { default: axios } = require("axios");
const path = require("path");
module.exports = {
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")]
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    experimental: {
        serverActions: true
    },
    reactStrictMode: true,
    // The browser never calls the backend port directly. It requests a relative
    // path and Next.js forwards it, so everything stays on one origin and CORS
    // never applies. Point at a deployed backend by setting BACKEND_API_URL.
    //
    // 8081, not Spring Boot's default 8080: a local PostgreSQL 18 service already
    // listens on 8080, so the backend runs with SERVER_PORT=8081 to avoid it.
    async rewrites() {
        return [
            {
                source: "/api/v1/:path*",
                destination: `${process.env.BACKEND_API_URL || "http://localhost:8081"}/api/v1/:path*`
            }
        ];
    },
    // async redirects() {
    //     let url_redirections = await axios.get(`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/url_redirection?fields=old_url,new_url`, {
    //         headers: {
    //             Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`
    //         }
    //     });
    //     return url_redirections?.data?.data.map(({ old_url, new_url }) => ({
    //         source: old_url,
    //         destination: new_url,
    //         permanent: true,
    //         statusCode: 301
    //     }));
    // },
    swcMinify: true,
    optimizeFonts: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "mpzvn9pupr.ap-south-1.awsapprunner.com"
            }
        ]
    }
};
