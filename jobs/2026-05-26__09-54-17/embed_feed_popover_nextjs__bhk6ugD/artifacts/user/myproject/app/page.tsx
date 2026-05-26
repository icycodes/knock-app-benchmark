"use client";

import { useState, useRef } from "react";
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react";

// Import the Knock stylesheet
import "@knocklabs/react/dist/index.css";

const KNOCK_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY!;
const KNOCK_FEED_CHANNEL_ID = process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID!;
const RUN_ID = process.env.NEXT_PUBLIC_ZEALT_RUN_ID!;
const USER_ID = `popover-user-${RUN_ID}`;

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <KnockProvider apiKey={KNOCK_PUBLIC_API_KEY} userId={USER_ID}>
        <KnockFeedProvider feedId={KNOCK_FEED_CHANNEL_ID}>
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">Knock Popover Demo</h1>
            <div className="relative">
              <NotificationIconButton
                ref={buttonRef}
                onClick={(e) => setIsVisible(!isVisible)}
              />
              <NotificationFeedPopover
                buttonRef={buttonRef}
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
              />
            </div>
          </div>
        </KnockFeedProvider>
      </KnockProvider>
    </main>
  );
}
