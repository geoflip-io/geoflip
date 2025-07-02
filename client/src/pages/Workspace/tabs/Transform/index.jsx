import {
	Typography,
	Box,
	Stepper,
	Step,
	StepConnector,
} from "@mui/material";
import { useAuth, refreshToken } from "../../../../features/AuthManager";
import { StyledStepLabel, StyledStepContent } from "../../../../utils/InputStyles";
import { useState } from "react";
import MapContainer from "./MapContainer";
import Upload from "./Upload";
import Transformations from "./Transformations";
import Export from "./Export";
import { useTheme } from "@mui/material/styles";
import { TransformContextProvider } from "./TransformContext";

const Transform = () => {
	const [activeStep, setActiveStep] = useState(0);
    const { authState, dispatch } = useAuth();
	const theme = useTheme();
	const steps = [
		{ label: "Upload", content: <Upload /> },
		{ label: "Transformations", content: <Transformations /> },
		{ label: "Output", content: <Export /> },
	];

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

	return (
		<TransformContextProvider>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
					mt: 2,
				}}
			>
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
							color: theme.palette.text.primary,
						}}
					>
						Upload or draw your Input data, then configure
						transformation and output
					</Typography>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						height: "100%",
						flex: 1,
						mt: 2,
						mb: 2,
					}}
				>
					<Box
						sx={{
							display: "flex",
							flex: 5,
							height: "100%",
							order: 2,
                            borderRadius: 2,
                            boxShadow: "-2px 2px 3px rgba(0,0,0,0.1)",
						}}
					>
						<MapContainer />
					</Box>
					<Box
						sx={{
							display: "flex",
							flex: 2,
							flexDirection: "column",
							overflow: "auto",
							minWidth: 340,
							maxWidth: 340,
							mr: 2,
							order: 1,
							width: "auto",
							backgroundColor: theme.palette.secondary.main,
							borderRadius: 2,
							boxShadow: "-2px 2px 3px rgba(0,0,0,0.1)",
							p: 2,
						}}
					>
						<Stepper
							orientation="vertical"
							activeStep={activeStep}
							connector={
								<StepConnector
									sx={{
										"& .MuiStepConnector-line": {
											borderLeft:
												theme.palette.mode == "dark"
													? `1px solid rgba(255, 255, 255, 0.22)`
													: `1px solid rgba(0, 0, 0, 0.22)`,
										},
									}}
								/>
							}
						>
							{steps.map((step, index) => (
								<Step key={step.label}>
									<StyledStepLabel
										onClick={() => handleStepChange(index)}
										sx={{ cursor: "pointer" }}
									>
										{step.label}
									</StyledStepLabel>
									<StyledStepContent>
										{step.content}
									</StyledStepContent>
								</Step>
							))}
						</Stepper>
					</Box>
				</Box>
			</Box>
		</TransformContextProvider>
	);
};

export default Transform;
