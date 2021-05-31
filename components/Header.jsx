import styles from "../styles/Header.module.css";

const Header = ({ title, description }) => {
	return (
		<div className={styles.header}>
			<h1 className={styles.title}>{title}</h1>
			<p className={styles.description}>
				{description}
			</p>
		</div>
	)
}

export default Header;