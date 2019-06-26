/**
 * Note that this script has been purposely written using ES3-/ES5-compatible
 *   syntax for good compatibility without requiring additional transpilation.
 * 
 * Future references:
 * - ClientRects: https://browserleaks.com/rects
 */

/**
 * Make a HTTP request with the given options.
 * @param {Object} options
 */
function http(options) {
	// Create a HTTP request.
	var request = (
		window.XMLHttpRequest ?
			new XMLHttpRequest()
		: window.ActiveXObject ?
			new ActiveXObject("Microsoft.XMLHTTP")
		: // Edge case; will be handled below
			undefined
	);

	// Build the parameters.
	var parameters = options.parameters;
	if (typeof parameters === "object") {
		parameters = Object.keys(parameters).map(function (key) {
			return key + "=" + encodeURIComponent(parameters[key])
		}).join("&");
	}

	// Build the URL.
	var url = parameters ? options.url + "?" + parameters : options.url;

	// Make the request.
	if (request) {
		// The request must be open before setting options.timeout to avoid
		//   InvalidStateError in IE.
		request.open(options.method || "GET", url, !options.synchronous);

		// Make sure to only set the options if we are using native
		//   XMLHttpRequest or else IE might throw a fit for attempting to
		//   modify an ActiveX object.
		if (
			options.options
			&& window.XMLHttpRequest
			&& request instanceof XMLHttpRequest
		) {
			for (var option in options.options) {
				request[option] = options.options[option];
			}
		}

		// Set the request headers.
		if (options.headers) {
			for (var header in options.headers) {
				request.setRequestHeader(header, options.headers[header]);
			}
		}

		// Send the request and return the response text if requested.
		request.send(options.data);
		return options.synchronous ? request.responseText : request;
	} else if (options.method.toUpperCase() === "GET") {
		// Use an embedded image to make the GET request.
		document.createElement("img").src = url;
	}
};

/**
 * Encode or decode an input string with a key using the XOR cipher.
 * This is absolutely NOT meant to be secure!
 * @param {string} input The input string to encode or decode
 * @param {string} key The key to encode/decode on the input string with
 */
function xorCipher(input, key) {
	var output = [], inputLength = input.length, keyLength = key.length;
	for (var i = 0; i < inputLength; i++) {
		output.push(
			String.fromCharCode(
				input.charCodeAt(i) ^ key.charCodeAt(i % keyLength)
			)
		);
	}
	return output.join("");
}

/**
 * Show a message on the screen.
 * @param {string} message The message to show on the screen
 * @param {boolean} showAction Show a link to close or reload the page
 * @param {boolean} reloadMode Show the page reload link instead of page close
 */
function showMessage(message, showAction, reloadMode) {
	document.getElementById("content").innerHTML = (
		"<div class=\"primary\">" + message + "<\/div>"
		+ (
			showAction ?
				"<a class=\"secondary\" href=\"javascript: "
				+ (
					reloadMode ?
						"location.reload(true)"
					:
						"window.open(location, '_self').close()"
				)
				+ "\">"
				+ (reloadMode ? "Reload Page" : "Close Page")
				+ "<\/a>"
			:
				""
		)
	);
}

/**
 * Verify the reCAPTCHA response with the server and send the fingerprint data.
 * Note that this must be defined using the "var = function () {...}" syntax
 *   to overwrite the default one.
 */
verify = function () {
	var reCAPTCHAresponse = grecaptcha.getResponse();
	if (reCAPTCHAresponse) {
		showMessage("Verifying...");
		fingerprinting.then(function (fingerprint) {
			http({
				url: "verify",
				method: "POST",
				data: btoa(xorCipher(JSON.stringify({
					sessionID: data.sessionID,
					reCAPTCHAresponse: reCAPTCHAresponse,
					data: fingerprint
				}), key)),
				options: {
					onload: function () {
						if (this.status === 200) {
							showMessage("Verification successful.", true);
						} else {
							showMessage("Verification failed.", true, true);
						}
					},
					onerror: function () {
						showMessage("Verification failed.", true, true);
					}
				}
			});
		});
	}
};

