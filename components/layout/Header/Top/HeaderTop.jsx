import React, { useEffect, useState } from "react";
import HeaderLogo from "./HeaderLogo";
import HeaderSearch from "./HeaderSearch";
import HeaderSetting from "./HeaderSetting";
import OffcanvasRight from "../MegaMenu/OffcanvasRight";
import { getMegaMenu } from "@/src/services/category/category.service";

export default function HeaderTop() {
  
  const [isOpen, setIsOpen] = useState(false);


  const [menu, setMenu] = useState([]);
  
    useEffect(() => {
      async function load() {
        const data = await getMegaMenu();
  
        setMenu(data);
      }
  
      load();
    }, []);
  return (
    <div className="grid place-items-center gap-3 grid-cols-12">
      {/* respnsive menu  */}

      <div className="lg:hidden col-span-4 w-full">
        <button onClick={() => setIsOpen(true)} className="px-4 py-2">
          <i className="fas fa-bars-staggered dark:text-white"></i>
        </button>
        <OffcanvasRight
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          menu={menu}
        />
      </div>

      {/* logo  */}
      <HeaderLogo />

      {/* search and filter  */}
      <HeaderSearch />

      {/* login and basket and favorite and dark mode  */}
      <HeaderSetting />
    </div>
  );
}
