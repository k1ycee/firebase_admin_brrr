const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('<your admin SDK path>');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function getAllUsers() {
  const users = [];
  let pageToken;

  try {
    do {
      // Get batch of users with optional pageToken
      const listUsersResult = await admin.auth().listUsers(1000, pageToken);

      // Add this batch of users to our array
      users.push(...listUsersResult.users);

      // Get next page token
      pageToken = listUsersResult.pageToken;

      console.log(`Fetched ${users.length} users so far...`);

    } while (pageToken); // Continue while there are more pages

    console.log(`Successfully fetched all ${users.length} users`);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function getUnverifiedUsers() {
  try {
    const allUsers = await getAllUsers();
    const unverifiedUsers = allUsers.filter(user => !user.emailVerified);

    console.log(`Found ${unverifiedUsers.length} unverified users out of ${allUsers.length} total users`);

    return unverifiedUsers.map(user => ({
      uid: user.uid,
      email: user.email
    }));
  } catch (error) {
    console.error('Error fetching unverified users:', error);
    throw error;
  }
}


async function sendNotification(token) {
  try {
    const message = {
      notification: {
        title: 'Lift Off!',
        body: 'Lift Offffff Bitches another oneeeeee',
      },
      data: {
        title: 'Lift Off!',
        content: 'Lift Offffff Bitches another oneeeeee',
      },
      android: {
        priority: "high",
        notification: {
          channelId: "JophabNotification"
        }
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
            sound: "default"
          }
        },
        headers: {
          "apns-priority": "10"
        }
      },
      token: token
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent notification:', response);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

async function getVerifiedUsers() {
  try {
    const allUsers = await getAllUsers();
    const verifiedUsers = allUsers.filter(user => user.emailVerified);

    console.log(`Found ${verifiedUsers.length} verified users out of ${allUsers.length} total users`);

    return verifiedUsers.map(user => ({
      uid: user.uid,
      email: user.email
    }));
  } catch (error) {
    console.error('Error fetching verified users:', error);
    throw error;
  }
}

async function createCustomToken(uid) {
  return admin.auth().createCustomToken(uid);
}

module.exports = {
  getUnverifiedUsers,
  createCustomToken,
  getVerifiedUsers,
  getAllUsers,
  sendNotification // Exported in case you need direct access to all users
};