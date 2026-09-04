import { cloneElement, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
export const Dropdown = ({ Button, options }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const handleOpen = () => {
    if (!open && buttonRef.current) {
      // Obtenemos la posición exacta del botón en la pantalla
      const rect = buttonRef.current.getBoundingClientRect();

      setCoords({
        // Se suma scrollY por si la página tiene scroll vertical
        top: rect.bottom + window.scrollY,
        // Alinea el menú a la derecha del botón (desplazando 176px = w-44 de Tailwind)
        left: rect.right + window.scrollX - 176,
      });
    }
    setOpen(!open);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Cierra si el clic fue fuera del botón Y fuera del menú renderizado
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="inline-block" ref={buttonRef}>
      {cloneElement(Button, {
        onClick: handleOpen,
      })}

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            className="z-50 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownMenuIconButton"
              onClick={() => setOpen(false)} // Cierra el menú al hacer clic en una opción
            >
              {options.map((option, key) => (
                <li key={key}>{option}</li>
              ))}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
};