// Keep data in the outer scope for other components to find.
var key = location.href.match(/[a-z0-9]{64}$/)[0].split("").reverse().join("");
var data = JSON.parse(xorCipher(atob(window.data), key));
//alert(JSON.stringify(data))

var fingerprinting = new Promise(function (finishFingerprinting) {
	// Force the fingerprinting to finish within 10 seconds.
	setTimeout(finishFingerprinting, 10000);
	
	var asyncFingerprints = [], fingerprint = {
		system: {
			os: {
				family: platform.os.family,
				version: platform.os.version || undefined,
				architecture: platform.os.architecture
			},
			
			cpu: navigator.hardwareConcurrency ? {
				cores: navigator.hardwareConcurrency
			} : undefined,
			
			gpu: window.HTMLCanvasElement ? (function () {
				try {
					var canvas = document.body.appendChild(
						document.createElement("canvas")
					);
					var context = canvas.getContext("experimental-webgl");
					var extension =
						context.getExtension("WEBGL_debug_renderer_info");
					var renderer =
						context.getParameter(extension.UNMASKED_RENDERER_WEBGL);
					
					return canvas.parentNode.removeChild(canvas) && {
						renderer: (
							renderer.match(/^ANGLE/) ?
								renderer.slice(7, -1)
							:
								renderer
						),

						vendor: context.getParameter(
							extension.UNMASKED_VENDOR_WEBGL
						)
					};
				} catch (_) { }
			})() : undefined,
			
			display: {
				width: screen.width,
				height: screen.height,
				colorDepth: screen.colorDepth
			},
			
			battery: asyncFingerprints.push(
				navigator.getBattery ? navigator.getBattery() : undefined
			),
			memory: navigator.deviceMemory,
			manufacturer: platform.manufacturer || undefined,
			time: new Date().toJSON(),
			timezoneOffset: -new Date().getTimezoneOffset()
		},
		
		browser: {
			userAgent: platform.ua,
			name: platform.name,
			version: platform.version,
			engine: platform.layout,
			languages: navigator.languages || (
				navigator.language ? [navigator.language] : undefined
			),
			// performanceTimings: window.performance && performance.timing.toJSON ? performance.timing.toJSON() : undefined,
			hasVisitedBefore: !!(
				(
					window.localStorage
					&& (
						localStorage.getItem("")
						|| localStorage.setItem("", true)
					)
				)
				|| (document.cookie = !!document.cookie)
			),
			doNotTrack: (
				navigator.doNotTrack === "1"
				|| data.doNotTrack
				|| data.headers.Dnt === "1"
			)
		},
		
		connection: {
			ipAddresses: { external: [data.ip], internal: undefined },
			isProxy: data.ipHub.block === 1,
			isTorExitNode: data.isTorExitNode,
			isp: data.ipHub.isp,
			asn: data.ipHub.asn,
			organization: data.ipapi.org,
			location: data.ipapi ? {
				continent: data.ipapi.continent_code,
				country: data.ipapi.country_name,
				region: data.ipapi.region,
				city: data.ipapi.city,
				postalCode: data.ipapi.postal || undefined,
				coordinates: {
					latitude: data.ipapi.latitude,
					longitude: data.ipapi.longitude
				},
				timezone: {
					region: data.ipapi.timezone,
					utcOffset: data.ipapi.utc_offset ? (data.ipapi.utc_offset.slice(0, 1) === "-" ? -1 : 1) * (data.ipapi.utc_offset.substr(-4, 2) * 60 + +data.ipapi.utc_offset.substr(-2, 2)) : undefined,
					matchesSystem: data.ipapi.utc_offset ? (data.ipapi.utc_offset.slice(0, 1) === "-" ? -1 : 1) * (data.ipapi.utc_offset.substr(-4, 2) * 60 + +data.ipapi.utc_offset.substr(-2, 2)) === -new Date().getTimezoneOffset() : undefined // getTimezoneOffset uses local time as reference instead of UTC time
				}
			} : undefined,
			latency: window.performance && performance.timing.responseStart !== performance.timing.requestStart ? performance.timing.responseStart - performance.timing.requestStart : undefined
		},
		
		headers: data.headers
	}
	
	// WebRTC IP address leaks
	asyncFingerprints.push(new Promise(function (resolve) {
		var ipAddresses = [];
		try {
			webRTCIPs(function (ipAddress) { ipAddresses.push(ipAddress); });
		} catch (_) { } // Edge is dumb and doesn't like finally
		setTimeout(function () { resolve(ipAddresses); }, 3000);
	}));
	
	// Fingerprintjs2
	setTimeout(function () {
		new Fingerprintjs2({
			extendedJsFonts: true,
			excludeAddBehavior: true,
			excludeAvailableScreenResolution: true,
			excludeColorDepth: true,
			excludeCpuClass: true,
			excludeDoNotTrack: true,
			excludeHardwareConcurrency: true,
			excludeIndexedDB: true,
			excludeLanguage: true,
			excludeOpenDatabase: true,
			excludePixelRatio: true,
			excludePlatform: true,
			excludeScreenResolution: true,
			excludeSessionStorage: true,
			excludeTimezoneOffset: true,
			excludeUserAgent: true
		}).get(function (signature, components) {
			var emptyObject = {};
			with (fingerprint) {
				system.isTouchEnabled = (components.find(function (component) { return component.key === "touch_support"; }).value || emptyObject).map(function (value) { return !!value; }).indexOf(true) !== -1;
				browser.hasAdBlock = (components.find(function (component) { return component.key === "adblock"; }) || emptyObject).value;
				browser.plugins = (components.find(function (component) { return component.key === "regular_plugins"; }) || emptyObject).value;
				browser.fonts = ((components.find(function (component) { return component.key === "js_fonts"; }) || emptyObject).value || []).sort();
				browser.tamperDetections = {
					os: (components.find(function (component) { return component.key === "has_lied_os"; }) || emptyObject).value,
					screenResolution: (components.find(function (component) { return component.key === "has_lied_resolution"; }) || emptyObject).value,
					browser: (components.find(function (component) { return component.key === "has_lied_browser"; }) || emptyObject).value,
					languages: (components.find(function (component) { return component.key === "has_lied_languages"; }) || emptyObject).value
				}
				browser.signature = signature;
			}
		});
	}, 100);
	
	// Wait for async fingerprints
	Promise.all(asyncFingerprints).then(function (fulfilledAsyncFingerprints) {
		// Remove unnecessary elements to keep window content bounded.
		var elements = document.body.children;
		var reCAPTCHAcomponent =
			document.querySelector(".g-recaptcha-bubble-arrow");
		for (var index = 1; index < elements.length; index++) {
			if (!reCAPTCHAcomponent || !elements[index].contains(reCAPTCHAcomponent)) {
				document.body.removeChild(elements[index]);
			}
		}

		// Populate the battery information.
		fingerprint.system.battery = (
			fulfilledAsyncFingerprints[0] ?
				{
					charging: fulfilledAsyncFingerprints[0].charging,
					level: fulfilledAsyncFingerprints[0].level
				}
			:
				undefined
		);
		
		with (fingerprint.connection) {
			// WebRTC IP addresses
			if (fulfilledAsyncFingerprints[1].length) {
				for (var index in fulfilledAsyncFingerprints[1]) {
					(fulfilledAsyncFingerprints[1][index].match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/) ? (ipAddresses.internal || (ipAddresses.internal = [])) : ipAddresses.external).push(fulfilledAsyncFingerprints[1][index]);
				}
			}
			
			// Remove duplicate IP addresses
			ipAddresses.external = ipAddresses.external.filter(function (ipAddress, index, self) { return self.indexOf(ipAddress) === index; });
			if (ipAddresses.internal) {
				ipAddresses.internal = ipAddresses.internal.filter(function (ipAddress, index, self) { return self.indexOf(ipAddress) === index; });
			}
		}
		
		// Send data
		finishFingerprinting(fingerprint);
		alert(JSON.stringify(fingerprint));
	});
});

// Show the reCAPTCHA box.
document.querySelector(".g-recaptcha").style.display = "inline-block";
