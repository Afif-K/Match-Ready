"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";

// NEW IMPORTS (added)
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user,setUser] = useState<User | null>(null);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      // USER LOGGED IN
      if (firebaseUser) {
        setUser(firebaseUser);

        // SAVE USER IN FIRESTORE
        await setDoc(
          doc(db, "users", firebaseUser.uid),
          {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            createdAt: new Date(),
          },
          { merge: true }
        );
      } 
      
      //  USER LOGGED OUT
      else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}