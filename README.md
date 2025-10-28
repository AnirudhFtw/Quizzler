# Quizzler Frontend

## About the Application

Quizzler is a comprehensive quiz management platform that enables users to create, share, and take interactive quizzes. The application provides a seamless experience for both quiz creators and participants with features designed for educational institutions, trainers, and quiz enthusiasts.

### Key Features

- **User Authentication**: Secure sign-up and sign-in system with email verification
- **Quiz Types**: Support for both public trivia quizzes and private quizzes
- **CSV Import**: Bulk question import functionality for efficient quiz creation
- **Real-time Quiz Taking**: Interactive quiz interface with timer and violation detection
- **Results & Analytics**: Detailed quiz results with question-by-question review
- **Leaderboards**: Global and quiz-specific rankings for competitive engagement
- **User Profiles**: Personal dashboards with statistics and achievement tracking
- **Responsive Design**: Fully responsive interface optimized for all devices
- **Admin Features**: Quiz management and results monitoring for creators

## Getting Started

### Installation

```sh
# Clone the repository
git clone <repository-url>

# Navigate to the frontend directory
cd Quizzler

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Tech Stack

### Frontend Framework

- **React 18.3.1** - Modern JavaScript library for building user interfaces
- **TypeScript** - Type-safe development with enhanced developer experience
- **Vite** - Fast build tool and development server

### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **shadcn/ui** - Beautiful and accessible React component library

### State Management & Routing

- **React Router DOM** - Declarative routing for React applications
- **Custom Hooks** - Reusable logic for authentication and mobile detection

### API Integration

- **Fetch API** - Modern HTTP client for backend communication
- **Custom API Client** - Centralized API management with error handling

### Additional Libraries

- **Sonner** - Toast notifications for user feedback
- **React Hook Form** - Efficient form handling and validation
- **Date Utilities** - Date formatting and manipulation

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components
├── pages/              # Page components/routes
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API client
├── assets/             # Static assets (images, icons)
└── types/              # TypeScript type definitions
```

## Features Overview

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG compliant components and navigation
- **Performance**: Optimized builds with code splitting
- **Type Safety**: Full TypeScript integration
- **Modern Development**: Hot reload, fast builds, and great DX

## Backend Integration

This frontend connects to a FastAPI backend server that provides:

- RESTful API endpoints
- User authentication with JWT tokens
- PostgreSQL database integration
- Real-time quiz session management
