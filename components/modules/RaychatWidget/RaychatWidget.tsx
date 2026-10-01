"use client";
<<<<<<< HEAD
// components/modules/RaychatWidget/RaychatWidget.tsx
import { useEffect } from "react";
import Script from "next/script";

const GOFTINO_ID = "h5fiYw";
const SCRIPT_ID = "goftino-widget";
const FRAME_SELECTORS = ['#goftino_w', 'iframe[src*="goftino"]'];
const FRAME_SELECTOR = FRAME_SELECTORS.join(", ");
const STORY_FRAME_SELECTOR = FRAME_SELECTORS.map(
  (selector) => `body.home-story-open ${selector}`,
).join(", ");
const MOBILE_CATEGORY_FRAME_SELECTOR = FRAME_SELECTORS.map(
  (selector) => `body.mobile-category-menu-open ${selector}`,
).join(", ");
const MODAL_FRAME_SELECTOR = FRAME_SELECTORS.map(
  (selector) => `body.vehicle-selector-open ${selector}`,
).join(", ");
const STYLE_ID = "goftino-widget-offset";
const STORY_HIDE_STYLE_ID = "goftino-widget-story-hide";
const MODAL_STACK_STYLE_ID = "goftino-widget-modal-stack";
const RAYCHAT_SCRIPT_ID = "raychat-widget";
const RAYCHAT_FRAME_ID = "raychat_widget";
const DESKTOP_QUERY = "(min-width: 1024px)";
const MOBILE_BOTTOM_OFFSET = 80;
const DESKTOP_BOTTOM_OFFSET = 16;
const RIGHT_OFFSET = 16;
const GOFTINO_INSTALL_SCRIPT = `
!function(){
  var i="${GOFTINO_ID}",d=document,g=d.createElement("script"),s="https://www.goftino.com/widget/"+i,l=localStorage.getItem("goftino_"+i);
  g.type="text/javascript";
  g.async=!0;
  g.src=l?s+"?o="+l:s;
  d.getElementsByTagName("head")[0].appendChild(g);
}();
`;

const MOBILE_NAV_OFFSET_CSS = `
${FRAME_SELECTOR} {
  right: 16px !important;
  bottom: 16px !important;
}

@media (max-width: 1023px) {
  ${FRAME_SELECTOR} {
    bottom: calc(5rem + env(safe-area-inset-bottom, 0px)) !important;
=======

import { useEffect } from "react";

const RAYCHAT_TOKEN = "4e8b6cdf-894b-4436-834c-05fc26762403";
const SCRIPT_ID = "raychat-widget";
const FRAME_ID = "raychat_widget";
const STYLE_ID = "raychat-widget-offset";
const STORY_HIDE_STYLE_ID = "raychat-widget-story-hide";
const DESKTOP_QUERY = "(min-width: 1024px)";
const MOBILE_BOTTOM = "calc(5rem + env(safe-area-inset-bottom, 0px))";
const DESKTOP_BOTTOM = "16px";

const MOBILE_NAV_OFFSET_CSS = `
@media (max-width: 1023px) {
  #${FRAME_ID}.raychat_frame,
  #${FRAME_ID} {
    bottom: ${MOBILE_BOTTOM} !important;
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  }
}
`;

const STORY_HIDE_CSS = `
<<<<<<< HEAD
${STORY_FRAME_SELECTOR},
${MOBILE_CATEGORY_FRAME_SELECTOR} {
=======
body.home-story-open #${FRAME_ID},
body.home-story-open #${FRAME_ID}.raychat_frame {
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
  opacity: 0 !important;
}
`;

<<<<<<< HEAD
const MODAL_STACK_CSS = `
${MODAL_FRAME_SELECTOR} {
  z-index: 70 !important;
}
`;

type GoftinoWidgetOptions = {
  marginRight?: number;
  marginLeft?: number;
  marginBottom?: number;
=======
type RaychatPosition = {
  top: string;
  right: string;
  bottom: string;
  left: string;
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
};

declare global {
  interface Window {
<<<<<<< HEAD
    Goftino?: {
      setWidget: (options: GoftinoWidgetOptions) => void;
=======
    RAYCHAT_TOKEN?: string;
    Raychat?: {
      setPosition: (position: RaychatPosition) => void;
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    };
  }
}

<<<<<<< HEAD
function removeRaychatWidget() {
  document.getElementById(RAYCHAT_SCRIPT_ID)?.remove();
  document.getElementById(RAYCHAT_FRAME_ID)?.remove();
  document
    .querySelectorAll('script[src*="raychat"], iframe[src*="raychat"]')
    .forEach((element) => element.remove());
}

function removeGoftinoWidget() {
  document.getElementById(SCRIPT_ID)?.remove();
  document
    .querySelectorAll('script[src*="goftino"], iframe[src*="goftino"], #goftino_w')
    .forEach((element) => element.remove());
}

function applyGoftinoPosition(liftAboveMobileNav: boolean) {
  const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;

  if (!window.Goftino?.setWidget) {
    return;
  }

  window.Goftino.setWidget({
    marginRight: RIGHT_OFFSET,
    marginBottom:
      liftAboveMobileNav && !isDesktop
        ? MOBILE_BOTTOM_OFFSET
        : DESKTOP_BOTTOM_OFFSET,
  });
}

export function GoftinoWidget({
=======
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
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
  liftAboveMobileNav = false,
}: {
  liftAboveMobileNav?: boolean;
}) {
  useEffect(() => {
<<<<<<< HEAD
    removeRaychatWidget();
=======
    window.RAYCHAT_TOKEN = RAYCHAT_TOKEN;
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c

    if (liftAboveMobileNav && !document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = MOBILE_NAV_OFFSET_CSS;
      document.head.appendChild(style);
    }

    if (!document.getElementById(STORY_HIDE_STYLE_ID)) {
      const storyHideStyle = document.createElement("style");
      storyHideStyle.id = STORY_HIDE_STYLE_ID;
      storyHideStyle.textContent = STORY_HIDE_CSS;
      document.head.appendChild(storyHideStyle);
    }

<<<<<<< HEAD
    if (!document.getElementById(MODAL_STACK_STYLE_ID)) {
      const modalStackStyle = document.createElement("style");
      modalStackStyle.id = MODAL_STACK_STYLE_ID;
      modalStackStyle.textContent = MODAL_STACK_CSS;
      document.head.appendChild(modalStackStyle);
    }

=======
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
    if (!liftAboveMobileNav) {
      document.getElementById(STYLE_ID)?.remove();
    }

<<<<<<< HEAD
    const onReady = () => {
      applyGoftinoPosition(liftAboveMobileNav);
    };

    window.addEventListener("goftino_ready", onReady);

    const media = window.matchMedia(DESKTOP_QUERY);
    const onViewportChange = () => {
      applyGoftinoPosition(liftAboveMobileNav);
    };
    media.addEventListener("change", onViewportChange);
    onReady();

    return () => {
      window.removeEventListener("goftino_ready", onReady);
      media.removeEventListener("change", onViewportChange);
      removeGoftinoWidget();
    };
  }, [liftAboveMobileNav]);

  return (
    <Script
      id={SCRIPT_ID}
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: GOFTINO_INSTALL_SCRIPT }}
    />
  );
=======
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
>>>>>>> 8d61a879ae8984c69b8b6c5e076ef8d8d968f03c
}
