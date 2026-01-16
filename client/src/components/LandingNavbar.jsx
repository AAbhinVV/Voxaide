
import { useState } from "react";
import { HoveredLink, Menu, MenuItem, } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export function LandingNavbar() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
      
    </div>
  );
}

function Navbar({
  className
}) {
  const [active, setActive] = useState(null);
  return (
    <div
      className={cn(" top-10 inset-x-0 min-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Services" />
          
        
        <MenuItem setActive={setActive} active={active} item="Products" />
          
        
        <MenuItem setActive={setActive} active={active} item="Pricing" />
      
      </Menu>

      <div>

      </div>
    </div>
  );
}
