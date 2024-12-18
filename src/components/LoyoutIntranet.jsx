import React, { useRef } from 'react'
import Header from './Header'
import NavegationFull from './NavegationFull'
import ContentWrapper from './ContentWrapper'

function LoyoutIntranet({title,description,children,modules,user,roles}) {
  const refMenu = useRef(null);
  const handleCloseMenu = () => {
    if(document.documentElement.clientWidth < 768 && refMenu.current.classList.contains('menu-content')){
      refMenu.current.classList.remove('menu-content')
    }
  }
  return (
    <>
      <Header title={title} description={description}/>
      <NavegationFull listModules={modules} user={user} closeMenu={handleCloseMenu} ref={refMenu}/>
      <ContentWrapper page={children} roles={roles} user={user} menu={refMenu}/>
    </>
  )
}

export default LoyoutIntranet