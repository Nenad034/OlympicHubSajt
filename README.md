# OlympicHub Travel Platform 🌍✈️

A modern, AI-powered travel platform built with Next.js 15 that enables travelers to discover, customize, and book complete travel packages including flights, hotels, and transfers.

## 🎯 Overview

OlympicHub is a dynamic packaging travel engine that provides:
- **Predictive UI**: Adapts based on user context (weather, location, preferences)
- **AI-Powered Search**: Natural language queries for finding perfect trips
- **Interactive Package Builder**: Visual itinerary creation with drag-and-drop
- **Dynamic Pricing**: Real-time margin calculation and opaque pricing
- **Serbian E-Faktura Compliance**: Full support for Serbian electronic invoicing

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, React 19)
- **Styling**: Tailwind CSS
- **Components**: Shadcn/UI (Radix Primitives)
- **Animations**: Framer Motion
- **Maps**: Mapbox GL JS
- **AI**: Vercel AI SDK

### Backend
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API Client**: Custom client for OlympicHub034 integration

### Key Features
- **Packaging Engine**: Dynamic price calculation with margin rules
- **Vector Search**: AI-powered semantic hotel search
- **Fiscal Compliance**: Serbian E-Faktura (SEF) standards, UBL 2.1
- **Multi-Supplier**: Integration with GDS (Amadeus), hotel aggregators, and local contracts

## 📁 Project Structure

```
OlympicHubSajt/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Homepage with HeroSearch
│   ├── globals.css          # Global styles
│   └── package/
│       └── builder/
│           └── page.tsx     # Package builder page
├── components/              # React components
│   ├── hero-search.tsx     # Predictive hero section
│   ├── package-builder.tsx # Interactive package builder
│   ├── ai-travel-agent.tsx # AI chat with generative UI
│   ├── product-json-ld.tsx # SEO structured data
│   └── ui/                 # Shadcn/UI components
├── lib/                    # Core business logic
│   ├── packaging-engine.ts # Dynamic pricing engine
│   ├── api-client.ts       # OlympicHub034 API client
│   └── utils.ts            # Utility functions
├── prisma/
│   └── schema.prisma       # Database schema
├── types/                  # TypeScript types
│   ├── invoice.ts          # E-Faktura types
│   ├── package.ts          # Travel package types
│   └── api.ts              # API request/response types
├── public/                 # Static assets
├── .env.example           # Environment variables template
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind config
└── next.config.js         # Next.js config
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 20+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nenad034/OlympicHubSajt.git
   cd OlympicHubSajt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/olympichub"
   
   # OlympicHub034 API
   OLYMPICHUB_API_URL="https://your-api-url.com"
   OLYMPICHUB_API_KEY="your-api-key"
   
   # Mapbox
   NEXT_PUBLIC_MAPBOX_TOKEN="your-mapbox-token"
   
   # OpenAI
   OPENAI_API_KEY="your-openai-key"
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```
   
   This will create all tables based on the Prisma schema.

5. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

The platform uses a comprehensive schema with the following models:

### Inventory Models
- **Flight**: Cached GDS results with flight details
- **Hotel**: Static hotel information with location and amenities
- **Room**: Room types with pricing
- **Transfer**: Airport and hotel transfers

### Dynamic Packaging
- **PackageBlueprint**: Template packages (e.g., "Summer in Greece")
- **Itinerary**: User-created trip combinations
- **PriceComponent**: Detailed price breakdown
- **MarginRule**: Dynamic pricing rules

### Agency Management
- **Supplier**: External providers (Amadeus, Hotelbeds, etc.)
- **MarginRule**: Markup configuration

### AI & Search
- **HotelEmbedding**: Vector data for semantic search

### Compliance
- **InvoiceData**: Serbian E-Faktura compliance data

## 🔧 Development Workflow

### Running locally
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database management
```bash
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio (visual DB editor)
npm run db:generate  # Generate Prisma Client
```

## 🔗 API Integration

This frontend application communicates with the **olympichub034** backend application for:
- Flight and hotel search
- Availability checking
- Booking creation and management
- Payment processing
- Invoice generation (Serbian E-Faktura)
- CIS payment integration

### API Client Usage

```typescript
import { apiClient } from '@/lib/api-client';

// Search flights
const flights = await apiClient.searchFlights({
  origin: 'BEG',
  destination: 'ATH',
  departureDate: '2024-07-15',
  passengers: 2,
  cabinClass: 'ECONOMY',
});

// Create booking
const booking = await apiClient.createBooking({
  itinerary: selectedItinerary,
  customer: customerData,
  payment: paymentInfo,
});
```

## 🎨 Design Philosophy

### Apple-like Cleanliness
- Minimalist interface with lots of whitespace
- High-quality typography (Inter font)
- Clean, simple layouts
- Focus on content

### Predictive UI
- Adapts before user clicks
- Weather-based destination suggestions
- Preference-based recommendations
- Smart defaults

### Performance
- Instant page transitions with Link prefetching
- Optimized images with next/image
- Server-side rendering for LCP optimization
- Framer Motion for smooth animations

## 🔐 Security & Privacy

This is a public repository with the following security measures:

- ✅ All API keys are in `.env` (not committed)
- ✅ `.env.example` contains only placeholder values
- ✅ No real credentials or sensitive data in code
- ✅ API keys should be added locally

### Adding Real Credentials

1. Copy `.env.example` to `.env`
2. Replace placeholder values with real credentials
3. Never commit `.env` to version control

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm run start
```

Set environment variables on your hosting platform.

## 📝 Key Components

### HeroSearch (`components/hero-search.tsx`)
- Predictive hero section that adapts to user context
- Natural language search input
- Weather-based destination suggestions
- Framer Motion animations

### PackageBuilder (`components/package-builder.tsx`)
- Split-screen layout with timeline and map
- Drag-and-drop itinerary customization
- Smooth layoutId animations
- Sticky price summary footer

### AiTravelAgent (`components/ai-travel-agent.tsx`)
- Vercel AI SDK integration
- Generative UI - renders React components in chat
- Context-aware recommendations
- Natural language understanding

### PackagingEngine (`lib/packaging-engine.ts`)
- Dynamic price calculation
- Margin rule application
- Opaque pricing (hides component breakdown)
- Tax calculation

## 🧪 Testing

```bash
npm run test        # Run tests (when implemented)
npm run test:e2e    # Run E2E tests (when implemented)
```

## 📱 Responsive Design

The platform is fully responsive with mobile-first design:
- Mobile: Single column layouts
- Tablet: Adaptive grids
- Desktop: Full split-screen experiences

## 🌍 Internationalization

Currently supports:
- Serbian (sr-RS) - Primary language
- English (en) - Coming soon

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙋 Support

For support, contact: support@olympichub.com

## 🔮 Roadmap

- [ ] Complete Mapbox integration in Package Builder
- [ ] Implement actual AI search with OpenAI
- [ ] Add payment gateway integration
- [ ] Serbian E-Faktura API connection
- [ ] User authentication and profiles
- [ ] Booking history and management
- [ ] Multi-language support
- [ ] Mobile app (React Native)

## 👥 Team

- **Backend Architecture**: Senior Backend Architect
- **Frontend & UX**: Lead Frontend Engineer

---

Built with ❤️ using Next.js 15 and modern web technologies
