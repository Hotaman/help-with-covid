const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID
});
var db = firebase.firestore();
const writeNewTeam = async (name, onfleetID, neighborhoodID) => {
    db.collection("teams")
        .doc(neighborhoodID.toString())
        .set({
            neighborhoodID: neighborhoodID,
            name: name,
            onfleetID: onfleetID
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
};

const getTeam = async id => {
    return db
        .collection("teams")
        .doc(id)
        .get()
        .then(function(doc) {
            return doc;
        });
};

module.exports = {
    writeNewTeam,
    getTeam
};
