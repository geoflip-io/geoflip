import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import {
	IconButton,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	List,
	Drawer as MuiDrawer,
	Box,
	Typography,
	Menu,
	MenuItem
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAuth, logout, refreshToken } from "../../features/AuthManager";
import { setTheme } from "../../utils/theme";
import { LoadingBackdrop } from "../../components/Loader";
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import IntegrationInstructionsOutlinedIcon from '@mui/icons-material/IntegrationInstructionsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { toast } from "react-toastify";
import TermsModal from "../TermsModal";


const drawerWidth = 250;

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));

function Navigation() {
	const theme = useTheme();
	const { authState, dispatch } = useAuth();
	const location = useLocation();
	const [open, setOpen] = useState(true);
	const [userMenuAnchor, setuserMenuAnchor] = useState(null);
	const [loading, setLoading] = useState(false);
	const [termsModalOpen, setTermsModalOpen] = useState(false);
	const [termsPage, setTermsPage] = useState(0);
	const [drawerClicked, setDrawerClicked] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			if (!drawerClicked){
				if (window.innerWidth < 600) {
					setOpen(false);
				} else {
					setOpen(true);
				}
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize(); // Check on mount in case the screen is already small

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [drawerClicked]);

	const pages = [
		{ name: "Workspace", path: "/workspace", icon: <PublicOutlinedIcon /> },
		{ name: "Credentials", path: "/credentials", icon: <VpnKeyOutlinedIcon /> },
		{ name: "Usage", path: "/usage", icon: <AnalyticsOutlinedIcon /> },
		{ name: "Invoices", path: "/invoices", icon: <ReceiptLongOutlinedIcon /> },
		{ name: "Settings", path: "/settings", icon: <SettingsOutlinedIcon /> }
	];

	const bottomPages = [
		{ name: "Request Calculator", path: "/request-calculator", icon: <IntegrationInstructionsOutlinedIcon /> },
		{ name: "Help", path: "/help", icon: <HelpOutlineOutlinedIcon /> },
	];

	const toggleDrawer = () => {
		setOpen((prevOpen) => !prevOpen);
		setDrawerClicked(true);
	};

	const handleMenuOpen = (event) => {
		setuserMenuAnchor(event.currentTarget);
	};

	const handleMenuClose = () => {
		setuserMenuAnchor(null);
	};

	const handleTermsModalClose = () => {
		setTermsModalOpen(false);
	};

	const handleTOSClick = () => {
		setTermsPage();
		handleMenuClose();
		setTermsModalOpen(true);
	};

	const handleLogout = async (e) => {
		e.preventDefault();
		setLoading(true);

		const result = await logout(dispatch, authState.token);
		if (result.message === "success") {
			handleMenuClose();
			toast.info("See you next time.");
			setLoading(false);
		} else {
			setLoading(false);
			toast.error(result.message);
		}
	};

	const handleThemeToggle = () => {
		handleMenuClose();
		setTheme(theme.palette.mode === "light" ? "dark" : "light");
	}

	const handleItemClick = () => {
		refreshToken(dispatch, authState.token);
	};

	const logoUrl = theme.palette.mode === "light" ? "/Geoflip_Logo.png" : "/Geoflip_Logo_inversed.png";
	const brandmarkUrl = theme.palette.mode === "light" ? "/Geoflip_Brandmark_Black.png" : "/Geoflip_Brandmark_White.png";

	return (
		<>
			<Drawer variant="permanent" open={open}>
				<DrawerHeader sx={{ mt: 2 }}>
					<NavLink
						to="/"
						style={{ color: "inherit", textDecoration: "none" }}
					>
						<img
							src={logoUrl}
							alt="Geoflip Logo"
							width="150"
							hidden={!open}
							style={{
								marginRight: "8px",
								flexGrow: 1,
								fontFamily: "monospace",
								fontWeight: 900,
								letterSpacing: ".1rem",
								color: theme.palette.primary.main,
								"&:hover": {
									color: theme.palette.primary.dark,
									textShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
								},
							}}
						/>
					</NavLink>
					<IconButton
						onClick={toggleDrawer}
						sx={{
							color: theme.palette.primary.contrastText,
							mr: 0.5,
							mb: 1,
						}}
					>
						{open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
				</DrawerHeader>
				<List>
					{pages.map((page) => (
						<ListItem
							key={page.name}
							disablePadding
							sx={{ display: "block" }}
						>
							<NavLink
								to={page.path}
								style={{ color: theme.palette.text.primary, textDecoration: "none" }}
							>
								<ListItemButton
									onClick={handleItemClick}
									sx={{
										minHeight: 48,
										justifyContent: open ? "initial" : "center",
										px: 2.5,
										color: location.pathname === page.path ? theme.palette.primary.main : theme.palette.primary.contrastText,
										"&:before": {
											content: '""',
											position: "absolute",
											left: 0,
											top: 0,
											bottom: 0,
											width: 4,
											borderRadius: "0 4px 4px 0",
											backgroundColor: location.pathname === page.path ? theme.palette.primary.main : "transparent",
										},
									}}
								>
									<ListItemIcon
										sx={{
											minWidth: 0,
											mr: open ? 3 : "auto",
											justifyContent: "center",
											color: location.pathname === page.path ? theme.palette.primary.main : theme.palette.primary.contrastText,
										}}
									>
										{page.icon}
									</ListItemIcon>
									<ListItemText
										primary={
											<Typography sx={{ 
												fontWeight: 600, 
											}}>
												{page.name}
											</Typography>
										}
										sx={{ opacity: open ? 1 : 0 }}
									/>
								</ListItemButton>
							</NavLink>
						</ListItem>
					))}
				</List>
				<Box sx={{ flexGrow: 1 }} />
				<Box>
					<List>
						{bottomPages.map((page) => (
							<ListItem
								key={page.name}
								disablePadding
								sx={{ display: "block" }}
								onClick={handleItemClick}
							>
								<NavLink
									to={page.path}
									style={{
										color: "inherit",
										textDecoration: "none",
									}}
								>
									<ListItemButton
										sx={{
											minHeight: 48,
											justifyContent: open
												? "initial"
												: "center",
											px: 2.5,
											color: location.pathname === page.path ? theme.palette.primary.main : theme.palette.primary.contrastText,
											"&:before": {
												content: '""',
												position: "absolute",
												left: 0,
												top: 0,
												bottom: 0,
												width: 4,
												borderRadius: "0 4px 4px 0",
												backgroundColor: location.pathname === page.path ? theme.palette.primary.main : "transparent",
											},
										}}
									>
										<ListItemIcon
											sx={{
												minWidth: 0,
												mr: open ? 3 : "auto",
												justifyContent: "center",
												color: location.pathname === page.path ? theme.palette.primary.main : theme.palette.primary.contrastText,
											}}
										>
											{page.icon}
										</ListItemIcon>
										<ListItemText
											primary={
												<Typography sx={{ 
													fontWeight: theme.palette.mode === "light" ? 600 : 500,  
												}}>
													{page.name}
												</Typography>
											}
											sx={{ opacity: open ? 1 : 0 }}
										/>
									</ListItemButton>
								</NavLink>
							</ListItem>
						))}


						<ListItem
							key="user_item"
							disablePadding
							sx={{ display: "block" }}
						>
							<ListItemButton
								onClick={handleMenuOpen}
								sx={{
									minHeight: 48,
									justifyContent: open ? "initial" : "center",
									px: 2.5,
									color: theme.palette.text.primary,
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										ml: "2px",
										mr: open ? 3 : "auto",
										justifyContent: "center",
										color: theme.palette.primary.contrastText,
									}}
								>
									<img src={brandmarkUrl} alt="Brandmark" width="22" />
								</ListItemIcon>
								{authState.isAuthenticated && (
									<ListItemText
										primary={
											<Typography sx={{ 
												fontWeight: theme.palette.mode === "light" ? 600 : 500,  
											}}>
												{`${authState.user.first_name} ${authState.user.last_name}`}
											</Typography>
										}
										sx={{ opacity: open ? 1 : 0 }}
									/>
								)}
							</ListItemButton>
						</ListItem>
					</List>
				</Box>
				<Menu
					anchorEl={userMenuAnchor}
					open={Boolean(userMenuAnchor)}
					onClose={handleMenuClose}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'left',
					}}
					sx={{
						mt: '15px',
						ml: '1px'
					}}
				>
					<MenuItem onClick={handleThemeToggle}>
						{theme.palette.mode === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
					</MenuItem>
					<MenuItem onClick={handleTOSClick}>Terms and Policies</MenuItem>
					<MenuItem onClick={handleLogout}>Logout</MenuItem>
				</Menu>
			</Drawer>
			<LoadingBackdrop isOpen={loading} />
			<TermsModal open={termsModalOpen} handleClose={handleTermsModalClose} initialPage={termsPage} />
		</>
	);
}

export default Navigation;
