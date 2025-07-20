import React, { useContext } from "react";
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography
} from "@mui/material";
import { StyledLongButton, StyledDeleteButton } from "../../../../../utils/InputStyles";
import { TransformContext } from "../TransformContext";

const FeatureWindow = () => {
	const { selectedFeature } = useContext(TransformContext);
	if (!selectedFeature) return null;

	const properties = selectedFeature.properties || {};

	const handleUpdateGeom = () => {
		console.log("update geometry");
	}

	const handleDeleteGeom = () => {
		console.log("delete feature");
	}

	return (
		<Box sx={{ }}>
			<Typography
				sx={{
					variant: "h6",
					mb: 1
				}}
			>
				Feature Attributes:
			</Typography>

			<TableContainer
				component={Paper}
				sx={{
					overflowY: 'auto',
					maxHeight: 350, // <= allow scroll only if table is tall
					scrollbarWidth: 'none',
					'&::-webkit-scrollbar': {
						display: 'none',
					},
				}}
			>
				<Table size="small" stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell><strong>Attribute</strong></TableCell>
							<TableCell><strong>Value</strong></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Object.entries(properties).map(([key, value]) => (
							<TableRow key={key}>
								<TableCell>{key}</TableCell>
								<TableCell>{String(value)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					marginTop: 2
				}}
			>
				<StyledLongButton
					variant="outlined"
					onClick={handleUpdateGeom}
					sx={{
						flex: 2,
						mr: 2,
						fontWeight: 400,
						fontSize: 15
					}}			
				>
					Edit Geometry
				</StyledLongButton>
				<StyledDeleteButton
					variant="outlined"
					onClick={handleDeleteGeom}
					sx={{
						flex: 1,
						fontWeight: 400,
						fontSize: 15
					}}			
				>
					Delete
				</StyledDeleteButton>
			</Box>
		</Box>
	);
};


export default FeatureWindow;
