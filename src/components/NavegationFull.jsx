import { listIcons } from '@/helpers/listIcons';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { forwardRef } from 'react';
const NavegationFull = forwardRef(({listModules,user,closeMenu},ref) => {
    const router = useRouter();
    const currentRoute = router.asPath;
    const listModuleNew = [
        {
            "id" : 0,
            "module_url" : "/home",
            "module_icon" : "home",
            "module_title" : "Inicio"
        }
    ,...listModules];
    return(
        <aside ref={ref} id='content-module' className="md:left-0 -left-[260px] fixed top-0 bottom-0 h-dvh z-20" onClick={closeMenu}>
            <div className='w-[260px] py-3 bg-white h-full' onClick={e => e.stopPropagation()}>
            <div className="py-4 text-center">
                <Image width={80} height={80} quality={100} src={user.user_avatar ? process.env.NEXT_PUBLIC_API_URL + '/' + user.user_avatar : "/img/user.png"} className='m-auto'/>
                <h3 className='pt-2'>{user.user_name}</h3>
            </div>
            <ul>
                {
                    listModuleNew.map(module => (
                        <li className="relative mb-1" key={module.id}>
                            <Link href={`/intranet${module.module_url}`} className={`${currentRoute == '/intranet'+module.module_url ? 'bg-green-100 text-green-500' : 'bg-white text-information'} transition-colors ease-in-out duration-300 hover:bg-gray-100 rounded-lg text-base mx-4 px-4 py-2 flex items-center gap-2`}>
                                {listIcons.find(icon => icon.name == module.module_icon).Icon}
                                <span className='text-base font-normal tracking-[0.15px]'>{module.module_title}</span>
                            </Link>
                            {currentRoute == '/intranet'+module.module_url && <div className='absolute bg-green-500 h-full right-0 top-0 w-1 '></div>}
                        </li>
                    ))
                }
            </ul>
            </div>
        </aside>
    )
})
export default NavegationFull;