# Personal Alignment Week

A single-user, one-week dashboard for rebuilding self-trust and tracking alignment between intentions, actions, and self-respect.

**Operation Time Respect: Oct 28 – Nov 3, 2024**

## Features

- 🌦️ **Task Weather System**: Visual metaphor showing mental clarity as tasks are completed
- 📅 **Daily Cards**: Track tasks, habits, reflections, and alignment scores for each day
- 🎯 **Drag & Drop**: Assign tasks from the cloud pool to specific days
- 🤖 **AI Task Extraction**: Use natural language to automatically break down tasks (free LLM integration)
- ✅ **Habit Tracking**: 5 key habits to build consistency
- 📝 **Daily Reflections**: Prompts for self-awareness and boundary-setting
- 📊 **Weekly Summary**: Visual score chart and end-of-week reflection
- 🔐 **Simple Auth**: Password protection for privacy
- 📆 **Dynamic Weeks**: Create and manage multiple weeks with custom date ranges

## Tech Stack

- React 18 + TypeScript
- Vite (fast development)
- Tailwind CSS (styling)
- Framer Motion (animations)
- @dnd-kit/core (drag-and-drop)
- LocalStorage (data persistence)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your configuration:
```bash
# Required: App password for authentication
VITE_APP_PASSWORD=your_secure_password

# Optional: Groq API key for AI task extraction
# Get a free API key at https://console.groq.com (14,400 requests/day free tier)
VITE_GROQ_API_KEY=your_groq_api_key_here
```

**Note:** The AI task extraction feature is optional. If you don't set `VITE_GROQ_API_KEY`, you can still use manual task entry and bulk add.

3. Start the dev server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. **Set Environment Variables** in Vercel project settings:
   - Go to your project → Settings → Environment Variables
   - Add the following:
     - `VITE_APP_PASSWORD` = your secure password
     - `VITE_GROQ_API_KEY` = your Groq API key (optional)
4. Deploy - Vercel will automatically deploy on push

**Important:** Environment variables must be set in your deployment platform (Vercel, Netlify, etc.) for them to work in production. The `.env` file is only for local development.

## Design Philosophy

- **Not scalable. Not a product.** This is a self-contained, aesthetic, emotionally intelligent dashboard.
- **Weather metaphor**: Stormy → Cloudy → Clear → Sunny as tasks complete
- **Encouragement style**: Supportive, witty, self-aware
- **Theme**: Brain clarity, self-respect, honest progress tracking

## Key Microcopy

- "Done is allowed."
- "Storm's clearing."
- "Say it ugly, not pretty."
- "It's fine if today was 4/10. 4 is data."

## License

Personal project. Not intended for commercial use.

