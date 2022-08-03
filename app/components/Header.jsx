import React from 'react';

import styles from "../styles/Header.module.scss";

const Header = ({ title, subtitle }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <h2 className={styles.subtitle}>{subtitle}</h2>
    </div>
  );
};

export default Header;
