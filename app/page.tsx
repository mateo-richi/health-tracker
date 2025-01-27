"use client";

import React, { useState } from "react";

import HeartRateGraph from "./components/HeartRateGraph/HeartRateGraph";
import SignInForm from "./components/SignInForm/SignInForm";
import ThemeSelector from "./components/ThemeSelector/ThemeSelector";

const Page: React.FC = () => {
  const [username, setUsername] = useState("");
  const [theme, setTheme] = useState("black");
  const onSignIn = (newUsername: string) => {
    setUsername(newUsername);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <div
        style={{
          width: "700px",
          height: "700px",
          display: "flex",
          justifyContent: "center",
          background: `url(/images/${theme}.png) no-repeat center center / cover`,
          borderRadius: "30px",
        }}
      >
        {!username ? (
          <SignInForm onSignIn={onSignIn} />
        ) : (
          <HeartRateGraph username={username} />
        )}
      </div>
      <ThemeSelector setTheme={setTheme} />
      {username !== "" && (
        <p
          onClick={() => onSignIn("")}
          style={{
            paddingTop: "20px",
            fontSize: "20px",
            color: "red",
            cursor: "pointer",
          }}
        >
          SIGN OUT
        </p>
      )}
    </div>
  );
};

export default Page;
