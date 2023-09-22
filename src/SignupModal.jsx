import { useEffect, useRef, useState } from "react";

function SignupModal({ setWantSignup }) {
  return (
    <div className="modal fixed w-[100vw] h-[100vh] left-0 top-0">
      <div className="wrapper w-full h-full relative flex flex-col justify-center items-center">
        <form
          action=""
          className="z-20 flex flex-col justify-between items-center w-[90%] max-w-[320px] h-[400px] bg-light text-dark py-5 px-7"
        >
          <h1 className="text-3xl font-medium">Sign up</h1>
          <hr className="border-dark w-full" />
          <input
            className="h-[40px] w-full outline-none px-3 bg-[transparent] border border-[transparent] border-b-dark placeholder:text-dark placeholder:opacity-50"
            type="text"
            name="username"
            id="username"
            placeholder="username"
          />
          <input
            className="h-[40px] w-full outline-none px-3 bg-[transparent] border border-[transparent] border-b-dark placeholder:text-dark placeholder:opacity-50"
            type="email"
            name="email"
            id="email"
            placeholder="email"
          />
          <input
            className="h-[40px] w-full outline-none px-3 bg-[transparent] border border-[transparent] border-b-dark placeholder:text-dark placeholder:opacity-50"
            type="password"
            name="password"
            id="password"
            placeholder="password"
          />
          <button className="h-[40px] w-full bg-dark text-light" type="submit">
            Sign up
          </button>
        </form>
        <div
          onClick={() => setWantSignup(false)}
          className="overlay z-10 absolute left-0 top-0 bg-dark w-full h-full opacity-50"
        ></div>
      </div>
    </div>
  );
}

export default SignupModal;
