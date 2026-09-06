"use client";

import { useEffect } from "react";

const RAYCHAT_TOKEN = "4e8b6cdf-894b-4436-834c-05fc26762403";
const SCRIPT_ID = "raychat-widget";
const FRAME_ID = "raychat_widget";
const STYLE_ID = "raychat-widget-offset";
const DESKTOP_QUERY = "(min-width: 1024px)";
const MOBILE_BOTTOM = "calc(5rem + env(safe-area-inset-bottom, 0px))";
const DESKTOP_BOTTOM = "16px";

const MOBILE_NAV_OFFSET_CSS = `
@media (max-width: 1023px) {
  #${FRAME_ID}.raychat_frame,
  #${FRAME_ID} {
    bottom: ${MOBILE_BOTTOM} !important;
  }
}
`;

type RaychatPosition = {
  top: string;
  right: string;
  bottom: string;
  left: string;
};

declare global {
  interface Window {
    RAYCHAT_TOKEN?: string;
    Raychat?: {
      setPosition: (position: RaychatPosition) => void;
    };
  }
}

function isLauncherFrame(frame: HTMLElement) {
  const height = frame.offsetHeight || Number.parseInt(frame.style.height, 10) || 0;
  const width = frame.offsetWidth || Number.parseInt(frame.style.width, 10) || 0;
  return height > 0 && height <= 160 && width <= 160;
}

function applyRaychatPosition() {
  const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
  const frame = document.getElementById(FRAME_ID);

  if (frame instanceof HTMLElement && !isDesktop && isLauncherFrame(frame)) {
    frame.style.setProperty("bottom", MOBILE_BOTTOM, "important");
  }

  if (!window.Raychat?.setPosition) {
    return;
  }

  window.Raychat.setPosition({
    top: "auto",
    left: "auto",
    right: "16px",
    bottom: isDesktop ? DESKTOP_BOTTOM : MOBILE_BOTTOM,
  });
}

export function RaychatWidget({
  liftAboveMobileNav = false,
}: {
  liftAboveMobileNav?: boolean;
}) {
  useEffect(() => {
    window.RAYCHAT_TOKEN = RAYCHAT_TOKEN;

    if (liftAboveMobileNav && !document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = MOBILE_NAV_OFFSET_CSS;
      document.head.appendChild(style);
    }

    if (!liftAboveMobileNav) {
      document.getElementById(STYLE_ID)?.remove();
    }

    let frameObserver: MutationObserver | null = null;

    const onReady = () => {
      if (!liftAboveMobileNav) {
        return;
      }
      applyRaychatPosition();
    };

    const watchFrame = (frame: HTMLElement) => {
      frameObserver?.disconnect();
      frameObserver = new MutationObserver(() => {
        if (liftAboveMobileNav) {
          applyRaychatPosition();
        }
      });
      frameObserver.observe(frame, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });
      applyRaychatPosition();
    };

    const existingFrame = document.getElementById(FRAME_ID);
    const bodyObserver = new MutationObserver(() => {
      const frame = document.getElementById(FRAME_ID);
      if (frame instanceof HTMLElement) {
        watchFrame(frame);
        bodyObserver.disconnect();
      }
    });

    if (existingFrame instanceof HTMLElement) {
      watchFrame(existingFrame);
    } else {
      bodyObserver.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("raychat_ready", onReady);

    const media = window.matchMedia(DESKTOP_QUERY);
    const onViewportChange = () => {
      if (liftAboveMobileNav) {
        applyRaychatPosition();
      }
    };
    media.addEventListener("change", onViewportChange);

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://widget-react.raychat.io/install/widget.js";
      script.async = true;
      document.head.appendChild(script);
    } else {
      onReady();
    }

    return () => {
      window.removeEventListener("raychat_ready", onReady);
      media.removeEventListener("change", onViewportChange);
      bodyObserver.disconnect();
      frameObserver?.disconnect();
    };
  }, [liftAboveMobileNav]);

  return null;
}
