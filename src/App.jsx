import { useEffect, useRef, useState } from "react";
import "./index.css";
import { db, auth } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";

function App() {
  const [lists, setLists] = useState([]);
  const [isPending, setIspending] = useState(true);
  const [wantSignup, setWantSignup] = useState(false);
  const [wantLogin, setWantLogin] = useState(false);
  const colRef = collection(db, "lists");
  const usersColRef = collection(db, "users");
  const [isLogin, setIsLogin] = useState(false);
  // const loginModal = useRef(null);
  useEffect(() => {
    if (auth.currentUser) {
      updateState();
      onAuthStateChanged(auth, (user) => {
        user ? setIsLogin(true) : setIsLogin(false);
        console.log(user);
      });
    } else setIspending(false);
  }, []);

  const updateState = () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    setIspending(true);
    getDoc(docRef).then((snapshot) => {
      console.log(snapshot.data());
      const newBooks = snapshot.data().books;
      setLists(newBooks);
      setIspending(false);
    });
  };

  useEffect(() => {
    console.log(auth);
  }, [lists]);

  const deleteDocHandler = (index) => {
    setIspending(true);
    const docRef = doc(db, "users", auth.currentUser.uid);
    getDoc(docRef).then((snapshot) => {
      let books = snapshot.data().books;
      books.splice(index, 1);
      updateDoc(docRef, { ...books }).then(() => {
        setLists(books);
        setIspending(false);
      });
    });
    // deleteDoc(docRef).then(() => {
    //   console.log("deleted");
    //   lists.splice(index, 1);
    //   setLists([...lists]);
    //   setIspending(false);
    // });
  };
  const addDocHandler = (e) => {
    e.preventDefault();
    const title = e.currentTarget.title.value;
    const description = e.currentTarget.description.value;
    if (!title || !description) return;
    setIspending(true);
    const docRef = doc(db, "users", auth.currentUser.uid);
    // get data
    getDoc(docRef)
      .then((snapshot) => {
        console.log(snapshot.data());
        const books = {
          books: [
            ...snapshot.data().books,
            { title: title, description: description },
          ],
        };
        updateDoc(docRef, books).then(() => {
          console.log("book added");
          updateState();
        });
        setIspending(false);
      })
      .catch((err) => console.log(err.message));

    // addDoc(colRef, book).then(() => {
    // updateState();
    //   setIspending(false);
    // });
    e.currentTarget.reset();
  };

  const logoutHandler = () => {
    signOut(auth).then(() => {
      console.log("signed out");
      setIsLogin(false);
    });
  };

  return (
    <div className="w-[80%] mx-auto text-light">
      <header className="flex justify-between py-5">
        <h1>Header</h1>
        <div className="flex justify-between gap-3">
          {!isLogin && (
            <>
              <button onClick={() => setWantLogin(true)}>
                <b>Login</b>
              </button>
              <button onClick={() => setWantSignup(true)}>
                <b>Sign Up</b>
              </button>
            </>
          )}
          {isLogin && (
            <button onClick={logoutHandler}>
              <b>Logout</b>
            </button>
          )}
        </div>
      </header>
      <div className="flex flex-col gap-5">
        <h1 className="text-xl">List of docs</h1>
        {!isLogin && <p>login to see books</p>}
        {isLogin && (
          <form
            action=""
            onSubmit={addDocHandler}
            className="flex items-end justify-between gap-5"
          >
            <div className="flex gap-5">
              <input
                className="h-[40px] border border-solid border-[transparent] border-b-light outline-none px-2 bg-dark"
                type="text"
                name="title"
                placeholder="title"
              />
              <input
                className="h-[40px] border border-solid border-[transparent] border-b-light outline-none px-2 bg-dark"
                type="text"
                name="description"
                placeholder="description"
              />
            </div>
            <button
              className="h-[40px] w-[150px] border-none outline-none px-2 bg-semidark font-medium"
              type="submit"
            >
              Add doc
            </button>
          </form>
        )}
        {isPending && <span>Loading...</span>}
        <ul className="grid grid-cols-3 gap-3">
          {lists.map((elem, index) => {
            return (
              <li
                className="bg-semidark p-5 flex flex-col gap-3"
                key={index + 1}
              >
                <h2>{elem.title}</h2>
                <hr />
                <p>{elem.description}</p>
                <button
                  className="text-right"
                  onClick={() => deleteDocHandler(index)}
                >
                  delete doc
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {wantSignup && <SignupModal setWantSignup={setWantSignup} auth={auth} />}
      {wantLogin && (
        <LoginModal
          auth={auth}
          setWantLogin={setWantLogin}
          setIsLogin={setIsLogin}
        />
      )}
    </div>
  );
}

export default App;
