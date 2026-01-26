import { SidebarDemo } from "../components/Sidebar";

function SidebarLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-20 bg-blue-400 z-50">
        <SidebarDemo />
      </aside>

      {/* Main content */}
      <main className="ml-20 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default SidebarLayout;
