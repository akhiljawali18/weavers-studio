/** @type {import('next').NextConfig} */
module.exports = {
    eslint: {
        ignoreDuringBuilds: true
    },
    experimental: {
        serverActions: true
    },
    reactStrictMode: true,
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
