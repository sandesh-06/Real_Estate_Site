import React from "react";
import { FaSearch } from "react-icons/fa";
import {Link} from 'react-router-dom'
export default function Header() {
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-2 sm:p-3">
        {/* Website name */}
        <Link to="/">
        <h1 className="font-bold text-sm sm:text-xl cursor-pointer">
          <span className="text-slate-500">Sandesh</span>
          <span className="text-slate-700">Estate</span>
        </h1>
        </Link>

        {/* Search bar */}
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-500" />
        </form>

        {/* Menu bar */}
        <ul className="flex gap-4">
            <Link to="/">
          <li className="hidden sm:inline text-slate-700 hover:underline hover:cursor-pointer">
            Home
          </li>
          </Link>

          <Link to='/about'>
          <li className="hidden sm:inline text-slate-700 hover:underline hover:cursor-pointer">
            About
          </li>
          </Link>

          <Link to='/sign-in'>
          <li className="inline text-slate-700 hover:underline hover:cursor-pointer">
            Sign in
          </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
