const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const express = require('express');
const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const app = express();

/* Middleware */
app.set(cors({ origin: true }));

// @desc   All Users
// @route  GET /users
// @access Public
app.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();

    let users = [];
    snapshot.docs.map(doc => {
      let id = doc.id;
      let data = doc.data();

      users.push({ id, ...data });
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
});

// @desc   Post User
// @route  POST /users
// @access Public
app.post('/', async (req, res) => {
  const user = req.body;

  await db.collection('users').add(user);

  res.status(201).json(user);
});

// @desc   Single User
// @route  GET /users/:id
// @access Public
app.get('/:id', async (req, res) => {
  const snapshot = await admin
    .firestore()
    .collection('users')
    .doc(req.params.id)
    .get();

  const userId = snapshot.id;
  const userData = snapshot.data();

  res.status(200).json({ id: userId, ...userData });
});

// @desc   Update User
// @route  PUT /users/:id
// @access Public
app.put('/:id', async (req, res) => {
  const user = req.body;

  await db.collection('users').doc(req.params.id).update(user);

  console.log(user);
  res.status(200).json(user);
});

// @desc   Delete User
// @route  DELETE /users/:id
// @access Public
app.delete('/:id', async (req, res) => {
  const user = req.body;

  await db.collection('users').doc(req.params.id).delete(user);

  console.log(user);
  res.status(200).json(user);
});

exports.users = functions.region('asia-northeast1').https.onRequest(app);
