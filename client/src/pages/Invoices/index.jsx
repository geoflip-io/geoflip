import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAuth } from '../../features/AuthManager';
import { useTheme } from '@mui/material/styles';
import { LoadingBackdrop } from "../../components/Loader";
import { toast } from "react-toastify";
import axios from 'axios';
import Button from '@mui/material/Button';
import StarsIcon from '@mui/icons-material/Stars';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

function Invoices() {
    const { authState, dispatch } = useAuth();
    const [rows, setRows] = useState([]);
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const pageMaxWidth = 1400;

    let mounted = false;
    useEffect(() => {
        const fetchInvoiceData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/accounts/invoices/${authState.user.user_id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${authState.token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    const invoicesData = response.data;

                    const formattedRows = invoicesData.map((invoice, index) => ({
                        id: index + 1,
                        invoice_id: invoice.invoice_id,
                        invoice_pdf: invoice.invoice_pdf,
                        paid: invoice.paid,
                        period_end: invoice.period_end,
                        period_start: invoice.period_start,
                        total: invoice.total
                    }));

                    setRows(formattedRows);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                if (error.response) {
                    if (error.response.status != 404) {
                        toast.error(
                            "Failed to receive invoice data from the server."
                        );
                    }
                    if (error.response.status === 401) {
                        dispatch({ type: "LOGOUT" });
                        navigate("/login");
                    }
                } else if (error.request) {
                    toast.error(
                        "No response received from the server. Please try again."
                    );
                } else {
                    toast.error(error.message);
                }
            }
        };

        if (authState.isAuthenticated && !mounted){
            fetchInvoiceData();
            mounted = true;
        }
    }, [authState]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const columns = [
        { field: 'period_start', headerName: 'Period Start', flex: 1,             
            renderCell: (params) => (
                <span>{formatDate(params.value)}</span>
            ) 
        },
        { field: 'period_end', headerName: 'Period End', flex: 1, 
            renderCell: (params) => (
                <span>{formatDate(params.value)}</span>
            )
        },
        { field: 'total', headerName: 'Amount', flex: 1, 
            renderCell: (params) => (
                <span>${params.value.toFixed(2)}</span>
            )
        },
        { 
            field: 'paid', 
            headerName: 'Status', 
            flex: 1, 
            renderCell: (params) => (
                <span>{params.value ? 'Paid' : 'Unpaid'}</span>
            )
        },
        { 
            field: 'invoice_pdf', 
            headerName: 'Download', 
            flex: 1,
            renderCell: (params) => (
                <Box
                    sx={{
                        right: 0,
                    }}
                >
                    <Button 
                        variant="outlined" 
                        href={params.value} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{
                            color: theme.palette.text.primary,
                            borderColor: theme.palette.text.primary,
                            borderWidth: "2px",
                            fontWeight: 600,
                            '&:hover': {
								borderColor: theme.palette.text.primary,
								backgroundColor: theme.palette.grey[1],
                                borderWidth: "2px"
                            },
                            borderRadius: 5,
                            width: "100%"
                        }}
                    >
                        Download PDF
                    </Button>
                </Box>
            )
        }
    ];

    return (			
        <Box sx={{ mt: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    maxWidth: pageMaxWidth,
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        component="p"
                        variant="h5"
                        align="left"
                        sx={{ 
                            fontWeight: 600, 
                            mb: 0,
                        }}
                    >
                        Invoices
                    </Typography>
                    <Typography
                        component="p"
                        variant="body1"
                        align="left"
                        sx={{ 
                            mb: 4,
                            mt: 0,
                            fontSize: '1.1rem',
                            color: theme.palette.text.secondary,
                            ml: 0
                        }}
                    >
                        Your invoices
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 4,
                        mr: 5,
                    }}
                >
                    {authState.isAuthenticated && authState.user.subscription_active ? (
                        <Button
                            variant="outlined"
                            sx={{
                                borderRadius: 5,
                                padding: "8px 8px",
                                fontWeight: 400,
                                pointerEvents: "none", // Disable all pointer events
                                cursor: "default",
                                borderWidth: "2px",
                                '&:hover': {
                                    borderWidth: "2px",
                                },
                            }}
                        >
                            <StarsIcon
                                sx={{
                                    mr: 1,
                                }}
                            />
                            Pro Plan
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => {
                                navigate("/workspace")
                            }}
                            sx={{
                                borderRadius: 5,
                                padding: "8px 8px",
                                pl: 1,
                                pr: 1.5,
                                fontWeight: 600,
                            }}
                        >
                            <StarsIcon
                                sx={{
                                    mr: 1,
                                }}
                            />
                            Upgrade to Pro
                        </Button>
                    )}
                </Box>
            </Box>
            {authState.isAuthenticated &&
                <Box
                    sx={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "row",
                        width: "100%",
                        maxWidth: pageMaxWidth,
                        minWidth: 600,
                    }}
                >
                    <Paper
                        elevation={1}
                        sx={{
                            padding: 4,
                            mr: 5,
                            borderRadius: 3,
                            boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            flex: 1,
                            flexDirection: "column",
                            alignItems: "left",
                            maxHeight:  1200,
                            overflow: "auto",
                            scrollbarWidth: "none",
                        }}
                    >
                        <Box sx={{ height: "100%", width: "100%"}}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                localeText={{
                                    noRowsLabel: "No invoices to display",
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
                    </Paper>
                </Box>
            }
            <LoadingBackdrop isOpen={loading} />
        </Box>
    );
}

export default Invoices;
