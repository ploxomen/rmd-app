import { ArrowLeftEndOnRectangleIcon, Bars3Icon, ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import React, { useEffect } from 'react'
import Link from 'next/link';
import { getCookie } from '@/helpers/getCookie2';
import apiAxios from '@/axios';
import { useRouter } from 'next/navigation';
function HeaderIntranet({dataRoles,user}) {
  const route = useRouter();
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
  const handleCloseSession = async () => {
    if(!window.confirm('¿Deseas cerrar sesión?')){
      return
    }
    const cookie = getCookie('authenticate');
    if(cookie){
      try {
        const headers = {
          'Authorization':'Bearer ' + JSON.parse(cookie).access_token
        }
        const resp = await apiAxios.delete('/user/logout',{headers});
        if(!resp.error){
          document.cookie = 'authenticate=;Max-Age=0;path=/';  
        }
        return route.replace('/account/login');
      } catch (error) {
        console.error(error);
      }
    }
  }
  return (
    <header className='px-6 mb-2'>
      <div className='bg-white px-4 py-2 rounded-md shadow flex justify-between items-center relative'>
        <button type='button' className='p-2 rounded-md text-placeholder hover:bg-slate-100 h-full focus:bg-slate-200'>
          <Bars3Icon className='w-7 h-7'/>
        </button>
        <button type='button' className='p-2 bg-white text-placeholder rounded-md' onClick={handleClickRoles}>
          <div className='flex gap-1 items-center'>
            <Image src={user.user_avatar ? process.env.NEXT_PUBLIC_API_URL + '/' + user.user_avatar : "/img/user.png"} quality={100} width={30} height={30}/>
            <ChevronDownIcon className='w-4 h-4'/>
          </div>
        </button>
        <div className='w-40 bg-white border pt-3 rounded-md absolute right-10 top-14' id='box-menu' hidden>
              <ul className='flex flex-col gap-0'>
                <li className='text-left px-3'>
                  <span className='font-semibold text-sm'>Roles</span>
                </li>
                {
                  dataRoles.map(role => (
                    <li className={`px-3 py-2 ${role.pivot.active ? 'bg-green-500' : 'hover:bg-gray-100'}`} key={role.id}>
                      <Link className={`text-sm flex gap-1 ${role.pivot.active ? 'text-white' : 'text-gray-600'}`} href={`/intranet/role/${role.id}`}>
                        <span>{role.rol_name}</span>
                      </Link>
                    </li>
                  ))
                }
                <li className='px-3 py-2 hover:bg-green-200'>
                  <a href="/intranet/my-account" className='text-sm flex gap-1 text-gray-600'>
                    <UserCircleIcon className='w-5 h-5'/>
                    <span>Mi perfil</span>
                  </a>
                </li>
                <li className='px-3 py-2 hover:bg-green-200'>
                  <button type="button" className='text-sm flex gap-1 text-gray-600' onClick={handleCloseSession}>
                    <ArrowLeftEndOnRectangleIcon className='w-5 h-5'/>
                    <span>Cerrar sesión</span>
                  </button>
                </li>
              </ul>
        </div>
      </div>
    </header>
  )
}

export default HeaderIntranet