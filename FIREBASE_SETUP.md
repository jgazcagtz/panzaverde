# Firebase Security Rules Setup Guide

## Overview
This document explains how to deploy the Firebase security rules for Panza Verde to ensure only verified admin accounts can write to the products collection.

## Security Rules Summary

The `firestore.rules` file implements the following security model:

### Products Collection (`/products/{productId}`)
- **Read**: Public (anyone can view products)
- **Create/Update/Delete**: Admin only (erandi@panzaverde.com)

### User Profiles (`/users/{userId}`)
- **Read**: Users can read their own profile
- **Create/Update**: Users can manage their own profile
- **Delete**: Admin only

### Orders Collection (`/orders/{orderId}`)
- **Read**: Users can read their own orders, admin can read all
- **Create**: Authenticated users can create their own orders
- **Update/Delete**: Admin only

## Deployment Methods

### Method 1: Firebase Console (Recommended for Quick Setup)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `bagueteria-3cbdb`
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the contents of `firestore.rules`
5. Paste into the rules editor
6. Click **Publish**

### Method 2: Firebase CLI (Recommended for Production)

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project** (if not already done):
   ```bash
   firebase init firestore
   ```
   - Select your existing project: `bagueteria-3cbdb`
   - Use the existing `firestore.rules` file

4. **Deploy the rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Method 3: Using Firebase Admin SDK (Advanced)

If you need to programmatically update rules, you can use the Firebase Admin SDK, but this is typically not necessary for most use cases.

## Important Notes

### Admin Authentication
- The admin email is hardcoded in the rules: `erandi@panzaverde.com`
- The admin must be authenticated via Firebase Auth (not just client-side credentials)
- **Action Required**: You need to create a Firebase Auth account for `erandi@panzaverde.com`:
  1. Go to Firebase Console → Authentication
  2. Add a user with email: `erandi@panzaverde.com`
  3. Set a password (can be `ChatitaEspuelas8` or generate a secure one)
  4. The admin should sign in using Firebase Auth in the app

### Updating Admin Email
If you need to change the admin email, update it in two places:
1. `firestore.rules` - line 7: `request.auth.token.email == 'erandi@panzaverde.com'`
2. `script.js` - line 41: `email: "erandi@panzaverde.com"`

### Testing Rules
After deploying, test the rules:
1. Try creating a product as a non-admin user (should fail)
2. Try reading products as an unauthenticated user (should succeed)
3. Sign in as admin and try creating a product (should succeed)

## Current Implementation Status

⚠️ **Important**: The current admin authentication in `script.js` is client-side only and does NOT use Firebase Auth. To make the security rules work properly, you need to:

1. Update the admin login to use Firebase Auth instead of client-side credential checking
2. Create the admin user account in Firebase Authentication
3. Deploy the security rules

## Next Steps

1. Deploy the `firestore.rules` file using one of the methods above
2. Create the admin user in Firebase Authentication
3. Update `script.js` to authenticate admin via Firebase Auth (see recommendation below)

## Recommended Code Update

To make admin authentication work with Firebase security rules, update the admin login function in `script.js`:

```javascript
// Instead of client-side check:
if (email === adminCredentials.email && password === adminCredentials.password) {
    setAdminAuthenticated(true);
}

// Use Firebase Auth:
try {
    await signInWithEmailAndPassword(auth, email, password);
    // Check if the authenticated user is admin
    if (auth.currentUser && auth.currentUser.email === adminCredentials.email) {
        setAdminAuthenticated(true);
    }
} catch (error) {
    showToast("Credenciales incorrectas.", "error");
}
```

This way, the admin will be authenticated via Firebase Auth, and the security rules will properly validate write permissions.

