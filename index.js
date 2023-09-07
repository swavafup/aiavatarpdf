const express = require('express');
const { Configuration, OpenAIApi } = require("openai");

// <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js"></script>
	
const firebase = require('firebase/app');
require('firebase/auth');

require('dotenv').config();


const webApp = express();

webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());

const PORT = process.env.PORT || 5000;

var data = Buffer.from('c2staUE2cG5aWE1Pc3ZxUGc0TXZZdVhUM0JsYmtGSnRrTHEzUHVGcUVvZVZlY2lLTENy', 'base64')

var decoded_data = data.toString();

const configuration = new Configuration({
    apiKey: decoded_data,
});

const openai = new OpenAIApi(configuration);

const textGeneration = async (prompt) => {

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Human: ${prompt}\nAI: `,
            temperature: 0.5,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: ['Human:', 'AI:']
        });

        return {
            status: 1,
            response: `${response.data.choices[0].text}`
        };
    } catch (error) {
        return {
            status: 0,
            response: ''
        };
    }
};

const formatResponseForDialogflow = (texts, sessionInfo, targetFlow, targetPage) => {

    messages = []

    texts.forEach(text => {
        messages.push(
            {
                text: {
                    text: [text],
                }
				  
											   
									   
            }
        );
    });

    let responseData = {
        fulfillmentMessages: messages
							  
		 
    };

							 


    return responseData
};

const getErrorMessage = () => {

    return formatResponseForDialogflow(
        [
            'We are facing a technical issue.'
        ],
        '',
        '',
        ''
    );
};

webApp.get('/', (req, res) => {
    res.sendStatus(200);
});


webApp.post('/dialogflow', async (req, res) => {
    
    let action = req.body.queryResult.action;
    let queryText = req.body.queryResult.queryText;

    if (action === 'input.unknown') {
        let result = await textGeneration(queryText);
        if (result.status == 1) {
            res.send(
                {
                    fulfillmentText: result.response
                }
            );
        } else {
            res.send(
                {
                    fulfillmentText: `Sorry, I'm not able to help with that.`
                }
            );
        }
    } else {
        res.send(
            {
                fulfillmentText: `No handler for the action ${action}.`
            }
        );
    }
});


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

const email = "swavaf3693@gmail.com";
const password = "Swavaf@123";

firebaseApp.auth().signInWithEmailAndPassword(email, password)
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
const database = firebaseApp.database();

const user = firebaseApp.auth().currentUser;

if (user) {
  // Assuming you have stored the user's unique identifier (UID) in your database under "users"
  const userId = user.uid;

  // Reference to the user's data
   const userRef = database.ref(userId);

  // Retrieve the "request" field
  userRef.child("request").once("value")
    .then((snapshot) => {
      const request = snapshot.val();
      if (request !== null) {
        console.log(`Request: ${request}`);
	const newData = {	
            email : "email sample",
            status : "true",
            request : "request sample",
            response : "response sample"
	};
	database.ref(userId).push(newData)
  .then(() => {
    console.log("Data saved successfully");
  })
  .catch((error) => {
    console.error("Data save error:", error);
  });
      } else {
        console.log("Request not found in the database.");
      }
    })
    .catch((error) => {
      console.error("Error retrieving data:", error);
    });

    // Retrieve the "response" field
  userRef.child("response").once("value")
    .then((snapshot) => {
      const response = snapshot.val();
      if (response !== null) {
        console.log(`Request: ${response}`);
      } else {
        console.log("Request not found in the database.");
      }
    })
    .catch((error) => {
      console.error("Error retrieving data:", error);
    });


} else {
  console.log("User is not authenticated. Please log in first.");
}

// Data to be saved
// const newData = {
//             email : email,
//             status : "false",
//             request : "",
//             response : ""
// };

// // Push data to a specific location (e.g., "users")
// database.ref("users").push(newData)
//   .then(() => {
//     console.log("Data saved successfully");
//   })
//   .catch((error) => {
//     console.error("Data save error:", error);
//   });


webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});




