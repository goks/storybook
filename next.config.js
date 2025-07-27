/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
<<<<<<< HEAD
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    dangerouslyAllowSVG: true, // temporarily allow SVG images Delete in production
=======
    ],
>>>>>>> 3adfff723705dffdb8be6b29a862d1ac03346e1b
  },
}

module.exports = nextConfig 