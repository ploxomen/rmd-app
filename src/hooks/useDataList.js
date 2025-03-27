import apiAxios from '@/axios';
import { useEffect, useRef, useState } from 'react';
import { getCookie } from '@/helpers/getCookie';
import { useRouter } from 'next/navigation';
import { sweetAlert } from '@/helpers/getAlert';

export const useDataList = ({
  url = '',
  currentPage = 1,
  quantityRowData = 25,
  params = {},
}) => {
  const headers = getCookie();
  const timerRef = useRef(null);
  const route = useRouter();
  const [ loading, setLoading ] = useState(false);
  const [ filters, setFilters ] = useState({
    show: quantityRowData,
    page: currentPage,
    ...params,
  });
  const [ dataTotal, setDataTotal ] = useState(0);
  const [ data, setData ] = useState([]);
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const resp = await apiAxios.get(url, {
          headers,
          params: filters,
        });
        if (resp.data.redirect !== null) {
          return route.replace(resp.data.redirect);
        }
        setDataTotal(resp.data.total);
        setData(resp.data.data);
      } catch (error) {
        sweetAlert({
          title: 'Error',
          text: 'Error al obtener los datos',
          icon: 'error',
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [filters]);
  const changeFilter = (key, value) => {
    setFilters((val) => ({ ...val, [key]: value }));
  };
  const serchInfomation = (value) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      changeFilter('search', value);
    }, 500);
  };
  return { loading, filters ,dataTotal, data, serchInfomation, changeFilter };
};
