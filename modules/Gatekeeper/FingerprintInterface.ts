export interface IGatekeeperFingerprint {
	readonly system: {
        readonly os: {
            readonly family: string;
            readonly version?: string;
            readonly architecture: number;
        };
        readonly cpu?: {
            readonly cores: number;
        };
        readonly gpu?: {
            readonly renderer: string;
            readonly vendor: string;
        };
        readonly display: {
            readonly width: number;
            readonly height: number;
            readonly colorDepth: number;
        };
        readonly battery?: {
            readonly charging: boolean;
            readonly level: number;
        };
        readonly memory?: number;
        readonly manufacturer?: string;
        readonly time: string;
        readonly timezoneOffset: number;

        // Async
        readonly isTouchEnabled?: boolean;
    };

	readonly browser: {
        readonly userAgent: string;
        readonly name: string;
        readonly version: string;
        readonly engine: string;
        readonly languages?: string[];
        readonly performanceTimings?: { readonly [property: string]: number; };
        readonly hasVisitedBefore: boolean;
        readonly doNotTrack: boolean;

        // Async
        readonly hasAdBlock?: boolean;
        readonly plugins?: string[];
        readonly fonts?: string[];
        readonly temperDetections?: {
            readonly os: boolean;
            readonly screenResolution: boolean;
            readonly browser: boolean;
            readonly languages: boolean;
        };
        readonly signature?: string;
    };

	readonly connection: {
        readonly ipAddresses: {
            readonly external: string[];
            readonly internal?: string[];
        };
        readonly isProxy: boolean;
        readonly isTorExitNode: boolean;
        readonly isp: string;
        readonly asn: number;
        readonly organization: string;
        readonly location?: {
            readonly continent: string;
            readonly country: string;
            readonly region: string;
            readonly city: string;
            readonly postalCode?: string;
            readonly coordinates: {
                readonly latitude: number;
                readonly longitude: number;
            };
            readonly timezone: {
                readonly region: string;
                readonly utcOffset: number;
                readonly matchesSystem: boolean;
            };
        };
        readonly latency?: number;
    };
	
	readonly headers: { readonly [property: string]: string; };
}