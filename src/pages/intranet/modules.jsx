import '@/app/globals.css';
import apiAxios from "@/axios";
import BanerModule from '@/components/BanerModule';
import { Checkbox } from '@/components/Inputs';
import LoyoutIntranet from "@/components/LoyoutIntranet";
import Modal from '@/components/Modal';
import TableModule from '@/components/TableModule';
import { sweetAlert } from '@/helpers/getAlert';
import { getCookie } from '@/helpers/getCookie';
import { verifUser } from '@/helpers/verifUser';
import { useModal } from '@/hooks/useModal';
import { TYPES_MODULE, crudModulesInitialState, reducerModules } from '@/reducers/crudModule';
import { useRouter } from 'next/navigation';
import { useEffect, useReducer } from 'react';

export async function getServerSideProps(context) {
    return await verifUser(context,'/modules');
}
export default function Roles({dataModules,dataRoles,dataUser}){
    const headers = getCookie();
    const route = useRouter();
    const [state,dispatch] = useReducer(reducerModules,crudModulesInitialState);
    const {modal,handleOpenModal,handleCloseModal} = useModal("hidden");
    useEffect(()=>{
        const getDataRoles = async () => {
            try {
                const resp = await apiAxios.get('/module',{headers});
                if(resp.data.redirect !== null){
                    return route.replace(resp.data.redirect);
                }
                dispatch({type:TYPES_MODULE.READ_ALL_MODULES,payload:resp.data.data});
            } catch (error) {
                dispatch({type:TYPES_MODULE.NO_MODULES});
            }
        }
        getDataRoles();        
    },[])
    const getRoles = async (module) => {
        try {
            const resp = await apiAxios.get(`/module-role/${module}`,{headers});
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            dispatch({type:TYPES_MODULE.GET_MODULE_ROLE,payload:{roles:resp.data.data,module}});
            handleOpenModal();
        } catch (error) {
            console.error(error);
            dispatch({type:TYPES_MODULE.NO_MODULES});
        }
    }
    const closeModal = () => {
        dispatch({type:TYPES_MODULE.RESET_MODULES});
        handleCloseModal();
    }
    const saveModules = async () => {
        try {
            const resp = await apiAxios.put(`/module-role/${state.idModule}`,{roles:state.roles},{headers});
            if(resp.data.redirect !== null){
                return route.replace(resp.data.redirect);
            }
            sweetAlert({title : "Exitoso", text: resp.data.message, icon : "success"});
            closeModal();
        } catch (error) {
            dispatch({type:TYPES_MODULE.NO_MODULES});
            console.error(error);
        }
    }
    return(
        <>
        <LoyoutIntranet title="Módulos" description="Administracion de roles" user={dataUser} modules={dataModules} roles={dataRoles}>
            <BanerModule imageBanner='/baners/Group 13.jpg' title="Administración de módulos"/>
            <div className='w-full p-6 bg-white rounded-md shadow md:flex-1 overflow-x-auto'>
                <TableModule modules={state.modules} getRoles={getRoles}/>
            </div>
        </LoyoutIntranet>
        <Modal title="Lista de roles" status={modal} handleCloseModal={closeModal} onSave={saveModules}>
            <ul>
                {
                    state.roles.map(role => (
                        <li key={role.id}>
                            <Checkbox label={role.rol_name} name={"module-"+role.id} checked={role.checked||false} onChange={ e => dispatch({type:TYPES_MODULE.CHANGE_CHECKED_ROLES,payload:role.id})}/>
                        </li>
                    ))
                }
            </ul>
        </Modal>
        </>
    )
}