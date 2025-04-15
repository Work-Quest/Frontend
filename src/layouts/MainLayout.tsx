import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '@/components/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <main className="flex-grow overflow-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;