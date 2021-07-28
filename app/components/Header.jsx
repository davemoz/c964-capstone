import styles from "../styles/Header.module.scss";

const Header = ({ title }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
    </div>
  );
};

export default Header;
