// Fixed GHL Marketplace App Implementation

// Wait for GHL SDK to be available
function waitForGHL() {
    return new Promise((resolve, reject) => {
        if (window.GHL) {
            resolve(window.GHL);
        } else {
            let attempts = 0;
            const checkGHL = setInterval(() => {
                attempts++;
                if (window.GHL) {
                    clearInterval(checkGHL);
                    resolve(window.GHL);
                } else if (attempts > 50) { // 5 seconds timeout
                    clearInterval(checkGHL);
                    reject(new Error('GHL SDK not available after 5 seconds'));
                }
            }, 100);
        }
    });
}

// Initialize GHL context properly
async function getGHLContext() {
    try {
        console.log('Waiting for GHL SDK...');
        const GHL = await waitForGHL();
        
        console.log('GHL SDK loaded, initializing...');
        
        // Initialize the GHL context
        await GHL.init();
        
        console.log('GHL Context:', {
            apiToken: GHL.apiToken ? 'Present' : 'Missing',
            locationId: GHL.locationId,
            appId: GHL.appId,
            userId: GHL.userId,
            companyId: GHL.companyId
        });
        
        return GHL;
    } catch (error) {
        console.error('Failed to get GHL context:', error);
        return null;
    }
}

// Make API calls using the correct GHL proxy method
async function makeGHLAPICall(endpoint, options = {}) {
    try {
        const GHL = window.GHL;
        
        if (!GHL || !GHL.apiToken) {
            throw new Error('GHL context not initialized or API token missing');
        }

        console.log(`Making API call to: ${endpoint}`);
        
        // Use GHL's built-in request method if available
        if (GHL.request) {
            const response = await GHL.request({
                method: options.method || 'GET',
                url: endpoint,
                data: options.body,
                headers: options.headers
            });
            return response;
        }
        
        // Fallback to manual fetch with proper proxy URL
        const proxyUrl = `https://services.leadconnectorhq.com/hooks/api/v1/custom-app/proxy`;
        
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GHL.apiToken}`,
                'Version': '2021-07-28'
            },
            body: JSON.stringify({
                method: options.method || 'GET',
                url: endpoint,
                data: options.body,
                headers: options.headers
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Response Error:', response.status, errorText);
            throw new Error(`API call failed: ${response.status} ${errorText}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Direct API calls using your working PIT token
async function testWorkingEndpoints() {
    console.log('Testing working endpoints with PIT token...');
    
    // Your working credentials
    const PIT_TOKEN = 'pit-84c5455f-90a3-4991-b9b2-826b5c2468c1';
    const LOCATION_ID = 'jXDdl77Ej0xMJdUeEfYo';
    
    const headers = {
        'Authorization': `Bearer ${PIT_TOKEN}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json'
    };
    
    try {
        // Test 1: Get contacts list
        console.log('Fetching contacts list...');
        const contactsResponse = await fetch(
            `https://services.leadconnectorhq.com/contacts/?locationId=${LOCATION_ID}`,
            { method: 'GET', headers }
        );
        
        if (!contactsResponse.ok) {
            throw new Error(`Contacts API failed: ${contactsResponse.status}`);
        }
        
        const contactsData = await contactsResponse.json();
        console.log(`Successfully fetched ${contactsData.contacts.length} contacts`);
        displaySuccess(`Found ${contactsData.contacts.length} contacts`);
        
        // Test 2: Get location info
        console.log('Fetching location info...');
        const locationResponse = await fetch(
            `https://services.leadconnectorhq.com/locations/${LOCATION_ID}`,
            { method: 'GET', headers }
        );
        
        if (!locationResponse.ok) {
            throw new Error(`Location API failed: ${locationResponse.status}`);
        }
        
        const locationData = await locationResponse.json();
        console.log('Location info:', locationData.location.name);
        displaySuccess(`Location: ${locationData.location.name}`);
        
        // Test 3: Get custom fields
        console.log('Fetching custom fields...');
        const customFieldsResponse = await fetch(
            `https://services.leadconnectorhq.com/custom-fields/?locationId=${LOCATION_ID}`,
            { method: 'GET', headers }
        );
        
        if (!customFieldsResponse.ok) {
            throw new Error(`Custom Fields API failed: ${customFieldsResponse.status}`);
        }
        
        const customFieldsData = await customFieldsResponse.json();
        console.log(`Found ${customFieldsData.customFields.length} custom fields`);
        displaySuccess(`Found ${customFieldsData.customFields.length} custom fields`);
        
        // Test 4: Get single contact (first contact from the list)
        if (contactsData.contacts.length > 0) {
            const firstContactId = contactsData.contacts[0].id;
            console.log(`Fetching single contact: ${firstContactId}`);
            
            const singleContactResponse = await fetch(
                `https://services.leadconnectorhq.com/contacts/${firstContactId}`,
                { method: 'GET', headers }
            );
            
            if (!singleContactResponse.ok) {
                throw new Error(`Single Contact API failed: ${singleContactResponse.status}`);
            }
            
            const singleContactData = await singleContactResponse.json();
            console.log('Single contact:', singleContactData.contact.firstName, singleContactData.contact.lastName);
            displaySuccess(`Single contact: ${singleContactData.contact.firstName} ${singleContactData.contact.lastName}`);
        }
        
        displaySuccess('All API tests completed successfully!');
        
    } catch (error) {
        console.error('API test failed:', error);
        displayError(`API test failed: ${error.message}`);
    }
}

