'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

export function NavLink({ href, children, icon: Icon, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(href + '/');

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
        ${
          isActive
            ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-lg shadow-purple-500/30'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }
      `}
    >
      {Icon && <Icon className="h-5 w-5" />}
      <span>{children}</span>
    </Link>
  );
}
