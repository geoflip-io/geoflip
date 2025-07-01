import { 	
	Box,
} from "@mui/material";
import {useContext } from "react";
import { useAuth } from "../../../../../features/AuthManager";
import { TransformContext } from "../TransformContext";
import { zoomToBounds } from "../utils/MapOperations";
import { useTheme } from "@mui/material/styles"
import { toast } from "react-toastify";
import {StyledButton} from "../../../../../utils/InputStyles";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import axios from "axios";
import { handleAPIError } from "../utils/MapOperations";
import { WorkspaceContext } from "../../../../Workspace/index";
import { useNavigate } from 'react-router-dom';

const UnionTransform = ({setLoading}) => {
    const navigate = useNavigate();
    const { applyApiUsage } = useContext(WorkspaceContext);
	const theme = useTheme();
    const { authState, dispatch } = useAuth();
    const { mapRef, drawRef, stopRotationRef, activeFeatures, setActiveFeatures } = useContext(TransformContext);

	const handleApplyUnion = async () => {
		const payload = {
			"input_geojson":{
				"type": "FeatureCollection",
				"features": drawRef.current.getAll().features
			},
			"output_format": "geojson",
			"transformations":[
				{
					"type":"union"
				}
			]
		}
		const payloadString = JSON.stringify(payload);

		const fetchData = async () => {
			setLoading(true);
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/v1/transform/geojson`,
					payloadString,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${authState.token}`,
                        }
                    }
                );
                if (response.status === 200) {
					const geojsonData = response.data;
					drawRef.current.set(geojsonData);
	
					const features = drawRef.current.getAll().features
	
					stopRotationRef.current();
					zoomToBounds(mapRef.current, features);

                    toast.info(`Union has been applied`);
                    applyApiUsage();
                } 
            } catch (error) {
                const loginExpired = await handleAPIError(error);
                if (loginExpired) {
                    dispatch({ type: "LOGOUT" });
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

		await fetchData();
	}
	
	return (
		<Box
			sx={{
				mt:3,
				display: "flex",
				flexDirection: "column",
                position: "relative", // Add this
                height: "100%", 
			}}
		>
            <Box
                sx={{
                    flex: 1,
                    textAlign: "left",
                    flexDirection: "row"
                }}
            >
                <StyledButton
                    variant="contained"
                    disabled={activeFeatures.length <= 0 ? true : false}
                    sx={{
                        width: "100%"
                    }}
                    onClick={handleApplyUnion}
                >
                    Apply Union <ArrowRightIcon />
                </StyledButton>
            </Box>
		</Box>
	);
}

export default UnionTransform;