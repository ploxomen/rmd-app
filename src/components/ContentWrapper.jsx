import React from 'react'
import HeaderIntranet from './HeaderIntranet'
import MainIntranet from './MainIntranet'

function ContentWrapper({page,roles,user}) {
  return (
    <div className='bg-layout pl-[260px] h-dvh py-4' >
        <HeaderIntranet dataRoles={roles} user={user}/>
        <MainIntranet page={page}/>
    </div>
  )
}

export default ContentWrapper