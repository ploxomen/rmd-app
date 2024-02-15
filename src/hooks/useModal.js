import { useState } from "react";

export const useModal = (value) => {
    const [modal, setModal] = useState(value);

    const handleCloseModal = () => {
        for (const modal of document.querySelectorAll('.bg-modal')) {
            modal.children[0].scrollTop = 0;
        }
        setModal("hidden")
    };
    const handleOpenModal = () => setModal("");

    return {modal,handleCloseModal,handleOpenModal}
}