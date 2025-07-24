# CycleConnect - Cycling Social Network

A location-based social networking platform designed specifically for cyclists to discover, organize, and join rides within their local geographical area.

## Features

🚴‍♂️ **Location-Based Ride Discovery**: Find rides within customizable radius
🗺️ **Interactive Maps**: Visual representation of ride routes and meeting points  
💬 **Real-time Chat**: In-app communication for ride coordination
👥 **Social Features**: User profiles, ratings, and following system
🔒 **Safety & Trust**: Identity verification and emergency features
📱 **Smart Matching**: AI-powered recommendations based on experience and preferences

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Material-UI (MUI)** for consistent design
- **React Leaflet** for mapping functionality
- **Socket.io-client** for real-time features

### Backend
- **Node.js** with Express and TypeScript
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **JWT** authentication with Passport.js

### Development Tools
- **Vite** for fast development and building
- **ESLint** and **Prettier** for code quality
- **Jest** and **Vitest** for testing

## Project Structure

```
CycleConnect/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript type definitions
│   └── package.json
├── server/                # Node.js backend API
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Express middleware
│   │   └── socket/        # Socket.io handlers
│   └── package.json
└── package.json           # Root workspace configuration
```

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **MongoDB** 6.x (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CycleConnect
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy server environment template
   cp server/.env.example server/.env
   
   # Edit server/.env with your configuration:
   # - MongoDB connection string
   # - JWT secret key
   # - Email service credentials (optional)
   ```

4. **Start development servers**
   ```bash
   # Start both frontend and backend in development mode
   npm run dev
   
   # Or start them separately:
   npm run server:dev  # Backend on http://localhost:5000
   npm run client:dev  # Frontend on http://localhost:3000
   ```

### Environment Setup

Create a `server/.env` file with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cycleconnect
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000

# Optional: Email service configuration
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@cycleconnect.com
```

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run install:all` - Install dependencies for all packages
- `npm test` - Run tests for both frontend and backend

### Backend (server/)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run backend tests

### Frontend (client/)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run frontend tests

## Key Features to Implement

### Core Functionality
- [x] User authentication and registration
- [x] User profiles with cycling preferences
- [x] Location-based ride discovery
- [x] Ride creation and management
- [x] Real-time chat for rides
- [ ] Interactive map with route planning
- [ ] Join/leave ride functionality
- [ ] User ratings and reviews

### Advanced Features
- [ ] Push notifications for new rides
- [ ] Emergency SOS functionality
- [ ] Integration with fitness apps (Strava, Garmin)
- [ ] Weather integration
- [ ] Premium subscription features
- [ ] Social features (following, feed)

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow component-based architecture for React
- Use async/await for asynchronous operations
- Implement proper error handling
- Write unit tests for components and API endpoints

### Database Design
- Use MongoDB with proper indexing for geospatial queries
- Implement data validation at both client and server levels
- Use Mongoose schemas with proper validation

### Security
- JWT token-based authentication
- Input validation and sanitization
- Rate limiting for API endpoints
- Secure password hashing with bcrypt

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.
