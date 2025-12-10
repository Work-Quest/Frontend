import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';
import { useRef } from "react"
import LoadingBar from "react-top-loading-bar"
import { Toaster } from 'react-hot-toast';

type MainLayoutProps = {
  className?: string;
};

const MainLayout = ({ className = '' }: MainLayoutProps) => {
   const loadingBarRef = useRef<any>(null)
   // Expose globally so fetch/axios can control it
  ;(window as any).loadingBarRef = loadingBarRef
  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
        <Toaster
        position="bottom-left"
        reverseOrder={false}
        />
      <LoadingBar color="#f97316" ref={loadingBarRef} height={3} />
      <div className="sticky top-0 z-50">
      </div>
        <main className="flex-grow overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
