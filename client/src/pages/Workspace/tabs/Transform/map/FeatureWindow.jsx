import { useContext } from "react";
import { TransformContext } from "../TransformContext";

const FeatureWindow = () => {
	const { mapRef, drawRef, selectedFeature, setSelectedFeature } = useContext(TransformContext);

	return (
		<>
			{selectedFeature && (
				<p>feature content {selectedFeature.id}</p>
			)}
		</>
	);
}

export default FeatureWindow;
