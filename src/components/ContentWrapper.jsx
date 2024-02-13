import React from 'react'
import HeaderIntranet from './HeaderIntranet'
import MainIntranet from './MainIntranet'

function ContentWrapper({page,roles}) {
  return (
    <div className='bg-layout pl-[260px] h-dvh py-4' >
        <HeaderIntranet dataRoles={roles}/>
        <MainIntranet page={page}/>
    </div>
  )
}

export default ContentWrapper