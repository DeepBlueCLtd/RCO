import os from 'node:os'

export const PROD_PORT = 8100

/**
 * The machine's first external IPv4 address, else localhost.
 *
 * Production tests use it rather than localhost because browsers treat
 * localhost as secure: security headers such as `upgrade-insecure-requests`
 * behave differently there than on a real plain-HTTP deployment.
 */
export const prodHost = (): string => {
  for (const addresses of Object.values(os.networkInterfaces())) {
    for (const address of addresses ?? []) {
      if (address.family === 'IPv4' && !address.internal) return address.address
    }
  }
  return 'localhost'
}

export const prodBaseURL = (): string => `http://${prodHost()}:${PROD_PORT}/`

/** Origins the production server accepts, as `yarn serve` sets them. */
export const prodOrigins = (): string =>
  [prodHost(), 'localhost', '127.0.0.1']
    .map((host) => `http://${host}:${PROD_PORT}`)
    .join(',')
