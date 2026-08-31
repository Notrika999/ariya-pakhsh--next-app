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
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5547.617139995333!2d53.13696503930926!3d36.56069567453188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sfr!4v1788178274660!5m2!1sen!2sfr"
          className="h-full w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
