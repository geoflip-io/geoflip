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
import {useDeleteFeatureFromLayer} from "../utils/MapOperations"

const FeatureWindow = () => {
	const { drawRef, selectedFeature } = useContext(TransformContext);
	const deleteSelectedFeature = useDeleteFeatureFromLayer();
	if (!selectedFeature) return null;

	const properties = selectedFeature.properties || {};

	const handleUpdateGeom = () => {
		// store a copy of the feature
		const editFeature = {...selectedFeature};
		// delete it from the main data source
		deleteSelectedFeature();

		// add it to the drawLayer for editing
		const newFeatureId = drawRef.current.add(editFeature);

		
		// Immediately activate edit mode on the new feature
		requestAnimationFrame(() => {
			drawRef.current.changeMode("direct_select", {
				featureId: newFeatureId[0],
			});
		});
	}

	const handleDeleteGeom = () => {
		deleteSelectedFeature();
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
						{Object.entries(properties)
							.filter(([key]) => key !== 'geoflip_id')
							.map(([key, value]) => 
						(
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
