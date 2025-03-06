# QuickFix AI Home Repair Assistant

An intelligent web application that assists homeowners with DIY repairs using advanced AI image analysis and dynamic, personalized repair guides.

[Live Demo](https://ai-handy-helper-maulikdavra06.replit.app/)

## Features

- **AI-Powered Image Analysis**: Upload photos of repair issues for instant analysis and step-by-step guidance
- **Smart Repair Guides**: Get detailed, personalized repair instructions with difficulty ratings and time estimates
- **Professional Network**: Connect with verified repair professionals in your area
- **Local Hardware Store Locator**: Find parts and materials at nearby stores
- **Responsive Design**: Modern, user-friendly interface that works on all devices

## Tech Stack

- **Frontend**: React with TypeScript
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: wouter
- **Backend**: Express.js
- **AI Integration**: OpenAI GPT-4 Vision API
- **Database**: PostgreSQL with Drizzle ORM

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```
   OPENAI_API_KEY=your_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utility functions
│   │   └── hooks/       # Custom React hooks
├── server/              # Backend Express application
│   ├── lib/            # Server utilities
│   └── routes.ts       # API routes
└── shared/             # Shared types and schemas
```

## Features in Development

- Estimated repair time and difficulty rating for each guide
- Integration with local hardware store inventory systems
- Chat support for real-time repair assistance
- Community features for sharing repair tips and experiences

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
