import { 
    Box,
    Button,
    Typography,
} from "@mui/material";
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useContext } from "react";
import { WorkspaceContext } from "../../index";
import { useTheme } from "@mui/material/styles";
import TransformJob from "./TransformJob";
import { getItem } from "../../../../utils/storage";

const Exports = () => {
    const theme = useTheme();
    const { exportJobs, removeExportJob } = useContext(WorkspaceContext);
    const [rows, setRows] = useState([]);

    const handleUpdateRows = () => {
        const data = exportJobs.map((job, index) => {
            return {
                id: index,
                name: job.name,
                details: {
                    task_id: job.task_id,
                    outputFormat: job.outputFormat
                }
            }
        });

        // add pending jobs to exportJobs if they are not already there
        const pendingJobs = JSON.parse(getItem("exportJobs"));
        if (pendingJobs !== null) {
            pendingJobs.forEach((taskId) => {
                const jobExists = data.some(job => job.details.task_id === taskId);
                if (!jobExists) {
                    const job = JSON.parse(getItem(taskId));
                    data.push(
                        {
                            id: data.length,
                            name: job.name,
                            details: {
                                task_id: taskId,
                                outputFormat: job.outputFormat
                            }
                        }
                    )
                }
            })
        };
        setRows(data);
    };
    
    useEffect(() => {
        handleUpdateRows();
    }, [exportJobs]);

    const columns = [
        { field: 'name', headerName: 'Exports', flex: 1 },
        { field: 'output', headerName: 'Output Format', flex: 1, 
            renderCell: (params) => (
                <Typography
                    sx={{
                        verticalAlign: "middle",
                        mt: 2
                    }}
                >
                    {params.row.details.outputFormat}
                </Typography>
            ) 
        },
        { field: 'details', headerName: 'Downloads', flex: 1, width: "100%",
            renderCell: (params) => (
                <TransformJob 
                    name={params.row.name} 
                    taskId={params.row.details.task_id} 
                    outputFormat={params.row.details.outputFormat}
                    handleUpdateRows={handleUpdateRows}
                />
            )
        },
    ];

	return (
        <Box sx={{ 
            // height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            mt: 2,
        }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 400,
                        fontSize: "1.0rem",
                        color: theme.palette.text.secondary,
                    }}
                >
                    Any exports you have not yet downloaded will be listed here
                </Typography>
			</Box>
            <DataGrid
                rows={rows}
                columns={columns}
                localeText={{
                    noRowsLabel: "Undownloaded exports will appear here",
                }}
                autoHeight
                autoWidth
                disableRowSelectionOnClick
                disableSelectionOnClick
                disableColumnMenu
                hideFooter
                className="custom-header"
                rowHeight={60} 
                sx={{
                    mt:2,
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 600,
                    },
                    '& .MuiDataGrid-row': {
                        alignItems: 'center', 
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
                    boxShadow: "-2px 2px 3px rgba(0,0,0,0.1)",
                }} 
            />
        </Box>
	);
}

export default Exports;