import { 	
	Box,
} from "@mui/material";
import {useContext } from "react";
import { TransformContext } from "../TransformContext";
import { zoomToBounds } from "../utils/MapOperations";
import { toast } from "react-toastify";
import {StyledButton} from "../../../../../utils/InputStyles";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { runGeoflipJob } from "../../../../../utils/geoflip-helper";

const UnionTransform = ({setLoading}) => {
    const { mapRef, drawRef, stopRotationRef, activeFeatures } = useContext(TransformContext);

	const handleApplyUnion = async () => {
		const fetchData = async () => {
			setLoading(true);
            try {
                const formData = new FormData();
                
                const featureCollection = {
                    type: "FeatureCollection",
                    features: drawRef.current.getAll().features,
                };
                const blob = new Blob(
                    [JSON.stringify(featureCollection)],
                    { type: "application/geo+json" }
                );
                formData.append("input_file", blob, "input.geojson"); 

                const config = {
                    input: {
                        format: "geojson",
                    },
                    transformations:[
                        {
                            type:"union"
                        }
                    ],
                    output: {
                        format: "geojson"
                    }
                };
                formData.append('config', JSON.stringify(config));

                const geojsonData = await runGeoflipJob(
                    import.meta.env.VITE_API_URL,
                    formData
                );
                
                drawRef.current.set(geojsonData);

                const features = drawRef.current.getAll().features

                stopRotationRef.current();
                zoomToBounds(mapRef.current, features);

                toast.info(`Union has been applied`);
            } catch (error) {
                console.error(error);
                toast.error("there was an error transforming your data");
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