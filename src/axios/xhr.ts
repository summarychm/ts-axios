import { AxiosRequestConfig } from "./types";

export function xhr(config: AxiosRequestConfig) {
	const { data = null, url, method = "get", headers = {} } = config;
	const request = new XMLHttpRequest();
	request.open(method.toUpperCase(), url, true);

	// 批量设置requestHeaders
	for (const [key, val] of Object.entries(headers)) {
		if (data === null && key.toLowerCase() === "context-type") {
			delete headers[key];
		} else request.setRequestHeader(key, val);
	}

	request.send(data);
}
