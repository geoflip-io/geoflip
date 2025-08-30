import React from "react";
import { Box, Typography, Link } from '@mui/material';

function PrivacyPolicy() {
  return (
    <Box p={3}>
      <Typography variant="body1" gutterBottom>
        This policy is effective as of <b>29 August 2025</b>.
      </Typography>

      <Typography variant="body1" paragraph>
        This Privacy Policy applies to the use of Geoflip, a spatial data
        transformation service provided by Intelligis.io Pty Ltd
        (referred to as "we", "us" or "our"), via the website
        located at geoflip.io (the "Website") and the API hosted at
        api.geoflip.io.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Spatial Data
      </Typography>
      <Typography variant="body1" paragraph>
        Geoflip processes spatial data you upload (such as GeoJSON, SHP, or DXF)
        for the purpose of running transformations. We do not permanently store
        this data:
      </Typography>
      <ul>
        <li>Uploaded data is held in memory or temporary storage only while a job runs.</li>
        <li>Outputs remain available for <b>1 hour</b> after completion.</li>
        <li>After this period, both inputs and outputs are permanently deleted.</li>
      </ul>
      <Typography variant="body1" paragraph>
        No customer spatial data is retained on our servers beyond this window.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Personal Information
      </Typography>
      <Typography variant="body1" paragraph>
        Geoflip does not require user accounts and we do not collect login
        credentials such as emails or passwords. The only personal information
        we may collect is what you voluntarily provide when you:
      </Typography>
      <ul>
        <li>Contact us by email or through the Website.</li>
        <li>Engage with us for enterprise licensing or support.</li>
      </ul>
      <Typography variant="body1" paragraph>
        In these cases, we will only use your contact details to respond to your
        enquiry or provide the services requested.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Cookies and Analytics
      </Typography>
      <Typography variant="body1" paragraph>
        Our Website may use cookies or analytics tools to improve your
        experience and monitor traffic. These do not identify you personally.
        You can disable cookies in your browser if you prefer not to use them.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Enterprise Deployments
      </Typography>
      <Typography variant="body1" paragraph>
        Organisations using Geoflip Enterprise (self-hosted Docker image) are
        responsible for their own data handling and storage. In this case,
        Intelligis.io does not have access to your data.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Security
      </Typography>
      <Typography variant="body1" paragraph>
        We take reasonable steps to protect all data processed by Geoflip from
        unauthorised access, misuse, or disclosure. As noted, all uploaded and
        output spatial data is automatically deleted within one hour on the
        hosted platform.
      </Typography>

      <Typography variant="h5" gutterBottom>
        How to Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions about this policy or how we handle your data,
        please contact us at{" "}
        <Link href="mailto:support@geoflip.io">support@geoflip.io</Link>.
      </Typography>
    </Box>
  );
}

export default PrivacyPolicy;