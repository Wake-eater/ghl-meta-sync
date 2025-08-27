// GHL Context - Works with GHL's iframe environment
async function getGHLContext() {
    try {
        let locationId = '';
        if (window.parent && window.parent.location) {
            const parentUrl = new URL(window.parent.location.href);
            const pathMatches = parentUrl.pathname.match(/locations\/([a-zA-Z0-9-]+)/);
            if (pathMatches && pathMatches[1]) {
                locationId = pathMatches[1];
            }
        }
        
        if (!locationId) {
            const urlParams = new URLSearchParams(window.location.search);
            locationId = urlParams.get('locationId') || urlParams.get('location_id');
        }

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
            return !!currentLocationId;
        }
        
        return false;
    } catch (error) {
        console.error('GHL Context error:', error);
        return false;
    }
}
