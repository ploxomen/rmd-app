import apiAxios from '@/axios';
import React from 'react';

export async function getServerSideProps(context) {
  const headers = {
    Cookie: context.req.headers.cookie,
    Origin: process.env.APP_URL,
  };
  try {
    const resp = await apiAxios.get('/user/change-role/' + role, { headers });
    if (resp.data.redirect !== null) {
      return {
        redirect: {
          destination: resp.data.redirect,
          permanent: false,
        },
      };
    }
  } catch {
    return {
      props: {},
    };
  }
}
function Data() {
  // window.location.href = '/account/login';
  return <>ACCESO DENEGADO</>;
}

export default Data;
