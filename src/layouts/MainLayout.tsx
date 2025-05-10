import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '@/components/Footer';

type MainLayoutProps = {
  className?: string;
};

const MainLayout = ({ className = '' }: MainLayoutProps) => {
  return (
    <div className={`flex flex-col min-h-screen w-screen ${className}`}>
      <Header />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
