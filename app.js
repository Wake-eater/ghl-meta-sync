async function main() {
    console.log('Starting custom app...');
    
    const contextReady = await getGHLContext();
    
    if (contextReady) {
        console.log('GHL context successfully retrieved.');
        
        const appId = 'YOUR_APP_ID';
        
        // This is the CORRECT API path based on your cURL test
        const apiPath = `/locations/${currentLocationId}/customFields?model=contact`;
        
        // Use the GHL Proxy with the correct full path
        const apiUrl = `https://services.leadconnectorhq.com/api/v1/apps/${appId}/proxy?path=${apiPath}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Version': '2021-07-28'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch data');
            }

            const data = await response.json();
            console.log('Successfully fetched data:', data);
            
        } catch (error) {
            console.error('API call failed:', error);
        }
    } else {
        console.error('Failed to initialize GHL context. App cannot function.');
    }
}
