import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./layouts";
import Dashboard from "./pages/Dashboard";
import Error from "./pages/Error";
import NavTemplate from "./pages/NavTemplate";
import Workspace from "./pages/Workspace";
import { Navigate } from "react-router-dom";
import Exports from "./pages/Exports";
import Enterprise from "./pages/Enterprise";

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
          {path:"/exports", element:<Exports />},
          {path:"/enterprise", element: <Enterprise />}
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
