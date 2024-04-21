// ******************** Styles ********************
import styles from '../styles/Home.module.css';

import { Link } from "react-router-dom"


const Home = () => {
    return (
        <div>
            <div className={styles.nav}>
            <ul className={styles.navbar}>
<li className={styles.navB}><a href="#home">Home</a></li>
  <li className={styles.navB}><a href="#news">News</a></li>
  <li className={styles.navB}><a href="#contact">Contact</a></li>
  <Link to="/signup"><li className={styles.rightnavB}><a className="active" href="#about">Sign up</a></li></Link>
  <Link to="/login"><li className={styles.rightnavB}><a className="active" href="#about">Login</a></li></Link>
</ul>
            </div>
            <h1 className={styles.home}>Home</h1>
        </div>
    )
}

export default Home
