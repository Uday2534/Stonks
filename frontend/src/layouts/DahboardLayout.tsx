import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 p-4">
        Stonks
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;