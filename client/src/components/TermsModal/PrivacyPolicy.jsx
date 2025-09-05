import React from "react";
import { Box, Typography, Link } from "@mui/material";

function PrivacyPolicy() {
  return (
    <Box p={3}>
      <Typography variant="body1" gutterBottom>
        This policy is effective as of <b>5 September 2025</b>.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Who We Are
      </Typography>
      <Typography variant="body1" paragraph>
        This Privacy Policy describes how Intelligis.io Pty Ltd ("Intelligis", "we", "us", or "our")
        processes information when you use the publicly hosted Geoflip website at{" "}
        <Link href="https://geoflip.io" target="_blank" rel="noopener">geoflip.io</Link> (the
        "Website") and API at{" "}
        <Link href="https://api.geoflip.io" target="_blank" rel="noopener">api.geoflip.io</Link>
        (together, the "Hosted Service"). This policy does not apply to self-hosted deployments of
        the open-source Geoflip software; those deployments are controlled by the organisations that
        run them.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Summary
      </Typography>
      <ul>
        <li>We do not require accounts or logins to use the Hosted Service.</li>
        <li>Uploaded spatial data and generated outputs are auto-deleted within <b>1 hour</b> of job completion.</li>
        <li>We keep lightweight operational logs (e.g., timestamps, job IDs, sizes, durations, error/status codes, and IP address) for reliability and abuse prevention, retained for up to <b>90 days</b>.</li>
        <li>Self-hosted Geoflip instances have their own policies set by the operator; this document doesn’t apply to them.</li>
      </ul>

      <Typography variant="h5" gutterBottom>
        Spatial Data You Submit
      </Typography>
      <Typography variant="body1" paragraph>
        To run transformations, you may upload spatial files (e.g., GeoJSON, SHP, DXF, GPKG) and set
        parameters (e.g., buffer distance, clip geometry). We handle that data as follows:
      </Typography>
      <ul>
        <li>Inputs are processed in memory and/or temporary storage solely to complete your job.</li>
        <li>Outputs are made available for download or retrieval for <b>1 hour</b> after completion.</li>
        <li>After this window, both inputs and outputs are permanently deleted from the Hosted Service.</li>
        <li>Please avoid uploading sensitive or confidential information to the public service.</li>
      </ul>

      <Typography variant="h5" gutterBottom>
        Operational Logs & Metadata
      </Typography>
      <Typography variant="body1" paragraph>
        To operate, secure, and improve the Hosted Service, we collect limited metadata:
      </Typography>
      <ul>
        <li>Job identifiers, timestamps, duration/processing time, payload size, status/error codes.</li>
        <li>Basic technical details such as IP address and user-agent for security and abuse prevention.</li>
      </ul>
      <Typography variant="body1" paragraph>
        These logs <b>do not store</b> your uploaded geometries or output files. Log records are
        retained for up to <b>90 days</b> and then deleted or aggregated.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Website Data, Cookies & Analytics
      </Typography>
      <Typography variant="body1" paragraph>
        The Website may use essential cookies and privacy-respecting analytics to understand traffic
        and service performance. We do not build profiles for advertising. You can control cookies
        via your browser settings; blocking certain cookies may affect site functionality.
      </Typography>

      <Typography variant="h5" gutterBottom>
        No Accounts; Personal Information You Provide
      </Typography>
      <Typography variant="body1" paragraph>
        We don’t require user accounts. If you choose to contact us (e.g., by email), we will
        process the personal information you provide (such as your name, email address, and message)
        only to respond and provide support, or to administer any commercial engagement you request.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Legal Basis / Why We Use Information
      </Typography>
      <Typography variant="body1" paragraph>
        We process information to provide and protect the Hosted Service (legitimate interests /
        necessary for service provision), to comply with legal obligations, and with your consent
        where applicable (e.g., certain cookies).
      </Typography>

      <Typography variant="h5" gutterBottom>
        Data Security
      </Typography>
      <Typography variant="body1" paragraph>
        We use reasonable administrative, technical, and organisational measures to protect the data
        we process (e.g., encrypted transport, access controls, segregated temporary storage, and
        automated deletion of inputs/outputs within one hour). No method of transmission or storage
        is 100% secure.
      </Typography>

      <Typography variant="h5" gutterBottom>
        International Transfers & Service Providers
      </Typography>
      <Typography variant="body1" paragraph>
        We may use reputable third-party infrastructure providers (e.g., cloud hosting, object
        storage, logging/monitoring) to run the Hosted Service. As a result, information (including
        operational logs) may be processed in jurisdictions outside your own. We take reasonable
        steps to ensure providers handle information securely and in accordance with this policy.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Your Rights
      </Typography>
      <Typography variant="body1" paragraph>
        Depending on your location, you may have rights to request access, correction, deletion, or
        restriction of your personal information, as well as to object to certain processing or to
        withdraw consent (where processing is based on consent). To exercise these rights, contact{" "}
        <Link href="mailto:support@geoflip.io">support@geoflip.io</Link>. We may need to verify your
        identity to respond. For Australian users, you can also lodge a privacy complaint with the
        Office of the Australian Information Commissioner (OAIC).
      </Typography>

      <Typography variant="h5" gutterBottom>
        Children
      </Typography>
      <Typography variant="body1" paragraph>
        The Hosted Service is not directed to children and should not be used by individuals under
        the age where parental consent is required by applicable law.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Self-Hosted Deployments (Open Source)
      </Typography>
      <Typography variant="body1" paragraph>
        If you deploy the open-source Geoflip software yourself, your deployment is independent from
        Intelligis and this policy does not apply. Your organisation is responsible for providing a
        privacy policy and meeting applicable legal obligations.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Changes to This Policy
      </Typography>
      <Typography variant="body1" paragraph>
        We may update this Privacy Policy from time to time. Changes will be posted here with an
        updated "Effective" date. Your continued use of the Hosted Service after the effective date
        means you accept the updated policy.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="body1" paragraph>
        Questions or requests regarding this policy can be sent to{" "}
        <Link href="mailto:support@geoflip.io">support@geoflip.io</Link>.
      </Typography>

      <Typography variant="caption" color="text.secondary">
        This document is provided for general informational purposes and is not legal advice.
      </Typography>
    </Box>
  );
}

export default PrivacyPolicy;
