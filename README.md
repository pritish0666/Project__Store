# Project Hub

A modern web application for showcasing personal projects with a Play Store-like experience. Built with Next.js, TypeScript, MongoDB, and Tailwind CSS.

## Features

- 🚀 **Project Showcase**: Display projects with images, descriptions, and tech stacks
- ⭐ **Rating & Reviews**: Users can rate and review projects
- 🔍 **Search & Filter**: Advanced filtering by category, tags, and rating
- 👥 **User Authentication**: OAuth with GitHub and Google
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎨 **Modern UI**: Clean, minimal interface with red accent colors
- 🔧 **Admin Panel**: Manage projects and moderate reviews
- 📊 **Analytics**: Track views, ratings, and user interactions

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: NextAuth.js
- **State Management**: TanStack Query (React Query)
- **Validation**: Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- GitHub OAuth App (optional)
- Google OAuth App (optional)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd project-hub
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/project-hub

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth Providers (optional)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. Start the development server:

```bash
npm run dev
```

5. Seed the database with sample data:

```bash
npm run seed
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── projects/          # Project pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   └── project/          # Project-specific components
├── lib/                  # Utilities and configurations
│   ├── models/           # Mongoose models
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database connection
│   ├── utils.ts          # Utility functions
│   └── validations.ts    # Zod schemas
└── scripts/              # Database scripts
    └── seed.ts           # Seed script
```

## API Endpoints

- `GET /api/projects` - Get projects with filtering
- `GET /api/projects/[slug]` - Get project details
- `POST /api/projects/[slug]/reviews` - Create a review
- `GET /api/projects/[slug]/reviews` - Get project reviews
- `POST /api/analytics/events` - Track analytics events

## Database Schema

The application uses MongoDB with the following main collections:

- **Users**: User profiles and authentication data
- **Projects**: Project information, metadata, and content
- **Reviews**: User reviews and ratings
- **Categories**: Project categories
- **Tags**: Project tags for filtering
- **AnalyticsEvents**: User interaction tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@projecthub.com or create an issue on GitHub.
