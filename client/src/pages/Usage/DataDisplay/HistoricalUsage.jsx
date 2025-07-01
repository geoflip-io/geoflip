import { useAuth } from "../../../features/AuthManager";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import {ContainerizedLoadingBackdrop} from '../../../components/Loader';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

function HistoricalUsage() {
    const theme = useTheme();
    const { authState } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [historicalUsage, setHistoricalUsage] = useState([]);
    const [numOfPages, setNumOfPages] = useState(1);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(7);
    const [rowCount, setRowCount] = useState(0);

    const columns = [
        { field: 'endpoint', headerName: 'Endpoint', width: 180 },
        { field: 'input_format', headerName: 'Input Format', width: 120 },
        { field: 'output_format', headerName: 'Output Format', width: 120 },
        { field: 'transformations_applied', headerName: 'Transformations Applied', width: 220 },
        { field: 'timestamp', headerName: 'Timestamp', width: 180 },
        { field: 'requestSize', headerName: 'Request Size', width: 100 },
        { field: 'executionTime', headerName: 'Execution Time', width: 150 },
        { field: 'unitsConsumed', headerName: 'Units Consumed', width: 150 },
    ];

    const fetchData = useCallback(async (page, pageSize) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/accounts/usage/user/${authState.user.user_id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authState.token}`,
                    },
                    params: {
                        page,
                        per_page: pageSize,
                    },
                }
            );

            if (response.status === 200) {
                const usageData = response.data.items.map((item, index) => ({
                    id: index + 1,
                    endpoint: item.endpoint,
                    input_format: item.input_format,
                    output_format: item.output_format,
                    transformations_applied: item.transformations_applied,
                    timestamp: 
                        new Date(item.timestamp).toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' +
                        new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    requestSize: item.request_size,
                    executionTime: item.execution_time,
                    unitsConsumed: item.units_consumed,
                }));

                setHistoricalUsage(usageData);
                setNumOfPages(response.data.total_pages);
                setRowCount(response.data.total_items);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setHistoricalUsage([]);
                    setRowCount(0);
                } else {
                    toast.error("An error occurred while fetching usage data.");
                }
            } else {
                toast.error("An error occurred while fetching usage data.");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(page+1, pageSize);
    }, [fetchData, page, pageSize]);

    const handlePaginationModelChange = (model) => {
        
        setPage(model.page);
        setPageSize(model.pageSize);
    };

    return (
        <Box sx={{ maxHeight: 600, maxWidth: "100%", padding: '16px' }}>
            <Box>
                <Typography variant="h7" sx={{ mt: 2, fontWeight: theme.palette.mode === "light" ? 600 : 500 }}>
                    Usage History
                </Typography>
            </Box>
            {isLoading ? (
                <ContainerizedLoadingBackdrop isOpen={isLoading} />
            ) : (
                <DataGrid
                    rows={historicalUsage}
                    columns={columns}
                    autoWidth
                    autoHeight
                    pagination
                    pageSizeOptions={[5, 7, 10, 20]}
                    paginationModel={{ page, pageSize }}
                    rowCount={rowCount}
                    paginationMode="server"
                    onPaginationModelChange={handlePaginationModelChange}
                    sx={{
                        mt:2,
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 600,
                        },
                        border: "none",
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
            )}
        </Box>
    );
}

export default HistoricalUsage;
