import React from 'react'
import Header from './Header'
import NavegationFull from './Navegation'
import ContentWrapper from './ContentWrapper'

function LoyoutIntranet({title,description,children,modules,user,roles}) {
  return (
    <>
      <Header title={title} description={description}/>
      <div>
        <NavegationFull listModules={modules} user={user}/>
        <ContentWrapper page={children} roles={roles} user={user}/>
      </div>
    </>
  )
}

export default LoyoutIntranet