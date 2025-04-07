import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

function Logout() {
    const router = useRouter();
    useEffect(()=>{
        document.cookie = 'authenticate=;Max-Age=0;path=/';
        router.replace('/login');
    },[])
  return (
    <div>Cerrando sesión</div>
  )
}

export default Logout