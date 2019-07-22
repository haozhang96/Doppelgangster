export interface IFingerprint {
    system: {
        os: {
            family: string;
            version?: string;
            architecture: number;
        };

        cpu?: {
            cores: number;
        };

        gpu?: {
            renderer: string;
            vendor: string;
        };

        display: {
            width: number;
            height: number;
            colorDepth: number;
        };

        battery?: {
            charging: boolean;
            level: number;
        };

        memory?: number;
        manufacturer?: string;
        time: string;
        timezoneOffset: number;
    };

    browser: {
        userAgent: string;
        name: string;
        version: string;
        engine: string;
        languages?: string[];
        performanceTimings?: { [key: string]: number; };
        hasVisitedBefore: boolean;
        doNotTrack: boolean;

        // Async
        hasAdBlock?: boolean;
        plugins?: string[];
        fonts?: string[];
        tamperDetections?: {
            os: boolean;
            screenResolution: boolean;
            browser: boolean;
            languages: boolean;
        };
        signature?: string;
    };

    connection: {
        ipAddresses: {
            external: string[];
            internal?: string[];
        };
        isProxy: boolean;
        isTorExitNode: boolean;
        isp: string;
        asn: number;
        organization: string;
        location?: {
            continent: string;
            country: string;
            region: string;
            city: string;
            coordinates: {
                latitude: number;
                longitude: number;
            };
            timezone: {
                region: string;
                utcOffset: number;
                matchesSystem: boolean;
            };
        };
        latency?: number;
    };

    headers: { [key: string]: string; };
}
