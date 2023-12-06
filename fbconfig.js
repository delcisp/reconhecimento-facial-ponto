import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyBusDm_ybyOgpscjUZjPhRKDxTFLr3akkA",
  authDomain: "attendancesystem-cb9a3.firebaseapp.com",
  databaseURL: "https://attendancesystem-cb9a3-default-rtdb.firebaseio.com",
  projectId: "attendancesystem-cb9a3",
  storageBucket: "attendancesystem-cb9a3.appspot.com",
  messagingSenderId: "251692974950",
  appId: "1:251692974950:web:37f8a30f173bc581693ea7"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


export { database }