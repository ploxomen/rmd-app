import apiAxios from '@/axios';
export const verifUser = async (context, currentRoute) => {
  const headers = {
    Cookie: context.req.headers.cookie,
    Origin: process.env.APP_URL,
  };
  let dataModules = [];
  let dataRoles = [];
  let dataUser = {
    user_name: '',
    user_last_name: '',
    user_avatar: null,
  };
  try {
    const req = await apiAxios.get('/user/modules-roles', {
      headers,
      params: { url: currentRoute },
    });
    if (req.data && req.data.redirect !== null) {
      return {
        redirect: {
          destination: req.data.redirect,
          permanent: false,
        },
      };
    }
    dataModules = req.data.modules;
    dataRoles = req.data.roles;
    dataUser = req.data.user;
    return {
      props: {
        dataModules,
        dataRoles,
        dataUser,
      },
    };
  } catch {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
    // return {
    //   props: {
    //     dataModules,
    //     dataRoles,
    //     dataUser,
    //   },
    // };
  }
};
