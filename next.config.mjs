/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        unoptimized:true,
        remotePatterns:[
            {
                protocol:'http',
                hostname:'127.0.0.1',
                port:'8000',
                pathname:'/storage/**'
            },
            {
                protocol:'https',
                hostname:'apirmd.herramientaswp.com',
                pathname:'/storage/**'
            }
        ]
    }
};

export default nextConfig;
