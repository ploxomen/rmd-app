import { useState } from "react";

export const useModal = (value) => {
    const [modal, setModal] = useState(value);

    const handleCloseModal = () => setModal("hidden");
    const handleOpenModal = () => setModal("");

    return {modal,handleCloseModal,handleOpenModal}
}