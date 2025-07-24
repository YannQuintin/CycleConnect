# CycleConnect Types

This directory contains TypeScript type definitions used throughout the frontend application.

## File Organization

- `auth.ts` - Authentication and user-related types
- `ride.ts` - Ride and route-related types  
- `api.ts` - API response and request types
- `common.ts` - Shared/common types
- `socket.ts` - Socket.io event types

## Usage

Import types from these files in your components and utilities:

```typescript
import { User, LoginCredentials } from '@/types/auth';
import { Ride, CreateRideData } from '@/types/ride';
```
