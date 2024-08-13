import React from 'react';
import { useRouter } from 'next/router';
import '@/app/globals.css';
import useIdleLogout from '@/hooks/useIdleLogout';

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

  // No aplicar el hook en la página de login
  const isLoginPage = router.pathname === '/login';

  if (!isLoginPage) {
    useIdleLogout();
  }

  return <Component {...pageProps} />;
};

export default MyApp;