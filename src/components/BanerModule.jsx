import React from 'react'
function BanerModule({imageBanner,title}) {
  return (
    <div className="mb-4 min-h-52 flex items-center" style={{backgroundImage:`url("${imageBanner}")`,backgroundSize:'cover',backgroundRepeat:'no-repeat',backgroundPosition:'center'}}>
        <div className="m-auto max-w-[600px]">
            <h1 className="text-center text-white my-4 text-3xl font-medium">{title}</h1>
        </div>
    </div>
  )
}

export default BanerModule