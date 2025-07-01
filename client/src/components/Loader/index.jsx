import React from "react";
import { Backdrop } from "@mui/material";

const LoadingBackdrop = ({ isOpen }) => {
	return (
		<Backdrop
			sx={{
				color: "#fff",
				zIndex: (theme) => theme.zIndex.drawer + 1,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
			open={isOpen}
		>
			<img
				src="/loader_white.gif"
				alt="Loading..."
				style={{ width: "100px"}}
			/>
		</Backdrop>
	);
};

const ContainerizedLoadingBackdrop = ({ isOpen }) => {
    return (
        <Backdrop
            sx={{
                color: '#fff', 
                zIndex: (theme) => theme.zIndex.drawer + 1,
                position: 'absolute',
                m: 0, 
                p: 0, 
                width: '100%',
                height: '100%',
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            open={isOpen}
        >
            <img
                src="/loader_white.gif"
                alt="Loading..."
                style={{ width: "100px"}}
            />
        </Backdrop>
    );
};

export {ContainerizedLoadingBackdrop, LoadingBackdrop};
