"use client";

import React from "react";

interface Props {
  onSignOut: () => void;
}

const SignOutButton = ({ onSignOut }: Props) => {
  return (
    <button
      onClick={onSignOut}
      style={{
        paddingTop: "20px",
        color: "red",
      }}
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
