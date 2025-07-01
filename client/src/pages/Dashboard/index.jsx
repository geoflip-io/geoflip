import { useAuth } from "../../features/AuthManager";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Navigation from "../../components/Navigation";
import { useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

function Dashboard() {
  const { authState, isInitializing, dispatch } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const checkAuthState = () => {
      if (!authState.isAuthenticated) {
        navigate("/login");
        return;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      if (authState.expiry && authState.expiry < currentTime) {
        dispatch({ type: "LOGOUT" });
        navigate("/login");
      }
    };

    if (!isInitializing) {
      checkAuthState();
    }
  }, [authState, isInitializing, navigate, dispatch]);

  if (isInitializing) {
    return <p>Loading...</p>;
  }

  const pageBgColor = theme.palette.mode === "light" ? theme.palette.secondary.main : theme.palette.background.default;

  return (
    <Box sx={{ display: 'flex', overflow:"hidden"}}>
      <CssBaseline />
      <Box
        component="nav"
      >
        <Navigation />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: pageBgColor,
          color: theme.palette.text.primary,
          paddingLeft: 5,
          paddingTop: 1.5,
          height: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default Dashboard;
