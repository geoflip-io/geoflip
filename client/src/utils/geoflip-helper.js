// geoflip-helper.js
import axios from "axios";

/**
 * Submit a Geoflip job with FormData, poll for completion, and
 * return the resulting GeoJSON FeatureCollection.
 *
 * @param {string} apiBase            e.g. import.meta.env.VITE_API_URL
 * @param {FormData} formData         must already contain 'file' and 'config'
 * @param {object}   [opts]
 * @param {number}   [opts.pollInterval=2000]   ms between status checks
 * @param {number}   [opts.timeout=120000]      overall timeout
 * @returns {Promise<object>} GeoJSON
 */
export async function runGeoflipJob(
  apiBase,
  formData,
  to_file = false,
  { pollInterval = 200, timeout = 10000 } = {}
) {
  const t0 = Date.now();

  /* 1️⃣  Kick off the job -------------------------------------------------- */
  const { data: start } = await axios.post(
    `${apiBase}/transform`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  const jobId = start.job_id;
  if (!jobId) throw new Error("No job_id returned from /transform");

  /* 2️⃣  Poll until we get output_url ------------------------------------- */
  let outputUrl;
  while (Date.now() - t0 < timeout) {
    await new Promise(r => setTimeout(r, pollInterval));

    const { data: status } = await axios.get(`${apiBase}/result/status/${jobId}`);

    if (status.status === "failed") {
      throw new Error(`Geoflip job failed: ${status.message ?? ""}`);
    }
    if (status.output_url) {
      outputUrl = status.output_url;
      break;
    }
  }
  if (!outputUrl) throw new Error(`Timed out waiting for job ${jobId}`);

  /* 3️⃣  Download the GeoJSON --------------------------------------------- */

  if (to_file) {
    return outputUrl
  } else {
    const { data } = await axios.get(outputUrl);           // axios auto-parses JSON
    return data;
  }
}
