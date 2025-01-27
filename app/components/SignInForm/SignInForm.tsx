"use client";

import React, { useState } from "react";

import styles from "./SignInForm.module.css";

interface Props {
  onSignIn: (username: string) => void;
}

const SignInForm = ({ onSignIn }: Props) => {
  const [username, setUsername] = useState("");
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      const response = await fetch(
        "https://nowatch-fullstack-test-assignment.vercel.app/api/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );
      if (response.ok) {
        onSignIn(username);
      } else {
        alert("Sign-in error");
      }
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <p className={styles.header}>Welcome to NOWATCH Health Tracker</p>
      <form onSubmit={submitHandler} className={styles.form}>
        <input
          id="username"
          type="text"
          placeholder="Please, enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />
      </form>
    </div>
  );
};

export default SignInForm;
