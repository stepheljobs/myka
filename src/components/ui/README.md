# Neobrutalism Design System

This directory contains the complete neobrutalism design system components for the MYKA application.

## Components

### Button
A versatile button component with neobrutalist styling.

**Props:**
- `variant`: 'primary' | 'secondary' | 'accent'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `shadow`: 'none' | 'sm' | 'md' | 'lg' | 'brutal'
- `fullWidth`: boolean
- `loading`: boolean

**Usage:**
```tsx
<Button variant="primary" size="lg" shadow="brutal">
  Click Me
</Button>
```

### Card
A container component with neobrutalist borders and shadows.

**Props:**
- `variant`: 'primary' | 'secondary' | 'accent'
- `shadow`: 'none' | 'sm' | 'md' | 'lg' | 'brutal'
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `hover`: boolean
- `border`: boolean

**Usage:**
```tsx
<Card variant="primary" shadow="lg" hover>
  Card content
</Card>
```

### Input
A form input component with labels, errors, and helper text.

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `variant`: 'primary' | 'secondary' | 'accent'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `shadow`: 'none' | 'sm' | 'md' | 'lg' | 'brutal'

**Usage:**
```tsx
<Input 
  label="Email" 
  placeholder="Enter email"
  error="Invalid email"
  helperText="We'll never share your email"
/>
```

### Typography
A flexible text component for all typography needs.

**Props:**
- `variant`: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'mono'
- `weight`: 'normal' | 'medium' | 'bold' | 'brutal'
- `color`: 'black' | 'gray' | 'white' | 'orange' | 'green' | 'yellow' | 'pink' | 'blue' | 'purple' | 'red'
- `as`: HTML element to render as

**Usage:**
```tsx
<Typography variant="h1" weight="brutal" color="orange">
  Main Heading
</Typography>
```

### Grid
A responsive grid layout component.

**Props:**
- `cols`: 1 | 2 | 3 | 4 | 6 | 12
- `gap`: 'sm' | 'md' | 'lg' | 'xl'
- `responsive`: boolean

**Usage:**
```tsx
<Grid cols={3} gap="lg">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
```

### Shape
Geometric shape components for visual elements.

**Props:**
- `shape`: 'square' | 'rectangle' | 'circle' | 'triangle'
- `color`: 'orange' | 'green' | 'yellow' | 'pink' | 'blue' | 'purple' | 'red' | 'white' | 'black'
- `variant`: 'primary' | 'secondary' | 'accent'
- `shadow`: 'none' | 'sm' | 'md' | 'lg' | 'brutal'

**Usage:**
```tsx
<Shape shape="circle" color="orange" shadow="md">
  Content
</Shape>
```

## Design Tokens

### Colors
- `brutal-black`: #000000
- `brutal-white`: #FFFFFF
- `brutal-orange`: #FF6B35
- `brutal-green`: #00D4AA
- `brutal-yellow`: #FFE66D
- `brutal-pink`: #FF006E
- `brutal-blue`: #0077FF
- `brutal-purple`: #8338EC
- `brutal-red`: #FF3333
- `brutal-gray`: #808080
- `brutal-light-gray`: #F5F5F5

### Typography
- **Headings**: Inter with font-weight 900
- **Body**: Inter with font-weight 600
- **Monospace**: JetBrains Mono with font-weight 600

### Shadows
- `brutal-sm`: 2px 2px 0px 0px #000000
- `brutal-md`: 4px 4px 0px 0px #000000
- `brutal-lg`: 6px 6px 0px 0px #000000
- `brutal-xl`: 8px 8px 0px 0px #000000
- `brutal-2xl`: 12px 12px 0px 0px #000000
- `brutal-3xl`: 16px 16px 0px 0px #000000

### Borders
- `brutal-thin`: 2px
- `brutal`: 3px
- `brutal-thick`: 5px

## Responsive Design

The design system follows a mobile-first approach with the following breakpoints:

- `brutal-xs`: 475px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## Utility Classes

### Layout
- `.brutal-container`: Responsive container with proper padding
- `.brutal-grid`: Grid layout with responsive gaps
- `.brutal-flex`: Flexible layout with responsive direction

### Interactions
- `.brutal-touch-target`: Minimum 44px touch targets
- `.brutal-hover-lift`: Hover effect with shadow and transform
- `.brutal-press-effect`: Active press animation

### Shapes
- `.shape-brutal-square`: Square aspect ratio with border and shadow
- `.shape-brutal-rectangle`: Video aspect ratio with styling
- `.shape-brutal-circle`: Circular shape with border

## Best Practices

1. **Touch Targets**: All interactive elements should be at least 44px in height/width
2. **Contrast**: Maintain high contrast ratios for accessibility
3. **Shadows**: Use consistent shadow patterns for depth hierarchy
4. **Borders**: Always use thick borders (3px minimum) for the brutal aesthetic
5. **Typography**: Use bold weights for headings and medium weights for body text
6. **Responsive**: Design mobile-first and enhance for larger screens
7. **Animation**: Keep animations short (100ms) and purposeful

## Accessibility

- All components support keyboard navigation
- Color combinations meet WCAG AA contrast requirements
- Focus states are clearly visible with brutal styling
- Screen reader support through proper semantic HTML
- Touch targets meet minimum size requirements (44px)