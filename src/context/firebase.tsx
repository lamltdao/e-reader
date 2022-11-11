import React, { createContext, useContext, useState } from "react";
import { initializeApp } from "firebase/app";
import { CollectionReference, DocumentData, getFirestore, collection, setDoc, doc } from "firebase/firestore";
import { User, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
// };
const firebaseConfig = {
  apiKey: "AIzaSyBALv9vwumdSf7D5sToRCR2kosTndLtwSk",
  authDomain: "e-reader-b3466.firebaseapp.com",
  projectId: "e-reader-b3466",
  storageBucket: "e-reader-b3466.appspot.com",
  messagingSenderId: "834014262568",
  appId: "1:834014262568:web:cf8414e99d9a3ffe888c1d",
};

initializeApp(firebaseConfig);

type TrackingProviderProps = {
  children: React.ReactNode;
};

type CollectionType = CollectionReference<
  DocumentData
>;

type createUserOnFirebaseType = (
  email: string,
  password: string
) => Promise<void>;
type doUserLoginOnFirebaseType = (
  email: string,
  password: string
) => Promise<void>;
type logoutUserFromFirebaseType = () => Promise<void>;

type FirebaseState = {
  user: User | null;
  isFetchingUser: boolean;

  createUserOnFirebase: createUserOnFirebaseType;
  doUserLoginOnFirebase: doUserLoginOnFirebaseType;
  logoutUserFromFirebase: logoutUserFromFirebaseType;
};

const FirebaseContext = createContext<FirebaseState | undefined>(undefined);

function FirebaseProvider({ children }: TrackingProviderProps) {
  const firestore = getFirestore();
  const auth = getAuth();

  // AUTHENTICATION
  const [user, setUser] = useState<User | null>(null);
  const [isFetchingUser, setIsFetchingUser] = useState(true);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }

    setIsFetchingUser(false);
  });

  const createUserOnFirebase: createUserOnFirebaseType = (email, password) =>
    new Promise(async (resolve, reject) => {
      try {
        const firebaseUser = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (!firebaseUser.user) {
          reject();
          return;
        }

        await setDoc(doc(usersCollection, firebaseUser.user.uid), {
          email: firebaseUser.user.email,
        })

        resolve();
      } catch (e) {
        reject(e);
      }
    });

  const doUserLoginOnFirebase: doUserLoginOnFirebaseType = (email, password) =>
    new Promise(async (resolve, reject) => {
      try {
        await signInWithEmailAndPassword(auth, email, password);

        resolve();
      } catch (e) {
        reject(e);
      }
    });

  const logoutUserFromFirebase = async () => await auth.signOut();

  // FIRESTORE
  const usersCollection = collection(firestore, "users");

  return (
    <FirebaseContext.Provider
      value={{
        createUserOnFirebase,
        doUserLoginOnFirebase,
        logoutUserFromFirebase,
        user,
        isFetchingUser,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

function useFirebase() {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }

  return context;
}

export { FirebaseProvider, useFirebase };
