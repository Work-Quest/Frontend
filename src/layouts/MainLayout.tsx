import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '@/components/Footer';

type MainLayoutProps = {
  className?: string;
};

const MainLayout = ({ className = '' }: MainLayoutProps) => {
  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
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
