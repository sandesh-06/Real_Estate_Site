import React from "react";

export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a listing
      </h1>

      <form className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />

          <textarea
            type="text"
            placeholder="description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />

          <input
            type="text"
            placeholder="address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />

          {/* CHECKBOXES */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
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
              />
              <p className="">Bathrooms</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p className="">Regular Price</p>
                <span className="text-xs">(&#8377; /month)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                id="discountPrice"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p className="">Discounted Price</p>
                <span className="text-xs">(&#8377; /month)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <p className="font-semibold">
            Images: <span className="font-normal text-gray-600 ml-2">The first image will be cover (max 6)</span>
          </p>

          <div className="flex gap-4">
            <input className="p-3 border border-gray-300 rounded w-full" type="file" id="images" accept="image/*" multiple/>
            <button className="p-3 text-green-700 border border-green-700 rounded-lg hover:shadow-lg disabled:opacity-80">UPLOAD</button>
          </div>
        {/* CREATE LISTING BUTTON */}
        <button className="p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 disabled:opacity-80 my-7">CREATE LISTING</button>
        </div>

      </form>
    </main>
  );
}
