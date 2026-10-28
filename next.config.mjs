/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 2592000, // 30 days image cache
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/blog/bihar-nmms-2024-mat-11p-sagarsir",
        destination: "/blog/bihar-nmms-2024-question-paper-answer-key-pdf",
        permanent: true,
      },
      {
        source: "/blog/bihar-nmms-2024-mat-7p-sagarsir",
        destination: "/blog/bihar-nmms-2024-question-paper-answer-key-pdf",
        permanent: true,
      },
      {
        source: "/blog/bihar-nmms-2023-sat-24p-sagarsir",
        destination: "/blog/bihar-nmms-2023-question-paper-answer-key-pdf",
        permanent: true,
      },
      {
        source: "/blog/bihar-nmms-2017-mat-6p-sagarsir",
        destination: "/blog/bihar-nmms-2017-mat-7p-sagarsir",
        permanent: true,
      },
      {
        source: "/blog/bihar-nmms-2025-full-paper-2p-sagarsir",
        destination: "/blog/bihar-nmms-2025-sat-18p-sagarsir",
        permanent: true,
      },
      {
        source: "/blog/up-nmms-2023-sat-1p-sagarsir",
        destination: "/blog/up-nmms-2025-full-paper-12p-sagarsir",
        permanent: true,
      },
      {
        source: "/blog/bihar-nmms-set-21-sat-3p-sagarsir",
        destination: "/blog/bihar-nmms-set-20-sat-30p-sagarsir",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
