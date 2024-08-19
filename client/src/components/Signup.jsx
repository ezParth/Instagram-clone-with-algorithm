import React, { useState } from "react";
import Input from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();
  const changeEventHandler = (e) => {
    setInput({...input, [e.target.name]:e.target.value})// we used ...input because we want email/email/password property intact as we change the username/password/email
  }
  const signupHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      setLoading(true)
        const res = await axios.post('http://localhost:3000/api/v1/user/register', input, {
            headers:{
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
        console.log('the response from axios request is: ',res.headers)
        if(res.data.message === 'Account created Successfully!'){
          Navigate("/login")
            toast.success(res.data.message)
            setInput({
              username: "",
              email: "",
              password: "",
            })
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
    } finally{
      setLoading(false);
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
        <Button type="submit" disabled={loading}>{loading?'Signing Up...':'Signup'}</Button>
        <span>Already have an account? <Link to="/login" className="text-blue-600">Login</Link></span>
      </form>
    </div>
  );
}

export default Signup;