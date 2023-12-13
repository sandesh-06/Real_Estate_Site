import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { firebase_app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function CreateListing() {
  const {currentUser} = useSelector(state=>state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  // console.log(files);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = (e) => {
    //check if any file exists, and should be less than 7
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const downloadUrls = []; //because we are uploading multiple files, we need to wait for every promise to resolve before moving on

      for (let i = 0; i < files.length; i++) {
        downloadUrls.push(storeImage(files[i]));
      }

      //once all the urls are recieved, all the urls to imageUrls
      Promise.all(downloadUrls)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2mb max per image)");
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(firebase_app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  //TO HANDLE CHANGE IN FORM
  const handleChanage = (e) => {
    e.preventDefault();
    //since we are receiving different inputs, we have to handle it seperately

    //1. For sell or rent
    if(e.target.id === 'sell' || e.target.id === 'rent'){
      setFormData({
        ...formData,
        type: e.target.id
      })
    }

    //2. To track the boolean values
    if(e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer"){
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      })
    }

    //3. rest of them
    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }
  };

  //TO HANDLE THE FORM SUBMISSION
  const handleFormSubmit = async(e)=>{
    e.preventDefault();
    try{
      //If there's no image uploaded, don't submit form
      if(formData.imageUrls.length < 1){
        return setError("You must upload atleast one image!");
      }

      //If the regular price is less than discounted price, it doesn't make sense, so don't submit form
      //the '+' will convert them to a number if received as string(may happen sometimes, but in backend mongo will handle it)
      if(+formData.regularPrice < +formData.discountedPrice){
        return setError("The regular price cannot be less than discounted price!")
      }
      setLoading(true)
      setError(false);
      const res = await fetch('/api/listing/create',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        //everytime you send a data, send some user
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id
        }),
      })

      const data = await res.json();
      setLoading(false);
      if(data.success === false){
        setError(data.message);
      }
      //once the listing is successfully created, navigate the user to display the created listing
      navigate(`/listing/${data._id}`)
    }catch(err){
      setError(err.message);
      setLoading(false);
    }
  }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a listing
      </h1>

      <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChanage}
            value={formData.name}
          />

          <textarea
            type="text"
            placeholder="description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChanage}
            value={formData.description}
          />

          <input
            type="text"
            placeholder="address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChanage}
            value={formData.address}
          />

          {/* CHECKBOXES */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sell"
                className="w-5"
                onChange={handleChanage}
                checked={formData.type === "sell"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChanage}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChanage}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChanage}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChanage}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          {/* NUMBER INPUTS */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChanage}
                value={formData.bedrooms}
              />
              <p className="">Bedrooms</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="8"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChanage}
                value={formData.bathrooms}
              />
              <p className="">Bathrooms</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                id="regularPrice"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChanage}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p className="">Regular Price</p>
                <span className="text-xs">(&#8377; /month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-3">
              <input
                type="number"
                id="discountedPrice"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChanage}
                value={formData.discountedPrice}
              />
              <div className="flex flex-col items-center">
                <p className="">Discounted Price</p>
                <span className="text-xs">(&#8377; /month)</span>
              </div>
            </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded-lg hover:shadow-lg disabled:opacity-80"
            >
              UPLOAD
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={index} // Ensure each div has a unique key while using map
                className="flex justify-between border border-gray-200 my-2 px-3 rounded-lg"
              >
                <img
                  key={index}
                  src={url}
                  alt={`listing image ${index}`} // Alt text should be unique for accessibility
                  className="w-20 h-20 object-contain rounded-lg my-1"
                />

                <button
                  onClick={() => handleRemoveImage(index)}
                  type="button"
                  className="text-red-700 p-3 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          {/* CREATE LISTING BUTTON */}
          <button className="p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80 my-7">
           {loading ? 'CREATING...': 'CREATE LISTING'}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
