import { HTMLAttributes, forwardRef } from 'react';

type ShapeType = 'square' | 'rectangle' | 'circle' | 'triangle';

interface ShapeProps extends HTMLAttributes<HTMLDivElement> {
  shape: ShapeType;
  color?: 'primary' | 'secondary' | 'accent' | 'destructive' | 'muted';
  children?: React.ReactNode;
}

const Shape = forwardRef<HTMLDivElement, ShapeProps>(
  ({ 
    shape,
    color = 'primary', 
    children,
    className = '',
    ...props 
  }, ref) => {
    const baseClasses = 'flex items-center justify-center border rounded-lg';
    
    const shapeClasses = {
      square: 'aspect-square',
      rectangle: 'aspect-video',
      circle: 'aspect-square rounded-full',
      triangle: 'aspect-square relative overflow-hidden',
    };
    
    const colorClasses = {
      primary: 'bg-primary text-primary-foreground border-primary',
      secondary: 'bg-secondary text-secondary-foreground border-secondary',
      accent: 'bg-accent text-accent-foreground border-accent',
      destructive: 'bg-destructive text-destructive-foreground border-destructive',
      muted: 'bg-muted text-muted-foreground border-muted',
    };
    
    const classes = [
      baseClasses,
      shapeClasses[shape],
      colorClasses[color],
      className,
    ].join(' ');
    
    if (shape === 'triangle') {
      return (
        <div
          ref={ref}
          className={classes}
          {...props}
        >
          <div 
            className={`absolute inset-0 ${colorClasses[color]}`}
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
          {children && (
            <div className="relative z-10 text-center">
              {children}
            </div>
          )}
        </div>
      );
    }
    
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

Shape.displayName = 'Shape';

export default Shape;