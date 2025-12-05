# 🐾 Tamedachi

A gamified media health tracker that helps you navigate your media consumption with confidence while nurturing a virtual pet!

## 🌟 Overview

Tamedachi empowers users to enhance their critical thinking skills by analyzing the quality of media sources they consume. Your virtual pet grows and thrives based on the credibility of the content you engage with, creating a fun and engaging way to build better media literacy habits.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Auth, Database, RLS)
- **AI**: OpenAI API (Content Analysis)
- **Testing**: Vitest + fast-check (Property-Based Testing)
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Fill in your environment variables in `.env.local`:
   - Supabase credentials
   - OpenAI API key
   - App URL

## 🛠️ Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your Tamedachi!

## 🧪 Testing

Run tests:
```bash
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:ui       # Run tests with UI
```

## 🚀 Deployment

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Configure environment variables (see `.env.setup.md`)
4. Deploy!

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `OPENAI_API_KEY` - Your OpenAI API key
- `NEXT_PUBLIC_APP_URL` - Your app URL

See `.env.setup.md` for detailed setup instructions.

## 📁 Project Structure

```
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/
│   ├── services/    # Business logic (Pet, Content Analysis, Submissions)
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Utility functions
├── public/          # Static assets
└── .kiro/specs/     # Feature specifications and design docs
```

## 🎨 Design System

Tamedachi features a whimsical sky theme with:
- Sky blue backgrounds with clouds
- Nature elements (green accents)
- Satellite and decorative elements
- Mobile-first responsive design (440px base)
- Touch-optimized interactions

## 🐣 Features

- **Egg Hatching**: Interactive onboarding with egg-cracking animation
- **Content Analysis**: AI-powered credibility scoring (0-100)
- **Pet Health States**: Visual feedback based on media quality
- **Growth System**: Pet ages based on good content consumption
- **Health Dashboard**: Track your media consumption patterns
- **Growth Timeline**: See your pet's development over time

## 📝 License

Private project - All rights reserved

## 🤝 Contributing

This is a personal project. For questions or suggestions, please open an issue.

---

Made with 💚 for better media literacy
