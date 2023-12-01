const express = require('express');
const axios = require('axios');

require('dotenv').config();

const webApp = express();

webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());

const PORT = process.env.PORT || 5000;

const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
const { FetchProvider } = require('@firebase/auth');

const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getDatabase, ref, get, set} = require("firebase/database");

firebaseConfig = {
    'apiKey': "AIzaSyC_1yhveazgVtX-hfmZh6OwFGvODNgCgG4",
    'authDomain': "loginwithstreamlit.firebaseapp.com",
    'projectId': "loginwithstreamlit",
    'databaseURL': "https://loginwithstreamlit-default-rtdb.firebaseio.com",
    'storageBucket': "loginwithstreamlit.appspot.com",
    'messagingSenderId': "286638028806",
    'appId': "1:286638028806:web:931ff9cffb9421e4b42b87",
    'measurementId': "G-SFTNJ19HS6"
}

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Initialize FetchProvider
const fetchProvider = new FetchProvider();
fetchProvider.initialize();

webApp.get('/', (req, res) => {
    res.sendStatus(200);
});

webApp.post('/dialogflow', async (req, res) => {
    let queryText = req.body.queryResult.queryText;
    const auth = getAuth(firebaseApp);
    // console.log(auth);
    const email = "irirobotictslab@uaeu.com";
    const password = "iriroboticslab@123";
	
    // const email = "admin@gmail.com";
    // const password = "admin@123";
    
    console.log(email);
	
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User is signed in
            const user = userCredential.user;
            console.log("User signed in:", user);
         })
         .catch((error) => {
            // Handle errors
            console.error("Sign-in error:", error);
         });

       // Reference to the database
       // const database = firebaseApp.database();

    const user = auth.currentUser;


    auth.onAuthStateChanged((user) => {
      if (user) {
  // Assuming you have stored the user's unique identifier (UID) in your database under "users"
        const userId = user.uid;
  
    
  // Reference to the user's data
        const database = getDatabase();
        const userRef = ref(database, userId);
        console.log(userRef);
        const childPath = "sourceid"; // Replace with the actual child node name

        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              sourceidnew = userData.request
              console.log(sourceidnew);
            
            } else {
              console.log('No data available for this user.');
            }
         })
          .catch((error) => {
            console.error('Error getting data:', error);
          });


      } else {
        console.log("User is not authenticated. Please log in first.");
      }
      })

      const apiKey = 'sec_qT39IlsF7TNBBS8Q2GNomWd9vpcSzYHN'; // Replace with your API key
      let sourceId = sourceidnew
      console.log("sourceId from firebase");
      console.log(sourceId);
      // const sourceId = 'src_g69WoiZ85Mdh52ziav7PM'; // Replace with your source ID

    const data = {
        sourceId: sourceId,
        messages: [
            {
                role: "user",
                content: queryText,
            },
        ],
    };

    const config = {
        headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await axios.post("https://api.chatpdf.com/v1/chats/message", data, config);

        res.send({
            fulfillmentText: response.data.content
        });
    } catch (error) {
        console.error("Error:", error.message);
        console.log("Response:", error.response.data);

        res.send({
            fulfillmentText: "Sorry, Im not able to help with that."
        });
    }
});

webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});



