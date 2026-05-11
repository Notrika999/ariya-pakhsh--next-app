import React from "react";

import TitleAfter from "@/components/modules/TitleAfter/TitleAfter";
export default function Map() {
  return (
    <div className="bg-white dark:bg-custom-dark mt-6 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <TitleAfter title={"موقعیت ما روی نقشه"} />
      </div>

      <div className="h-[450px] bg-gray-300 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.676621075215!2d51.38882131526982!3d35.7323439801875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQzJzU2LjQiTiA1McKwMjMnMjMuNiJF!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
          className="w-full h-full border-0"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
