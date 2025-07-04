# Protected Routes Implementation

This project implements protected and unprotected routes using Expo Router's protected routes feature (available in SDK 53+).

## Project Structure

```
app/
├── _layout.tsx              # Root layout with SessionProvider and protected routes
├── index.tsx                # Public home page (unprotected)
├── login.tsx                # Login page (unprotected)
├── register.tsx             # Register page (unprotected)
├── +not-found.tsx           # 404 page
└── (app)/                   # Protected route group
    ├── _layout.tsx          # Protected app layout
    └── (tabs)/              # Tab navigation (protected)
        ├── _layout.tsx      # Tab layout
        ├── index.tsx        # Protected home dashboard
        ├── explore.tsx      # Protected explore page
        └── profile.tsx      # Protected profile page
```

## Authentication Context

The authentication is managed through a React Context (`ctx.tsx`) that provides:

- `session`: Current user session data
- `isLoading`: Loading state while checking authentication
- `signIn(email, password)`: Sign in function
- `signUp(email, password, name)`: Sign up function
- `signOut()`: Sign out function

## Protected Routes Implementation

### Root Layout (`app/_layout.tsx`)

The root layout uses Expo Router's `Stack.Protected` component to protect routes:

```typescript
<Stack>
  {/* Unprotected routes - accessible to everyone */}
  <Stack.Screen name="index" options={{ headerShown: false }} />
  <Stack.Screen name="login" options={{ headerShown: false }} />
  <Stack.Screen name="register" options={{ headerShown: false }} />

  {/* Protected routes - only accessible when authenticated */}
  <Stack.Protected guard={!!session}>
    <Stack.Screen name="(app)" options={{ headerShown: false }} />
  </Stack.Protected>

  <Stack.Screen name="+not-found" />
</Stack>
```

### How It Works

1. **Unprotected Routes**: `index`, `login`, and `register` are always accessible
2. **Protected Routes**: The entire `(app)` route group is protected by the `guard={!!session}` condition
3. **Automatic Redirects**: When a user tries to access a protected route without authentication, they are automatically redirected to the anchor route (index)
4. **Dynamic Protection**: If a user's session becomes invalid while using the app, they are automatically redirected

## Route Groups

### Public Routes (Unprotected)

- `/` - Public home page with sign in/sign up buttons
- `/login` - Login form
- `/register` - Registration form

### Protected Routes (Require Authentication)

- `/(app)/(tabs)/` - Main app with tab navigation
  - `/(app)/(tabs)/index` - Protected dashboard
  - `/(app)/(tabs)/explore` - Protected explore content
  - `/(app)/(tabs)/profile` - User profile and sign out

## Features

### Authentication Flow

1. Users start at the public home page
2. They can sign in or sign up
3. Upon successful authentication, they're redirected to the protected app area
4. All protected routes are now accessible
5. Users can sign out from the profile tab

### Session Management

- Sessions are stored in localStorage (web) or can be extended to use AsyncStorage (native)
- Session state is checked on app startup
- Loading states are handled with a splash screen controller

### Navigation

- Protected routes are completely isolated from public routes
- Users cannot navigate to protected routes without authentication
- Sign out automatically redirects to the public home page

## Usage

### Testing the Implementation

1. **Start the app**: `npm start`
2. **Public access**: Visit the home page - you'll see sign in/sign up buttons
3. **Try protected routes**: Attempt to navigate to protected routes - you'll be redirected
4. **Sign in**: Use the login form with any email/password (mock authentication)
5. **Access protected content**: After signing in, you can access all protected routes
6. **Sign out**: Use the profile tab to sign out and return to public routes

### Customization

To customize the authentication:

1. **Replace mock authentication** in `ctx.tsx` with your actual auth service
2. **Add more protected routes** by placing them in the `(app)` route group
3. **Add more public routes** by adding them to the root layout outside the `Stack.Protected` wrapper
4. **Customize the guard condition** to include additional authentication checks (e.g., user roles)

## Key Benefits

- **Type Safety**: Full TypeScript support with proper route typing
- **Automatic Redirects**: No manual redirect logic needed
- **Clean Separation**: Clear distinction between public and protected content
- **Scalable**: Easy to add more protected or public routes
- **User Experience**: Smooth transitions and proper loading states

## Dependencies

- Expo SDK 53+
- expo-router 5.1.3+
- React Navigation 7+

This implementation follows Expo Router's best practices for authentication and protected routes as documented in the [official documentation](https://docs.expo.dev/router/advanced/protected/).
