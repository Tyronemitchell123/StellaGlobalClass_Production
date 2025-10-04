'use client';

import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Base layout primitive types
interface LayoutPrimitiveProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

// Container component - Main layout wrapper
export const Container = forwardRef<HTMLDivElement, LayoutPrimitiveProps>(
  ({ className, children, as: Component = 'div', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('container mx-auto px-4 sm:px-6 lg:px-8', className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Container.displayName = 'Container';

// Flex component - Flexible layout container
interface FlexProps extends LayoutPrimitiveProps {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  responsive?: boolean;
}

const gapClasses = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
};

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({
    className,
    children,
    direction = 'row',
    align = 'stretch',
    justify = 'start',
    wrap = 'nowrap',
    gap,
    responsive = false,
    as: Component = 'div',
    ...props
  }, ref) => {
    const flexClasses = [
      'flex',
      direction === 'col' ? 'flex-col' : direction === 'row-reverse' ? 'flex-row-reverse' : direction === 'col-reverse' ? 'flex-col-reverse' : 'flex-row',
      align === 'start' ? 'items-start' : align === 'center' ? 'items-center' : align === 'end' ? 'items-end' : align === 'baseline' ? 'items-baseline' : 'items-stretch',
      justify === 'start' ? 'justify-start' : justify === 'center' ? 'justify-center' : justify === 'end' ? 'justify-end' : justify === 'between' ? 'justify-between' : justify === 'around' ? 'justify-around' : 'justify-evenly',
      wrap === 'wrap' ? 'flex-wrap' : wrap === 'wrap-reverse' ? 'flex-wrap-reverse' : 'flex-nowrap',
      gap ? gapClasses[gap] : '',
      responsive && 'flex-col md:flex-row',
    ].filter(Boolean);

    return (
      <Component
        ref={ref}
        className={cn(flexClasses, className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Flex.displayName = 'Flex';

// Grid component - CSS Grid layout
interface GridProps extends LayoutPrimitiveProps {
  cols?: number | { default: number; sm?: number; md?: number; lg?: number; xl?: number };
  rows?: number | { default: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  autoFlow?: 'row' | 'col' | 'dense' | 'row-dense' | 'col-dense';
  autoCols?: 'auto' | 'min' | 'max' | 'fr';
  autoRows?: 'auto' | 'min' | 'max' | 'fr';
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({
    className,
    children,
    cols = 1,
    rows,
    gap,
    autoFlow,
    autoCols,
    autoRows,
    as: Component = 'div',
    ...props
  }, ref) => {
    const getGridClasses = (prop: number | { default: number; sm?: number; md?: number; lg?: number; xl?: number } | undefined, prefix: string) => {
      if (!prop) return [];

      if (typeof prop === 'number') {
        return [`grid-${prefix}-${prop}`];
      }

      const classes = [`grid-${prefix}-${prop.default}`];
      if (prop.sm) classes.push(`sm:grid-${prefix}-${prop.sm}`);
      if (prop.md) classes.push(`md:grid-${prefix}-${prop.md}`);
      if (prop.lg) classes.push(`lg:grid-${prefix}-${prop.lg}`);
      if (prop.xl) classes.push(`xl:grid-${prefix}-${prop.xl}`);
      return classes;
    };

    const gridClasses = [
      'grid',
      ...getGridClasses(cols, 'cols'),
      ...getGridClasses(rows, 'rows'),
      gap ? gapClasses[gap] : '',
      autoFlow ? `grid-flow-${autoFlow}` : '',
      autoCols ? `auto-cols-${autoCols}` : '',
      autoRows ? `auto-rows-${autoRows}` : '',
    ].filter(Boolean);

    return (
      <Component
        ref={ref}
        className={cn(gridClasses, className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Grid.displayName = 'Grid';

// Stack component - Vertical layout with consistent spacing
interface StackProps extends LayoutPrimitiveProps {
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  divider?: ReactNode;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, children, spacing = 'md', align = 'stretch', divider, as: Component = 'div', ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);

    if (divider && childrenArray.length > 1) {
      const childrenWithDividers = childrenArray.reduce((acc: ReactNode[], child, index) => {
        if (index > 0) {
          acc.push(
            <div key={`divider-${index}`} className="flex justify-center">
              {divider}
            </div>
          );
        }
        acc.push(child);
        return acc;
      }, []);

      return (
        <Component
          ref={ref}
          className={cn(
            'flex flex-col',
            align === 'start' ? 'items-start' : align === 'center' ? 'items-center' : align === 'end' ? 'items-end' : 'items-stretch',
            spacing ? gapClasses[spacing] : '',
            className
          )}
          {...props}
        >
          {childrenWithDividers}
        </Component>
      );
    }

    return (
      <Component
        ref={ref}
        className={cn(
          'flex flex-col',
          align === 'start' ? 'items-start' : align === 'center' ? 'items-center' : align === 'end' ? 'items-end' : 'items-stretch',
          spacing ? gapClasses[spacing] : '',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Stack.displayName = 'Stack';

// Section component - Semantic section with optional header
interface SectionProps extends LayoutPrimitiveProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  variant?: 'default' | 'card' | 'bordered';
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, children, title, description, actions, variant = 'default', as: Component = 'section', ...props }, ref) => {
    const variantClasses = {
      default: '',
      card: 'bg-slate-800 border border-slate-700 rounded-lg p-6',
      bordered: 'border-b border-slate-700 pb-6 mb-6',
    };

    return (
      <Component
        ref={ref}
        className={cn(variantClasses[variant], className)}
        {...props}
      >
        {(title || description || actions) && (
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              {title && (
                <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
              )}
              {description && (
                <p className="text-slate-400">{description}</p>
              )}
            </div>
            {actions && (
              <div className="ml-4 flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        )}
        {children}
      </Component>
    );
  }
);
Section.displayName = 'Section';

// AspectRatio component - Maintain aspect ratio
interface AspectRatioProps extends LayoutPrimitiveProps {
  ratio?: number;
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, children, ratio = 16 / 9, as: Component = 'div', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('relative', className)}
        style={{ paddingBottom: `${(1 / ratio) * 100}%` }}
        {...props}
      >
        <div className="absolute inset-0">
          {children}
        </div>
      </Component>
    );
  }
);
AspectRatio.displayName = 'AspectRatio';

// Spacer component - Add space between elements
interface SpacerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      xs: 'h-1',
      sm: 'h-2',
      md: 'h-4',
      lg: 'h-6',
      xl: 'h-8',
      '2xl': 'h-12',
    };

    return (
      <div
        ref={ref}
        className={cn(sizeClasses[size], className)}
        {...props}
      />
    );
  }
);
Spacer.displayName = 'Spacer';

// Layout composition utilities
export const Layout = {
  Container,
  Flex,
  Grid,
  Stack,
  Section,
  AspectRatio,
  Spacer,
};

// Higher-order layout components
export function withLayout<P extends object>(
  Component: React.ComponentType<P>,
  layoutProps: {
    container?: boolean;
    section?: SectionProps;
    flex?: FlexProps;
  }
) {
  const WrappedComponent = (props: P) => {
    let content = <Component {...props} />;

    if (layoutProps.flex) {
      content = <Flex {...layoutProps.flex}>{content}</Flex>;
    }

    if (layoutProps.section) {
      content = <Section {...layoutProps.section}>{content}</Section>;
    }

    if (layoutProps.container) {
      content = <Container>{content}</Container>;
    }

    return content;
  };

  WrappedComponent.displayName = `withLayout(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Responsive breakpoint utilities
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Hook for responsive design
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`);
    setMatches(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [breakpoint]);

  return matches;
}

// Accessibility utilities
export const a11y = {
  // Screen reader only content
  srOnly: 'sr-only',

  // Focus management
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900',

  // Skip links
  skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-purple-600 text-white px-4 py-2 z-50',

  // Reduced motion
  reducedMotion: 'motion-reduce:transition-none motion-reduce:animate-none',
};

// Theme-aware layout utilities
export function useThemeClass(baseClass: string, themeVariants?: Record<string, string>) {
  // This would integrate with your theme system
  // For now, return base class
  return baseClass;
}
