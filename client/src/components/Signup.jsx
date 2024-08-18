import React, { useState } from "react";
import Input from "./ui/input";
import { Button } from "./ui/button";

function Signup() {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const changeEventHandler = (e) => {
    setInput({...input, [e.target.name]:e.target.value})// we used ...input because we want email/email/password property intact as we change the username/password/email
    // setInput({...input, [e.target.email]:e.target.value})// we used ...input because we want email and password property intact as we chaneg the username
    // setInput({...input, [e.target.password]:e.target.value})// we used ...input because we want email and password property intact as we chaneg the username
  }
  const signupHandler = (e) => {
    e.preventDefault();
    console.log(input);
    
    try {
        
    } catch (error) {
        console.log(error)
    }
  }
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8">
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center">Signup on instagram</p>
        </div>
        <div>
          <span className=" font-medium">Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-2"
          />
        </div>
        <div>
          <span className=" font-medium">Email</span>
          <Input type="email" name="email" value={input.email} onChange={changeEventHandler} className="focus-visible:ring-transparent my-2" />
        </div>
        <div>
          <span className=" font-medium">Password</span>
          <Input type="password" name="password" value={input.password} onChange={changeEventHandler} className="focus-visible:ring-transparent my-2" />
        </div>
        <Button type="submit">Signup</Button>
      </form>
    </div>
  );
}

export default Signup;
