// import React, { useState } from "react";
// import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar.jsx";
// import { Mic, User, House, Voicemail, NotepadText } from "lucide-react";
// // import {
// //   IconArrowLeft,
// //   IconBrandTabler,
// //   IconSettings,
// //   IconUserBolt,
// // } from "@tabler/icons-react";
// import { motion } from "motion/react";
// import { cn } from "@/lib/utils";

// export function SidebarDemo({ children }) {
//   const links = [
//     {
//       label: "Home",
//       href: "/dashboard",
//       icon: (
//         <House className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />

//       ),
//     },
//     {
//       label: "Recordings",
//       href: "/recordings",
//       icon: (
//         <Voicemail className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
        
//       ),
//     },
//     {
//       label: "Notes",
//       href: "/notes",
//       icon: (
//         <NotepadText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
        
//       ),
//     },
//   ];
//   const [open, setOpen] = useState(false);
//   const [activeLink, setActiveLink] = useState("/dashboard");

//   return (
//     <motion.div
// 		// initial = {{opacity: 0, x: -20}}
// 		// animate = {{opacity: 1, x: 0}}
// 		// transition={{ duration: 0.8, delay: 0.5}}
		// className={cn(
		// 	"flex w-full w-full divide-x-2 flex-1 flex-col overflow-hidden border border-neutral-200 bg-transparent md:flex-row dark:border-neutral-700 dark:bg-transparent",
		// 	// for your use case, use `h-screen` instead of `h-[60vh]`
		// 	"h-screen"
		// )}
// 	>

//       <Sidebar open={open} setOpen={setOpen}>
//         <SidebarBody className="justify-between gap-10">
//           <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
//             {open ? <Logo /> : <LogoIcon />}
//             <div className="mt-20 flex flex-col gap-4 font-body tracking-widest">
//               {links.map((link, idx) => (
//                 <SidebarLink key={idx}
//                    link={link}
//                   isActive={activeLink === link.href}
//                    isOpen={open}
//                    onClick={() => setActiveLink(link.href)}
//                    delay={idx * 0.1} />
//               ))}
//             </div>
//           </div>
//           <div>
//             <SidebarLink
//               link={{
//                 label: "Manu Arora",
//                 href: "#",
//                 icon: (
//                 //   <img
//                 //     src="https://assets.aceternity.com/manu.png"
//                 //     className="h-7 w-7 shrink-0 rounded-full"
//                 //     width={50}
//                 //     height={50}
//                 //     alt="Avatar" />
// 				<User className="h-[25px] w-[25px] rounded-full bg-transparent transition delay-100 duration-100 ease-in-out" />
//                 ),
//               }} />
//           </div>
//         </SidebarBody>
//       </Sidebar>
//       {children}
//     </motion.div>
//   );
// }

// export const Logo = () => {
//   return (
//     <a
//       href="/dashboard"
//       className="relative z-20 flex items-center space-x-2 py-1 text-sm font-extralight font-headings text-black">
//       <div
//         className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
//       <motion.span
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="font-extralight font-headings whitespace-pre text-black dark:text-white">
//         VOXAIDE
//       </motion.span>
//     </a>
//   );
// };
// export const LogoIcon = () => {
//   return (
//     <a
//       href="/dashboard"
//       className="relative z-20 flex items-center space-x-2 py-1 text-sm font-extralight font-headings text-black">
//       <div
//         className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
//     </a>
//   );
// };




