import { useEffect, useState } from "react";
import "./App.css";
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
    setIspending(true);
    e.preventDefault();
    const title = e.currentTarget.title.value;
    const description = e.currentTarget.description.value;
    if (!title || !description) return;
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
    <div>
      <div>
        <h1>List</h1>
        {isPending && <span>Loading...</span>}
        <div>
          <div className="tools">
            <form action="" onSubmit={addDocHandler}>
              <input type="text" name="title" placeholder="title" />
              <input type="text" name="description" placeholder="description" />
              <button type="submit">Add doc</button>
            </form>
          </div>
          <ul>
            {lists.map((elem, index) => {
              return (
                <li key={index + 1}>
                  <h2>{elem.title}</h2>
                  <p>{elem.description}</p>
                  <button onClick={() => deleteDocHandler(index)}>
                    delete doc
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
