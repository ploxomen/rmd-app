import Link from "next/link";
import React from "react";

export default function CartProductProgress({urlImg = '', altImg = '', title = '', description = '', url = ""}) {
  return (
    <Link href={url} className="p-4 border-2 rounded-md text-center block w-full max-w-80 transition-all hover:border-green-700">
      <img
        src={urlImg}
        alt={altImg}
        className="w-32 block m-auto"
      />
      <div className="mt-3">
        <span className="font-bold">{title}</span>
        <p className="text-xs text-slate-500">
          {description}
        </p>
      </div>
    </Link>
  );
}
