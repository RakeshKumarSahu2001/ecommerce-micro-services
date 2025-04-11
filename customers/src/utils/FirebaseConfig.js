import serviceAccount from "../serviceAccountKey.json";
import admin from "firebase-admin"


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://dummy-a25c2-default-rtdb.firebaseio.com"
});