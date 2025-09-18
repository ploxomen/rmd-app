import Link from "next/link";
import React from "react";
import HeroIcons from "./HeroIcons";

function NavModule({ module_url, module_icon, module_title, currentRoute }) {
  return (
    <li className="relative">
      <Link
        href={`/intranet${module_url}`}
        className={`${
          currentRoute == "/intranet" + module_url
            ? "bg-green-200 text-green-600"
            : "bg-white text-information"
        } transition-colors ease-in-out duration-300 hover:bg-gray-100 rounded-lg text-sm mx-2 px-4 py-2 flex items-center gap-2`}
      >
        <HeroIcons name={module_icon} />
        <span className="text-sm font-normal tracking-[0.15px]">
          {module_title}
        </span>
      </Link>
      {currentRoute == "/intranet" + module_url && (
        <div className="absolute bg-green-500 h-full right-0 top-0 w-1 "></div>
      )}
    </li>
  );
}

export default NavModule;
