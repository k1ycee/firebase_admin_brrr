const express = require('express');
const { getUnverifiedUsers, createCustomToken, getVerifiedUsers, sendNotification } = require('./firebase_admin');

const app = express();
app.use(express.json());

app.get('/api/unverified-users', async (req, res) => {
  try {
    const users = await getUnverifiedUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/verified-users', async (req, res) => {
  try {
    const users = await getVerifiedUsers();

    console.log(users);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/custom-token', async (req, res) => {
  try {
    const { uid } = req.body;
    const token = await createCustomToken(uid);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/send-notification', async (req, res) => {
  try {
    const { token } = req.body;
    await sendNotification(token);


    res.json({
      message: 'Notification sent sucessfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});