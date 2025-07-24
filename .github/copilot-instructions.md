<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# CycleConnect Development Instructions

This is a full-stack cycling social network application built with:

## Technology Stack
- **Frontend**: React 18 with TypeScript, Redux Toolkit, Material-UI, React Leaflet
- **Backend**: Node.js with Express and TypeScript, Socket.io for real-time features
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with Passport.js

## Project Structure
- `/client` - React TypeScript frontend application
- `/server` - Node.js Express backend API
- Root level contains workspace configuration and documentation

## Development Guidelines
- Use TypeScript for all new code (both frontend and backend)
- Follow component-based architecture for React components
- Use MongoDB aggregation pipelines for complex geospatial queries
- Implement proper error handling with try/catch blocks
- Use Socket.io for real-time features (chat, location updates, ride status)
- Follow RESTful API conventions for HTTP endpoints
- Implement proper authentication middleware for protected routes
- Use Mongoose schemas with proper validation and indexing
- Write unit tests for components and API endpoints

## Key Features to Implement
1. Location-based ride discovery using geospatial queries
2. Real-time chat and location sharing during rides
3. User authentication and profile management
4. Ride creation, joining, and management
5. Safety features including emergency contacts and check-ins
6. Rating and review system for users and rides

## Code Style
- Use consistent naming conventions (camelCase for variables, PascalCase for components)
- Implement proper TypeScript interfaces and types
- Use async/await for asynchronous operations
- Follow React hooks best practices
- Implement proper state management with Redux Toolkit
