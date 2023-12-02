import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import GoogleOAuth from "../components/GoogleOAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  
  const {loading, error} = useSelector((state) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //on change event
  const handleChange = (e) => {
    e.preventDefault();
    setFormData({
      ...formData, // to keep the prev added values,
      [e.target.id]: e.target.value, //which even id is changing update its value
    });
  };
  // console.log(formData); //try this without ...formData if you don't understand why is it used.

  //form submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    //instead of mentioning 'http://localhost....' in every fetch, add a proxy in vite.config.js file.
    try {
      //old: setLoading(true); //set loading true before execution of request
      //updated:
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        //if the data has an error then execute this
        //updated:
        dispatch(signInFailure(data.message))
        return;
        // console.log(data);
        //old:
        // setError(data.message);
        // setLoading(false);
        
      }
      //old:
      // setLoading(false); //if no error, set loading as false
      // setError(null) //set error to null, if everything works fine (works for after encountering an error)
      //updated: 
      dispatch(signInSuccess(data))
      navigate('/') //if user created successfully navigate to sign in page
      // console.log(data);
    } catch (error) {
      // console.log(error);
      //updated:
      dispatch(signInFailure(error.message))

      //old:
      // setError(error.message);
      // setLoading(false);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      {/* sign up form */}
      <h1 className="text-3xl text-center font-semibold my-7">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
         disabled = {loading} 
         className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer">
          Login
        </button>

        <GoogleOAuth/>
        
      </form>

    {/* Sign in redirect */}
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700 font-semibold">Sign up</span>
        </Link>
      </div>

      {/* print the error message if there is an error */}
      {error && <p className="text-rose-500 font-semibold mt-5">{error}</p>}
    </div>
  );
}
