# MYKA App Installation

A Progressive Web App built with Next.js 14, featuring neobrutalism design and native-like installation capabilities.

## Features

- **Next.js 14** with App Router and TypeScript
- **PWA Support** with next-pwa plugin and Workbox
- **Neobrutalism Design System** with Tailwind CSS
- **Firebase Integration** (ready for setup)
- **Offline Functionality** with service workers
- **Native-like Installation** experience
- **Morning Routine Tracking** - Weight and water intake
- **Todo Management** - Simple task tracking
- **Daily Journaling** - Wins and commitments reflection

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   └── ui/             # UI components (Button, Card, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
public/
├── manifest.json       # App manifest
├── icons/              # App icons
└── screenshots/        # App screenshots
```

## App Configuration

The app is configured with:
- Web App Manifest (`public/manifest.json`)
- Service Worker with caching strategies
- Offline functionality
- Installation prompts for Android/iOS

## Design System

The neobrutalism design system includes:
- Bold, high-contrast colors
- Chunky typography (Inter font family)
- Thick borders and offset shadows
- Geometric shapes and layouts
- Responsive design utilities

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **next-pwa** - PWA plugin for Next.js
- **Workbox** - Service worker library

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components

1. Create component in `src/components/`
2. Export from appropriate index file
3. Use TypeScript interfaces from `src/types/`

## Next Steps

This setup provides the foundation for:
1. Firebase authentication and data persistence
2. Advanced PWA features (push notifications, background sync)
3. Enhanced offline functionality
4. App store deployment preparation

## License

MIT License