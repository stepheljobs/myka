import { HTMLAttributes, forwardRef } from 'react';

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  children: React.ReactNode;
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ 
    cols = 1,
    gap = 'md',
    responsive = true,
    children,
    className = '',
    ...props 
  }, ref) => {
    const baseClasses = 'grid';
    
    const colClasses = responsive ? {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
      12: 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-12',
    } : {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
    };
    
    const gapClasses = {
      sm: 'gap-3 sm:gap-4',
      md: 'gap-4 sm:gap-6',
      lg: 'gap-6 sm:gap-8',
      xl: 'gap-8 sm:gap-10',
    };
    
    const classes = [
      baseClasses,
      colClasses[cols],
      gapClasses[gap],
      className,
    ].join(' ');
    
    return (
      <div
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

export default Grid;