# Design Document

## Overview

This document outlines the design for transforming the existing PWA landing page into "My Kaizen App" (MYKA), a comprehensive fitness tracking application. The design maintains the existing neobrutalist design system while creating a mobile-first, fitness-focused user experience that showcases the app's core tracking capabilities: water intake, weight, calories, protein, workouts, journaling, and reminders.

The design philosophy centers around the concept of "kaizen" (continuous improvement), emphasizing progress tracking and habit building through bold, encouraging visual design that motivates users to start and maintain their fitness journey.

## Architecture

### Component Structure
```
src/app/page.tsx (MYKA Landing Page)
├── Header (Mobile-optimized navigation)
├── Hero Section (MYKA branding and motivation)
├── Features Grid (6 core fitness tracking features)
├── Progress Showcase (Visual progress indicators)
├── Call-to-Action Section (Journey start)
└── Installation Prompts (PWA installation)
```

### Design System Integration
- Leverages existing neobrutalist components (Button, Card, Typography, Grid, Shape)
- Maintains brutal design tokens (shadows, borders, typography)
- Introduces fitness-appropriate color schemes within existing palette
- Preserves PWA installation and authentication flows

### Mobile-First Approach
- Single-column layout optimized for mobile screens
- Touch-friendly interaction targets (minimum 44px)
- Stacked card arrangements for easy scrolling
- Compact header with essential navigation only

## Components and Interfaces

### Header Component
**Purpose**: Mobile-optimized navigation with MYKA branding
**Design**:
- Use existing header structure with `brutal-container` and `py-4` spacing
- Apply `border-b-brutal border-brutal-black shadow-brutal-sm` classes
- MYKA branding using Typography component with `variant="h4" weight="brutal"`
- Right-aligned buttons using existing Button component with `variant` and `size` props
- Maintain `flex items-center justify-between` layout with `space-x-3` for buttons

### Hero Section
**Purpose**: Primary brand introduction and motivation
**Design**:
- Typography component with `variant="h1" weight="brutal"` for MYKA heading
- Use `mb-brutal-lg text-center` classes for spacing and alignment
- Card component with `shadow="brutal" hover` props for main content area
- Typography `variant="h2" weight="brutal"` for welcome message
- Typography `variant="body"` with `text-brutal-gray` for descriptions
- Button components using `brutal-flex` layout with existing size and variant props

### Features Grid
**Purpose**: Showcase 6 core fitness tracking capabilities
**Design**:
- Grid component with `cols={2}` for mobile, responsive to larger screens
- Use `gap="lg"` prop and `mb-brutal-lg` class
- Each Card component uses `variant="primary" shadow="lg" hover` props
- Shape components with appropriate `shape`, `color`, and `className="w-16 h-16 mb-brutal-sm mx-auto"` props
- Typography components: `variant="h4" weight="brutal" color="black"` for emojis
- Typography `variant="h5" weight="brutal"` with `mb-brutal-xs text-center` for titles
- Typography `variant="caption"` with `text-center text-brutal-gray` for descriptions

**Feature Cards** (using brutal framework):
1. **Water Intake**: 💧 in Shape `shape="circle" color="blue"` - "Stay Hydrated"
2. **Daily Weight**: ⚖️ in Shape `shape="square" color="green"` - "Track Progress"  
3. **Calories**: � inp Shape `shape="triangle" color="orange"` - "Fuel Your Body"
4. **Protein**: 💪 in Shape `shape="rectangle" color="purple"` - "Build Strength"
5. **Workouts**: 🏋️ in Shape `shape="circle" color="red"` - "Log Sessions"
6. **Journal**: 📝 in Shape `shape="square" color="yellow"` - "Reflect Daily"

### Progress Showcase Section
**Purpose**: Visual demonstration of progress tracking
**Design**:
- Card with sample progress indicators
- Mock data showing improvement over time
- Encouraging copy about seeing results
- Visual elements like progress bars or charts using shapes

### Call-to-Action Section
**Purpose**: Convert visitors to users
**Design**:
- Prominent card with journey-focused messaging
- "Start Your Kaizen Journey" or similar motivational CTA
- Benefits summary (holistic tracking, habit building)
- Large, touch-friendly button

### Installation Section
**Purpose**: Maintain PWA installation capabilities
**Design**:
- Contextual messaging about having MYKA on home screen
- Fitness app benefits of native installation
- Platform-appropriate installation flows
- Success state for already installed users

## Data Models

### Page State Interface
```typescript
interface LandingPageState {
  isAuthenticated: boolean;
  canInstall: boolean;
  isInstalled: boolean;
  platform: 'android' | 'ios' | 'desktop';
  shouldShowPrompt: boolean;
  showInstallModal: boolean;
}
```

### Feature Card Interface
```typescript
interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  shapeType: 'circle' | 'square' | 'triangle' | 'rectangle';
  shapeColor: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'yellow';
}
```

