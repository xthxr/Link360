# Piik.me Landing Page

A high-performance, dark-mode landing page for Piik.me - The Intelligence Layer for Your Links. Inspired by the Factory.ai aesthetic.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 15, React 19, TypeScript, and Tailwind CSS
- **Stunning Animations**: Smooth scroll animations and hover effects using Framer Motion
- **Dark Mode Design**: Deep black background with Electric Lime and Cyan gradient accents
- **Glassmorphism UI**: Beautiful glass-effect components with backdrop blur
- **Fully Responsive**: Mobile-first design with hamburger menu
- **Performance Optimized**: Server-side rendering with Next.js App Router

## 🎨 Design Elements

- **Background**: Deep black (#000102) with radial gradients
- **Primary Colors**: Electric Lime (#CCFF00) and Electric Cyan (#00FFFF)
- **Effects**: Glassmorphism (blur: 12px), glow effects, pulse animations
- **Typography**: Bold sans-serif headings with tight tracking

## 📦 Components

### Navigation
Sticky glassmorphism header with:
- Logo with brand colors
- Desktop navigation links (Features, Pricing, Sign In)
- Mobile hamburger menu with smooth transitions
- "Get Started" CTA button

### Hero Section
Minimalist hero with:
- Large headline with gradient text
- Animated gradient orbs in background
- Glowing URL input field with pulse effect on focus
- Stats grid (10M+ Links, 99.9% Uptime, 150+ Countries)

### Features (Bento Grid)
Responsive grid showcasing:
- Real-time Analytics with chart visualization
- AI-powered Routing
- Custom Branded Links
- API for Developers with code snippet
- 4 additional feature badges (Uptime, Speed, Security, CDN)

### Social Proof
Auto-scrolling logo strip featuring trusted companies

### Footer
Four-column layout with:
- Product, Company, Resources, and Developers links
- System Status indicator with animated pulse
- Social media links (Twitter, GitHub, LinkedIn, Email)
- Copyright information

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.9
- **React**: 19.0.0
- **TypeScript**: ^5
- **Styling**: Tailwind CSS 3.4.1
- **Animations**: Framer Motion 11.15.0
- **Icons**: Lucide React 0.468.0
- **Package Manager**: npm

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd c:\Zaplink\public\landing
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Project Structure

```
landing/
├── app/
│   ├── globals.css          # Global styles and Tailwind directives
│   ├── layout.tsx           # Root layout with fonts and metadata
│   └── page.tsx             # Main page integrating all components
├── components/
│   ├── Navigation.tsx       # Sticky header with glassmorphism
│   ├── Hero.tsx             # Hero section with URL input
│   ├── Features.tsx         # Bento grid feature showcase
│   ├── SocialProof.tsx      # Scrolling logo strip
│   └── Footer.tsx           # Footer with status indicator
├── .github/
│   └── copilot-instructions.md  # Project setup instructions
├── tailwind.config.ts       # Tailwind configuration with custom theme
├── tsconfig.json            # TypeScript configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize theme colors:
```typescript
colors: {
  "deep-black": "#000102",
  "electric-lime": "#CCFF00",
  "electric-cyan": "#00FFFF",
}
```

### Animations
Modify Framer Motion animations in individual components. Key animation properties:
- `initial` - Starting state
- `animate` - End state
- `whileHover` - Hover effects
- `transition` - Animation timing

### Content
Update component content directly in:
- Hero headline: `components/Hero.tsx`
- Features: `components/Features.tsx`
- Footer links: `components/Footer.tsx`

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Build for Production
```bash
npm run build
npm start
```

## 📄 License

This project is built for Piik.me.

## 🙏 Acknowledgments

- Design inspired by [Factory.ai](https://factory.ai)
- Built with [Next.js](https://nextjs.org)
- Animations by [Framer Motion](https://www.framer.com/motion)
- Icons by [Lucide](https://lucide.dev)

---

Built with ❤️ for modern link management
