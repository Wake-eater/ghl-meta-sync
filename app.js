async function main() {
    console.log('Starting custom app...');

    try {
        const contextReady = await getGHLContext();

        if (contextReady) {
            console.log('GHL context successfully retrieved.');

            const appId = '68ae7013bb7027c6c3cbf9aa-metf55tl';
            
            // The API path for the contacts search endpoint. No locationId here.
            const apiPath = `contacts/search`;
            
            // Construct the full URL using the GHL Proxy
            const apiUrl = `https://services.leadconnectorhq.com/api/v1/apps/${appId}/proxy?path=${encodeURIComponent(apiPath)}`;

            // You must define your private integration token here
            const privateIntegrationToken = '7302d8fc-ba24-4cf8-9112-586e88f8280e';

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${privateIntegrationToken}`,
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
