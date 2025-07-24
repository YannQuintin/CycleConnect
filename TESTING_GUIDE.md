# 🧪 CycleConnect Testing Guide

## Quick Start

1. **Run the setup script:**
   ```bash
   chmod +x setup-test.sh
   ./setup-test.sh
   ```

2. **Start the development servers:**
   ```bash
   npm run dev
   ```

3. **Test the API endpoints:**
   ```bash
   node test-api.js
   ```

## Test Users

Three test users have been created with different experience levels:

| Email | Password | Name | Experience Level | Preferred Rides |
|-------|----------|------|------------------|-----------------|
| `alice@test.com` | `password123` | Alice Johnson | Advanced | Mountain Biking, Gravel, Training |
| `bob@test.com` | `password123` | Bob Smith | Intermediate | Road Cycling, Social, Commute |
| `charlie@test.com` | `password123` | Charlie Davis | Beginner | City Tour, Social, Training |

## Test Rides Created

1. **Golden Gate Bridge Morning Ride** (Intermediate)
   - Organizer: Alice
   - Start: Crissy Field, SF
   - End: Sausalito, CA
   - Distance: 15.5km

2. **Twin Peaks Climb Challenge** (Advanced)
   - Organizer: Bob
   - Start: Market Street, SF
   - End: Twin Peaks, SF
   - Distance: 8.2km

3. **Beginner-Friendly Bay Trail Tour** (Beginner)
   - Organizer: Alice
   - Start: Embarcadero, SF
   - End: Aquatic Park, SF
   - Distance: 5.8km

4. **Weekend Warriors Group Ride** (Intermediate)
   - Organizer: Charlie
   - Start: Golden Gate Park, SF
   - End: Ocean Beach, SF
   - Distance: 12.3km

## Manual Testing Scenarios

### 1. Authentication Flow
- [ ] Register a new user
- [ ] Login with test credentials
- [ ] Access protected routes
- [ ] Logout and verify token removal

### 2. Ride Management
- [ ] View all rides
- [ ] Filter rides by difficulty/type
- [ ] Search rides by location (use "Nearby Rides" toggle)
- [ ] Create a new ride
- [ ] View ride details
- [ ] Join a ride (with different users)
- [ ] Leave a ride

### 3. Profile Management
- [ ] View user profile
- [ ] Edit profile information
- [ ] Update cycling preferences
- [ ] View ride statistics

### 4. Real-time Chat
- [ ] Join a ride as a participant
- [ ] Open the chat component
- [ ] Send messages between different users
- [ ] Verify message persistence

### 5. Geospatial Features
- [ ] Enable "Nearby Rides" filter
- [ ] Adjust search radius
- [ ] Verify location-based filtering

## API Endpoints to Test

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Rides
- `GET /api/rides` - Get all rides
- `GET /api/rides/nearby` - Get nearby rides
- `GET /api/rides/:id` - Get ride details
- `POST /api/rides` - Create new ride
- `POST /api/rides/:id/join` - Join ride
- `POST /api/rides/:id/leave` - Leave ride

### Users
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id` - Get user by ID

### Health Check
- `GET /api/health` - Server health status

## Troubleshooting

### Common Issues

1. **MongoDB Not Connected**
   ```bash
   # Start MongoDB
   brew services start mongodb/brew/mongodb-community
   ```

2. **Port Already in Use**
   ```bash
   # Kill processes on ports 3000 and 5000
   lsof -ti:3000 | xargs kill -9
   lsof -ti:5000 | xargs kill -9
   ```

3. **CORS Errors**
   - Ensure both frontend and backend are running
   - Check that CLIENT_URL is set correctly in backend

4. **Socket.IO Connection Issues**
   - Verify WebSocket connections in browser dev tools
   - Check for firewall blocking WebSocket connections

## Testing Checklist

- [ ] All API endpoints respond correctly
- [ ] Authentication works end-to-end
- [ ] Ride CRUD operations function properly
- [ ] Real-time chat is operational
- [ ] Geospatial search returns appropriate results
- [ ] UI is responsive and error-free
- [ ] Database persistence works correctly
