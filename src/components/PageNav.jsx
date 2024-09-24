import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";
import Logo from "./Logo";
import { useState } from "react";

function PageNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className={styles.nav}>
      <Logo />
      <button className={styles.menuButton} onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`${styles.navList} ${menuOpen ? styles.showMenu : ""}`}>
        <li>
          <NavLink to="/" onClick={toggleMenu}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/pricing" onClick={toggleMenu}>
            Pricing
          </NavLink>
        </li>
        <li>
          <NavLink to="/product" onClick={toggleMenu}>
            Product
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" className={styles.ctaLink} onClick={toggleMenu}>
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
export default PageNav;
