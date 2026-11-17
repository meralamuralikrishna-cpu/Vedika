import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useApp } from '@/context/AppContext';
import { Auth } from '@/pages/Auth';
import { Button } from '@/components/ui/Button';
export function AppShell() {
    const { pathname } = useLocation();
    const { authEnabled, authReady, cloudReady, cloudError, retryCloudLoad, user, offlineDemo, leaveOfflineDemo } = useApp();
    const isStudio = pathname === '/studio';
    if (authEnabled && !authReady) return <div className="min-h-screen flex items-center justify-center text-forest">Loading Vedika…</div>;
    if (authEnabled && !user && !offlineDemo) return <Auth />;
    if (authEnabled && user && cloudError) return <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center text-forest"><p>{cloudError}</p><Button onClick={retryCloudLoad}>Try again</Button></div>;
    if (authEnabled && user && !cloudReady) return <div className="min-h-screen flex items-center justify-center text-forest">Loading your saved workspace…</div>;
    return (<div className="flex min-h-screen app-atmosphere">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {offlineDemo && <div role="status" className="flex flex-wrap items-center justify-center gap-3 bg-amber-100 px-4 py-2 text-center text-xs text-amber-950">Offline demo mode — changes are temporary and won&apos;t be saved.<Button size="sm" variant="secondary" onClick={leaveOfflineDemo}>Return to sign in</Button></div>}
        {!isStudio && <Header />}
        <main className={isStudio ? 'flex-1 min-h-0 overflow-hidden' : 'flex-1 overflow-auto'}>
          <Outlet />
        </main>
      </div>
    </div>);
}
