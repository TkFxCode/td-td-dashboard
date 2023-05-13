import React from 'react';
import { SignupCard } from '../components/Auth/SignUpCard';

const SignUp = () => {
  return (
    <div>
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl text-center py-20">
        Join Our Community!
      </h1>
      <div className="flex justify-center items-center">
        <SignupCard />
      </div>
    </div>
  );
};

export default SignUp;
