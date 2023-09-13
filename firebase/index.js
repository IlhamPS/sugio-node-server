const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

const serviceAccount = require('./service-account.json');

initializeApp({
  credential: cert(serviceAccount)
});

const firestore = getFirestore();

module.exports = firestore