// Import external libraries.
import * as $JSONSchema from "jsonschema";

// Define the schema to validate fingerprint objects against.
export const fingerprintSchema: $JSONSchema.Schema = {
    id: "/Fingerprint",
    properties: {

    },
    type: "object",
};

/*[
    "type" => "object",
    "additionalProperties" => false,
    "required" => ["system", "browser", "connection", "headers"],
    "properties" => [
        "system" => [
            "type" => "object",
            "additionalProperties" => false,
            "required" => ["os", "display", "time", "timezoneOffset"],
            "properties" => [
                "os" => [
                    "type" => "object",
                    "additionalProperties" => false,
                    "required" => ["family", "architecture"],
                    "properties" => [
                        "family" => ["type" => "string"],
                        "version" => ["type" => "string"],
                        "architecture" => ["type" => "number"]
                    ]
                ],
                "cpu" => [
                    "type" => "object",
                    "additionalProperties" => false,
                    "required" => ["cores"],
                    "properties" => [
                        "cores" => ["type" => "number"]
                    ]
                ],
                "gpu" => [
                    "type" => "object",
                    "additionalProperties" => false,
                    "required" => ["renderer", "vendor"],
                    "properties" => [
                        "renderer" => ["type" => "string"],
                        "vendor" => ["type" => "string"]
                    ]
                ],
                "display" => [
                    "type" => "object",
                    "additionalProperties" => false,
                    "required" => ["width", "height", "colorDepth"],
                    "properties" => [
                        "width" => ["type" => "number"],
                        "height" => ["type" => "number"],
                        "colorDepth" => ["type" => "number"]
                    ]
                ],
                "battery" => [
                    "type" => "object",
                    "additionalProperties" => false,
                    "required" => ["charging", "level"],
                    "properties" => [
                        "charging" => ["type" => "boolean"],
                        "level" => ["type" => "number"]
                    ]
                ],
                "memory" => ["type" => "number"],
                "manufacturer" => ["type" => "string"],
                "time" => ["type" => "string"],
                "timezoneOffset" => ["type" => "number"],
                
                // Async
                "isTouchEnabled" => ["type" => "boolean"]
            ]
        ],
        "browser" => [
            "type" => "object",
            "additionalProperties" => false,
            "required" => ["userAgent", "name", "version", "engine", "hasVisitedBefore", "doNotTrack"],
            "properties" => [
                "userAgent" => ["type" => "string"],
                "name" => ["type" => "string"],
                "version" => ["type" => "string"],
                "engine" => ["type" => "string"],
                "languages" => ["type" => "array"],
                "performanceTimings" => ["type" => "object", "maxProperties" => 25],
                "hasVisitedBefore" => ["type" => "boolean"],
                "doNotTrack" => ["type" => "boolean"],
                
                // Async
                "hasAdBlock" => ["type" => "boolean"],
                "plugins" => ["type" => "array"],
                "fonts" => ["type" => "array"],
                "tamperDetections" => [
                    "type" => "object",
                    "additionalProperties" => false,
                    "required" => ["os", "screenResolution", "browser", "languages"],
                    "properties" => [
                        "os" => ["type" => "boolean"],
                        "screenResolution" => ["type" => "boolean"],
                        "browser" => ["type" => "boolean"],
                        "languages" => ["type" => "boolean"]
                    ]
                ],
                "signature" => ["type" => "string"]
            ]
        ],
        "connection" =>  [
            "type" => "object",
            "additionalProperties" => false,
            "required" => ["ipAddresses", "isProxy", "isTorExitNode", "isp", "asn", "organization"],
            "properties" => [
                "ipAddresses" => [
                    "type" => "object",
                    "additionalProperties" => false,
                    "required" => ["external"],
                    "properties" => [
                        "external" => ["type" => "array", "maxItems" => 5],
                        "internal" => ["type" => "array", "maxItems" => 5]
                    ]
                ],
                "isProxy" => ["type" => "boolean"],
                "isTorExitNode" => ["type" => "boolean"],
                "isp" => ["type" => "string"],
                "asn" => ["type" => "number"],
                "organization" => ["type" => "string"],
                "location" => [
                    "type" => "object",
                    "additionalProperties" => false,
                    "required" => ["continent", "country", "region", "city", "coordinates", "timezone"],
                    "properties" => [
                        "continent" => ["type" => "string"],
                        "country" => ["type" => "string"],
                        "region" => ["type" => "string"],
                        "city" => ["type" => "string"],
                        "postalCode" => ["type" => "string"],
                        "coordinates" => [
                            "type" => "object",
                            "additionalProperties" => false,
                            "required" => ["latitude", "longitude"],
                            "properties" => [
                                "latitude" => ["type" => "number"],
                                "longitude" => ["type" => "number"]
                            ]
                        ],
                        "timezone" => [
                            "type" => "object",
                            "additionalProperties" => false,
                            "required" => ["region", "utcOffset", "matchesSystem"],
                            "properties" => [
                                "region" => ["type" => "string"],
                                "utcOffset" => ["type" => "number"],
                                "matchesSystem" => ["type" => "boolean"]
                            ]
                        ]
                    ]
                ],
                "latency" => ["type" => "number"]
            ]
        ],
        "headers" =>  [
            "type" => "object",
            "maxProperties" => 15
        ]
    ]
]*/