import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar.jsx";
import { User, House, Voicemail, NotepadText, Settings, LogOut, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function SidebarDemo({ children }) {
  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/dashboard");

  const links = [
    {
      label: "Home",
      href: "/dashboard",
      icon: House,
      badge: null,
    },
    {
      label: "Recordings",
      href: "/recordings",
      icon: Voicemail,
      badge: "35", // Show total recordings count
    },
    {
      label: "Notes",
      href: "/notes",
      icon: NotepadText,
      badge: "150", // Show total notes count
    },
  ];

  return (
    <motion.div
      		className={cn(
			"flex w-full divide-x-2 flex-1 flex-col overflow-hidden bg-transparent md:flex-row dark:bg-transparent",
			// for your use case, use `h-screen` instead of `h-[60vh]`
			"h-screen"
		)}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-gradient-to-b from-[#5B21B6] via-[#4C1D95] to-[#3B0F7F] shadow-2xl">
          {/* Top Section */}
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {/* Logo with animation */}
            <motion.div >
              {open ? <Logo /> : <LogoIcon />}
            </motion.div>

            {/* Main Navigation */}
            <div className="mt-20 flex flex-col gap-4 font-body tracking-widest">
              {links.map((link, idx) => (
                <NavLink
                  key={idx}
                  link={link}
                  isActive={activeLink === link.href}
                  isOpen={open}
                  onClick={() => setActiveLink(link.href)}
                  delay={idx * 0.1}
                />
              ))}
            </div>

            {/* Divider */}
            {open && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="my-6 h-px bg-white/10"
              />
            )}

            {/* Secondary Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="mt-auto flex flex-col gap-1.5"
            >
              
              <SecondaryLink
                icon={Settings}
                label="Settings"
                href="/settings"
                isOpen={open}
              />
            </motion.div>
          </div>

          {/* Bottom Section - User Profile */}
          <motion.div>
            <UserProfile isOpen={open} />
          </motion.div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <div className="">
        {children}
      </div>
    </motion.div>
  );
}

// Enhanced Navigation Link Component
const NavLink = ({ link, isActive, isOpen, onClick, delay }) => {
  const Icon = link.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <a
        href={link.href}
        onClick={onClick}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200",
          "hover:bg-white/10",
          isActive && "bg-white/15 shadow-lg"
        )}
      >
        {/* Active Indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}

        {/* Icon */}
        <div className={cn(
          "relative z-10 flex items-center justify-center",
          isActive ? "text-white" : "text-white/70 group-hover:text-white"
        )}>
          <Icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
        </div>

        {/* Label */}
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "text-sm font-medium transition-colors",
                isActive ? "text-white" : "text-white/80 group-hover:text-white"
              )}
            >
              {link.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Badge */}
        {link.badge && isOpen && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="ml-auto rounded-full bg-purple-400 px-2 py-0.5 text-xs font-semibold text-purple-900"
          >
            {link.badge}
          </motion.span>
        )}

        {/* Tooltip for collapsed state */}
        {!isOpen && (
          <div className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
            {link.label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
          </div>
        )}
      </a>
    </motion.div>
  );
};

// Secondary Link Component (Settings, Notifications, etc.)
const SecondaryLink = ({ icon: Icon, label, href, isOpen, badge }) => {
  return (
    <a
      href={href}
      className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-white/60 transition-all hover:bg-white/5 hover:text-white/90"
    >
      <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
      
      {isOpen && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-medium"
        >
          {label}
        </motion.span>
      )}

      {badge && isOpen && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {badge}
        </span>
      )}

      {!isOpen && (
        <div className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
        </div>
      )}
    </a>
  );
};

// User Profile Component
const UserProfile = ({ isOpen }) => {
  return (
    <div className="group relative">
      <a
        href="/profile"
        className="flex items-center gap-3 rounded-xl px-3 py-3 transition-all hover:bg-white/10"
      >
        {/* Avatar */}
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg ring-2 ring-white/20 transition-transform group-hover:scale-105">
            <User className="h-5 w-5 text-white" />
          </div>
          {/* Online status indicator */}
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#5B21B6] bg-green-400" />
        </div>

        {/* User Info */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <span className="truncate text-sm font-semibold text-white">
              Abhinav
            </span>
            <span className="truncate text-xs text-white/60">
              abhinav@voxaide.com
            </span>
          </motion.div>
        )}

        {/* Logout Icon */}
        {isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </motion.button>
        )}
      </a>
    </div>
  );
};

// // Improved Logo Component
export const Logo = () => {
  return (
    <a
      href="/dashboard"
      className="group relative flex items-center gap-3 rounded-xl px-2 py-3 transition-all hover:bg-white/5"
    >
      {/* Logo Icon with gradient */}
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-xl transition-all group-hover:shadow-2xl group-hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 opacity-90" />
        <div className="relative h-5 w-5 rounded-md bg-white" />
      </div>

      {/* Logo Text */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col"
      >
        <span className="text-lg font-bold tracking-wider text-white">
          VOXAIDE
        </span>
        <span className="text-xs font-light text-white/60">
          Voice AI Platform
        </span>
      </motion.div>
    </a>
  );
};

// Logo Icon for collapsed state
export const LogoIcon = () => {
  return (
    <a
      href="/dashboard"
      className="group relative flex items-center justify-center rounded-xl py-3 transition-all hover:bg-white/5"
    >
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-xl transition-all group-hover:shadow-2xl group-hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 opacity-90" />
        <div className="relative h-5 w-5 rounded-md bg-white" />
      </div>
    </a>
  );
};
