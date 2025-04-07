import Swal from "sweetalert2"

export const sweetAlert = ({title,text,icon,confirmButtonText = "Aceptar",showCancelButton=false,cancelButtonText="Cancelar"}) => {
    return Swal.fire({
        title,
        text,
        icon,
        showCancelButton,
        cancelButtonText,
        confirmButtonText
    })
}