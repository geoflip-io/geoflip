import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from "@mui/material/styles";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from "../../../features/AuthManager";
import axios from 'axios';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoadingBackdrop, ContainerizedLoadingBackdrop } from '../../../components/Loader';

function AnnualUsage() {
    const theme = useTheme();
    const { authState, dispatch } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/accounts/usage/annual/${authState.user.user_id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    const usageData = response.data; // Reverse the data
                    setData(usageData);
                } 
            } catch (error) {
                if (error.response){
                    if (error.response.status === 404) {
                        setData([]);
                    }
                }
                if (error.response.status === 401) {
                    dispatch({ type: "LOGOUT" });
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        if (authState.isAuthenticated){
            fetchData();
        }
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            const data = payload[0].payload;
            const monthString = months[data.month - 1];

            return (
                <Box 
                    sx={{ 
                        backgroundColor: theme.palette.text.main, 
                        padding: '8px', 
                        borderRadius: 3,
                    }}
                >
                    <Typography
                        sx={{ 
                            margin: 0,
                            mb: -0.5,
                            color: theme.palette.primary.main,
                            fontSize: '0.9rem',
                            fontWeight: 700
                        }}
                    >
                        {`${monthString} ${data.year}`}
                    </Typography>
                    <Typography 
                        sx={{ 
                            margin: 0, 
                            mb: -0.5,
                            color: theme.palette.text.secondary,
                            fontSize: '0.8rem'
                        }}
                    >
                        {`API Calls: ${data.api_calls}`}
                    </Typography>
                    <Typography 
                        sx={{ 
                            margin: 0, 
                            color: theme.palette.text.secondary,
                            fontSize: '0.8rem'
                        }}
                    >
                        {`Units Consumed: ${data.units_consumed}`}
                    </Typography>
                </Box>
            );
        }
    
        return null;
    };

    return (
        <Box
            sx={{
                position: 'relative', // Ensure the container is relative
                display: "flex",
                flexDirection: "column",
                padding: 3,
                paddingTop: 0,
                borderRadius: 3,
                height: "100%",
                width: "100%",
                minHeight: 220,
                fontWeight: theme.palette.mode === "light" ? 600 : 500,
            }}
        >
            <p>API Calls By Month</p>
            {loading ? (
               < ContainerizedLoadingBackdrop isOpen={loading} />
            ) : (
                <ResponsiveContainer 
                    width="100%" 
                    height="100%"
                    maxHeight={180}
                    minWidth={300}
                    minHeight={180}
                >
                    <AreaChart
                        data={data}
                        margin={{
                            top: 0, right: 0, left: -45, bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorApiCalls" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="month" 
                            tickFormatter={(month, index) => {
                                return `${month}/${data[index].year}`;
                            }}
                            axisLine={false} 
                            tick={{ fill: theme.palette.text.primary }} 
                            tickLine={false}
                            reversed={true}
                            fontWeight={500}
                        />
                        <YAxis 
                            axisLine={false} 
                            tick={{ fill: theme.palette.text.primary }} 
                            tickLine={false}
                            fontWeight={500}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                            type="monotone" 
                            dataKey="api_calls" 
                            stroke={theme.palette.primary.main} 
                            fillOpacity={1} 
                            fill="url(#colorApiCalls)" 
                            reversed={true}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </Box>
    );
}

export default AnnualUsage;
