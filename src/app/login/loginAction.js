'use client';
import api from '@/libs/axios';
import { useState } from 'react';
export function useLogin(username, password) {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      await api.get(`/sanctum/csrf-cookie`);
      await api.post(
        `/login`,
        {
          username,
          password,
        }
      );
      window.location.href = process.env.NEXT_PUBLIC_URI_LOGIN;
    } catch (error) {
      if (error.response.status === 401) {
        setAlert(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return { handleSubmit, loading, alert };
}
