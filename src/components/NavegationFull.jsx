import { listIcons } from "@/helpers/listIcons";
import { useRouter } from "next/router";
import Link from "next/link";
import { forwardRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import NavModule from "./NavModule";
const NavegationFull = forwardRef(({ listModules, user, closeMenu }, ref) => {
  const router = useRouter();
  const currentRoute = router.asPath;
  const listModuleNew = [
    {
      id: 0,
      id_module_group: null,
      module_url: "/home",
      module_icon: "home",
      module_title: "Inicio",
    },
    ...listModules,
  ];
  const handleSubmenus = (e) => {
    const listSubmenu = e.target.closest("li").querySelector("ul");
    const textSubmenu = e.target.closest(".text-submenu");
    const iconSubmenu = e.target.closest("li").querySelector(".icon-submenu");
    iconSubmenu.classList.toggle("rotate-180")
    textSubmenu.classList.toggle("bg-white");
    textSubmenu.classList.toggle("text-information");
    textSubmenu.classList.toggle("bg-green-100");
    textSubmenu.classList.toggle("text-green-500");
    listSubmenu.classList.toggle("hidden");
    listSubmenu.classList.toggle("block");
  }
  return (
    <aside
      ref={ref}
      id="content-module"
      className="md:left-0 -left-[260px] fixed top-0 bottom-0 h-dvh z-20"
      onClick={closeMenu}
    >
      <div
        className="w-[260px] py-3 bg-white h-full overflow-y-auto navigation-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-4 text-center">
          <img
            alt="Avatar"
            width={80}
            height={80}
            src={
              user.user_avatar
                ? process.env.NEXT_PUBLIC_API_URL + "/" + user.user_avatar
                : "/img/user.png"
            }
            loading="lazy"
            className="m-auto"
          />
          <h3 className="pt-2">{user.user_name}</h3>
        </div>
        <ul className="flex flex-col gap-1">
          {listModuleNew.map((module, key) => {
            if (module.id_module_group) {
                const openSubmodal = module.module_list.some(sub => "/intranet" + sub.module_url == currentRoute);
                return (
                <li className="relative flex flex-col gap-1" key={key}>
                  <div className={`cursor-pointer text-submenu transition-colors ease-in-out duration-300 ${openSubmodal ? "text-green-500 bg-green-100" : "bg-white text-information"} items-center hover:bg-gray-100 rounded-lg text-base mx-4 px-4 py-2 flex justify-between gap-1`} onClick={handleSubmenus}>
                    <div className="flex gap-1 text-base font-normal tracking-[0.15px]">
                      {
                        listIcons.find(
                          (icon) => icon.name == module.module_group_icon
                        ).Icon
                      }
                      {module.module_group_title}
                    </div>
                    <ChevronDownIcon className={`size-4 transition-transform ease-in-out icon-submenu ${openSubmodal && "rotate-180"}`} />
                  </div>
                  <ul className={`${!openSubmodal && "hidden"} pl-2 flex flex-col gap-1`}>
                    {module.module_list.map((submodule, keySubmodule) => (
                      <NavModule {...submodule} key={keySubmodule} currentRoute={currentRoute}/>
                    ))}
                  </ul>
                </li>
              );
            } else {
              return (
                <NavModule {...module} currentRoute={currentRoute} key={key}/>

              );
            }
          })}
        </ul>
      </div>
    </aside>
  );
});
export default NavegationFull;
