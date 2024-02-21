import React, { useRef } from 'react'
import HeaderIntranet from './HeaderIntranet'
import MainIntranet from './MainIntranet'

function ContentWrapper({page,roles,user,menu}) {
  const refMain = useRef(null);
  const handleMenu = (e) => {
    if(document.documentElement.clientWidth < 768){
      menu.current.classList.toggle('menu-content')
    }else{
      menu.current.classList.toggle('menu-content-windows')
      refMain.current.classList.toggle('main-content-windows')
    }
  }
  return (
    <div className='bg-layout md:pl-[260px] h-dvh py-4' ref={refMain}>
        <HeaderIntranet dataRoles={roles} user={user} handleMenu={handleMenu}/>
        <MainIntranet page={page}/>
    </div>
  )
}

export default ContentWrapper