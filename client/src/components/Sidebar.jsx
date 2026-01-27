import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar.jsx";
import { Mic, User, House, Voicemail, NotepadText } from "lucide-react";
// import {
//   IconArrowLeft,
//   IconBrandTabler,
//   IconSettings,
//   IconUserBolt,
// } from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function SidebarDemo({ children }) {
  const links = [
    {
      label: "Home",
      href: "/dashboard",
      icon: (
        <House className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />

      ),
    },
    {
      label: "Recordings",
      href: "/recordings",
      icon: (
        <Voicemail className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
        
      ),
    },
    {
      label: "Notes",
      href: "/notes",
      icon: (
        <NotepadText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
        
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <motion.div
		// initial = {{opacity: 0, x: -20}}
		// animate = {{opacity: 1, x: 0}}
		// transition={{ duration: 0.8, delay: 0.5}}
		className={cn(
			"flex w-full w-full divide-x-2 flex-1 flex-col overflow-hidden border border-neutral-200 bg-transparent md:flex-row dark:border-neutral-700 dark:bg-transparent",
			// for your use case, use `h-screen` instead of `h-[60vh]`
			"h-screen"
		)}
	>

      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-20 flex flex-col gap-4 font-body tracking-widest">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                //   <img
                //     src="https://assets.aceternity.com/manu.png"
                //     className="h-7 w-7 shrink-0 rounded-full"
                //     width={50}
                //     height={50}
                //     alt="Avatar" />
				<User className="h-[25px] w-[25px] rounded-full bg-transparent transition delay-100 duration-100 ease-in-out" />
                ),
              }} />
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </motion.div>
  );
}
export const Logo = () => {
  return (
    <a
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-extralight font-headings text-black">
      <div
        className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-extralight font-headings whitespace-pre text-black dark:text-white">
        VOXAIDE
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-extralight font-headings text-black">
      <div
        className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

