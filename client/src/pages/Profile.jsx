import React from "react";
import { useSelector } from "react-redux";
export default function Profile() {
  const {currentUser} = useSelector(state=>state.user);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h3 className="text-center font-bold text-3xl my-7">PROFILE</h3>

      <form className="flex flex-col gap-4" action="">
        <img className='h-32 w-32 rounded-full self-center object-cover' src={currentUser.avatar} alt="profile_img" />

        <input type="text" placeholder="username"
        className="border p-3 rounded-lg py-5"
        id="username"
        />
        <input type="password" placeholder="email"
        className="border p-3 rounded-lg py-5"
        id="email"
        />
        <input type="text" placeholder="password"
        className="border p-3 rounded-lg py-5"
        id="password"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 ">update</button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
