import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaHome,
  FaSignOutAlt,
  FaUserPlus,
  FaExchangeAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";

import logo from "../../assets/img/logo.svg";
import AppContext from "../../contexts";
import styles from "./Navbar.module.css";
import { Toaster, toast } from "react-hot-toast";

const Navbar = () => {
  const { user, setUser } = useContext(AppContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);

    Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Successfully logged out");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
      }
      setIsLoggingOut(false);
    });
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo} alt="logo" className={styles.logoImage} />
      </div>
      <div className={styles.navLinks}>
        <NavLink
          exact
          to="/"
          className={styles.navLink}
          activeClassName={styles.activeNavLink}
        >
          <FaHome className={styles.navIcon} />
          Home
        </NavLink>
        <NavLink
          to="/addfriend"
          className={styles.navLink}
          activeClassName={styles.activeNavLink}
        >
          <FaUserPlus className={styles.navIcon} />
          Add Friend
        </NavLink>
        <NavLink
          to="/transaction"
          className={styles.navLink}
          activeClassName={styles.activeNavLink}
        >
          <FaExchangeAlt className={styles.navIcon} />
          Send Money
        </NavLink>
      </div>
      <div className={styles.userProfile}>
        <p className={styles.welcomeMessage}>Welcome, {user.username}</p>
        <button
          className={styles.btnLogout}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ClipLoader color={"#ffffff"} loading={true} size={12} />
          ) : (
            <>
              <FaSignOutAlt className={styles.icon} />
              Logout
            </>
          )}
        </button>
        <Toaster />
      </div>
    </nav>
  );
};

export default Navbar;
