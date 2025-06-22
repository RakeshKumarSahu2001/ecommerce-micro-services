import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_ApiKey,
  authDomain: import.meta.env.VITE_AuthDomain,
  projectId: import.meta.env.VITE_ProjectID,
  storageBucket: import.meta.env.VITE_StorageBucket,
  messagingSenderId: import.meta.env.VITE_MessagingSenderID,
  appId: import.meta.env.VITE_AppID,
  measurementId: import.meta.env.VITE_MeasurementID,
  databaseURL: import.meta.env.VITE_DatabaseURL
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);