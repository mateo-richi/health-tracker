import React from "react";

import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.heart} />
      <p className={styles.text}>We are loading your heart rate data...</p>
    </div>
  );
};

export default Loading;
