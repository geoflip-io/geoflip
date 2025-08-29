import React from 'react';
import { Typography, Box, Link } from '@mui/material';

const TermsOfService = () => {
  return (
    <Box p={3}>
      <Typography variant="body1" gutterBottom>
        Effective as of <b>29 August 2025</b>
      </Typography>

      <Typography variant="h6" gutterBottom>
        Overview
      </Typography>
      <Typography variant="body1" gutterBottom>
        Geoflip is a geospatial transformation service provided by Intelligis.io
        Pty Ltd. These Terms of Service ("Terms") govern your use of the Geoflip
        website (<Link href="https://geoflip.io">geoflip.io</Link>), the hosted API
        (<Link href="https://api.geoflip.io">api.geoflip.io</Link>), and any related
        services. By using Geoflip, you agree to be bound by these Terms.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Public API Usage
      </Typography>
      <Typography variant="body1" gutterBottom>
        The public Geoflip API is free to use and does not require registration
        or login. Users may submit jobs to transform spatial data, subject to
        the following conditions:
      </Typography>
      <ul>
        <li>Do not use the API for unlawful purposes or to process illegal data.</li>
        <li>Do not attempt to disrupt, overload, or reverse engineer the service.</li>
        <li>Uploaded data is processed temporarily and deleted within one (1) hour of job completion.</li>
        <li>You are solely responsible for ensuring you do not upload sensitive or confidential information to the public service.</li>
      </ul>

      <Typography variant="h6" gutterBottom>
        Enterprise Edition
      </Typography>
      <Typography variant="body1" gutterBottom>
        Organisations requiring private, self-hosted deployments of Geoflip may
        license the Enterprise Edition. Such deployments are governed by a
        separate license agreement, not these Terms. For enquiries, contact{" "}
        <Link href="mailto:support@geoflip.io">support@geoflip.io</Link>.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Intellectual Property
      </Typography>
      <Typography variant="body1" gutterBottom>
        Geoflip, including its code, design, and documentation, is owned by
        Intelligis.io Pty Ltd. You are granted a limited, non-exclusive,
        revocable license to use the public API and Website for lawful purposes.
        No other rights are granted. You may not reproduce, adapt, distribute,
        or exploit Geoflip except as permitted by law or with prior written
        consent.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Disclaimer of Warranties
      </Typography>
      <Typography variant="body1" gutterBottom>
        Geoflip is provided "as is" without warranties of any kind. While we
        strive for reliability, we do not guarantee uninterrupted service,
        accuracy, or fitness for a particular purpose. You acknowledge that the
        service may be unavailable at times or subject to change without notice.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Limitation of Liability
      </Typography>
      <Typography variant="body1" gutterBottom>
        To the maximum extent permitted by law, Intelligis.io Pty Ltd shall not
        be liable for any indirect, incidental, special, or consequential
        damages arising from your use of Geoflip. Our total liability for any
        claim shall not exceed re-supplying the service.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Governing Law
      </Typography>
      <Typography variant="body1" gutterBottom>
        These Terms are governed by the laws of Western Australia, Australia.
        Any disputes shall be resolved exclusively in the courts of Western
        Australia.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Contact
      </Typography>
      <Typography variant="body1" gutterBottom>
        Questions about these Terms can be sent to{" "}
        <Link href="mailto:support@geoflip.io">support@geoflip.io</Link>.
      </Typography>
    </Box>
  );
};

export default TermsOfService;
