import { ArrowDownCircleIcon, ArrowLeftEndOnRectangleIcon, ArrowLeftStartOnRectangleIcon, ArrowsRightLeftIcon, Bars3Icon, ChevronDownIcon, CubeIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import userLogo from '@/img/logo.jpg';
import Link from 'next/link';

function HeaderIntranet({dataRoles}) {
  const handleClickRoles = (e) => {
    e.stopPropagation();
    const menu = document.querySelector("#box-menu");
    menu.hidden =  !menu.hidden;
  }
  useEffect(() => {
    const handleBodyClick = () => {
      const menu = document.querySelector("#box-menu");
      if(!menu.hidden){
        menu.hidden = true;
      }
    };
    document.body.addEventListener('click', handleBodyClick);
    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, []);
  return (
    <header className='px-6 mb-2'>
      <div className='bg-white px-4 py-2 rounded-md shadow flex justify-between items-center relative'>
        <button type='button' className='p-2 rounded-md text-placeholder hover:bg-slate-100 h-full focus:bg-slate-200'>
          <Bars3Icon className='w-7 h-7'/>
        </button>
        <button type='button' className='p-2 bg-white text-placeholder rounded-md' onClick={handleClickRoles}>
          <div className='flex gap-1 items-center'>
            <Image src={userLogo} width={30} height={30}/>
            <ChevronDownIcon className='w-4 h-4'/>
          </div>
        </button>
        <div className='w-40 bg-white border pt-3 rounded-md absolute right-10 top-14' id='box-menu' onClick={e => e.stopPropagation()} hidden>
              <ul className='flex flex-col gap-0'>
                <li className='text-left px-3'>
                  <span className='font-semibold text-sm'>Roles</span>
                </li>
                {
                  dataRoles.map(role => (
                    <li className='px-3 py-2 hover:bg-green-200' key={role.id}>
                      <Link className='text-sm flex gap-1' href={`/intranet/role/${role.id}`}>
                        <span>{role.rol_name}</span>
                      </Link>
                      
                    </li>
  
                  ))
                }
                <li className='px-3 py-2 hover:bg-green-200'>
                  <a href="" className='text-sm flex gap-1'>
                    <ArrowLeftEndOnRectangleIcon className='w-5 h-5'/>
                    <span>Cerrar sesión</span>
                  </a>
                </li>
              </ul>
        </div>
      </div>
    </header>
  )
}

export default HeaderIntranet