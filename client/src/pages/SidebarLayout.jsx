import { SidebarDemo } from "../components/Sidebar";

function SidebarLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 dark:from-[#0a0a1a] dark:via-[#0d0d2b] dark:to-[#10102a]">
      {/* Sidebar */}
      <aside className="h-screen z-50">
        <SidebarDemo />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default SidebarLayout;
