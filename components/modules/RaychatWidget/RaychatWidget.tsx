"use client";
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
  }
}
`;

const STORY_HIDE_CSS = `
${STORY_FRAME_SELECTOR},
${MOBILE_CATEGORY_FRAME_SELECTOR} {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
  opacity: 0 !important;
}
`;

const MODAL_STACK_CSS = `
${MODAL_FRAME_SELECTOR} {
  z-index: 70 !important;
}
`;

type GoftinoWidgetOptions = {
  marginRight?: number;
  marginLeft?: number;
  marginBottom?: number;
};

declare global {
  interface Window {
    Goftino?: {
      setWidget: (options: GoftinoWidgetOptions) => void;
    };
  }
}

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
  liftAboveMobileNav = false,
}: {
  liftAboveMobileNav?: boolean;
}) {
  useEffect(() => {
    removeRaychatWidget();

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

    if (!document.getElementById(MODAL_STACK_STYLE_ID)) {
      const modalStackStyle = document.createElement("style");
      modalStackStyle.id = MODAL_STACK_STYLE_ID;
      modalStackStyle.textContent = MODAL_STACK_CSS;
      document.head.appendChild(modalStackStyle);
    }

    if (!liftAboveMobileNav) {
      document.getElementById(STYLE_ID)?.remove();
    }

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
}
