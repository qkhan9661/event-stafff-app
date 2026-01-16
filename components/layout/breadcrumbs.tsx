'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRightIcon } from '@/components/ui/icons';
import { useTerminology } from '@/lib/hooks/use-terminology';

export function Breadcrumbs() {
  const pathname = usePathname();
  const { terminology } = useTerminology();

  // Route to label mappings for breadcrumbs (matching sidebar structure)
  // Some labels are dynamic based on terminology
  const getRouteLabel = (segment: string): string => {
    const staticLabels: Record<string, string> = {
      // Main sections
      'dashboard': 'Dashboard',

      // Task section - clients stays static
      'clients': 'Inventory',

      // Talent section
      'talents': 'Talent',
      'staff': 'Work Force',
      'positions': 'Positions',

      // Time section (now under events)
      'shift': 'Shift',
      'timesheet': 'Timesheet',
      'calendar': 'Schedule',

      // Settings section
      'settings': 'Settings',
      'profile': 'Profile',
      'customization': 'Customization',
      'terminology': 'Terminology',
      'labels': 'Labels',
      'templates': 'Templates',
      'users': 'Users',

      // Other
      'notifications': 'Notifications',
      'my-schedule': 'My Schedule',
      'client-portal': 'Client Portal',
    };

    // Dynamic labels based on terminology
    if (segment === 'tasks' || segment === 'events') {
      return terminology.event.singular;
    }

    return staticLabels[segment] || segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Generate breadcrumb segments from pathname
  const generateBreadcrumbs = () => {
    if (!pathname || pathname === '/') return [];

    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    let currentPath = '';
    for (const segment of segments) {
      currentPath += `/${segment}`;

      const label = getRouteLabel(segment);

      breadcrumbs.push({
        label,
        href: currentPath,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm">
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={breadcrumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="mx-1 h-4 w-4 text-muted-foreground" />
            )}
            {isLast ? (
              <span className="font-medium text-foreground">
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {breadcrumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

