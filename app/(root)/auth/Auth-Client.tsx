"use client"
import { signIn, signInSocial, signUp } from '@/lib/actions/auth-actions';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from 'react'
import toast from "react-hot-toast";

const AuthClientPage = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [age, setAge] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showVerification, setShowVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [verifying, setVerifying] = useState(false);

    const router = useRouter();

    const handleSocialAuth = async (provider: "google") => {
        setIsLoading(true);
        setError("");
        try {
            await signInSocial(provider); // Uncomment if you have this function
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
                let result: any;

                try {
                    result = await signIn(email, password);
                } catch (err: any) {
                    // If Better Auth throws, show a friendly message
                    setError("Invalid email or password");
                    toast.success("Invalid email or password");
                    setIsLoading(false);
                    return;
                }
            
                if (!result.user) {
                    setError("Invalid email or password"); 
                    toast.error("Invalid email or password");
                }
                else router.push("/profile");
            } else {
            // 1. Sign up with Better Auth
                const result = await signUp(email, password, name);
                if (!result.user) {
                    setError("Signup failed");
                    toast.error("Signup failed");
                    setIsLoading(false);
                    return;
                }

            // 2. Update extra fields via custom API
                const res = await fetch("/api/user/update", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                    email,
                    phone,
                    age,
                    city,
                    country,
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(toast.error(data.error || "Unknown error"));

            // 3. Send verification code
                const verifyRes = await fetch("/api/send-verification", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });
                const verifyData = await verifyRes.json();
                if (!verifyRes.ok) throw new Error(toast.error(verifyData.error || "Failed to send verification code"));

                setShowVerification(true);
                setIsLoading(false);
                return;
        }
  } catch (err: any) {
      setError(err.message || "Unknown error");
      toast.error(err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifying(true);
        setError("");
        try {
            const code = otp.join(""); // <-- Use the 6 input values
            const res = await fetch("/api/verify-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Invalid or expired code");
            router.push("/profile");
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setVerifying(false);
        }
    };

    const handleBackToLogin = () => {
        setShowVerification(false);
        setOtp(Array(otpLength).fill(""));
        setError("");
        setIsSignIn(true);
        setEmail("");
        setPassword("");
        setName("");
        setPhone("");
        setAge("");
        setCity("");
        setCountry("");
        router.push("/auth"); // or your login route
    };

  const otpLength = 6;
const otpRefs = Array.from({ length: otpLength }, () => useRef<HTMLInputElement>(null));
const [otp, setOtp] = useState(Array(otpLength).fill(""));

const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
  const value = e.target.value.replace(/[^0-9a-zA-Z]/g, "").slice(0, 1);
  const newOtp = [...otp];
  newOtp[idx] = value;
  setOtp(newOtp);

  // Move to next input if value entered
  if (value && idx < otpLength - 1) {
    otpRefs[idx + 1].current?.focus();
  }
};

const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
  if (e.key === "Backspace" && !otp[idx] && idx > 0) {
    otpRefs[idx - 1].current?.focus();
  }
};

const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  const pasted = e.clipboardData.getData("Text").slice(0, otpLength).split("");
  setOtp((prev) =>
    prev.map((_, idx) => pasted[idx] || "")
  );
  // Focus last filled input
  const lastIdx = pasted.length - 1;
  if (lastIdx >= 0 && lastIdx < otpLength) {
    otpRefs[lastIdx].current?.focus();
  }
};

  return (
    <>
    {showVerification ? (
        <div className='verification-page'>
            <div className="verification-container">
                <div className="image-container">
                    <Image src="/assets/auth/mail.png" alt="Signup Image" width={500} height={500} />
                </div>
                <div className="text-container">
                    <h1 className='heading auth'>Email Verification</h1>
                    <p>We've sent a verification code to <span>{email}</span></p>
                </div>
                <div className="form-container">
                    <form onSubmit={handleVerify}>
                        <div className="input-container">
                            <div className="otp-inputs" style={{ display: "flex", gap: 8 }}>
                            {otp.map((val, idx) => (
                                <input
                                key={idx}
                                ref={otpRefs[idx]}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={val}
                                onChange={(e) => handleOtpChange(e, idx)}
                                onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                                onPaste={handlePaste}
                                />
                            ))}
                            </div>
                        </div>
                        <button type="submit" disabled={verifying}>
                            {verifying ? "Verifying..." : "Verify Email"}
                        </button>
                        {error && <div className="error-message">{error}</div>}
                    </form>
                </div>
                <button onClick={handleBackToLogin}>Back to Login</button>
            </div>
        </div>
    ) : (
<div className='auth-page'>
        <div className="image-container">
            <Image src="/assets/auth/bg.png" alt="Signup Image" width={500} height={500} />
        </div>
        <div className="auth-container">
            <div className="text-container">
                <Image src="/assets/logo-dark.svg" alt="Logo" width={150} height={50} />
                {isSignIn ? <h1 className='heading auth'>Welcome Back to PlayboyPlacements</h1> : <h1 className='heading auth'>Create Your Free Playboy Profile</h1>}
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
                    <input type="password" placeholder='••••••••••••' name='password' value={password} onChange={e => setPassword(e.target.value)}/>
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
                {!isSignIn ? <p>Or Sign up with</p> : <p>Or Sign in with</p>}
                <div className="d-line"></div>
            </div>
            <div className="socials">
                <div className="social">
                    <Image src="/assets/auth/apple.png" alt="Apple" width={30} height={30} />
                </div>
                <div className="social" onClick={() => handleSocialAuth("google")}>
                    <Image src="/assets/auth/google.png" alt="Google" width={30} height={30} />
                </div>
                <div className="social">
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
    )}



    
    </>
  )
}

export default AuthClientPage