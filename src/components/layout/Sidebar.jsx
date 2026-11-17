import { NavLink } from 'react-router-dom';
import { LayoutDashboard, LayoutTemplate, Palette, FolderHeart, Images, Search, CalendarDays, Settings, ShieldCheck, ChevronLeft, ChevronRight, } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { BrandMarkIcon } from '@/components/brand/BrandMark';
import { Wordmark } from '@/components/brand/Wordmark';
const NAV = [
    { id: 'overview', path: '/', icon: LayoutDashboard },
    { id: 'templates', path: '/templates', icon: LayoutTemplate },
    { id: 'studio', path: '/studio', icon: Palette },
    { id: 'designs', path: '/designs', icon: FolderHeart },
    { id: 'moodboards', path: '/moodboards', icon: Images },
    { id: 'decorators', path: '/decorators', icon: Search },
    { id: 'bookings', path: '/bookings', icon: CalendarDays },
    { id: 'settings', path: '/settings', icon: Settings },
];
export function Sidebar() {
    const { locale, sidebarCollapsed, setSidebarCollapsed, mobileNavOpen, setMobileNavOpen, isAdmin } = useApp();
    const navItems = isAdmin ? [...NAV, { id: 'adminBookings', path: '/admin', icon: ShieldCheck }] : NAV;
    const content = (<div className="flex flex-col h-full relative overflow-hidden bg-[#09251E] select-none">
      <div className="pointer-events-none absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(ellipse 90% 55% at 0% 0%, rgba(166,25,53,0.35), transparent 60%), radial-gradient(ellipse 70% 45% at 100% 100%, rgba(143,168,138,0.2), transparent 50%)',
        }}/>

      <div className={cn('relative flex items-center gap-2.5 px-3.5 h-[55px] border-b border-white/[0.08]', sidebarCollapsed && 'justify-center px-2')}>
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/[0.08] ring-1 ring-white/[0.12] shrink-0 text-[#8FA88A]">
          <BrandMarkIcon tone="soft" className="h-5 w-6 text-white"/>
        </div>
        {!sidebarCollapsed && (<div className="min-w-0 animate-fade-in flex flex-col justify-center">
            <Wordmark text={t(locale, 'brand')} size="sm" light/>
            <span className="text-[9px] text-[#8FA88A] tracking-[0.18em] uppercase font-semibold leading-none mt-0.5">
              Studio
            </span>
          </div>)}
      </div>

      <nav className="relative flex-1 overflow-y-auto py-3 px-2 space-y-1" aria-label="Main">
        {navItems.map(({ id, path, icon: Icon }) => (<NavLink key={id} to={path} end={path === '/'} onClick={() => setMobileNavOpen(false)} className={({ isActive }) => cn('group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-150', sidebarCollapsed && 'justify-center px-2', isActive
                ? 'bg-white/[0.12] text-white shadow-xs font-semibold'
                : 'text-[#8FA88A] hover:bg-white/[0.06] hover:text-white')} title={t(locale, id)}>
            {({ isActive }) => (<>
              {isActive && !sidebarCollapsed && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-[#A61935]" aria-hidden="true" />
              )}
              <Icon className={cn('h-4 w-4 shrink-0 transition-colors duration-150', isActive ? 'text-white' : 'text-[#8FA88A] group-hover:text-white')} aria-hidden/>
              {!sidebarCollapsed && <span className="truncate">{t(locale, id)}</span>}
            </>)}
          </NavLink>))}
      </nav>

      <div className="relative hidden md:flex p-2 border-t border-white/[0.08]">
        <button type="button" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="flex items-center justify-center w-full h-8 rounded-lg text-[#8FA88A] hover:bg-white/[0.08] hover:text-white transition-colors" aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4"/> : <ChevronLeft className="h-4 w-4"/>}
        </button>
      </div>
    </div>);
    return (<>
      <aside className={cn('hidden md:flex flex-col bg-[#09251E] text-white shrink-0 transition-all duration-200 h-screen sticky top-0 z-30', sidebarCollapsed ? 'w-[72px]' : 'w-[190px]')}>
        {content}
      </aside>

      {mobileNavOpen && (<div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => setMobileNavOpen(false)} aria-hidden/>
          <aside className="absolute left-0 top-0 bottom-0 w-[240px] bg-[#09251E] shadow-2xl">
            {content}
          </aside>
        </div>)}
    </>);
}
