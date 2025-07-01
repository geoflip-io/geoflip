import { useAuth } from "../../../features/AuthManager";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { ContainerizedLoadingBackdrop } from "../../../components/Loader";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function MonthlyUsage() {
    const theme = useTheme();
    const { authState } = useAuth();
    const [loading, setLoading] = useState(false);
    const [CurrentMonth, setCurrentMonth] = useState("");
    const [usageData, setUsageData] = useState({});
    const navigate = useNavigate();

    let mounted = false;
    useEffect(() => {
        if (!mounted) {
            const date = new Date();
            const monthString = date.toLocaleString("default", { month: "long" });
            const currentYear = date.getFullYear();
            const currentMonth = date.getMonth() + 1;

            setCurrentMonth(`${monthString} ${currentYear}`);

            const calculateCharges = (unitsConsumed) => {
                let charge = 0;
                if (unitsConsumed <= 500) {
                    charge = unitsConsumed * 0.07;
                } else if (unitsConsumed <= 2500) {
                    charge = unitsConsumed * 0.05;
                } else {
                    charge = unitsConsumed * 0.03;
                }
                return charge.toFixed(2);
            }

            const fetchCurrentUsageData = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_URL}/accounts/usage/monthly/${authState.user.user_id}/${currentMonth}/${currentYear}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${authState.token}`,
                            },
                        }
                    );
                    if (response.status === 200) {
                        const usageData = response.data;
                        setLoading(false);
                        return usageData;
                    }
                } catch (error) {
                    setLoading(false);
                    if (error.response) {
                        if (error.response.status === 404) {
                            return [];
                        }

                        if (error.response.status === 401) {
                            dispatch({ type: "LOGOUT" });
                            navigate("/login");
                        }

                    } else {
                        toast.error("An error occurred while fetching usage data.");
                    }
                }
            };

            const fetchPrevUsageData = async () => {
                setLoading(true);
                let prevMonth = currentMonth - 1;
                let prevYear = currentYear;

                if (currentMonth === 0) {
                    prevMonth = 11;
                    prevYear = currentYear - 1;
                }

                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_URL}/accounts/usage/monthly/${authState.user.user_id}/${prevMonth}/${prevYear}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${authState.token}`,
                            },
                        }
                    );
                    if (response.status === 200) {
                        const usageData = response.data;
                        setLoading(false);
                        return usageData;
                    }
                } catch (error) {
                    setLoading(false);
                    if (error.response) {
                        if (error.response.status === 404) {
                            return [];
                        }
                    } else {
                        toast.error("An error occurred while fetching usage data.");
                    }
                }
            };

            const getUsageData = async () => {
                const currentData = await fetchCurrentUsageData();
                const prevData = await fetchPrevUsageData();

                let prev_api_calls = 0;
                let prev_units_consumed = 0;
                let prev_charge = 0;
                if (prevData.length > 0) {
                    prev_api_calls = prevData.length;
                    prev_units_consumed = prevData.reduce((sum, record) => sum + record.units_consumed, 0);
                    prev_charge = calculateCharges(prev_units_consumed);
                }

                let api_calls = 0
                let units_consumed = 0
                let charge = 0
                if (currentData.length > 0) {
                    api_calls = currentData.length;
                    units_consumed = currentData.reduce((sum, record) => sum + record.units_consumed, 0);
                    charge = calculateCharges(units_consumed);

                    const outputData = {
                        "api_calls": api_calls,
                        "api_calls_delta": api_calls - prev_api_calls,
                        "units_consumed": units_consumed,
                        "units_consumed_delta": units_consumed - prev_units_consumed,
                        "charge": charge,
                        "charge_delta": (charge - prev_charge).toFixed(2)
                    }

                    setUsageData(outputData);
                } else {
                    const outputData = {
                        "api_calls": 0,
                        "api_calls_delta": 0 - prev_api_calls,
                        "units_consumed": 0,
                        "units_consumed_delta": 0 - prev_units_consumed,
                        "charge": 0,
                        "charge_delta": 0 - prev_charge
                    }
                    setUsageData(outputData);
                }
            };

            getUsageData();
            mounted = true;
        }
    }, []);

    return (
        <Box
            sx={{
                position: "relative", // Ensure the container is relative
                display: "flex",
                flexDirection: "column",
                padding: 3,
                paddingTop: 0,
                borderRadius: 3,
                height: "100%",
                width: "100%",
            }}
        >
            <Typography
                variant="h7"
                sx={{
                    mt: 2,
                    fontWeight: theme.palette.mode === "light" ? 600 : 500,
                }}
            >
                Monthly Usage
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    marginBottom: 2,
                    color: theme.palette.text.secondary,
                }}
            >
                {CurrentMonth}
            </Typography>

            <Box
                sx={{
                    mt: 0,
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: 3,
                        mr: 2,
                        p: 2,
                    }}
                >
                    <SyncAltIcon
                        sx={{
                            color: theme.palette.primary.main,
                            fontSize: 36,
                        }}
                    />
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 0,
                            fontWeight: 700,
                        }}
                    >
                        {usageData.api_calls}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.text.secondary,
                        }}
                    >
                        API Calls
                    </Typography>
                    <Typography
                        fontSize={12}
                        sx={{
                            color: theme.palette.primary.main,
                        }}
                    >
                        {usageData.api_calls_delta >= 0 ? "+" : ""}
                        {usageData.api_calls_delta} from last month
                    </Typography>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: 3,
                        mr: 2,
                        p: 2,
                    }}
                >
                    <InsertChartOutlinedIcon
                        sx={{
                            color: theme.palette.accent1.main,
                            fontSize: 36,
                        }}
                    />
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 0,
                            fontWeight: 700,
                        }}
                    >
                        {usageData.units_consumed}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.text.secondary,
                        }}
                    >
                        Units Consumed
                    </Typography>
                    <Typography
                        fontSize={12}
                        sx={{
                            color: theme.palette.accent1.main,
                        }}
                    >
                        {usageData.units_consumed_delta >= 0 ? "+" : ""}
                        {usageData.units_consumed_delta} from last month
                    </Typography>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: 3,
                        p: 2,
                    }}
                >
                    <MonetizationOnOutlinedIcon
                        sx={{ color: theme.palette.accent2.main, fontSize: 36 }}
                    />
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 0,
                            fontWeight: 700,
                        }}
                    >
                        ${usageData.charge}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.text.secondary,
                        }}
                    >
                        Current Charge
                    </Typography>
                    <Typography
                        fontSize={12}
                        sx={{
                            color: theme.palette.accent2.main,
                        }}
                    >
                        {usageData.charge_delta >= 0 ? "+" : ""}
                        {usageData.charge_delta} from last month
                    </Typography>
                </Box>
            </Box>

            <ContainerizedLoadingBackdrop isOpen={loading} />
        </Box>
    );
}

export default MonthlyUsage;
