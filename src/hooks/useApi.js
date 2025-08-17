import apiAxios from "@/axios";
import { useEffect, useState } from "react";

export function useApi(resource){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState([]);

    useEffect(() => {
        setLoading(true);
        apiAxios.get(resource).then(response => {
            setData(response.data);
        }).finally(() => setLoading(false));        
    },[resource])
    return {data,loading};
}