import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layouts";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Error from "./pages/Error";
import Credentials from "./pages/Credentials";
import Usage from "./pages/Usage";
import Invoices from "./pages/Invoices";
import Settings from "./pages/Settings";
import RequestCalculator from "./pages/RequestCalculator";
import ResetPassword from "./pages/ResetPassword";
import Help from "./pages/Help";
import Workspace from "./pages/Workspace";
import { Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element:<Layout />,
    children: [
      {
        path:"/",
        element:<Navigate to="/workspace" />,
      },
      {
        path:"/",
        element:<Dashboard />,
        children:[
		  {path:"/workspace", element:<Workspace />},
          {path:"/credentials", element:<Credentials />},
          {path:"/usage", element:<Usage />},
          {path:"/invoices", element:<Invoices />},
          {path:"/settings", element:<Settings />},
          {path:"/request-calculator", element:<RequestCalculator />},
          {path:"/help", element:<Help />},
        ]
      },
      {path:"/login",element:<Login />},
      {path:"/signup",element:<Signup />},
      {path:"/reset-password",element:<ResetPassword />},
      {path:"*",element:<Error />}
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
