import { createTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

// Define custom colors
const colors = {
	primaryBlue: "#3690EB",
	secondaryBlue: "#233241",
	secondaryBlueLight: "#EBF4FD",
	secondaryLight: "#D9EAFB",
	secondaryDark: "#2D4864",
    tertiaryBlueLight: "#EBF4FD",
    tertiaryBlueDark: "#2B3642",
	darkMode: "#202123",
	darkPaper: "#202123",
	lightMode: "#FFFFFF",
	lightPaper: "#FFFFFF",
	accent1: "#B770FF",
	accent2: "#00BACC",
	error: "#EC6A5E",
};

// Light theme configuration
const lightTheme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: colors.primaryBlue,
			contrastText: colors.darkMode,
		},
		secondary: {
			main: colors.secondaryBlueLight,
			light: colors.secondaryLight,
		},
		background: {
			default: colors.lightMode,
			paper: colors.lightPaper, // Light grey background for papers
            workspace: colors.tertiaryBlueLight,
        },
		text: {
			primary: "#000000", // Black text
			secondary: "#555555", // Dark grey text
		},
		accent1: {
			main: colors.accent1,
		},
		accent2: {
			main: colors.accent2,
		},
		error: {
			main: colors.error,
            secondary: "#ebb2b2"
		},
        disabled: {
            main: "#E0E0E0",
        }
	},
    map: {
        globe: {
            style: "mapbox://styles/geoflip/cm04zqwhy00io01ps2d727ndl",
            space: "#0b1b26",
            fogColor: "#b3c8e3",
            fogHighColor: "#011f36",
        },
        features: {
            erase: "#c72626",
            clip: "#fc7e23"
        },
    },
	typography: {
		fontFamily: "Source Sans Pro, Roboto, sans-serif",
	},
	components: {
		MuiLink: {
			styleOverrides: {
				root: {
					textDecoration: "underline",
					cursor: "pointer",
					"&:hover": {
						color: colors.primaryBlue,
					},
				},
			},
		},
		MuiMenu: {
			styleOverrides: {
			  list: {
				'&[role="menu"]': {
				backgroundColor: colors.lightMode
				},
			  },
			  paper:{
				boxShadow: 'none',
				borderRadius: '0 4px 4px 0',
			  }
			},
		},
		MuiButton: {
			styleOverrides: {
				root:{
					textTransform: 'none',
				},
				contained: {
					color: colors.lightMode, 
				},
			},
		},
		MuiDataGrid: {
			styleOverrides: {
				root: {
					'--DataGrid-containerBackground': colors.secondaryBlueLight, // Override container background color
				}
			},
		},
	},
});

// Dark theme configuration
const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: colors.primaryBlue,
			contrastText: colors.lightMode,
		},
		secondary: {
			main: colors.secondaryBlue,
			light: colors.secondaryDark,
		},
		background: {
			default: colors.darkMode,
			paper: colors.darkPaper, // Dark grey background for papers
            workspace: colors.tertiaryBlueDark,
        },
		text: {
			primary: "#FFFFFF", // White text
			secondary: "#AAAAAA", // Light grey text
		},
		accent1: {
			main: colors.accent1,
		},
		accent2: {
			main: colors.accent2,
		},
		error: {
			main: colors.error,
            secondary: "#ebb2b2"
		},
        disabled: {
            main: "#c4c4c4",
        }
	},
    map: {
        globe: {
            style: "mapbox://styles/mapbox/streets-v12",
            space: "#0b1b26",
            fogColor: "#b3c8e3",
            fogHighColor: "#011f36",
        },
        features: {
            erase: "#c72626",
            clip: "#fc7e23"
        },
    },
	typography: {
		fontFamily: "Source Sans Pro, Roboto, sans-serif",
	},
	components: {
		MuiLink: {
			styleOverrides: {
				root: {
					textDecoration: "underline",
					cursor: "pointer",
					"&:hover": {
						color: colors.primaryBlue,
					},
				},
			},
		},
		MuiMenu: {
			styleOverrides: {
			  list: {
				'&[role="menu"]': {
					backgroundColor: colors.darkMode,
				},
			  },
			  paper:{
				boxShadow: 'none',
				borderRadius: '0 4px 4px 0',
			  }
			},
		},
		MuiButton: {
			styleOverrides: {
				root:{
					textTransform: 'none',
				}
			},
		},
		MuiDataGrid: {
			styleOverrides: {
				root: {
					'--DataGrid-containerBackground': colors.secondaryBlue, // Override container background color
				}
			},
		},
	},
});
const darkThemeWithGlobalStyles = createTheme(darkTheme, {
	components: {
	  MuiCssBaseline: {
		styleOverrides: `
		  ::-webkit-calendar-picker-indicator {
			filter: invert(1);
		  }
		  .MuiInputAdornment-root svg {
			filter: invert(1);
		  }
		`,
	  },
	},
  });
  
  export { lightTheme, darkThemeWithGlobalStyles as darkTheme };