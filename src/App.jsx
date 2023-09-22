import { useEffect, useState } from "react";
import "./index.css";
import { db, auth } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

function App() {
  const [lists, setLists] = useState([]);
  const [isPending, setIspending] = useState(true);
  const colRef = collection(db, "lists");

  const updateState = () => {
    setIspending(true);
    getDocs(colRef).then((snapshot) => {
      let newList = [];
      snapshot.forEach((doc) => {
        newList.push({ ...doc.data(), id: doc.id });
      });
      setLists(newList);
      setIspending(false);
    });
  };

  useEffect(() => {
    console.log(lists);
  }, [lists]);

  useEffect(updateState, []);

  const deleteDocHandler = (index) => {
    setIspending(true);
    const docRef = doc(db, "lists", lists[index].id);
    deleteDoc(docRef).then(() => {
      console.log("deleted");
      lists.splice(index, 1);
      setLists([...lists]);
      setIspending(false);
    });
  };
  const addDocHandler = (e) => {
    e.preventDefault();
    const title = e.currentTarget.title.value;
    const description = e.currentTarget.description.value;
    if (!title || !description) return;
    setIspending(true);
    addDoc(colRef, {
      title: title,
      description: description,
    }).then(() => {
      updateState();
      setIspending(false);
    });
    e.currentTarget.reset();
  };

  return (
    <div className="w-[80%] mx-auto text-light">
      <header className="flex justify-between py-5">
        <h1>Header</h1>
        <div className="flex justify-between gap-3">
          <button>
            <b>Login</b>
          </button>
          <button>
            <b>Sign Up</b>
          </button>
          {/* <button>
            <b>Logout</b>
          </button> */}
        </div>
      </header>
      <div className="flex flex-col gap-5">
        <h1 className="text-xl">List of docs</h1>
        <form
          action=""
          onSubmit={addDocHandler}
          className="flex items-center justify-start gap-5"
        >
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
          <button
            className="h-[40px] w-[200px] border-none outline-none px-2 bg-semidark"
            type="submit"
          >
            Add doc
          </button>
        </form>
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
    </div>
  );
}

export default App;
