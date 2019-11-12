import { AxiosPromise, AxiosResponse } from "./types/index";
import { AxiosRequestConfig } from "./types";
import { parseHeaders } from "./helper/headers";

export function xhr(config: AxiosRequestConfig): AxiosPromise {
	return new Promise((resolve, reject) => {
		const { data = null, url, method = "get", headers = {}, responseType } = config;
		const request = new XMLHttpRequest();
		if (responseType) request.responseType = responseType;
		request.open(method.toUpperCase(), url, true);
		// 批量设置requestHeaders
		for (const [key, val] of Object.entries(headers)) {
			if (data === null && key.toLowerCase() === "context-type") {
				delete headers[key];
			} else request.setRequestHeader(key, val);
		}
		request.onreadystatechange = () => {
			if (request.readyState !== 4) return;
			const responseHeaders = request.getAllResponseHeaders();
			const responseData = responseType && responseType !== "text" ? request.response : request.responseText;
			// 从request上构造response
			const response: AxiosResponse = {
				data: responseData,
				status: request.status,
				statusText: request.statusText,
				headers: parseHeaders(responseHeaders),
				config,
				request,
			};
			resolve(response);
		};
		request.send(data);
	});
}
