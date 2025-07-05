import { useTheme } from "@mui/material/styles";
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect, useContext } from 'react';
import { Typography, Box, Paper } from "@mui/material";
import { ExportsContext } from "../../components/ExportsContext";
import TransformJob from "./TransformJob";
import Socials from "../../components/Socials";
import { getItem } from "../../utils/storage";

function Exports() {
    const theme = useTheme();
    const { exportJobs, removeExportJob } = useContext(ExportsContext);
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
        <Box sx={{ mt: 2, overflow: 'auto', height: '100vh'}}> 
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
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
                        sx={{ fontWeight: 600, mb: 0 }}
                    >
                        Exports
                    </Typography>
                    <Typography
                        component="p"
                        variant="body1"
                        align="left"
                        sx={{ 
                            mb: 4, mt: 0, fontSize: '1.1rem', color: theme.palette.text.secondary
                        }}
                    >
                        Keep track of your data export jobs here
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
                    <Socials />
                </Box>
            </Box>
            <Paper
                sx={{
                    padding: 4,
                    paddingTop: 1,
                    mr: 5,
                    borderRadius: 3,
                    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
                    // height: '100%', 
                    maxHeight: 'calc(100vh - 150px)',
                    overflowY: 'auto',
                    scrollbarWidth: 'none'
                }}
            >
                <Box sx={{ 
                    // height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    mt: 2,
                }}>
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
            </Paper>
        </Box>
    );
}

export default Exports;
