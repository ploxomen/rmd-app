import { cloneElement, useEffect, useRef, useState} from "react";

export const Dropdown = ({ Button, options }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null); // Creamos una referencia para el dropdown
    const handleOpen = () => {
        setOpen(!open);
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setOpen(false); // Cierra el menú si el clic no fue en el dropdown
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [dropdownRef]);
    return (
        <div className="relative" ref={dropdownRef}>
            {
                cloneElement(Button, {
                    onClick: handleOpen
                })
            }
            {
                open && (
                    <div className="z-10 absolute top-0 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                            {
                                options.map((option,key) => (
                                    <li key={key}>
                                        {option}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                )
            }

        </div>
    )
}