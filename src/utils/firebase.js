// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAB39A1eVvhFbTIqol1yB8sIrbv9Allqpg",
	authDomain: "ynab-47641.firebaseapp.com",
	projectId: "ynab-47641",
	storageBucket: "ynab-47641.appspot.com",
	messagingSenderId: "166507618318",
	appId: "1:166507618318:web:2586479d23433cfc855c5f",
	measurementId: "G-WL97FFD4EH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
