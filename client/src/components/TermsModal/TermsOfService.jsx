import React from 'react';
import { Typography, Box, Link } from '@mui/material';

const TermsOfService = () => {
  return (
    <Box p={3}>
      <Typography variant="body1" gutterBottom>
        Effective as of <b>5 September 2025</b>
      </Typography>

      <Typography variant="h6" gutterBottom>
        Overview
      </Typography>
      <Typography variant="body1" gutterBottom>
        Geoflip is a geospatial transformation service provided by Intelligis.io Pty Ltd (the
        "Hosted Service") and an open-source software project licensed under the Apache License,
        Version 2.0 (the "Open Source Software"). These Terms of Service ("Terms") govern your
        use of the Hosted Service at{' '}
        <Link href="https://geoflip.io" target="_blank" rel="noopener">geoflip.io</Link>{' '}
        and the public API at{' '}
        <Link href="https://api.geoflip.io" target="_blank" rel="noopener">api.geoflip.io</Link>.
        Use of the Open Source Software itself is governed by the repository’s{' '}
        <Link href="https://geoflip.io/LICENSE" target="_blank" rel="noopener">LICENSE</Link>{' '}
        (Apache-2.0) and <Link href="https://geoflip.io/NOTICE" target="_blank" rel="noopener">NOTICE</Link> files, not these Terms.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Public API & Hosted Service (Free Use)
      </Typography>
      <Typography variant="body1" gutterBottom>
        The Hosted Service is provided without charge and does not require registration or login.
        By using it, you agree to the following:
      </Typography>
      <ul>
        <li>Use the service only for lawful purposes and in compliance with applicable laws.</li>
        <li>Do not upload content that is illegal, harmful, infringing, or violates third-party rights.</li>
        <li>Do not disrupt, probe, overload, or reverse engineer the service or its infrastructure.</li>
        <li>Do not attempt to bypass or defeat rate limits, quotas, or abuse-prevention measures.</li>
        <li>
          Uploaded data is processed temporarily and deleted within one (1) hour of job completion.
          Do not upload sensitive or confidential information to this public service.
        </li>
        <li>
          Fair use applies. Intelligis may throttle, queue, or reject jobs, or block abusive usage,
          to protect service stability for all users.
        </li>
        <li>
          The service may change, be suspended, or discontinued at any time without notice and
          without any service level agreement (SLA).
        </li>
      </ul>

      <Typography variant="h6" gutterBottom>
        Privacy & Data Handling (Summary)
      </Typography>
      <Typography variant="body1" gutterBottom>
        The Hosted Service processes your submitted files and parameters to perform transformations.
        Operational metadata (for example: timestamps, job identifiers, processing times, payload
        size, and error/status codes) may be logged for reliability, security, and analytics. These
        logs do not store your uploaded geometries or output files and are retained for up to
        ninety (90) days, after which they are deleted or aggregated. Basic technical information
        (such as IP address) may be processed for abuse prevention. For detailed practices, see our
        Privacy Policy (when available).
      </Typography>

      <Typography variant="h6" gutterBottom>
        Open Source License & Self-Hosting
      </Typography>
      <Typography variant="body1" gutterBottom>
        The Geoflip source code is licensed under Apache-2.0. Your rights to copy, modify, and
        distribute the code arise from the{' '}
        <Link href="https://github.com/geoflip-io/geoflip/blob/main/LICENSE" target="_blank" rel="noopener">LICENSE</Link>{' '}
        (and <Link href="https://github.com/geoflip-io/geoflip/blob/main/NOTICE" target="_blank" rel="noopener">NOTICE</Link>) and are separate from these Terms, which only
        govern use of the Hosted Service. Contributions to the project are accepted under Apache-2.0.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Managed Hosting & Support
      </Typography>
      <Typography variant="body1" gutterBottom>
        If you require commercial support, custom features, or a managed/private deployment,
        contact <Link href="mailto:support@geoflip.io">support@geoflip.io</Link>. Any such services
        are provided under separate agreements and are not covered by these Terms.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Intellectual Property (Hosted Service)
      </Typography>
      <Typography variant="body1" gutterBottom>
        As between you and Intelligis, Intelligis retains all rights in the Hosted Service’s brand,
        design, and infrastructure. You are granted a limited, non-exclusive, revocable license to
        access and use the Hosted Service for lawful purposes in accordance with these Terms. These
        Terms do not restrict your rights under the Apache-2.0 license for the Open Source Software.
      </Typography>

      <Typography variant="h6" gutterBottom>
        High-Risk Use
      </Typography>
      <Typography variant="body1" gutterBottom>
        The Hosted Service is not designed for use in safety-critical or high-risk environments
        (including but not limited to emergency response, aviation/air traffic control, life-support,
        or nuclear facilities). You must not use the service where failure could reasonably be
        expected to result in death, personal injury, or severe environmental or property damage.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Disclaimer of Warranties
      </Typography>
      <Typography variant="body1" gutterBottom>
        The Hosted Service is provided "as is" and "as available", without warranties of any kind,
        express or implied, including but not limited to merchantability, fitness for a particular
        purpose, non-infringement, accuracy, or uninterrupted availability.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Limitation of Liability
      </Typography>
      <Typography variant="body1" gutterBottom>
        To the maximum extent permitted by law, Intelligis.io Pty Ltd will not be liable for any
        indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss of
        profits, revenue, data, or goodwill, arising out of or related to your use of the Hosted
        Service. To the extent liability cannot be excluded, it is limited to the resupply of the
        service.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Termination & Suspension
      </Typography>
      <Typography variant="body1" gutterBottom>
        Intelligis may suspend or terminate your access to the Hosted Service at any time if we
        reasonably believe you have violated these Terms or pose a risk to the service or other
        users. You may stop using the service at any time.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Changes to the Service or Terms
      </Typography>
      <Typography variant="body1" gutterBottom>
        We may modify the Hosted Service or these Terms from time to time. Updates will be posted on
        this page with a new "Effective" date. Your continued use of the service after changes take
        effect constitutes acceptance of the updated Terms.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Governing Law
      </Typography>
      <Typography variant="body1" gutterBottom>
        These Terms are governed by the laws of Western Australia, Australia. Any disputes shall be
        resolved exclusively in the courts of Western Australia.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Contact
      </Typography>
      <Typography variant="body1" gutterBottom>
        Questions about these Terms: <Link href="mailto:support@geoflip.io">support@geoflip.io</Link>.
      </Typography>
    </Box>
  );
};

export default TermsOfService;