## Error Handling

### Authentication State
- Graceful handling of authentication loading states
- Appropriate button states for authenticated vs unauthenticated users
- Fallback navigation options if auth context fails

### Installation Capabilities
- Progressive enhancement for PWA installation features
- Fallback messaging if installation APIs are unavailable
- Platform detection error handling

### Responsive Design
- Graceful degradation for unsupported screen sizes
- Fallback layouts if CSS Grid is unavailable
- Touch target accessibility on all devices

## Testing Strategy

### Visual Regression Testing
- Screenshot comparisons for mobile and desktop layouts
- Feature card rendering across different screen sizes
- Authentication state variations
- Installation prompt appearances

### Interaction Testing
- Touch target accessibility (minimum 44px)
- Button hover and active states
- Card hover effects and animations
- Navigation flow testing

### Responsive Testing
- Mobile-first layout verification
- Grid system behavior across breakpoints
- Typography scaling and readability
- Image and icon rendering

### Accessibility Testing
- Keyboard navigation through all interactive elements
- Screen reader compatibility for fitness content
- Color contrast validation for new fitness-themed colors
- Focus state visibility

### Performance Testing
- Page load speed optimization
- Image and icon loading performance
- Animation performance on mobile devices
- PWA installation prompt timing

## Visual Design Specifications

### Color Scheme
**Primary Colors** (from existing brutal palette):
- Headers: `brutal-black` (#000000)
- Background: `brutal-white` (#FFFFFF)
- Borders: `brutal-black` (#000000)

**Feature-Specific Colors**:
- Water: `brutal-blue` (#0077FF)
- Weight/Progress: `brutal-green` (#00D4AA)
- Calories: `brutal-orange` (#FF6B35)
- Protein: `brutal-purple` (#8338EC)
- Workouts: `brutal-red` (#FF3333)
- Journal: `brutal-yellow` (#FFE66D)

### Typography
- **App Name**: Typography variant="h1" weight="brutal"
- **Section Headers**: Typography variant="h2" weight="brutal"
- **Feature Titles**: Typography variant="h5" weight="brutal"
- **Descriptions**: Typography variant="body" with `text-brutal-gray`
- **CTAs**: Typography variant="h4" weight="brutal"

### Spacing and Layout (Using Brutal Framework)
- **Container**: `brutal-container` class with responsive padding
- **Section Spacing**: `mb-brutal-lg` utility class between major sections
- **Card Spacing**: `mb-brutal-md` utility class between cards
- **Grid Layout**: `brutal-grid` with `gap="md"` for mobile, `gap="lg"` for larger screens
- **Flex Layout**: `brutal-flex` for button groups and horizontal layouts

### Shadows and Borders (Brutal Design System)
- **Primary Cards**: `shadow="brutal"` prop with `border-brutal` class
- **Feature Cards**: `shadow="lg"` prop with `brutal-hover-lift` class for interactions
- **Buttons**: `shadow="brutal"` prop for primary actions
- **Shapes**: Use Shape component with brutal shadow variants (`shadow="md"`, `shadow="lg"`)
- **Borders**: Apply `border-brutal`, `border-brutal-thick` classes consistently

### Mobile Optimizations
- **Touch Targets**: Use `.brutal-touch-target` class for minimum 44px interactive elements
- **Grid Layout**: Utilize `brutal-grid` with responsive breakpoints
- **Typography Scale**: Leverage brutal typography variants with responsive classes
- **Spacing**: Apply `brutal-container` and brutal spacing utilities

### Neobrutalism CSS Framework Integration
- **Layout Classes**: `brutal-container`, `brutal-grid`, `brutal-flex`
- **Interaction Classes**: `brutal-touch-target`, `brutal-hover-lift`, `brutal-press-effect`
- **Shape Classes**: `shape-brutal-square`, `shape-brutal-circle` for feature icons
- **Responsive Classes**: Use brutal breakpoint system (`brutal-xs`, `sm`, `md`, `lg`, `xl`)
- **Utility Classes**: Leverage all existing brutal spacing, color, and layout utilities

## Implementation Notes

### Existing Component Reuse
- Leverage all existing UI components (Button, Card, Typography, Grid, Shape) without modification
- Use existing brutal design tokens and CSS classes throughout
- Maintain current authentication and installation hooks
- Preserve existing routing and navigation patterns
- Keep current PWA functionality intact
- Apply brutal utility classes for consistent styling

### Content Strategy
- Motivational, progress-focused messaging throughout
- Fitness terminology that appeals to beginners and enthusiasts
- Clear value propositions for each tracking feature
- Encouraging language that emphasizes habit building

### Performance Considerations
- Optimize emoji/icon rendering for mobile devices
- Minimize layout shifts during authentication state changes
- Efficient grid rendering for feature cards
- Smooth animations that don't impact mobile performance