import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, sendEmailVerification } from 'firebase/auth';


// Your Firebase configuration
const firebaseConfig = {
  // Add your Firebase config object here
  apiKey: "<your api key>",
  authDomain: "<your auth domain>",
  projectId: "<your project Id>",
  // ... other config options
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


 async function sendVerificationEmails() {
    try {
      // Get unverified users from your server
      const response = await fetch('http://localhost:3000/api/unverified-users');
      const unverifiedUsers = await response.json();
  
      for (const user of unverifiedUsers) {
        try {
          // Get custom token
          const tokenResponse = await fetch('http://localhost:3000/api/custom-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid: user.uid })
          });
          const { token } = await tokenResponse.json();
  
          // Sign in as user
          await signInWithCustomToken(auth, token);
  
          // Send verification email
          await sendEmailVerification(auth.currentUser, {
            url: 'https://jophab-nigeria.firebaseapp.com/verified',
            handleCodeInApp: true
          });
  
          console.log(`Verification email sent to ${user.email}`);
          
          // Add delay
          await new Promise(resolve => setTimeout(resolve, 1000));
  
        } catch (error) {
          console.error(`Error processing user ${user.email}:`, error);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function checkVerifiedUsers() {
    try {
      // Get unverified users from your server
      const response = await fetch('http://localhost:3000/api/verified-users');
      const verifiedUsers = await response.json();
  
      for (const user of verifiedUsers) {
        try {



          console.log(`${user.email} is verified`);
          
          // Add delay
          await new Promise(resolve => setTimeout(resolve, 1000));
  
        } catch (error) {
          console.error(`Error processing user ${user.email}:`, error);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }


  async function sendVerificationEmailtoSpecificPerson(userId, email) {
    console.log(userId);

        try {
          // Get custom token
          const tokenResponse = await fetch('http://localhost:3000/api/custom-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid: userId })
          });
          const { token } = await tokenResponse.json();
  
          // Sign in as user
          await signInWithCustomToken(auth, token);
  
          // Send verification email
          await sendEmailVerification(auth.currentUser, {
            url: 'https://jophab-nigeria.firebaseapp.com/verified',
            handleCodeInApp: true
          });
  
          console.log(`Verification email sent to ${email}`);
          
          // Add delay
          await new Promise(resolve => setTimeout(resolve, 1000));
  
        } catch (error) {
          console.error(`Error processing user ${email}:`, error);
        }
      
    
  }


  async function sendNotification(token) {
        try {
          // Get custom token
          const tokenResponse = await fetch('http://localhost:3000/api/send-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
          });

          console.log(token)

          const { message } = await tokenResponse.json();
          

  
          console.log(`Wetin server talk ${message}`);
          

  
        } catch (error) {
          console.error(`Error processing user ${email}:`, error);
        }
      
    
  }

//  sendVerificationEmailtoSpecificPerson('zxFn0vWqi1TfiXHTTMkD7ULlYxe2', 'jameschidiebere2021@gmail.com')

// sendVerificationEmails()
// checkVerifiedUsers() 

sendNotification("cZSb4xHhSgm0fK35HJNw0k:APA91bFHEv6xNXv3TQ8AZiV-BmKgLrhWlwahJ3yCCgVWXVVq7xCt7zUjKjbvpfZZBKyYfpfSI-Gq5hI79ckAEL9gjcYdqCwU3Bwi4LDwxejEGDUzANuqZB0")