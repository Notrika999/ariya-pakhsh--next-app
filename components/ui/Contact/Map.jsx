// components/ui/Contact/Map.jsx
import React from "react";

import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
export default function Map() {
  return (
    <div className="bg-white dark:bg-custom-dark mt-6 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <TitleAfter title={"موقعیت ما روی نقشه"} />
      </div>

      <div className="h-[450px] w-full overflow-hidden rounded-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3204.6401899455964!2d53.120506616776986!3d36.562787696132276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f853e6f91b80863%3A0x292fdd1805ec199c!2zSDQ2OStHUDnYjCDYs9in2LHbjNiMINin2LPYqtin2YYg2YXYp9iy2YbYr9ix2KfZhtiMINin24zYsdin2YY!5e0!3m2!1sfa!2s!4v1784608927581!5m2!1sfa!2s"
          className="h-full w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
