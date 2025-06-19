import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_ApiKey,
//   authDomain: import.meta.env.VITE_AuthDomain,
//   projectId: import.meta.env.VITE_ProjectID,
//   storageBucket: import.meta.env.VITE_StorageBucket,
//   messagingSenderId: import.meta.env.VITE_MessagingSenderID,
//   appId: import.meta.env.VITE_AppID,
//   measurementId: import.meta.env.VITE_MeasurementID,
//   databaseURL:import.meta.env.VITE_DatabaseURL
// };

const firebaseConfig = {
  apiKey: "AIzaSyAnGaPgZPEAdtKgW_xKqmN7L2Ea57ob8TY",
  authDomain: "mern-ecommerce-b11b5.firebaseapp.com",
  databaseURL: "https://mern-ecommerce-b11b5-default-rtdb.firebaseio.com",
  projectId: "mern-ecommerce-b11b5",
  storageBucket: "mern-ecommerce-b11b5.firebasestorage.app",
  messagingSenderId: "846627404078",
  appId: "1:846627404078:web:4d927b00923b320436a2bf",
  measurementId: "G-RTD7N01ZE5"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);