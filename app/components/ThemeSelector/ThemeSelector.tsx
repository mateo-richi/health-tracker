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
  return (
    <div className={styles.container}>
      <Theme theme="black" setTheme={() => setTheme("black")} />
      <Theme theme="amethyst" setTheme={() => setTheme("amethyst")} />
      <Theme theme="falcon_eye" setTheme={() => setTheme("falcon_eye")} />
      <Theme theme="labradorite" setTheme={() => setTheme("labradorite")} />
      <Theme theme="lapis_lazuli" setTheme={() => setTheme("lapis_lazuli")} />
      <Theme theme="malachite" setTheme={() => setTheme("malachite")} />
      <Theme theme="rose_quartz" setTheme={() => setTheme("rose_quartz")} />
      <Theme theme="tigers_eye" setTheme={() => setTheme("tigers_eye")} />
      <Theme theme="white_agate" setTheme={() => setTheme("white_agate")} />
    </div>
  );
};

export default ThemeSelector;
