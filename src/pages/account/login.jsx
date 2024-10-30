import { InputLogin } from '@/components/Inputs';
import '@/app/globals.css';
import { ButtonLogin } from '@/components/Buttons';
import Header from '@/components/Header';
import { useState } from 'react';
import apiAxios from '@/axios';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'
export async function getServerSideProps(context) {
    const userCookie = context.req.cookies;
    if(userCookie.authenticate){
        return {
            redirect : {
                destination: '/intranet/home',
                permanent:false
            }
        }
    }
    return {
        props:{}
    }
}
export default function Login(){
    const defaultValueForm = {
        username:'',
        password:''
    }
    const route = useRouter();
    const [incorrectUser,setIncorrectUser] = useState(null);
    const [formUser,setFormUser] = useState(defaultValueForm);
    const handleFormChange = (e) => {
        setFormUser({
            ...formUser,
            [e.target.name] : e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIncorrectUser(null);
        try {
            const resp = await apiAxios.get('/login',{params:formUser});
            if(!resp.data.authenticate){
                setIncorrectUser(resp.data.message);
            }else{
                Cookies.set('authenticate',JSON.stringify(resp.data.data),{path:'/'});
                return route.replace('/intranet/home');
            }
        } catch (error) {
            console.error(error);
            alert("Error al iniciar sesión")
        }
    }
    return(
        <>
            <Header title="Iniciar sesión" description='Accede al sistema integrado'/>
            <div className='bg-layout p-5 flex justify-center items-center min-h-dvh' style={{backgroundImage:"url('/img/login-fondo.jpg')", backgroundRepeat:'no-repeat',backgroundPosition:'center', backgroundSize:'cover'}}>
                <div className='bg-white px-4 py-7 max-w-md rounded-lg shadow-md'>
                    <img src='/img/logo.jpg' width={120} height={120} className='m-auto'/>
                    {
                        incorrectUser && <div className='px-6 pt-2 pb-3 bg-red-100 rounded flex gap-2 items-center'>
                            <ExclamationTriangleIcon className='w-4 h-4 text-red-500'/>
                            <span className='text-red-500 text-sm'>{incorrectUser}</span>
                        </div>
                    }
                    <div className='px-6 pt-2 pb-6 text-center'>
                        <h1 className='mb-1 font-medium text-2xl text-title'>¡Bienvenido al Sistema Integrado!</h1>
                        <p className='text-base text-paragraph font-normal'>Por favor inicie sesión con su cuenta proporcionada</p>
                    </div>
                    <form className="px-6" onSubmit={handleSubmit}>
                        <InputLogin name="username" label="Usuario" type="text" value={formUser.username} onChange={handleFormChange}/>
                        <InputLogin name="password" label="Contraseña" type="password" value={formUser.password} onChange={handleFormChange}/>
                        <div>
                            <ButtonLogin text="Iniciar sesión" type="submit"/>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}