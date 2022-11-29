import React from "react";

import styles from "../styles/Loading.module.scss";

const Loading = () => {
  const dots = () => {
    const dotsArr = [];
    const to = setInterval(() => {
      dotsArr.push('.');
    }, 500);
    return dotsArr;
  };

  return <div className={styles.loading}><>Loading...</></div>;
};

export default Loading;
