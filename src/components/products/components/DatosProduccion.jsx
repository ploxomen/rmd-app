import { useEffect, useState } from "react";
import ProduccionRow from "./ProduccionRow";

export default function DatosProduccion({
    seccionesLabels = [],
    onChange = () => {},
}) {
    const [secciones, setSecciones] = useState(seccionesLabels);
    useEffect(() => {
        setSecciones(seccionesLabels);
    }, [seccionesLabels]);
    const actualizarTiempo = (productLabelId, value) => {
        const nuevasSecciones = secciones.map((item) => {
            if (item.id !== productLabelId) {
                return item;
            }
            return {
                ...item,
                time_origin_minute: value,
                time_origin_hours: (value / 60).toFixed(2) || "",

            };
        });
        setSecciones(nuevasSecciones);
        onChange(value => ({...value, list_labels: nuevasSecciones}))
    };
    return (
        <section
            className="
                rounded-3xl
                border border-slate-200
                bg-slate-50
                p-6
                shadow-sm
            "
        >
            <div
                className="
                    mb-6
                    rounded-2xl
                    border border-slate-200
                    bg-white
                    px-6 py-5
                "
            >
                <p className="text-sm text-slate-600">
                    <strong className="text-slate-700">
                        Cómo funciona:
                    </strong>{" "}
                    el tiempo de origen se registra en minutos. El sistema
                    calcula automáticamente las{" "}
                    <strong className="text-slate-700">
                        horas estándar de ficha
                    </strong>{" "}
                    dividiendo entre 60. La Orden de Producción usa esas horas
                    y las multiplica por la cantidad del pedido.
                </p>
            </div>
            {/* TABLA */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead>
                            <tr className="bg-green-50">
                                <th
                                    className="
                                        border-b border-r border-slate-200
                                        px-5 py-4
                                        text-left
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-green-800
                                    "
                                >
                                    Sección
                                </th>
                                <th
                                    className="
                                        border-b border-r border-slate-200
                                        px-5 py-4
                                        text-left
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-green-800
                                    "
                                >
                                    Tiempo de origen
                                </th>
                                <th
                                    className="
                                        border-b border-r border-slate-200
                                        px-5 py-4
                                        text-center
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-green-800
                                    "
                                >
                                    Conversión
                                </th>
                                <th
                                    className="
                                        border-b border-slate-200
                                        px-5 py-4
                                        text-left
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-green-800
                                    "
                                >
                                    Horas estándar ficha
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {secciones.map((item) => (
                                <ProduccionRow
                                    key={item.id}
                                    item={item}
                                    onChange={actualizarTiempo}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            
        </section>
    );
}