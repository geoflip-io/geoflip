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
	Typography
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { setTheme } from "../../utils/theme";
import { LoadingBackdrop } from "../../components/Loader";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
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
	const location = useLocation();
	const [open, setOpen] = useState(true);
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
		{ name: "NavTemplate", path: "/nav-template", icon: <SettingsOutlinedIcon /> }
	];

	const bottomPages = [
		{ name: "API Documentation", path: "/api-docs", icon: <DescriptionOutlinedIcon /> },
	];

	const toggleDrawer = () => {
		setOpen((prevOpen) => !prevOpen);
		setDrawerClicked(true);
	};

	const handleTermsModalClose = () => {
		setTermsModalOpen(false);
	};

	const handleTOSClick = () => {
		setTermsPage();
		setTermsModalOpen(true);
	};

	const handleThemeToggle = () => {
		setTheme(theme.palette.mode === "light" ? "dark" : "light");
	}

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
								onClick={handleTOSClick}
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
									<PolicyOutlinedIcon />
								</ListItemIcon>

                                <ListItemText
                                    primary={
                                        <Typography sx={{ 
                                            fontWeight: theme.palette.mode === "light" ? 600 : 500,  
                                        }}>
                                            {`Terms and Policies`}
                                        </Typography>
                                    }
                                    sx={{ opacity: open ? 1 : 0 }}
                                />

							</ListItemButton>
						</ListItem>

						<ListItem
							key="user_item"
							disablePadding
							sx={{ display: "block" }}
						>
							<ListItemButton
								onClick={handleThemeToggle}
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
									
                                    {/* {theme.palette.mode === "light" ? <DarkModeIcon /> : <LightModeIcon />} */}

                                    <img src={brandmarkUrl} alt="geoflip" width="24"/>
								</ListItemIcon>

                                <ListItemText
                                    primary={
                                        <Typography sx={{ 
                                            fontWeight: theme.palette.mode === "light" ? 600 : 500,  
                                        }}>
                                            {theme.palette.mode === "light" ? "Dark Mode" : "Light Mode"}
                                        </Typography>
                                    }
                                    sx={{ opacity: open ? 1 : 0 }}
                                />

							</ListItemButton>
						</ListItem>

					</List>
				</Box>
			</Drawer>
			<LoadingBackdrop isOpen={loading} />
			<TermsModal open={termsModalOpen} handleClose={handleTermsModalClose} initialPage={termsPage} />
		</>
	);
}

export default Navigation;
