import React from 'react'
import Header from './Header'
import NavegationFull from './Navegation'
import ContentWrapper from './ContentWrapper'

function LoyoutIntranet({title,description,children,modules,names,roles}) {
  return (
    <>
      <Header title={title} description={description}/>
      <div>
        <NavegationFull listModules={modules} names={names}/>
        <ContentWrapper page={children} roles={roles}/>
      </div>
    </>
  )
}

export default LoyoutIntranet