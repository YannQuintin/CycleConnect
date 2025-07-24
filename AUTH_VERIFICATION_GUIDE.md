# 🔐 Authentication Flow Verification Guide

This guide will help you verify that the login and registration flows are working correctly and that data is being properly stored in MongoDB.

## 🚀 Quick Verification Steps

### Step 1: Start the Development Environment

```bash
# Start both frontend and backend
npm run dev

# OR start them separately:
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend  
cd client && npm run dev
```

### Step 2: Run Automated Authentication Tests

```bash
# Run comprehensive auth API tests
node verify-auth.js
```

This will test:
- ✅ User registration with new email
- ✅ User login with credentials
- ✅ Token-based authentication
- ✅ Profile retrieval
- ✅ Existing user login

### Step 3: Verify Database Content

```bash
# Check what's actually in MongoDB
cd server && npm run verify-auth
```

This will show:
- 📊 Total users in database
- 👥 All user details (without passwords)
- 🧪 Test user verification
- 🕐 Recent registrations
- 🏥 Database health status

### Step 4: Real-time Database Monitoring

```bash
# Watch database changes in real-time
cd server && npm run watch-db
```

Keep this running and then register a new user in the frontend to see real-time database updates!

## 🧪 Manual Testing Workflow

### Frontend Registration Test

1. **Open** http://localhost:3000
2. **Click** "Register" or navigate to registration page
3. **Fill out the form** with:
   ```
   Email: yourtest@example.com
   Password: testPassword123
   First Name: Test
   Last Name: User
   Experience Level: Intermediate
   ```
4. **Submit** the form
5. **Verify** you get redirected and see a success message
6. **Check** if you're automatically logged in

### Frontend Login Test

1. **Navigate** to login page
2. **Use test credentials**:
   ```
   Email: alice@test.com
   Password: password123
   ```
3. **Submit** the form
4. **Verify** successful login and redirect to dashboard

### Database Verification

After each registration/login:

```bash
# Check if the user was created/authenticated
cd server && npm run verify-auth
```

## 🔍 What to Look For

### ✅ Successful Registration Should Show:

**Frontend:**
- Form submission without errors
- Redirect to dashboard/home page
- User appears logged in
- Token stored in localStorage

**Backend/Database:**
- New user document in MongoDB
- Password is hashed (not plaintext)
- Profile data properly structured
- Cycling preferences saved

**API Response:**
```json
{
  "user": {
    "_id": "...",
    "email": "test@example.com",
    "profile": {
      "firstName": "Test",
      "lastName": "User",
      ...
    },
    "cycling": {
      "experienceLevel": "intermediate"
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### ✅ Successful Login Should Show:

**Frontend:**
- No form validation errors
- Successful redirect
- User state updated in Redux
- Dashboard/protected content accessible

**Backend:**
- 200 status response
- Valid JWT token returned
- User data without password

**Database:**
- No new user created (existing user login)
- User data remains unchanged

### ❌ Common Issues to Watch For:

1. **CORS Errors**
   - Solution: Ensure backend CORS is configured for `http://localhost:3000`

2. **Database Connection Errors**
   - Solution: Ensure MongoDB is running (`brew services start mongodb/brew/mongodb-community`)

3. **Password Validation Issues**
   - Check: Password meets requirements (length, complexity)

4. **Token Storage Issues**
   - Check: Browser localStorage for token
   - Check: Token format (should be JWT)

5. **Profile Data Missing**
   - Check: All required fields are being sent
   - Check: Schema validation passes

## 🛠️ Troubleshooting Commands

```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB if not running
brew services start mongodb/brew/mongodb-community

# Check if backend server is running
curl http://localhost:5000/api/health

# Check if frontend is running
curl http://localhost:3000

# View recent server logs
cd server && npm run dev

# Clear and recreate test data
cd server && npm run seed
```

## 📊 Expected Database Structure

After registration, you should see users in MongoDB with this structure:

```javascript
{
  "_id": ObjectId("..."),
  "email": "test@example.com",
  "password": "$2b$10$..." // Hashed password
  "profile": {
    "firstName": "Test",
    "lastName": "User",
    "verified": false,
    "bio": ""
  },
  "cycling": {
    "experienceLevel": "intermediate",
    "preferredRideTypes": []
  },
  "location": {
    "coordinates": [0, 0],
    "radius": 25
  },
  "createdAt": "2025-01-XX...",
  "updatedAt": "2025-01-XX..."
}
```

## 🎯 Success Criteria

Authentication is working correctly when:

- ✅ New users can register successfully
- ✅ Registration data appears in MongoDB
- ✅ Passwords are properly hashed
- ✅ Users can login with credentials
- ✅ JWT tokens are generated and stored
- ✅ Protected routes are accessible after login
- ✅ User profile data is complete and accurate
- ✅ Frontend state management works correctly
- ✅ No console errors or network failures

Run the verification scripts above to confirm all these criteria are met!
