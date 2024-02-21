import Badge from "@/components/Badge";

export const statusQuotations = [
    {
        value:"0",
        label:"Anulado",
        element:<Badge text="Anulado" colors="text-red-500 bg-red-100" />
    },
    {
        value:"1",
        label:"Generado",
        element:<Badge text="Generado" colors="text-green-500 bg-green-100" />
    },
    {
        value:"2",
        label:"En pedido",
        element:<Badge text="En pedido" colors="text-blue-500 bg-blue-100" />
    }
]
export const statusOrders = [
    {
        value:"0",
        label:"Anulado",
        element:<Badge text="Anulado" colors="text-red-500 bg-red-100" />
    },
    {
        value:"1",
        label:"Generado",
        element:<Badge text="Generado" colors="text-green-500 bg-green-100" />
    },
]