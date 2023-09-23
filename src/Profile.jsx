import { useState, useContext, useEffect, useRef } from "react";
import { db, auth, storage } from "./firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from "firebase/storage";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { UserContext } from "./App";
import { onAuthStateChanged } from "firebase/auth";

function Profile() {
  const [showFileUpload, setShowFileUpload] = useState(false);
  const { userId } = useContext(UserContext);
  const [profile, setProfile] = useState("");
  const [username, setUsername] = useState("");
  const urlRef = useRef(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, "users", userId.current);
        onSnapshot(docRef, (snapshot) => {
          setProfile(snapshot.data().profileImage);
          setUsername(snapshot.data().username);
        });
      }
    });
  }, []);

  const uploadFileHandler = async (e) => {
    e.preventDefault();
    const imageRef = ref(storage, `users/${userId.current}/profileImage`);
    try {
      await getMetadata(imageRef);
      await deleteObject(imageRef);
    } catch (err) {
      console.log(err);
    }
    uploadBytes(imageRef, e.target.files[0])
      .then((snapshot) => {
        console.log(snapshot);
        return getDownloadURL(snapshot.ref);
      })
      .then((url) => {
        const docRef = doc(db, "users", userId.current);
        urlRef.current = url;
        return updateDoc(docRef, { profileImage: url });
      })
      .then(() => setProfile(urlRef.current))
      .catch((err) => console.log(err.message));
  };
  return (
    <div className="flex justify-start gap-10 items-center">
      <div
        onMouseEnter={() => setShowFileUpload(true)}
        onMouseLeave={() => setShowFileUpload(false)}
        className="flex-[1_0_80px] h-[80px] border-2 border-light rounded-full bg-cover relative"
        style={{ backgroundImage: `url(${profile})` }}
      >
        {showFileUpload && (
          <input
            type="file"
            name="profile"
            id="profile"
            onChange={uploadFileHandler}
            className="absolute bottom-0 left-0"
          />
        )}
      </div>
      <div>
        <h1>{username}</h1>
        <p className="mt-[10px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam odio
          minima aliquam aut amet quidem quam, iusto praesentium voluptas
          tempora vero non sed, vitae dolorum recusandae quos consequuntur
          asperiores autem!
        </p>
      </div>
    </div>
  );
}

export default Profile;
