// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     output: 'export',
//     trailingSlash: true, // optional: helps with static routing on some servers
//   };
  
//   export default nextConfig;
  
// next.config.js
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
