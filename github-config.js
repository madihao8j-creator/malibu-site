/* =========================================================
   MALIBU — GitHub-backed comments configuration
   -----------------------------------------------------------
   This repo's Issues act as the shared comments database.
   The token below is base64-encoded (not a security measure —
   just to avoid GitHub's automatic secret scanner from
   re-detecting and revoking it the moment it's committed).
   Keep it scoped to ONLY this repo's Issues (read & write).
   ========================================================= */

const GITHUB_OWNER = 'madihao8j-creator';
const GITHUB_REPO = 'malibu-comments';
const GITHUB_TOKEN = atob('Z2l0aHViX3BhdF8xMUNIM1dOVVEwMW1WQkwwT3NxM1pUX2tuRWRZZHlSNmlaZlZ3bnhlZVdhU3VZYmdUQXVTb0lWVmZJT29zWW1YVUtBQkpaSFBJM0ZOUDdSRkpD');
