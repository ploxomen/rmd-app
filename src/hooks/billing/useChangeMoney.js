import apiAxios from "@/axios";
import { useState } from "react";
import { useModal } from "../useModal";
import { sweetAlert } from "@/helpers/getAlert";

const INITIAL_FORM = {
  id: null,
  change_attempts: 0,
  change_day: "",
  change_soles: "",
  change_user: null,
};
export const useChangeMoney = (reloadPage = () => {}) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const { modal, handleOpenModal, handleCloseModal } = useModal("hidden");
  const deleteChangeMoney = async (date) => {
    try {
      const { data } = await apiAxios.delete(`/money/change/${date}`);
      if (data.alert) {
        return sweetAlert({
          title: "Alerta",
          text: data.alert,
          icon: "warning",
        });
      }
      setForm(INITIAL_FORM);
      handleCloseModal();
      sweetAlert({ title: "Alerta", text: data.message, icon: "success" });
    } catch (error) {
      console.error(error);
    }
  };
  const handleOpenModalChangeMoney = () => {
    setForm(INITIAL_FORM);
    handleOpenModal();
  };
  const handleChangeValueForm = (e) => {
    setForm((value) => ({ ...value, [e.target.name]: e.target.value }));
  };
  const handleCloseModalChangeMoney = () => {
    setForm(INITIAL_FORM);
    handleCloseModal();
  };
  const saveChangeMoney = async (event) => {
    event.preventDefault();
    try {
      const { data } = form.id
        ? await apiAxios.put(`/money/change/${form.change_day}`, form)
        : await apiAxios.post("/money/change", form);
      if (data.alert) {
        return sweetAlert({
          title: "Alerta",
          text: data.alert,
          icon: "warning",
        });
      }
      setForm(INITIAL_FORM);
      reloadPage()
      handleCloseModal();
      sweetAlert({ title: "Alerta", text: data.message, icon: "success" });
    } catch (error) {
      console.error(error);
    }
  };
  const getChangeMoney = async (date) => {
    try {
      const { data } = await apiAxios.get(`/money/change/${date}`);
      handleOpenModal();
      setForm(data.value);
    } catch (error) {
      console.error(error);
    }
  };
  return {
    modal,
    form,
    getChangeMoney,
    handleOpenModalChangeMoney,
    saveChangeMoney,
    deleteChangeMoney,
    handleChangeValueForm,
    handleCloseModalChangeMoney,
  };
};
