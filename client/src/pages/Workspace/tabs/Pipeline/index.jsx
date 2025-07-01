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
import Input from "./Stepper/Input";
import Output from "./Stepper/Output";
import Transformations from "./Stepper/Transformations";
import { useTheme } from "@mui/material/styles";
import { PipelineContextProvider } from "./PipelineContext";
import Planner from "./Planner";

const Pipeline = ({handleExportTabChange}) => {
	const [activeStep, setActiveStep] = useState(0);
    const { authState, dispatch } = useAuth();
	const theme = useTheme();
	const steps = [
		{ label: "Input", content: <Input /> },
		{ label: "Transformations", content: <Transformations />},
		{ label: "Output", content: <Output /> },
	];

    const handleStepChange = (step) => {
        setActiveStep(step);
        refreshToken(dispatch, authState.token);
    };

	return (
		<PipelineContextProvider>
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
						Build and run a geoprocessing pipeline.
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
                        <Planner handleExportTabChange={handleExportTabChange} />
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
		</PipelineContextProvider>
	);
};

export default Pipeline;
