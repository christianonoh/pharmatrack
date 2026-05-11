import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Bell, X } from 'lucide-react';
import { cn } from '../lib/cn';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/inventory', label: 'Inventory', icon: Package, end: false },
  { to: '/alerts', label: 'Alerts', icon: Bell, end: false },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
            )
          }
        >
          <Icon className="h-4 w-4" aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2 px-5 py-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-white p-1">
        <img src="/logo.svg" alt="PharmaTrack" className="h-full w-full" />
      </div>
      <span className="text-sm font-semibold tracking-tight text-zinc-900">
        PharmaTrack
      </span>
    </div>
  );
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-zinc-200 md:bg-white">
        <Brand />
        <NavItems />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            'absolute inset-0 bg-zinc-900/40 transition-opacity',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={onCloseMobile}
        />
        <aside
          className={cn(
            'absolute left-0 top-0 flex h-full w-64 flex-col border-r border-zinc-200 bg-white transition-transform',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between pr-3">
            <Brand />
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-md p-2 text-zinc-500 hover:bg-zinc-100"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <NavItems onNavigate={onCloseMobile} />
        </aside>
      </div>
    </>
  );
}
