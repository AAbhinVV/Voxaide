import { SidebarDemo } from "../components/Sidebar";

function SidebarLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="h-screen z-50">
        <SidebarDemo />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default SidebarLayout;
