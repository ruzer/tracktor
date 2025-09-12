import { env } from '$env/dynamic/public';

/**
 * Constructs API URLs properly, handling base URL concatenation
 */
export function getApiUrl(path: string): string {
	const baseUrl = env.PUBLIC_API_BASE_URL || '';

	// Remove trailing slash from base URL and leading slash from path to avoid double slashes
	const cleanBaseUrl = baseUrl.replace(/\/$/, '');
	const cleanPath = path.replace(/^\//, '');

	// Build final URL
	let url: string;
	if (!cleanBaseUrl || cleanBaseUrl === '') {
		// Return relative URL when no base is configured (proxy mode)
		url = `/${cleanPath}`;
	} else {
		// Return absolute URL when base URL is configured
		url = `${cleanBaseUrl}/${cleanPath}`;
	}

	// Debug: trace URL building in dev console
	try {
		console.debug('[api] getApiUrl', { baseUrl: cleanBaseUrl || '(empty)', path: cleanPath, url });
	} catch {
		/* no-op: some environments may not expose console */
	}

	return url;
}
