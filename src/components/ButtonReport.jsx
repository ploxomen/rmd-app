import React from "react";

export default function ButtonReport({
  imgUrl = "",
  title = "",
  description = "",
  onClick = () => {},
}) {
  return (
    <button
      className="p-4 border-2 rounded-md text-center block w-full max-w-80 transition-all hover:border-green-700"
      onClick={onClick}
    >
      <img
        src={imgUrl}
        alt="Referencia al boton reporte"
        className="w-32 block m-auto"
      />
      <div className="mt-3">
        <span className="font-bold">{title}</span>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </button>
  );
}
