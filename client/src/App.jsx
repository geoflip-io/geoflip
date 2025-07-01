import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layouts";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import NavTemplate from "./pages/NavTemplate";
import ApiDocs from "./pages/ApiDocs";
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
          {path:"/nav-template", element:<NavTemplate />},
          {path:"/api-docs", element:<ApiDocs />},
        ]
      },
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
