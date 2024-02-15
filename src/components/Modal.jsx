import { BookmarkSquareIcon, XCircleIcon } from '@heroicons/react/24/solid'
import React from 'react'

function Modal({title,children,status,handleCloseModal,onSave,textSuccess = "Guardar",textDanger="Cerrar", maxWidth="max-w-lg"}) {
  return (
    <div className='fixed z-20 top-0 left-0 w-full h-dvh bg-modal' hidden={status}>
        <div className='px-4 py-6 w-full h-full flex justify-center items-start overflow-y-auto'>
            <div className={`py-4 px-6 border border-gray-300 bg-white w-full ${maxWidth} rounded-lg`}>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-medium'>{title}</h2>
                </div>
                <div className='mb-4'>
                    {children}
                </div>
                <div className='text-end flex gap-2 items-center justify-end'>
                    <button className='p-2 bg-indigo-500 rounded-md transition-colors hover:bg-indigo-400 focus:bg-indigo-600 text-white font-semibold text-sm' onClick={onSave}>
                        <div className='flex justify-center items-center gap-1'>
                            <BookmarkSquareIcon className='w-5 h-6'/>
                            <span>{textSuccess}</span>
                        </div>
                    </button>
                    <button className='p-2 bg-rose-500 rounded-md transition-colors hover:bg-rose-400 focus:bg-rose-600 text-white font-semibold text-sm' onClick={handleCloseModal}>
                        <div className='flex justify-center items-center gap-1'>
                            <XCircleIcon className='w-5 h-6'/>
                            <span>{textDanger}</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Modal