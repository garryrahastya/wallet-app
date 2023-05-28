import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.component";

import AppContext from "../../contexts";

function Root() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(userData);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <Navbar />
      <Outlet />
    </AppContext.Provider>
  );
}

export default Root;
