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
import { TransformContext } from "../TransformContext";

const FeatureWindow = () => {
	const { selectedFeature } = useContext(TransformContext);

	if (!selectedFeature) return null;

	const properties = selectedFeature.properties || {};

	return (
		<Box sx={{ p: 2 }}>
			<Typography variant="h6" gutterBottom>
				Feature Attributes
			</Typography>
			<TableContainer component={Paper}>
				<Table size="small">
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
		</Box>
	);
};

export default FeatureWindow;