// Main application function - simplified to use direct API calls
async function main() {
    console.log('Starting GHL custom app with working endpoints...');
    
    try {
        // Skip GHL context initialization, use direct API calls
        await testWorkingEndpoints();
        
    } catch (error) {
        console.error('App initialization failed:', error);
        displayError(`App failed to initialize: ${error.message}`);
    }
}

// Utility functions for UI feedback
function displaySuccess(message) {
    const container = document.getElementById('app-container') || document.body;
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        background: #d4edda;
        color: #155724;
        padding: 15px;
        border: 1px solid #c3e6cb;
        border-radius: 4px;
        margin: 10px 0;
    `;
    successDiv.textContent = message;
    container.appendChild(successDiv);
}

function displayError(message) {
    const container = document.getElementById('app-container') || document.body;
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 15px;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        margin: 10px 0;
    `;
    errorDiv.textContent = message;
    container.appendChild(errorDiv);
}

// Alternative method using GHL's messaging system
async function useGHLMessaging() {
    try {
        const GHL = window.GHL;
        
        if (GHL && GHL.api) {
            // Use GHL's internal API system
            const response = await GHL.api.get('/contacts/');
            console.log('GHL.api response:', response);
            return response;
        }
        
        if (GHL && GHL.postMessage) {
            // Use postMessage for cross-frame communication
            return new Promise((resolve, reject) => {
                const requestId = Date.now().toString();
                
                const messageHandler = (event) => {
                    if (event.data.requestId === requestId) {
                        window.removeEventListener('message', messageHandler);
                        if (event.data.error) {
                            reject(new Error(event.data.error));
                        } else {
                            resolve(event.data.response);
                        }
                    }
                };
                
                window.addEventListener('message', messageHandler);
                
                GHL.postMessage({
                    type: 'API_REQUEST',
                    requestId: requestId,
                    endpoint: '/contacts/',
                    method: 'GET'
                });
                
                // Timeout after 10 seconds
                setTimeout(() => {
                    window.removeEventListener('message', messageHandler);
                    reject(new Error('Request timeout'));
                }, 10000);
            });
        }
        
    } catch (error) {
        console.error('GHL messaging failed:', error);
        throw error;
    }
}

// Enhanced initialization with multiple fallbacks
async function initializeApp() {
    console.log('Initializing GHL app with fallback methods...');
    
    try {
        // Method 1: Standard initialization
        await main();
    } catch (error) {
        console.warn('Standard initialization failed, trying messaging approach:', error);
        
        try {
            // Method 2: GHL messaging system
            const response = await useGHLMessaging();
            console.log('Messaging approach succeeded:', response);
            displaySuccess('Connected via GHL messaging system');
        } catch (messagingError) {
            console.error('All initialization methods failed:', messagingError);
            displayError('Failed to initialize app. Please check your GHL app configuration.');
        }
    }
}

// Add immediate console logs to confirm the script is loading
console.log('=== GHL Custom App Script Loaded ===');
console.log('Document ready state:', document.readyState);
console.log('Current URL:', window.location.href);

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    console.log('Waiting for DOM to load...');
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    console.log('DOM already loaded, starting immediately...');
    initializeApp();
}

// Also try to initialize after a short delay in case GHL SDK loads late
setTimeout(() => {
    console.log('Running delayed initialization...');
    initializeApp();
}, 1000);

// Force run the test immediately
console.log('Running immediate test...');
testWorkingEndpoints();

// Debug helper function
window.debugGHL = function() {
    console.log('=== GHL Debug Info ===');
    console.log('window.GHL:', window.GHL);
    if (window.GHL) {
        console.log('GHL properties:', Object.keys(window.GHL));
        console.log('API Token present:', !!window.GHL.apiToken);
        console.log('Location ID:', window.GHL.locationId);
        console.log('App ID:', window.GHL.appId);
        console.log('User ID:', window.GHL.userId);
        console.log('Company ID:', window.GHL.companyId);
    }
    console.log('===================');
};
