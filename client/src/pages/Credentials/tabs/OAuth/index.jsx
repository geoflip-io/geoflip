
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useAuth } from "../../../../features/AuthManager";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import CreateDialog from "./dialogs/CreateDialog";
import NewOAuthDialog from "./dialogs/NewOAuthDialog";
import DeleteDialog from "./dialogs/DeleteDialog";
import UpdateDialog from "./dialogs/UpdateDialog";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoadingBackdrop } from "../../../../components/Loader";


function OAuth() {
	const theme = useTheme();
	const { authState, dispatch } = useAuth();
	const [rows, setRows] = useState([]);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [newOAuthDialogOpen, setNewOAuthDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [newOAuthData, setNewOAuthData] = useState({});
	const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
	const [deleteOAuthData, setDeleteOAuthData] = useState({});
	const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
	const [updateOAuthData, setUpdateOAuthData] = useState({});
	const navigate = useNavigate();
	
	let mounted = false;
	useEffect(() => {
		const fetchOAuth = async () => {
			setLoading(true);
		
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/accounts/oauth/user/${authState.user.user_id}`,
					{
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${authState.token}`,
						},
					}
				);
				if (response.status === 200) {
					const oauthClients = response.data;
					setRows((prevRows) => {
						const updatedRows = [...prevRows];
						for (let i = 0; i < oauthClients.length; i++) {
							const keyData = oauthClients[i];
							const newRow = {
								id: keyData.client_id,
								name: keyData.name,
                                domains: keyData.domains,
							};
							// Check if the newRow.id already exists in the updatedRows
							if (!updatedRows.some(row => row.id === newRow.id)) {
								updatedRows.push(newRow);
							}
						}
						return updatedRows;
					});

					setLoading(false);
				}
			} catch (error) {
				setLoading(false);
				if (error.response) {
					if (error.response.status === 401) {
						dispatch({ type: "LOGOUT" });
						navigate("/login");
					}
					toast.error(`Failed to fetch your OAuth clients. Please try again later.`);
				} else if (error.request) {
					toast.error("No response received from the server. Please try again.");
				} else {
					toast.error(error.message);
				}
			}
		};

		if (authState.isAuthenticated && !mounted) {
			fetchOAuth();
			mounted = true;
		}
	}, [authState]);

	const updateOAuth = async (oauthId, newName) => {
		setLoading(true);
		const payload = {
			name: newName,
			domains: "*",
		};

		try {
			const response = await axios.put(
				`${import.meta.env.VITE_API_URL}/accounts/oauth/${oauthId}`,
				payload,
				{
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${authState.token}`,
					},
				}
			);
			if (response.status === 201) {
				const updatedOauthData = response.data.data;
				const updatedOAuth = {
					id: updatedOauthData.client_id,
					name: updatedOauthData.name,
                    domains: updatedOauthData.domains,
				};

				// Update the rows state with the updated name
				setRows((prevRows) =>
					prevRows.map((row) => 
						row.id === updatedOAuth.id ? updatedOAuth : row
					)
				);

				setLoading(false);
				toast.success("OAuth client updated successfully.");
			}
		} catch (error) {
			if (error.response) {
				setLoading(false);
				toast.error(`Error updating OAuth client: ${error.response.data.message}`);
			} else if (error.request) {
				setLoading(false);
				toast.error("No response received from the server. Please try again.");
			} else {
				setLoading(false);
				toast.error(error.message);
			}
		}

		setUpdateDialogOpen(false);
		setUpdateOAuthData({});
	}

	const handleUpdateClick = (params) => {
		setUpdateDialogOpen(true);
		setUpdateOAuthData(params.row);
	};
	
	const deleteOAuth = async (client_id) => {
		setLoading(true);
		try {
			const response = await axios.delete(
				`${import.meta.env.VITE_API_URL}/accounts/oauth/${client_id}`,
				{
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${authState.token}`,
					},
				}
			);
			if (response.status === 200) {
				const newRows = rows.filter(row => row.id !== client_id);
				setRows(newRows);
				setLoading(false);
				toast.success("OAuth client deleted successfully.");
			}
		} catch (error) {
			if (error.response) {
				setLoading(false);
				toast.error(`Error deleting OAauth client: ${error.response.data.message}`);
			} else if (error.request) {
				setLoading(false);
				toast.error("No response received from the server. Please try again.");
			} else {
				setLoading(false);
				toast.error(error.message);
			}
		}

		setConfirmDeleteDialogOpen(false);
		setDeleteKeyData({});
	};

	const handleDeleteClick = (params) => {
		setConfirmDeleteDialogOpen(true);
		setDeleteOAuthData(params.row);
	};

    const handleCreateNewOAuth = () => {
        setCreateDialogOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setCreateDialogOpen(false);
    };

    const handleSaveOAuth = async (oauthName) => {
        // Add logic to save the new API key
        setCreateDialogOpen(false);
		setLoading(true);

		const payload = {
			user_id: authState.user.user_id,
			name: oauthName,
            domains: "*"
		}

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/accounts/oauth/create`,
                payload,
				{
					headers: {
						"Content-Type": "application/json",
                        "Authorization": `Bearer ${authState.token}`,
					},
				}
			);
			if (response.status === 201) {
				const oauthData = response.data
				const newOauth = {
					id: oauthData.client_id,
					name: oauthData.name,
				}
				const newRows = [...rows, newOauth];

				setRows(newRows);
				setLoading(false);
				toast.success("OAuth client created successfully.");

				setNewOAuthData({
					...newOauth,
					secret: oauthData.client_secret,
				});
				setNewOAuthDialogOpen(true);
			}
		} catch (error) {
			if (error.response) {
                setLoading(false);
                toast.error(`Error creating API Key: ${error.response.data.message}`);
			} else if (error.request) {
                setLoading(false);
                toast.error("No response received from the server. Please try again.");
			} else {
                setLoading(false);
                toast.error(error.message);
			}
		}
    };

	const columns = [
		{ field: "name", headerName: "OAuth Client Name", flex: 2,  },
		{ field: "id", headerName: "Client ID", flex: 3 },
		{
			field: "actions",
			headerName: "",
			flex: 3,
			renderCell: (params) => (
				<Box
					display="flex"
					justifyContent="right"
					width="100%"
					sx={{
						mt: 1,
					}}
				>
					<Button
						variant="outlined"
						sx={{
							color: theme.palette.text.primary,
							borderColor: theme.palette.text.primary,
							mr: 2,
                            width: "100%",
                            borderRadius: 10,
                            borderWidth: "2px",
                            fontWeight: 600,
                            ":hover": {
								borderColor: theme.palette.text.primary,
								backgroundColor: theme.palette.grey[1],
                                borderWidth: "2px",
							},
						}}
                        onClick={() => handleUpdateClick(params)}
					>
						Update
					</Button>
					<Button
						variant="outlined"
						sx={{
							color: theme.palette.error.main,
							borderColor: theme.palette.error.main,
                            width: "100%",
                            borderRadius: 10,
                            borderWidth: "2px",
                            fontWeight: 600,
							":hover": {
								borderColor: theme.palette.error.main,
								backgroundColor: theme.palette.grey[1],
                                borderWidth: "2px",
							},
						}}
                        onClick={()=>handleDeleteClick(params)}
					>
						Delete
					</Button>
				</Box>
			),
		},
	];

	return (
		<Box
			sx={{
				mt: 2,
			}}
		>
            <Box
                elevation={1}
                sx={{
                    display: "flex",
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "left",
                    maxHeight:  1200,
                    overflow: "auto",
                    scrollbarWidth: "none",
                }}
            >
                <Box sx={{ height: "100%", width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        localeText={{
                            noRowsLabel: "Create OAuth credentials to get started",
                        }}
                        autoHeight
                        autoWidth
                        disableRowSelectionOnClick
                        disableSelectionOnClick
                        disableColumnMenu
                        hideFooter
                        className="custom-header"
                        sx={{
                            border: "none",
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 600,
                            },
                            "& .MuiDataGrid-cell:focus": {
                                outline: "none",
                            },
                            "& .MuiDataGrid-cell": {
                                "&:focus": {
                                    outline: "none",
                                },
                            },
                            "& .MuiDataGrid-cell--textCenter": {
                                "&:focus-within": {
                                    outline: "none",
                                },
                            },
                            borderRadius: 2,
                            boxShadow: "-2px 2px 3px rgba(0,0,0,0.1)"
                        }}
                    />
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        onClick={handleCreateNewOAuth}
                        sx={{
                            fontWeight: 600,
                            mt: 2,
                        }}
                    >
                        Create New OAuth Credentials
                    </Button>
                </Box>
            </Box>
			{authState.isAuthenticated && (
				<>
					<CreateDialog 
						open={createDialogOpen} 
						handleClose={handleCloseCreateDialog} 
						handleSave={handleSaveOAuth}
					/>
					<UpdateDialog
						open={updateDialogOpen}
						handleClose={() => setUpdateDialogOpen(false)}
						oAuthData={updateOAuthData}
						updateOAuth={updateOAuth}
					/>
				</>
			)}
			<NewOAuthDialog 
				open={newOAuthDialogOpen} 
				handleClose={() => setNewOAuthDialogOpen(false)} 
				newOAuthData={newOAuthData}
			/>
			<DeleteDialog 
				open={confirmDeleteDialogOpen} 
				handleClose={() => setConfirmDeleteDialogOpen(false)} 
				oAuthData={deleteOAuthData} 
				deleteOAuth={deleteOAuth}
			/>
			<LoadingBackdrop isOpen={loading} />
		</Box>
	);
}

export default OAuth;
