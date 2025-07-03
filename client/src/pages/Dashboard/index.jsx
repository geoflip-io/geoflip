import { Outlet } from "react-router-dom";
import Navigation from "../../components/Navigation";
import { useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

function Dashboard() {
  const theme = useTheme();

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
