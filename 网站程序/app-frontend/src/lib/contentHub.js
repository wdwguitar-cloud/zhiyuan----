const DEFAULT_BACKEND_ORIGIN = import.meta.env.DEV ? 'http://localhost:8798' : ''

export const backendOrigin = (
  import.meta.env.VITE_BACKEND_ORIGIN || DEFAULT_BACKEND_ORIGIN
).replace(/\/$/, '')

export function buildBackendUrl(path) {
  return backendOrigin ? `${backendOrigin}${path}` : path
}

export function resolveContentAssetUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return buildBackendUrl(path)
}

export async function fetchContentHubState() {
  const response = await fetch(buildBackendUrl('/api/content-center/state'))

  if (!response.ok) {
    throw new Error(`content-center state request failed: ${response.status}`)
  }

  const payload = await response.json()
  return payload.state
}

export function getContentHubLinks() {
  return {
    contentCenter: buildBackendUrl('/content-center.html'),
    admin: buildBackendUrl('/admin.html'),
    legacyAbout: buildBackendUrl('/about.html'),
  }
}
