import { HTMLAttributes, forwardRef, ReactNode } from 'react';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'mono';
type TypographyWeight = 'normal' | 'medium' | 'bold' | 'semibold';
type TypographyColor = 'default' | 'muted' | 'primary' | 'secondary' | 'destructive';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  color?: TypographyColor;
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ 
    variant = 'body',
    weight = 'normal',
    color = 'default',
    children,
    as,
    className = '',
    ...props 
  }, ref) => {
    const variantClasses = {
      h1: 'text-4xl sm:text-5xl font-bold',
      h2: 'text-3xl sm:text-4xl font-bold',
      h3: 'text-2xl sm:text-3xl font-semibold',
      h4: 'text-xl sm:text-2xl font-semibold',
      h5: 'text-lg sm:text-xl font-semibold',
      h6: 'text-base sm:text-lg font-semibold',
      body: 'text-base',
      caption: 'text-sm',
      mono: 'text-base font-mono',
    };
    
    const weightClasses = {
      normal: 'font-normal',
      medium: 'font-medium',
      bold: 'font-bold',
      semibold: 'font-semibold',
    };
    
    const colorClasses = {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive',
    };
    
    const classes = [
      variantClasses[variant],
      weightClasses[weight],
      colorClasses[color],
      className,
    ].join(' ');
    
    // Determine the HTML element to render
    const Component = as || (variant.startsWith('h') ? variant : 'p') as keyof JSX.IntrinsicElements;
    
    const ElementComponent = Component as any;
    
    return (
      <ElementComponent
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </ElementComponent>
    );
  }
);

Typography.displayName = 'Typography';

export default Typography;