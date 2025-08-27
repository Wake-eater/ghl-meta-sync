// Global variables to store the location ID and API token
let currentLocationId = 'jXDdl77Ej0xMJdUeEfYo';
let apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6ImpYRGRsNzdFajB4TUpkVWVFZllvIiwidmVyc2lvbiI6MSwiaWF0IjoxNzUwMzU4MTk4NDg3LCJzdWIiOiJtY1VVUElISnU5UWRIT0tBbWJhTiJ9.9pdhqUbxR3tbn2UjJALFWR1Yr6CogYuUj9LJ2Vh-jGU';

// Main function to initialize the app and handle all logic
async function main() {
    console.log('Starting custom app...');
    
    // Step 1: Get the GHL context (location ID and API token)
    const contextReady = await getGHLContext();
    
    if (contextReady) {
        console.log('GHL context successfully retrieved.');
        
        // Step 2: Make the API call using the GHL Proxy
        // Replace 'YOUR_APP_ID' with your actual app ID from the custom app settings
        const appId = 'YOUR_APP_ID';
        
        // This is the API endpoint we want to hit, e.g., to get a list of contacts
        const apiPath = `/contacts/search`;
        
        // The URL for the API call MUST use the GHL proxy
        // We pass the real API path and the locationId as query parameters
        const apiUrl = `https://services.leadconnectorhq.com/api/v1/apps/${appId}/proxy?path=${apiPath}&locationId=${currentLocationId}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Version': '2021-07-28' // Use the correct API version
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch data');
            }

            const data = await response.json();
            console.log('Successfully fetched data:', data);
            
            // Your app logic to handle the fetched data goes here.
            // For example, you can now use the 'data' object to populate your UI.
            
        } catch (error) {
            console.error('API call failed:', error);
            // Display an error message in your app's UI.
        }
    } else {
        console.error('Failed to initialize GHL context. App cannot function.');
    }
}

// Function to retrieve the location ID and access token from the GHL iframe
async function getGHLContext() {
    try {
        let locationId = '';
        
        // Method 1 (Best Practice): Get locationId from the parent window's URL
        if (window.parent && window.parent.location) {
            const parentUrl = new URL(window.parent.location.href);
            const pathMatches = parentUrl.pathname.match(/locations\/([a-zA-Z0-9-]+)/);
            if (pathMatches && pathMatches[1]) {
                locationId = pathMatches[1];
            }
        }
        
        // Method 2 (Fallback): Get from the current iframe's URL parameters
        if (!locationId) {
            const urlParams = new URLSearchParams(window.location.search);
            locationId = urlParams.get('locationId') || urlParams.get('location_id');
        }

        // Method 3 (Fallback): Get from the current iframe's path
        if (!locationId) {
            const pathMatches = window.location.pathname.match(/locations\/([a-zA-Z0-9-]+)/);
            if (pathMatches && pathMatches[1]) {
                locationId = pathMatches[1];
            }
        }

        if (locationId) {
            currentLocationId = locationId;
            console.log('GHL Location ID:', currentLocationId);
            apiToken = await getAccessToken(); 
            return !!currentLocationId && !!apiToken;
        }
        
        return false;
    } catch (error) {
        console.error('GHL Context error:', error);
        return false;
    }
}

// Function to get the GHL Access Token (this is a placeholder)
// You must implement this function to retrieve your actual token.
async function getAccessToken() {
    // This part of the code is unique to your application's authentication method.
    // For a quick test, you can hardcode your token here.
    const accessToken = 'YOUR_API_TOKEN_HERE';
    
    if (!accessToken || accessToken === 'YOUR_API_TOKEN_HERE') {
        console.error('API Token is missing or not configured. Please add your token.');
        return null;
    }
    return accessToken;
}

// Start the application by calling the main function
main();
