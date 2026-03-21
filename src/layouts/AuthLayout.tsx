import { Outlet } from 'react-router-dom'
import { useRef } from 'react'
import LoadingBar, { type LoadingBarRef } from 'react-top-loading-bar'
import { AppToaster } from '@/components/AppToaster'

type MainLayoutProps = {
  className?: string
}

const MainLayout = ({ className = '' }: MainLayoutProps) => {
  const loadingBarRef = useRef<LoadingBarRef | null>(null)
  window.loadingBarRef = loadingBarRef
  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
      <AppToaster />
      <LoadingBar color="#ff995a" ref={loadingBarRef} height={4} shadow={true} />
      <div className="sticky top-0 z-50"></div>
      <main className="flex-grow overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
