async function main() {
    console.log('Starting custom app...');

    try {
        const contextReady = await getGHLContext();

        if (contextReady) {
            console.log('GHL context successfully retrieved.');

            // Get the location ID from the GHL context
            const currentLocationId = GHL.location.id;

            // Your app ID from the GHL Developer portal
            const appId = '68ae7013bb7027c6c3cbf9aa';

            // Construct the API path for the contacts endpoint
            const apiPath = `locations/${currentLocationId}/contacts`;

            // Use the GHL Proxy, passing the full path as the 'path' query parameter
            const apiUrl = `https://services.leadconnectorhq.com/api/v1/apps/${appId}/proxy?path=${encodeURIComponent(apiPath)}`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Version': '2021-07-28'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch contact data from proxy');
            }

            const data = await response.json();
            console.log('Successfully fetched contact data:', data);

        } else {
            console.error('Failed to initialize GHL context. App cannot function.');
        }
    } catch (error) {
        console.error('API call failed:', error);
    }
}
