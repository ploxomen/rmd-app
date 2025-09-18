import * as Icons from "@heroicons/react/24/outline"
export default function HeroIcons({name, className = ""}) {
    const IconComponent = Icons[name];
    if(!IconComponent) return null;
  return (
    <IconComponent className={`${className} h-5 w-5`}/>
  )
}
