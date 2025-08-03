'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Typography from '@/components/ui/Typography';

interface NavigationTab {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const navigationTabs: NavigationTab[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '🏠',
    href: '/dashboard'
  },
  {
    id: 'dailies',
    label: 'Dailies',
    icon: '📊',
    href: '/dashboard/dailies'
  },
  {
    id: 'priorities',
    label: 'Priorities',
    icon: '🎯',
    href: '/dashboard/priorities'
  },
  {
    id: 'journal',
    label: 'Journal',
    icon: '📖',
    href: '/dashboard/journal/history'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    href: '/settings/user'
  }
];

export default function BottomNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-brutal-black shadow-brutal-sm z-50">
      <div className="flex items-center justify-around h-16 px-4">
        {navigationTabs.map((tab) => {
          const active = isActive(tab.href);
          
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                active
                  ? 'bg-brutal-blue text-brutal-white shadow-brutal-sm'
                  : 'text-brutal-gray hover:text-brutal-black'
              }`}
            >
              <div className="text-2xl mb-1">{tab.icon}</div>
              <Typography 
                variant="caption" 
                weight={active ? "bold" : "medium"}
                className="text-xs"
              >
                {tab.label}
              </Typography>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 