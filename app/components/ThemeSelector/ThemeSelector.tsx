"use client";

import React from "react";

import styles from "./ThemeSelector.module.css";

interface ThemeProps {
  theme: string;
  setTheme: () => void;
}

const Theme = ({ theme, setTheme }: ThemeProps) => {
  return (
    <img
      src={`/images/${theme}.png`}
      alt={`${theme} theme`}
      onClick={setTheme}
    />
  );
};

interface Props {
  setTheme: (theme: string) => void;
}

const ThemeSelector = ({ setTheme }: Props) => {
  const themes = [
    "black",
    "amethyst",
    "falcon_eye",
    "labradorite",
    "lapis_lazuli",
    "malachite",
    "rose_quartz",
    "tigers_eye",
    "white_agate",
  ];
  return (
    <div className={styles.container}>
      {themes.map((theme) => (
        <Theme key={theme} theme={theme} setTheme={() => setTheme(theme)} />
      ))}
    </div>
  );
};

export default ThemeSelector;
