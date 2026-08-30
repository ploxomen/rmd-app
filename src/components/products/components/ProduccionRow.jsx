import { useMemo } from "react";
export default function ProduccionRow({
    item,
    onChange,
}) {
    const horas = useMemo(() => {
        const minutos = Number(item.time_origin_minute) || 0;
        return minutos / 60;
    }, [item.time_origin_minute]);

    const conversion = useMemo(() => {
        const minutos = Number(item.time_origin_minute) || 0;
        if (minutos <= 0) {
            return "—";
        }
        return `${minutos} ÷ 60 = ${horas.toFixed(2)} h`;
    }, [item.time_origin_minute, horas]);

    return (
        <tr className="border-b border-slate-200 last:border-b-0">
            {/* SECCIÓN */}
            <td className="px-4 py-4">
                <span className="font-semibold text-slate-800">
                    {item.name}
                </span>
            </td>
            {/* TIEMPO DE ORIGEN */}
            <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={item.time_origin_minute}
                        onChange={(event) =>
                            onChange(
                                item.id,
                                event.target.value
                            )
                        }
                        className="
                            w-full
                            rounded-xl
                            border border-slate-200
                            bg-white
                            px-2 py-1
                            text-base
                            text-slate-800
                            outline-none
                            transition
                            focus:border-emerald-500
                            focus:ring-2
                            focus:ring-emerald-100
                        "
                    />
                    <span className="shrink-0 font-semibold text-slate-500 text-sm">
                        min
                    </span>
                </div>
            </td>
            {/* CONVERSIÓN */}
            <td className="px-4 py-4 text-center">
                <span className="font-bold text-sm text-green-800">
                    {conversion}
                </span>
            </td>

            {/* HORAS ESTÁNDAR */}
            <td className="px-4 py-4">
                <div className="flex items-center gap-3 text-sm">
                    <div
                        className="
                            w-full
                            rounded-xl
                            border border-slate-200
                            bg-green-50
                            px-2 py-1
                            font-bold
                            text-green-800
                        "
                    >
                        {horas.toFixed(2).replace(".", ",")}
                    </div>

                    <span className="shrink-0 font-semibold text-slate-500">
                        h
                    </span>
                </div>
            </td>
        </tr>
    );
}