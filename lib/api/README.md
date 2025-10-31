# API Structure - Industry Best Practices

## Overview

The API layer has been completely reorganized following industry standards used by companies like Airbnb, Uber, and Stripe. This eliminates code duplication and creates a maintainable, scalable structure.

## Structure

```
lib/api/
├── config.ts          # Centralized configuration (API_BASE, storage keys)
├── client.ts          # Reusable HTTP client utilities
├── user.api.ts        # User-related endpoints
├── rider.api.ts       # Rider-related endpoints
├── admin.api.ts       # Admin-related endpoints
├── restaurant.api.ts  # Restaurant-related endpoints (auth, profile, menu, etc.)
└── index.ts           # Central export point
```

## Key Benefits

### 1. **No Code Duplication**
- ✅ API_BASE defined **once** in `config.ts` (previously in 3 files)
- ✅ Token management handled by `client.ts` utilities (previously repeated 20+ times)
- ✅ Error handling centralized in `ApiError` class
- ✅ Headers automatically injected (no manual Authorization headers)

### 2. **Type Safety**
- All requests are type-safe with generics: `apiRequest<T>()`
- TypeScript IntelliSense works perfectly
- Compile-time error checking

### 3. **Separation of Concerns**
- **config.ts**: Configuration only
- **client.ts**: HTTP utilities only
- **\*.api.ts**: Business logic organized by domain

### 4. **Easy to Extend**
- Add new endpoints by creating new functions
- Add new domains by creating new `*.api.ts` files
- No need to modify existing code

## Files Explained

### `config.ts` - Configuration Hub
```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api",
  TIMEOUT: 30000,
};

export const STORAGE_KEYS = {
  USER_TOKEN: "token",
  RESTAURANT_TOKEN: "restaurantToken",
  RIDER_TOKEN: "riderToken",
  ADMIN_TOKEN: "adminToken",
};
```

**Purpose**: Single source of truth for all configuration.

### `client.ts` - HTTP Client
```typescript
// Main request handler
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T>

// FormData handler (for file uploads)
export async function apiRequestFormData<T>(
  endpoint: string,
  formData: FormData,
  options: RequestOptions = {}
): Promise<T>

// Token helpers
export function getToken(tokenKey: string): string | null
export function setToken(tokenKey: string, token: string): void
export function removeToken(tokenKey: string): void
```

**Key Features**:
- Automatic token injection via `tokenKey` parameter
- Centralized error handling with `ApiError` class
- JSON parsing built-in
- FormData support for file uploads

### `restaurant.api.ts` - Restaurant Domain
```typescript
// Grouped by feature
export const restaurantAuth = {
  signup: (data) => ...,
  login: (data) => ...,
};

export const restaurantProfile = {
  get: () => ...,
  update: (data) => ...,
};

export const restaurantPublic = {
  getAll: (params) => ...,
  getBySlug: (slug) => ...,
};

export const menuCategories = {
  getAll: (slug) => ...,
  create: (slug, data) => ...,
  update: (slug, categoryId, data) => ...,
  delete: (slug, categoryId) => ...,
};

export const menuItems = {
  getAll: (slug, categoryId) => ...,
  create: (slug, categoryId, formData) => ...,
  update: (slug, categoryId, itemId, formData) => ...,
  delete: (slug, categoryId, itemId) => ...,
};

// Legacy exports for backward compatibility
export const registerRestaurant = restaurantAuth.signup;
export const loginRestaurant = restaurantAuth.login;
export const getRestaurantProfile = restaurantProfile.get;
// ... etc
```

**Features**:
- Logical grouping by feature
- **Backward compatibility** with old function names
- Clean, self-documenting API

## Usage Examples

### Before (Old Way)
```typescript
// In authService.ts
const API_BASE = "http://localhost:4000/api";

export async function loginRestaurant(credentials) {
  const token = localStorage.getItem("restaurantToken"); // Repeated everywhere
  
  try {
    const res = await fetch(`${API_BASE}/restaurant/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Manual headers
      },
      body: JSON.stringify(credentials),
    });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Unknown" }));
      throw new Error(err.message);
    }
    
    return await res.json();
  } catch (err: any) {
    throw new Error(err.message || "Failed to login");
  }
}
```

### After (New Way)
```typescript
// In restaurant.api.ts
import { apiRequest } from "./client";
import { STORAGE_KEYS } from "./config";

