import React from 'react'

function CartHome({title,quantity,Icon,backgroundIcon,colorIcon}) {
  return (
    <div className='p-6 shadow bg-white rounded-md flex justify-between items-center'>
        <div>
            <h1 className='text-paragraph'>{title}</h1>
            <strong className='text-gray-500'>{quantity}</strong>
        </div>
        <div className={`p-1.5 ${backgroundIcon} rounded-md`}>
            <Icon className={`w-6 h-6 ${colorIcon}`}/>
        </div>
    </div>
  )
}

export default CartHome