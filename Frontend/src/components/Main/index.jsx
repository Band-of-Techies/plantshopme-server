import styles from "./styles.module.css";
import { Link } from "react-router-dom";
const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>fakebook</h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>

        <button className={styles.white_btn} >
				<Link to={'/addCategory'} >AddCategory
     </Link>	
				</button>

        <button className={styles.white_btn} >
				<Link to={'/addplantcare'} >Addplantcare
     </Link>	
				</button>

			</nav>
		</div>
	);
};

export default Main;