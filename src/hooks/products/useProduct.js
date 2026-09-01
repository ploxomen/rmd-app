import { useState, useEffect } from 'react';
import { ProductService } from '@/services/ProductService';
import { sweetAlert } from "@/helpers/getAlert";

export const useFormProduct = () => {
  const [product, setProduct] = useState(null);
  const [data, setData] = useState({ categories: [], labels: []});
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
      }finally {
        setLoading(false);
      }
    };
    getData();
  }, []);
  const getProduct = async (idProduct) => {
    try {
      const resp = await ProductService.getProduct(idProduct);
      if (resp.error) {
        setError(resp.message);
        return false;
      }
      setProduct(resp.data.product);
      dispatch({
        type: TYPES_PRODUCTS.GET_PRODUCT,
        payload: {
          product: resp.data.data.product,
          url: resp.data.data.url,
          subcategories: resp.data.data.subcategories,
          categorieId: resp.data.data.categorieId,
          editStock: resp.data.data.updateStockInitial,
        },
      });
      handleOpenModal();
    } catch (error) {
      dispatch({ type: TYPES_PRODUCTS.NO_PRODUCTS });
      console.error(error);
    }
  }
  return { ...data, loading, error };
}