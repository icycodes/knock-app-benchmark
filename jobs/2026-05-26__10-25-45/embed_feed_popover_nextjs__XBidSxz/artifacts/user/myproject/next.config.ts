import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_ZEALT_RUN_ID: process.env.ZEALT_RUN_ID,
    NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY: process.env.KNOCK_PUBLIC_API_TOKEN,
    NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID: process.env.KNOCK_INAPP_FEED_CHANNEL_ID,
  },
};

export default nextConfig;
