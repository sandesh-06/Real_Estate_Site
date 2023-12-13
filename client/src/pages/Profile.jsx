import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { firebase_app } from "../firebase.js";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutStart,
  signOutFailure,
  signOutSuccess,
} from "../redux/user/userSlice.js";

export default function Profile() {
  /* FIREBASE STORAGE RULES:
      service firebase.storage {
    match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*')
    }
  }
}
  */
  const dispatch = useDispatch();

  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({}); //incase we change the user name or password, send that data to the backend too
  // console.log(filePercentage);
  // console.log(fileUploadError);
  // console.log(formData);
  // console.log(formData);

  const [userListings, setUserListings] = useState([]);

  const [showListingError, setShowListingError] = useState(false);

  useEffect(() => {
    if (file) {
      // console.log(file.name);
      handleFileUpload(file);
    }
  }, [file]); //if there is file then call this function

  //1. FUNCTION TO HANDLE PROFILE UPLOAD
  const handleFileUpload = (file) => {
    const storage = getStorage(firebase_app); //get the storage using your api key
    const fileName = new Date().getTime() + file.name; //because when i try to upload the same pic twice, we get an error. So if you add the current time to the file name, everytime you get a unique file name.
    const storageRef = ref(storage, fileName); //store this file name, in the storage
    const uploadTask = uploadBytesResumable(storageRef, file);

    // tracking the changes using uploadTask
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; //to convert to %
        setFilePercentage(Math.round(progress));
        // console.log('Upload is ' + progress + '% done')
      },
      (error) => {
        setFileUploadError(true);
      },
      //once the upload is successful, get the download url
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          console.log(downloadUrl);
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };

  //2. TO HANDLE THE CHANGES IN THE FORM
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //3. TO SUBMIT THE REPONSE TO THE BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };

  //4. TO HANDLE DELETE USER API
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  //5. TO HANDLE THE SIGN OUT FUNCTION
  const handleSignOut = async () => {
    try {
      // dispatch(signOutStart())
      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (err) {
      dispatch(signOutFailure(err.message));
    }
  };

  //6. TO HANDLE THE SHOW LISTING API
  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);

      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (err) {
      setShowListingError(true);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h3 className="text-center font-bold text-3xl my-7">PROFILE</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" action="">
        {/* this file input is referenced to the image, i.e while clicking the image this file input will run */}
        <input
          type="file"
          name=""
          id=""
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])} //since we only need one file, giving an index of 0
        />
        {/* making it to accept only images*/}
        <img
          onClick={() => fileRef.current.click()}
          className="h-32 w-32 rounded-full self-center object-cover cursor-pointer"
          src={formData.avatar || currentUser.avatar} //if the avatar exists in form data show that or yk..
          alt="profile_img"
        />
        <p className="self-center">
          {" "}
          {/*if error ? display error or if percentage ? display percentage or per=100 ? display imgage success or empty strng*/}
          {fileUploadError ? (
            <span className="text-red-700">
              Error uploading image! (must be less that 2MB)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">
              {`Uploading ${filePercentage}%`}
            </span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">Image upload successful</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg py-5"
          defaultValue={currentUser.username}
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg py-5"
          defaultValue={currentUser.email}
          id="email"
          disabled
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg py-5"
          id="password"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 ">
          update
        </button>

        {/* CREATE LISTING BUTTON */}
        <Link
          className="bg-green-700 text-white p-3 uppercase text-center hover:opacity-95 rounded-lg"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>

      {/* TO SHOW THE LISTINGS */}
      <button
        onClick={handleShowListings}
        className="text-green-700 w-full my-5"
      >
        Show my listings
      </button>
      <p className="text-red-500">
        {showListingError ? "Error showing listings" : ""}
      </p>


      {userListings &&
        userListings.length > 0 &&
        <div className="">
          <h1 className="text-2xl font-bold text-center underline">YOUR LISTINGS</h1>
        {userListings.map((listings) => (
          <div
            key={listings._id}
            className="flex border border-black rounded-lg p-3 justify-between items-center mt-3"
          >
            <Link to={`/listing/${listings._id}`}>
              <img
                src={listings.imageUrls[0]}
                alt=""
                className="h-16 w-16 object-contain"
              />
            </Link>
            <Link
              to={`/listing/${listings._id}`}
              className="text-slate-700 font-semibold hover:underline truncate"
            >
              <p>{listings.name}</p>
            </Link>

            <div className="flex flex-col gap-3">
              <button className="text-red-700">DELETE</button>
              <button className="text-green-700">EDIT</button>
            </div>
          </div>
        ))}
        </div>}
    </div>
  );
}
