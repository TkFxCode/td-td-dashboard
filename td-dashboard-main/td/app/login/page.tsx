import React from 'react';
import { SigninCard } from '../components/Auth/SignInCard';

const Login = () => {
  return (
    <div>
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl text-center py-20">
        Welcome Back!
      </h1>
      <div className="flex justify-center items-center">
        <SigninCard />
      </div>
    </div>
  );
};

export default Login;
