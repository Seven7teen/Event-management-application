const admin = require("firebase-admin");  
const serviceAccount = require('./credentials.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: 'https://event-management-a025c-default-rtdb.firebaseio.com'
  databaseURL: 'https://event-management-a025c-default-rtdb.firebaseio.com/'
});

module.exports = admin;
