import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import Login from "./containers/Login/Login.container";
import Register from "./containers/Register/Register.container";
import Root from "./containers/Root/Root.container";
import Dashboard from "./containers/Dashboard/Dashboard.container";
import AddFriend from "./containers/AddFriend/AddFriend.container";
import Transaction from "./containers/Transaction/Transaction.container";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="" element={<Root />}>
          <Route index element={<Dashboard />} />
          <Route path="/addfriend" element={<AddFriend />} />
          <Route path="/transaction" element={<Transaction />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
