const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert({
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    storageBucket: "gs://mernforum-eff8b.firebasestorage.app",
});

const bucket = admin.storage().bucket();
module.exports = { bucket };


