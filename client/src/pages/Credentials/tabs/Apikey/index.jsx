
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useAuth } from "../../../../features/AuthManager";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import CreateDialog from "./dialogs/CreateDialog";
import NewKeyDialog from "./dialogs/NewKeyDialog";
import DeleteDialog from "./dialogs/DeleteDialog";
import UpdateDialog from "./dialogs/UpdateDialog";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoadingBackdrop } from "../../../../components/Loader";


function Apikey() {
	const theme = useTheme();
	const { authState, dispatch } = useAuth();
	const [rows, setRows] = useState([]);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [newKeyDialogOpen, setNewKeyDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [newKeyData, setNewKeyData] = useState({});
	const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
	const [deleteKeyData, setDeleteKeyData] = useState({});
	const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
	const [updateKeyData, setUpdateKeyData] = useState({});
	const navigate = useNavigate();
	const pageWidth = 1400
	
	let mounted = false;
	useEffect(() => {
		const fetchApiKeys = async () => {
			setLoading(true);
		
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/accounts/apikey/user/${authState.user.user_id}`,
					{
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${authState.token}`,
						},
					}
				);
				if (response.status === 200) {
					const apiKeys = response.data;
					setRows((prevRows) => {
						const updatedRows = [...prevRows];
						for (let i = 0; i < apiKeys.length; i++) {
							const keyData = apiKeys[i];
							const newRow = {
								id: keyData.apikey_id,
								name: keyData.name,
								expiryDate: new Date(keyData.expiration).toISOString().split('T')[0],
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
					toast.error(`Failed to fetch your API keys. Please try again later.`);
				} else if (error.request) {
					toast.error("No response received from the server. Please try again.");
				} else {
					toast.error(error.message);
				}
			}
		};

		if (authState.isAuthenticated && !mounted) {
			fetchApiKeys();
			mounted = true;
		}
	}, [authState]);

	const updateApiKey = async (keyID, newName, newExpiry) => {
		setLoading(true);
		const payload = {
			name: newName,
			expiration: `${newExpiry}T18:00:00`,
		};

		try {
			const response = await axios.put(
				`${import.meta.env.VITE_API_URL}/accounts/apikey/${keyID}`,
				payload,
				{
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${authState.token}`,
					},
				}
			);
			if (response.status === 201) {
				const updatedKeyData = response.data.data;
				const formattedExpiration = new Date(updatedKeyData.expiration).toISOString().split('T')[0];
				const updatedKey = {
					id: updatedKeyData.apikey_id,
					name: updatedKeyData.name,
					expiryDate: formattedExpiration,
				};

				// Update the rows state with the updated key
				setRows((prevRows) =>
					prevRows.map((row) => 
						row.id === updatedKey.id ? updatedKey : row
					)
				);

				setLoading(false);
				toast.success("API key updated successfully.");
			}
		} catch (error) {
			if (error.response) {
				setLoading(false);
				toast.error(`Error updating API Key: ${error.response.data.message}`);
			} else if (error.request) {
				setLoading(false);
				toast.error("No response received from the server. Please try again.");
			} else {
				setLoading(false);
				toast.error(error.message);
			}
		}

		setUpdateDialogOpen(false);
		setUpdateKeyData({});
	}

	const handleUpdateClick = (params) => {
		setUpdateDialogOpen(true);
		setUpdateKeyData(params.row);
	};
	
	const deleteApiKey = async (keyID) => {
		setLoading(true);
		try {
			const response = await axios.delete(
				`${import.meta.env.VITE_API_URL}/accounts/apikey/${keyID}`,
				{
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${authState.token}`,
					},
				}
			);
			if (response.status === 200) {
				const newRows = rows.filter(row => row.id !== keyID);
				setRows(newRows);
				setLoading(false);
				toast.success("API key deleted successfully.");
			}
		} catch (error) {
			if (error.response) {
				setLoading(false);
				toast.error(`Error deleting API Key: ${error.response.data.message}`);
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
		setDeleteKeyData(params.row);
	};

    const handleCreateNewApiKey = () => {
        setCreateDialogOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setCreateDialogOpen(false);
    };

    const handleSaveApiKey = async (newKeyName, newKeyExpiry) => {
        // Add logic to save the new API key
        setCreateDialogOpen(false);
		setLoading(true);

		const payload = {
			user_id: authState.user.user_id,
			name: newKeyName,
			expiration: `${newKeyExpiry}T18:00:00`,
		}

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/accounts/apikey/create`,
                payload,
				{
					headers: {
						"Content-Type": "application/json",
                        "Authorization": `Bearer ${authState.token}`,
					},
				}
			);
			if (response.status === 201) {
				const keyData = response.data.data
				const formattedExpiration = new Date(keyData.expiration).toISOString().split('T')[0];
				const newKey = {
					id: keyData.apikey_id,
					name: keyData.name,
					expiryDate: formattedExpiration,
				}
				const newRows = [...rows, newKey];

				setRows(newRows);
				setLoading(false);
				toast.success("API key created successfully.");

				setNewKeyData({
					...newKey,
					key: keyData.key,
				});
				setNewKeyDialogOpen(true);
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
		{ field: "name", headerName: "API Key Name", flex: 1,  },
		{ field: "expiryDate", headerName: "Expiry Date", flex: 1 },
		{
			field: "actions",
			headerName: "",
			flex: 1,
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
                            noRowsLabel: "Create an API key to get started",
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
                        onClick={handleCreateNewApiKey}
                        sx={{
                            fontWeight: 600,
                            mt: 2,
                        }}
                    >
                        Create New API Key
                    </Button>
                </Box>
            </Box>
			{authState.isAuthenticated && (
				<>
					<CreateDialog 
						open={createDialogOpen} 
						handleClose={handleCloseCreateDialog} 
						handleSave={handleSaveApiKey}
						subscription_active={authState.user.subscription_active}
					/>
					<UpdateDialog
						open={updateDialogOpen}
						handleClose={() => setUpdateDialogOpen(false)}
						keyData={updateKeyData}
						updateKey={updateApiKey}
						subscription_active={authState.user.subscription_active}
					/>
				</>
			)}
			<NewKeyDialog 
				open={newKeyDialogOpen} 
				handleClose={() => setNewKeyDialogOpen(false)} 
				newKeyData={newKeyData}
			/>
			<DeleteDialog 
				open={confirmDeleteDialogOpen} 
				handleClose={() => setConfirmDeleteDialogOpen(false)} 
				keyData={deleteKeyData} 
				deleteKey={deleteApiKey}
			/>
			<LoadingBackdrop isOpen={loading} />
		</Box>
	);
}

export default Apikey;
