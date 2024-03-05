import React, { useEffect, useRef, useState } from 'react'
import Modal from '../Modal'
import { InputPrimary, SubmitForm, TextareaPrimary, Toogle } from '../Inputs';
import SeccionForm from '../SeccionForm';
import { getCookie } from '@/helpers/getCookie';
import { SelectPrimary } from '../Selects';
import apiAxios from '@/axios';
import Image from 'next/image';
import { ButtonDangerSm, ButtonPrimary, ButtonPrimarySm } from '../Buttons';
import { ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/solid';
import { sweetAlert } from '@/helpers/getAlert';
import EditorText from '../EditorText';
const dataForm = {
    product_name:"",
    product_description:"",
    product_buy:"",
    product_sale:"",
    product_categorie:"",
    product_service:false,
    sub_categorie:"",
    product_img:null
}
function FormProduct({statusModal,closeModal,handleSave,productEdit,categories,subcategoriesData}) {
    const [form,setForm] = useState(dataForm);
    const [subcategories,setSubcategories] = useState([]);
    const [deleteImg,setDeleteImg] = useState(false);
    const editorDescription = useRef(null);
    const headers = getCookie();
    const edit = Object.keys(productEdit).length;
    useEffect(()=>{
        setForm(edit ? productEdit : dataForm);
        setDeleteImg(false);
    },[productEdit]);
    useEffect(()=>{
        setSubcategories(subcategoriesData.length ? subcategoriesData : []);
    },[subcategoriesData]);
    const hanbleSendModal = () => {
        const formProduct = document.querySelector("#form-product-submit");
        formProduct.click();
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in form) {
            if (Object.hasOwnProperty.call(form, key) && form[key] && key != 'product_img') {
                data.append(key,form[key])                
            }
        }
        if(form.id){
            data.append('_method','PUT');
            if(deleteImg){
                data.append('delete_img','true');
            }
        }
        data.append('product_description',editorDescription.current.getContent());
        const inputImage = document.querySelector("#upload-file");
        if(inputImage.value){
            data.append('product_img',inputImage.files[0]);
        }
        handleSave(data);
    }
    const handleChangeForm = async (e) => {
        const key = e.target.name;
        const value = e.target.value;
        console.log(key);
        if(key == "product_service"){
            setForm({
                ...form,
                product_service : !form.product_service
            })
            return
        }
        setForm({
            ...form,
            [key] : value
        })
        if(key == 'product_categorie'){
            try {   
                const resp = await apiAxios.get('/product-subcategorie/' + value,{headers});
                setSubcategories(resp.data.data);
            } catch (error) {
                console.error(error);
                sweetAlert({title : "Error", text: "Ocurrió un error al obtener las subcategorías", icon : "error"});
            }
        }
    }
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(!file){
            setForm({
                ...form,
                product_img : null
            })
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setForm({
                ...form,
                product_img : reader.result
            })
        }
        if(file){
            reader.readAsDataURL(file);
        }
    }
    const handleDeleteImg = () => {
        setForm({
            ...form,
            product_img:null
        })
        document.querySelector("#upload-file").value = null;
        setDeleteImg(true);
    }
    const handleClickUpload = (e) =>{
        document.querySelector("#upload-file").click();
    }
  return (
    <Modal status={statusModal} maxWidth='w-[750px]' title={edit ? 'Editar producto' : 'Nuevo producto'} onSave={hanbleSendModal} handleCloseModal={closeModal}>
        <form  className='grid grid-cols-6 gap-x-3 gap-y-0' onSubmit={handleSubmit}>
            <div className="col-span-full">
                <SeccionForm title="Datos del producto"/>
            </div>
            <div className="col-span-full">
                <InputPrimary label="Producto" inputRequired='required' name="product_name" value={form.product_name||''} onChange={handleChangeForm}/>
            </div>
            <div className="col-span-full">
                <Toogle text="Establecer como servicio" onChange={handleChangeForm} checked={form.product_service} name="product_service"/>
            </div>
            <div className="col-span-full mb-4">
                <EditorText label="Descripción" initialValue={form.product_description} id="quotation_observations" editorRef={editorDescription}/>
            </div>
            {
                !form.product_service
                &&
                <>
                    <div className="col-span-3">
                        <InputPrimary label="P. Producción" step="0.01" min="0" type='number' name="product_buy" value={form.product_buy||''} onChange={handleChangeForm}/>
                    </div>
                    <div className="col-span-3">
                        <InputPrimary label="P. Venta" step="0.01" min="0" type='number' inputRequired='required' name="product_sale" value={form.product_sale||''} onChange={handleChangeForm}/>
                    </div>
                </>
            }
            
            <div className="col-span-3">
                <SelectPrimary label="Categorías" inputRequired='required' name="product_categorie" value={form.product_categorie||''} onChange={handleChangeForm}>
                    <option value="">Seleccione una opción</option>
                    {
                        categories.map(categorie => <option value={categorie.id} key={categorie.id}>{categorie.categorie_name}</option>)
                    }
                </SelectPrimary>
            </div>
            <div className="col-span-3">
                <SelectPrimary label="Subcategorías" inputRequired='required' name="sub_categorie" value={form.sub_categorie||''} onChange={handleChangeForm}>
                    <option value="">Seleccione una opción</option>
                    {
                        subcategories.map(subcategorie => <option value={subcategorie.id} key={subcategorie.id}>{subcategorie.sub_categorie_name}</option>)
                    }
                </SelectPrimary>
            </div>
            <div className="col-span-full">
                <div className="flex gap-2 items-center">
                    <input type="file" id='upload-file' accept='image/*' hidden onChange={handleImageChange} />
                    <Image src={form.product_img ? form.product_img : "/img/no-pictures.png"} alt="Imagen previa" width={100} height={100} priority/>
                    <ButtonPrimarySm text="Subir" icon={<ArrowUpTrayIcon className='w-4 h-6'/>} onClick={handleClickUpload}/>
                    {form.product_img && <ButtonDangerSm text="Borrar" icon={<TrashIcon className='w-4 h-6'/>} onClick={handleDeleteImg}/>}
                </div>
            </div>
            <SubmitForm id="form-product-submit"/>
        </form>
    </Modal>
  )
}

export default FormProduct