import { ArrowRightCircleIcon, HomeModernIcon, UserIcon,HomeIcon, UsersIcon, TagIcon, CubeIcon, CurrencyDollarIcon, CurrencyBangladeshiIcon, Cog6ToothIcon, FlagIcon} from '@heroicons/react/24/solid'
const classSizeIcon = "h-5 w-5";
export const listIcons = [
    {
        name:"home",
        Icon: <HomeIcon className="h-5 w-5"/>
    },
    {
        name:'customers',
        Icon: <UserIcon className={classSizeIcon}/> 
    },
    {
        name:'modules',
        Icon: <HomeModernIcon className={classSizeIcon}/> 
    },
    {
        name:'roles',
        Icon: <ArrowRightCircleIcon className={classSizeIcon}/> 
    },
    {
        name:'users',
        Icon: <UsersIcon className={classSizeIcon}/> 
    },
    {
        name:'categories',
        Icon: <TagIcon className={classSizeIcon}/> 
    },
    {
        name:'products',
        Icon: <CubeIcon className={classSizeIcon}/> 
    },
    {
        name:'cotizacion-new',
        Icon: <CurrencyDollarIcon className={classSizeIcon}/> 
    },
    {
        name:'cotizacion-all',
        Icon: <CurrencyBangladeshiIcon className={classSizeIcon}/> 
    },
    {
        name:'configuration',
        Icon: <Cog6ToothIcon className={classSizeIcon}/> 
    },
    {
        name:'quotation-report',
        Icon: <FlagIcon className={classSizeIcon}/> 
    },
    {
        name:'order-new',
        Icon: <FlagIcon className={classSizeIcon}/> 
    }
]