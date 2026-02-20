import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase } from "firebase/database";

const rawDatabaseUrl =
  process.env.REACT_APP_FIREBASE_DATABASE_URL ||
  "https://delivery-64e17-default-rtdb.firebaseio.com";

const databaseURL = rawDatabaseUrl.replace(/\/+$/, "");

const firebaseConfig = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY ||
    "AIzaSyCnzXC2yIm092wqBTgCL9WIrRv9iakWHyo",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "delivery-64e17-default-rtdb.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "delivery-64e17",
  databaseURL,
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ||
    "1:702806085339:web:fa8c1b87443032757906fe",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const rtdb = getDatabase(app, databaseURL);

export async function ensureAnonymousAuth() {
  if (auth.currentUser) return auth.currentUser;

  try {
    const { user } = await signInAnonymously(auth);
    return user;
  } catch (error) {
    if (error?.code === "auth/admin-restricted-operation") {
      console.warn(
        "Auth anônima desativada no Firebase. Ative em Authentication > Sign-in method > Anonymous."
      );
      return null;
    }

    throw error;
  }
}
