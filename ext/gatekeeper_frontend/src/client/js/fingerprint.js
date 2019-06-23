// ClientRects: https://browserleaks.com/rects

http = function (options) {
	var request = window.XMLHttpRequest ? new XMLHttpRequest() : window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : undefined;
	if (typeof options.parameters === "object") {
		var objectKeys = Object.keys || objectKeys || function(){"use strict";var t=Object.prototype.hasOwnProperty,r=!{toString:null}.propertyIsEnumerable("toString"),e=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],o=e.length;return function(n){if("function"!=typeof n&&("object"!=typeof n||null===n))throw new TypeError("Object.keys called on non-object");var c,l,p=[];for(c in n)t.call(n,c)&&p.push(c);if(r)for(l=0;l<o;l++)t.call(n,e[l])&&p.push(e[l]);return p}}(), serializer = function (key) {
			return key + "=" + (typeof this[1][key] === "object" ? objectKeys(this[1][key]).map(this[0].bind([this[0], this[1][key]])) : encodeURIComponent(this[1][key]));
		};
		options.parameters = objectKeys(options.parameters).map(serializer.bind([serializer, options.parameters])).join("&");
	}
	var url = options.parameters ? options.url + "?" + options.parameters : options.url;
	if (request) {
		request.open(options.method || "GET", url, !options.synchronous); // Must open before setting options.timeout to avoid InvalidStateError in IE
		if (options.options && window.XMLHttpRequest && request instanceof XMLHttpRequest)
			for (var option in options.options)
				request[option] = options.options[option];
		if (options.headers)
			for (var header in options.headers)
				request.setRequestHeader(header, options.headers[header]);
		request.send(options.data);
		return options.synchronous ? request.responseText : request;
	} else document.createElement("img").src = url;
};

generateCode = function (reCAPTCHAresponse) {
	if (reCAPTCHAresponse = reCAPTCHAresponse || grecaptcha.getResponse())
		http({
			url: "Public/GenerateCode.php",
			parameters: { id: data.id, reCAPTCHA: reCAPTCHAresponse },
			options: {
				onload: function () {
					var response = this.responseText;
					fingerprinting.then(function () {
						document.getElementById("content").innerHTML = "<div class=\"primary\" oncopy=\"setTimeout(window.open(location, '_self').close.bind(window), 0)\">" + (response || "Invalid server response.") + "</div>";
					});
				}
			}
		});
};

var data = JSON.parse((function (input, key) { // Keep data in the outer scope for generateCode
	for (var output = [], input_len = input.length, key_len = key.length, index = 0; index < input_len; index++)
		output.push(String.fromCharCode(input.charCodeAt(index) ^ key.substr(index % key_len, 1).charCodeAt(0)));
	return output.join("");
})(atob(window.data), location.href.match(/[a-z0-9]{64}$/).pop().split("").reverse().join("")));

var fingerprinting = new Promise(function (finishFingerprinting) {
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
					var canvas = document.body.appendChild(document.createElement("canvas")), context = canvas.getContext("experimental-webgl");
					var extension = context.getExtension("WEBGL_debug_renderer_info"), renderer = context.getParameter(extension.UNMASKED_RENDERER_WEBGL);
					
					return canvas.parentNode.removeChild(canvas) && {
						renderer: renderer.match(/^ANGLE/) ? renderer.slice(7, -1) : renderer,
						vendor: context.getParameter(extension.UNMASKED_VENDOR_WEBGL)
					};
				} catch (_) { }
			})() : undefined,
			
			display: {
				width: screen.width,
				height: screen.height,
				colorDepth: screen.colorDepth
			},
			
			battery: asyncFingerprints.push(navigator.getBattery ? navigator.getBattery() : undefined),
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
			languages: navigator.languages || (navigator.language ? [navigator.language] : undefined),
			// performanceTimings: window.performance && performance.timing.toJSON ? performance.timing.toJSON() : undefined,
			hasVisitedBefore: !!((window.localStorage && (localStorage.getItem("") || localStorage.setItem("", true))) || (document.cookie = !!document.cookie)),
			doNotTrack: navigator.doNotTrack === "1" || data.doNotTrack || data.headers.Dnt === "1"
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
					utcOffset: (data.ipapi.utc_offset.slice(0, 1) === "-" ? -1 : 1) * (data.ipapi.utc_offset.substr(-4, 2) * 60 + +data.ipapi.utc_offset.substr(-2, 2)),
					matchesSystem: (data.ipapi.utc_offset.slice(0, 1) === "-" ? -1 : 1) * (data.ipapi.utc_offset.substr(-4, 2) * 60 + +data.ipapi.utc_offset.substr(-2, 2)) === -new Date().getTimezoneOffset() // getTimezoneOffset uses local time as reference instead of UTC time
				}
			} : undefined,
			latency: window.performance && performance.timing.responseStart !== performance.timing.requestStart ? performance.timing.responseStart - performance.timing.requestStart : undefined
		},
		
		headers: data.headers
	}
	
	// WebRTC IP address leaks
	asyncFingerprints.push(new Promise(function (resolve) {
		var ipAddresses = [];
		try { webRTCIPs(function (ipAddress) { ipAddresses.push(ipAddress); }); } catch (_) { } // Edge is dumb and doesn't like finally
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
		// Remove unnecessary elements to keep window content bounded
		for (var elements = document.body.children, reCAPTCHAcomponent = document.querySelector(".g-recaptcha-bubble-arrow"), index = 1; index < elements.length; index++)
			if (!reCAPTCHAcomponent || !elements[index].contains(reCAPTCHAcomponent))
				document.body.removeChild(elements[index]);
		
		with (fingerprint) {
			// Battery
			system.battery = fulfilledAsyncFingerprints[0] ? { charging: fulfilledAsyncFingerprints[0].charging, level: fulfilledAsyncFingerprints[0].level } : undefined;
			
			with (connection) {
				// WebRTC IP addresses
				if (fulfilledAsyncFingerprints[1].length)
					for (var index in fulfilledAsyncFingerprints[1])
						(fulfilledAsyncFingerprints[1][index].match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/) ? (ipAddresses.internal || (ipAddresses.internal = [])) : ipAddresses.external).push(fulfilledAsyncFingerprints[1][index]);
				
				// Remove duplicate IP addresses
				ipAddresses.external = ipAddresses.external.filter(function (ipAddress, index, self) { return self.indexOf(ipAddress) === index; });
				if (ipAddresses.internal)
					ipAddresses.internal = ipAddresses.internal.filter(function (ipAddress, index, self) { return self.indexOf(ipAddress) === index; });
			}
		}
		
		// Send data
		var fingerprintString = JSON.stringify(fingerprint);
		alert(fingerprintString);
		http({
			method: "POST",
			url: "Public/Fingerprint.php",
			parameters: { id: data.id },
			data: fingerprintString,
			options: { onload: finishFingerprinting, onerror: finishFingerprinting }
		});
		/*http({
			method: "POST",
			url: "Test.php",
			data: fingerprintString,
			options: {
				onload: function () {
					alert(this.responseText);
				}
			}
		});*/
	});
});

document.querySelector(".g-recaptcha").style.display = "inline-block"; // Show reCAPTCHA box