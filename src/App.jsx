import { useEffect, useRef, useState, createContext } from "react";
import "./index.css";
import { db, auth } from "./firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import Profile from "./Profile";

//use context
export const UserContext = createContext();

function App() {
  const [books, setBooks] = useState([]);
  const [isPending, setIspending] = useState(true);
  const [wantSignup, setWantSignup] = useState(false);
  const [wantLogin, setWantLogin] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const userId = useRef(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogin(true);
        userId.current = user.uid;
        const docRef = doc(db, "users", userId.current);
        onSnapshot(docRef, (snapshot) => {
          console.log(snapshot.data());
          const newBooks = snapshot.data().books;
          setBooks(newBooks);
          setIspending(false);
        });
      } else {
        setIsLogin(false);
        userId.current = null;
        setIspending(false);
      }
    });
  }, []);

  const deleteDocHandler = (index) => {
    setIspending(true);
    if (!userId.current) return;
    const docRef = doc(db, "users", userId.current);
    books.splice(index, 1);
    updateDoc(docRef, { books: [...books] }).then(() => {
      console.log("book deleted");
    });
  };

  const addDocHandler = (e) => {
    e.preventDefault();
    setIspending(true);
    const title = e.currentTarget.title.value;
    const description = e.currentTarget.description.value;
    if (!title || !description || !userId.current) return;
    console.log(title, description);
    const newBooks = {
      books: [...books, { title: title, description: description }],
    };
    // get data
    const docRef = doc(db, "users", userId.current);
    updateDoc(docRef, newBooks)
      .then(() => {
        console.log("book added");
      })
      .catch((err) => {
        console.log(err.message);
      });
    e.currentTarget.reset();
  };

  const logoutHandler = () => {
    signOut(auth).then(() => {
      console.log("signed out");
      setIsLogin(false);
      setBooks([]);
    });
  };

  return (
    <UserContext.Provider value={{ userId: userId }}>
      <div className="w-[80%] mx-auto text-light flex flex-col gap-10">
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
        {isLogin && <Profile />}
        <div className="flex flex-col gap-5">
          <h1 className="text-xl">List of books</h1>
          {!isLogin && <p>login to see books</p>}
          {isLogin && (
            <form
              action=""
              onSubmit={addDocHandler}
              className="flex flex-col lg:flex-row lg:justify-between gap-5"
            >
              <div className="flex flex-col lg:flex-row gap-5">
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
                className="h-[40px] w-full lg:w-[150px] border-none outline-none px-2 bg-semidark font-medium"
                type="submit"
              >
                Add doc
              </button>
            </form>
          )}
          {isPending && <span>Loading...</span>}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-[100px]">
            {books.map((elem, index) => {
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
        {wantSignup && (
          <SignupModal setWantSignup={setWantSignup} auth={auth} />
        )}
        {wantLogin && (
          <LoginModal
            auth={auth}
            setWantLogin={setWantLogin}
            setIsLogin={setIsLogin}
          />
        )}
      </div>
    </UserContext.Provider>
  );
}

export default App;
