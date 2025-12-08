# VeAg Client

React application with Firebase authentication and Tailwind CSS.

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase**
   - Copy `.env.example` to `.env`
   - Add your Firebase configuration values to `.env`
   - Get these values from your Firebase Console

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Features

- Landing page with VeAg branding
- Google Sign In with Firebase
- Protected routes for authenticated users
- 7-day authentication cache using localStorage
- Dashboard with 4 main navigation buttons
- Green-themed UI with gradients
- Responsive design with Tailwind CSS

## Environment Variables

Create a `.env` file with the following variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000
```

## Tech Stack

- React 18
- Vite
- React Router DOM
- Firebase Authentication
- Tailwind CSS
- PostCSS
- Axios
