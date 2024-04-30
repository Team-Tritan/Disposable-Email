const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://temp-mail-api.tritan.gg/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
