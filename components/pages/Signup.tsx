"use client"
import { signIn } from '@/lib/actions/auth-actions';
import Image from 'next/image'
import { redirect } from 'next/navigation';
import React, { useState } from 'react'

const Signup = ({auth} : {auth: string}) => {
    const [isSignIn, setIsSignIn] = useState(auth !== 'signup');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [age, setAge] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSocialAuth = async (provider: "google" | "apple" | "facebook") => {
        setIsLoading(true);
        setError("");
        try {
            // await signInSocial(provider); // Uncomment if you have this function
        } catch (err) {
            setError(
            `Error authenticating with ${provider}: ${
                err instanceof Error ? err.message : "Unknown error"
            }`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            if (isSignIn) {
                const result = await signIn(email, password); // Uncomment if you have this function
                if (!result.user) setError("Invalid email or password");
            } else {
                // Custom API sign up
                const res = await fetch("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, name, phone, age, city, country }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to create account");
                redirect("/");
                // Optionally: redirect or show success
            }
        } catch (err) {
            setError(
            `Authentication error: ${
                err instanceof Error ? err.message : "Unknown error"
            }`
            );
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className='auth-page'>
        <div className="image-container">
            <Image src="/assets/auth/bg.png" alt="Signup Image" width={500} height={500} />
        </div>
        <div className="auth-container">
            <div className="text-container">
                <Image src="/assets/logo-dark.svg" alt="Logo" width={150} height={50} />
                {isSignIn ? <h1 className='heading auth'>Create Your Free Playboy Profile</h1> : <h1 className='heading auth'>Welcome Back to PlayboyPlacements</h1>}
            </div>
        </div>
        <div className="form-container">
            <form onSubmit={handleEmailAuth}>
                {!isSignIn ? (
                    <>
                <div className="input-container">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" placeholder='Enter your name' name='name' value={name} onChange={e => setName(e.target.value)}/>
                </div>
                <div className="input-container">
                    <label htmlFor="email">Email address</label>
                    <input type="email" placeholder='example@gmail.com' name='email' value={email} onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="input-container">
                    <label htmlFor="phone">Phone no.</label>
                    <input type="number" placeholder='+91 XXXXXXXXXXX' name='phone' value={phone} onChange={e => setPhone(e.target.value)}/>
                </div>
                <div className="input-container">
                    <label htmlFor="password">Create Password</label>
                    <input type="password" placeholder='••••••••••••' name='password' value={password} onChange={e => setPassword(e.target.value)}/>
                </div>
                <div className="input-container">
                    <label htmlFor="age">Age (18+)</label>
                    <input type="number" placeholder='Enter your Age' name='age' value={age} onChange={e => setAge(e.target.value)}/>
                </div>
                <div className="input-container">
                    <label htmlFor="city">City</label>
                    <input type="text" placeholder='Tell us where do you live' name='city' value={city} onChange={e => setCity(e.target.value)}/>
                </div>
                <div className="input-container">
                    <label htmlFor="country">Country</label>
                    <input type="text" placeholder='Enter your Country’s Name' name='country' value={country} onChange={e => setCountry(e.target.value)}/>
                </div>
                </>) : <><div className="input-container">
                    <label htmlFor="email">Email address</label>
                    <input type="text" placeholder='example@gmail.com' name='email' value={email} onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="input-container">
                    <label htmlFor="password">Create Password</label>
                    <input type="text" placeholder='Enter Password' name='password' value={password} onChange={e => setPassword(e.target.value)}/>
                </div></>}
                
                {error && <div className="error-message">{error}</div>}

                <button type='submit' disabled={isLoading}>
                {isLoading ? "Loading..." : isSignIn ? "Sign In" : "Sign Up"}
                </button>
            </form>
        </div>
        <div className="providers-container">
            <div className="divider-container">
                <div className="d-line"></div>
                {auth === 'signup' ? <p>Or Sign up with</p> : <p>Or Sign in with</p>}
                <div className="d-line"></div>
            </div>
            <div className="socials">
                <div className="social" onClick={() => handleSocialAuth("apple")}>
                    <Image src="/assets/auth/apple.png" alt="Apple" width={30} height={30} />
                </div>
                <div className="social" onClick={() => handleSocialAuth("google")}>
                    <Image src="/assets/auth/google.png" alt="Google" width={30} height={30} />
                </div>
                <div className="social" onClick={() => handleSocialAuth("facebook")}>
                    <Image src="/assets/auth/fb.png" alt="Facebook" width={30} height={30} />
                </div>
            </div>
            <p>
  {isSignIn
    ? "Don't have an account? "
    : "Already have an account? "}
  <span
    style={{ color: "#54432E", cursor: "pointer" }}
    onClick={() => {
        setIsSignIn(!isSignIn);
        setError("");
        setName("");
        setEmail("");
        setPassword("");
        setAge("");
        setCity("");
        setCountry("");
        setPhone("");
    }}
  >
    {isSignIn ? "Sign Up" : "Sign In"}
  </span>
</p>
        </div>
    </div>
  )
}

export default Signup