import { 	
	Box,
} from "@mui/material";
import { useContext } from "react";
import { useTheme } from "@mui/material/styles"
import {StyledButton} from "../../../../../../utils/InputStyles";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { PipelineContext } from "../../PipelineContext";

const AddUnionTransform = ({setLoading}) => {
	const theme = useTheme();
    const {setTransformationsData} = useContext(PipelineContext);

	const handleAddUnion = async () => {
        const unionData = {
            type: "union"
        };
		setTransformationsData(prevData => [...prevData, unionData]);
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
                    sx={{
                        width: "100%"
                    }}
                    onClick={handleAddUnion}
                >
                    Add Union <ArrowRightIcon />
                </StyledButton>
            </Box>
		</Box>
	);
}

export default AddUnionTransform;