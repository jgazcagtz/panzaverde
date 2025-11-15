# Panza Verde - Admin Dashboard Access Credentials

## 🔐 Admin Login Information

### Email Address
```
erandi@panzaverde.com
```

### Password
**You need to set this up in Firebase Authentication Console**

If you haven't created the admin account yet, follow the setup steps below.

---

## ⚠️ Error Explanation

The **400 error** you're seeing means:
- The admin account doesn't exist in Firebase Authentication, OR
- The password is incorrect, OR
- The email format is wrong

---

## 🚀 Setup Instructions

### Step 1: Create Admin Account in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **bagueteria-3cbdb**
3. Navigate to **Authentication** → **Users** tab
4. Click **Add user**
5. Enter:
   - **Email**: `erandi@panzaverde.com`
   - **Password**: Choose a secure password (write it down!)
6. Click **Add user**

### Step 2: Test Login

1. Go to `admin.html` in your browser
2. Enter:
   - **Email**: `erandi@panzaverde.com`
   - **Password**: (the password you just created)
3. Click **Iniciar sesión**

---

## 🔑 Quick Reference

**Admin Email**: `erandi@panzaverde.com`  
**Password**: (Set in Firebase Console - see Step 1)

---

## 🛠️ Troubleshooting

### If login still fails:

1. **Check Firebase Authentication is enabled**:
   - Firebase Console → Authentication → Sign-in method
   - Ensure "Email/Password" is enabled

2. **Verify the email is correct**:
   - Must be exactly: `erandi@panzaverde.com`
   - No spaces, correct spelling

3. **Check browser console**:
   - Press F12 → Console tab
   - Look for specific error messages

4. **Reset password** (if needed):
   - Firebase Console → Authentication → Users
   - Find `erandi@panzaverde.com`
   - Click the three dots → Reset password

---

## 📝 Important Notes

- The admin email is hardcoded in:
  - `admin.js` (line 33)
  - `firestore.rules` (line 9)
  
- If you need to change the admin email, update both files

- The password is NOT stored in code (for security)
- You must create it in Firebase Authentication Console

---

## 🔒 Security

- Never commit passwords to git
- Use a strong password
- Consider enabling 2FA for the Firebase project

