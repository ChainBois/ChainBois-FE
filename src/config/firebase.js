// Import the functions you need from the SDKs you need
import { getApps, getApp, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
	FIREBASE_API_K,
	FIREBASE_A_DOMAIN,
	FIREBASE_DATABASE_URL,
	FIREBASE_PROJECT_ID,
	FIREBASE_STORAGE_BUCKET,
	FIREBASE_MESSAGING_SENDER_ID,
	FIREBASE_APP_ID,
	FIREBASE_MEASUREMENT_ID,
} from '@/constants'

// Your we app's Firebase configuration
const firebaseConfig = {
	apiKey: FIREBASE_API_K,
	authDomain: FIREBASE_A_DOMAIN,
	databaseURL: FIREBASE_DATABASE_URL,
	projectId: FIREBASE_PROJECT_ID,
	storageBucket: FIREBASE_STORAGE_BUCKET,
	messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
	appId: FIREBASE_APP_ID,
	measurementId: FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null))
<<<<<<< HEAD
const auth = getAuth()

export { app, analytics, auth }
=======
const auth = getAuth(app)

if (process.env.NODE_ENV !== 'production') {
	console.log('[Firebase] Auth initialized', {
		appName: auth.app.name,
		projectId: auth.app.options.projectId,
		authDomain: auth.app.options.authDomain,
		hasApiKey: Boolean(auth.app.options.apiKey),
	})
}

export { app, analytics, auth };
>>>>>>> last-milestone
