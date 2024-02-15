import Image from 'next/image'
import React from 'react'
function BanerModule({imageBanner,title}) {
  return (
    <div className="mb-4">
        <div className="m-auto max-w-[500px]">
            <Image alt="Descripción de imagen" priority className='block m-auto' src={imageBanner} width={124} height={124} />
            <h1 className="text-center text-slate-900 my-4 text-3xl font-medium">{title}</h1>
        </div>
    </div>
  )
}

export default BanerModule