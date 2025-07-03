import { useEffect } from 'react';

function ApiDocs() {
    useEffect(() => {
        window.open('https://docs.geoflip.io', '_blank');
    }, []);

    return null;
}

export default ApiDocs;