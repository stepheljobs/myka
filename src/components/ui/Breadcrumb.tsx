import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-muted-foreground mx-2">/</span>
          )}
          {item.href && !item.isActive ? (
            <Link href={item.href}>
              <span className="text-primary hover:text-primary/80 hover:underline cursor-pointer">
                {item.label}
              </span>
            </Link>
          ) : (
            <span className={item.isActive ? "text-foreground font-medium" : "text-muted-foreground"}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
} 