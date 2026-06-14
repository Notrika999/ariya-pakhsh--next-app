import React from "react";
import ImagesCropper from "./ImagesCropperPage";

function page() {
  return (
    <div className="flex justify-center">
      <ImagesCropper classWH={"w-200 h-200"} />
    </div>
  );
}

export default page;