export const restaurantAuth = {
  login: (data: RestaurantLoginPayload) =>
    apiRequest<RestaurantAuthResponse>("/restaurant/login", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true, // No token needed for login
    }),
};
```

**Improvements**:
- 20+ lines → 7 lines
- No manual token management
- No manual error handling
- No repeated API_BASE
- Type-safe with generics
- Centralized configuration

### Using the New API

```typescript
// Import from the central point
import { restaurantAuth, restaurantProfile } from "@/lib/api";

// Or import everything
import * as api from "@/lib/api";

// Login
const result = await restaurantAuth.login({
  email: "owner@restaurant.com",
  password: "password123"
});

// Get profile (token automatically injected)
const profile = await restaurantProfile.get();

// Update profile
await restaurantProfile.update({
  ownerFirstName: "John",
  ownerLastName: "Doe",
  phone: "+1234567890"
});
```

## Backward Compatibility

All existing function names are preserved:

```typescript
// Old imports still work!
import { 
  loginRestaurant,          // → restaurantAuth.login
  getRestaurantProfile,     // → restaurantProfile.get
  getAllRestaurants,        // → restaurantPublic.getAll
  createMenuCategory,       // → menuCategories.create
} from "@/lib/api/restaurant";
```

This means **no breaking changes** - existing code continues to work while new code can use the improved structure.

## Migration Plan

### Phase 1: ✅ Complete
- Created `lib/api/config.ts` with centralized configuration
- Created `lib/api/client.ts` with reusable utilities
- Created `lib/api/*.api.ts` files for each domain
- Added backward compatibility exports

### Phase 2: Update Imports (Next Step)
```typescript
// Find and replace across codebase:
import { ... } from "@/lib/authService"
// → 
import { ... } from "@/lib/api/user"

import { ... } from "@/lib/restaurantService"
// →
import { ... } from "@/lib/api/restaurant"
```

### Phase 3: Cleanup
- Delete `lib/authService.ts`
- Delete `lib/restaurantService.ts`
- Delete `lib/authService.old.ts`

### Phase 4: Verification
- Run TypeScript compiler: `npx tsc --noEmit`
- Test all auth flows
- Test profile management
- Test menu management

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_BASE=http://localhost:4000/api
```

If not set, defaults to `http://localhost:4000/api`.

### Token Storage Keys
All token keys are defined in `config.ts`:
- `token` - User token
- `restaurantToken` - Restaurant owner token
- `riderToken` - Delivery rider token
- `adminToken` - Admin token

## Error Handling

The new `ApiError` class provides consistent error handling:

```typescript
try {
  await restaurantAuth.login(credentials);
} catch (error) {
  if (error instanceof ApiError) {
    console.error("API Error:", error.message);
    console.error("Status:", error.statusCode);
    console.error("Data:", error.data);
  } else {
    console.error("Network Error:", error);
  }
}
```

## Best Practices

### ✅ DO
- Use the new grouped APIs: `restaurantAuth.login()`, `menuCategories.create()`
- Import from `@/lib/api` for everything
- Use TypeScript types provided by the API modules
- Handle `ApiError` instances in catch blocks

### ❌ DON'T
- Don't manually manage tokens (use `tokenKey` parameter)
- Don't manually set `Authorization` headers
- Don't declare `API_BASE` anywhere else
- Don't copy-paste fetch logic

## Future Enhancements

Potential improvements:
- Request/response interceptors
- Automatic retry logic
- Request caching
- Request cancellation
- Progress tracking for uploads
- WebSocket support

## Summary

This reorganization provides:
1. **Zero code duplication** (API_BASE in 1 place, token management in 1 place)
2. **Industry-standard structure** (similar to major tech companies)
3. **Backward compatibility** (no breaking changes)
4. **Type safety** (full TypeScript support)
5. **Easy maintenance** (clear separation of concerns)
6. **Scalability** (easy to add new endpoints/domains)

The new structure follows the **DRY principle** (Don't Repeat Yourself) and **Separation of Concerns**, making the codebase more maintainable and professional.
