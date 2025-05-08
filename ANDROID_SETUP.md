
# Android Setup Guide for Hadirku QR Portal

This guide will help you set up the Android version of Hadirku QR Portal which integrates with the main web application's database.

## Prerequisites

1. Node.js and npm installed
2. Android Studio installed
3. Android SDK installed and configured
4. Git to clone the repository

## Setup Steps

1. Clone the repository:
```bash
git clone <YOUR_REPOSITORY_URL>
cd hadirku-qr-portal
```

2. Install dependencies:
```bash
npm install
```

3. Build the web application:
```bash
npm run build
```

4. Sync the Capacitor project:
```bash
npx cap sync
```

5. Add Android platform if not already added:
```bash
npx cap add android
```

6. Open the project in Android Studio:
```bash
npx cap open android
```

7. In Android Studio, you can now build and run the app on an emulator or physical device.

## Database Integration

This Android app uses the same database service as the web application. The data is currently stored in localStorage, which will be accessible on the device.

When deploying the web version on Vercel:

1. Deploy your web application to Vercel as normal
2. Update the `server.url` in `capacitor.config.ts` to point to your Vercel deployment:

```typescript
server: {
  url: "https://your-vercel-deployment-url.vercel.app",
  cleartext: true
}
```

3. Rebuild and sync your Capacitor project:
```bash
npm run build
npx cap sync
```

## Future Enhancements

To use a real backend database instead of localStorage:

1. Implement a proper backend service (Node.js, Express, etc.)
2. Update the `dbService.ts` to connect to your backend API
3. Update the `platformDbAdapter.ts` to handle platform-specific data synchronization

## Troubleshooting

- If you encounter network issues, check that `android:usesCleartextTraffic="true"` is in your `AndroidManifest.xml`
- For offline support, consider implementing a more robust synchronization mechanism in `platformDbAdapter.ts`
