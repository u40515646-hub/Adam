

interface ApiConfig {
    serverId: string;
    apiKey: string;
}

const API_CONFIG_KEY = 'stormfinsApiConfig';

const getApiConfig = (): ApiConfig | null => {
    try {
        const storedConfig = localStorage.getItem(API_CONFIG_KEY);
        if (storedConfig) {
            const config = JSON.parse(storedConfig);
            // Basic validation
            if (config.serverId) {
                return config;
            }
        }
    } catch (e) {
        console.error('Could not parse API config from localStorage.', e);
    }
    return null;
};

// Fix: Export 'saveApiConfig' to be used by SettingsView.tsx. This function now saves to localStorage.
export const saveApiConfig = (config: ApiConfig) => {
    localStorage.setItem(API_CONFIG_KEY, JSON.stringify(config));
};

export const isApiConfigured = (): boolean => {
    const config = getApiConfig();
    return !!config?.serverId;
};

export const fetchData = async (): Promise<any | null> => {
    const config = getApiConfig();
    if (!config) {
        // This is not an error, just means it's not configured yet.
        return null;
    }

    try {
        const response = await fetch(`https://api.npoint.io/${config.serverId}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            // A 404 is normal for a new npoint bin, treat as empty data.
            if (response.status === 404) {
                return {}; 
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Handle potentially empty responses from npoint
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return null;
    }
};

export const saveData = async (data: any): Promise<boolean> => {
    const config = getApiConfig();
    if (!config) {
        // Not an error, just not configured to save.
        return false;
    }

    try {
        const response = await fetch(`https://api.npoint.io/${config.serverId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Note: npoint.io doesn't use API keys, but we include for compatibility with other services
                'X-API-Key': config.apiKey, 
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error("Failed to save data:", error);
        return false;
    }
};
