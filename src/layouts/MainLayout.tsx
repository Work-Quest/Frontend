import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      <header className="p-4 bg-blue-500 text-white">My App Header</header>
      <main className="p-4">
        <Outlet />
      </main>
      <footer className="p-4 bg-gray-200">Footer here</footer>
    </div>
  );
};

export default MainLayout;