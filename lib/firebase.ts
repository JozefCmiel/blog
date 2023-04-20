import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCI8GtVk4xejolCxp5ej1eycpC92t-6bLs",
  authDomain: "testproject-d9d03.firebaseapp.com",
  projectId: "testproject-d9d03",
  storageBucket: "testproject-d9d03.appspot.com",
  messagingSenderId: "647095484648",
  appId: "1:647095484648:web:35a02b46eb8266d9cf495d",
  measurementId: "G-EX09DJJ5L0"
};


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users');
  console.log(usersRef, 'usersRef', username)
  const query = usersRef.where('username', '==', username).limit(1);
  console.log(query, 'query')
  const userDoc = (await query.get()).docs[0];
  console.log('userDoc', userDoc)
  return userDoc;
}


/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}


export const fromMillis = firebase.firestore.Timestamp.fromMillis;
