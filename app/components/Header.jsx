import styles from "../styles/Header.module.scss";

const Header = ({ title }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>
        Please select a date below and click &apos;Predict&apos; to generate the
        prediction for that day.
      </p>
    </div>
  );
};

export default Header;
