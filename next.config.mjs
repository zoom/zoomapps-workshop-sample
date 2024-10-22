/** @type {import('next').NextConfig} */
const nextConfig = {
   async headers() {
       return [
           {
               source: '/',
               headers: [
                   {
                       key: 'Strict-Transport-Security',
                       value: 'max-age=31536000;'
                   },
                   {
                       key: "X-Content-Type-Options",
                       value: "nosniff"
                   },
                   {
                       key: "Content-Security-Policy",
                       value: "default-src 'self' 'unsafe-inline' 'unsafe-eval';"
                   },
                   {
                       key: "Referrer-Policy",
                       value: "same-origin"
                   }
               ]
           }
       ];
   }
};

export default nextConfig;
