import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import _ from 'lodash';
import { LoadingBackdrop } from "../../../components/Loader";

function TabTwo() {
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Tab Two Content here
            </Typography>


            <LoadingBackdrop isOpen={loading} />
        </Box>
    );
}

export default TabTwo;
