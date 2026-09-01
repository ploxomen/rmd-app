import { useState, useEffect } from "react";
import { ProductService } from "@/services/ProductService";
import { sweetAlert } from "@/helpers/getAlert";
import { useModal } from "../useModal";
export const useFormProduct = () => {
  const [product, setProduct] = useState({});
  const { modal, handleOpenModal, handleCloseModal } = useModal("hidden");
  const [data, setData] = useState({ categories: [], labels: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const [categories, labels] = await Promise.all([
          ProductService.getCategories(),
          ProductService.getLabels(),
        ]);
        setData({ categories, labels });
      } catch (error) {
        setError(error.message);
        sweetAlert({
          title: "Error",
          text: "Error al obtener los datos",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);
  const getProduct = async (idProduct) => {
    setLoading(true);
    try {
      const resp = await ProductService.getProduct(idProduct);
      if (resp.error) {
        setError(resp.message);
        return false;
      }
      setProduct({
        ...resp.data.product,
        url: resp.data.url,
        subcategories: resp.data.subcategories,
        categorieId: resp.data.categorieId,
        editStock: resp.data.updateStockInitial,
      });
      handleOpenModal();
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const saveProduct = async (data) => {
    try {
      const resp = await ProductService.saveProduct(data);
      if (resp.error) {
        if (resp.message) {
          throw new Error(resp.message);
        }
        resp.data.forEach((error) => {
          sweetAlert({ title: "Alerta", text: error, icon: "warning" });
        });
        return false;
      }
      handleCloseModal();
      sweetAlert({
        title: "Exitoso",
        text: resp.message,
        icon: "success",
      });
      return { id: data.get("id") };
    } catch (error) {
      console.error(error);
      sweetAlert({
        title: "Error",
        text: error || "Error al guardar el producto",
        icon: "error",
      });
      return false;
    }
  };
  return {
    ...data,
    loading,
    error,
    product,
    handleCloseModal,
    getProduct,
    modal,
    saveProduct,
  };
};
