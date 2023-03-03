import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
        if (user.displayName === null) {
          const name = user.email.split("@")[0];
          user.displayName = name;
        }
      } else {
        setIsLoggedIn (false);
      }
      setInit(true);
    })
  }, []);

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : "Initializing..."}
    </>
  );
}

export default App;
