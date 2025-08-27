async function main() {
    console.log('Starting custom app...');

    try {
        const contextReady = await getGHLContext();

        if (contextReady) {
            console.log('GHL context successfully retrieved.');

            // Retrieve the token from the GHL context
            const apiToken = GHL.apiToken;
            const appId = GHL.appId;

            // The API path for the contacts search endpoint
            const apiPath = `contacts/search`;
            
            // Construct the full URL using the GHL Proxy
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
