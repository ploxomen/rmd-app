import apiAxios from '@/axios';
import { useEffect, useState } from 'react';
import { getCookie } from '@/helpers/getCookie';
import { useModal } from './useModal';

const initialMoneyChange = {
  money: 0,
  attempt: 0,
};
export const useMoney = () => {
  const [moneyChange, setMoneyChange] = useState(initialMoneyChange);
  const { modal, handleOpenModal, handleCloseModal } = useModal('hidden');
  const headers = getCookie();
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await apiAxios.get('/money/change', { headers });
        setMoneyChange({
          attempt: data.value.change_attempts,
          money: data.value.change_soles,
        });
        !data.value.change_soles && handleOpenModal();
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, []);
  return { moneyChange , modal, setMoneyChange, handleCloseModal, handleOpenModal};
};
