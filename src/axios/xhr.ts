import { AxiosPromise, AxiosResponse } from "./types/index";
import { AxiosRequestConfig } from "./types";
import { parseHeaders } from "./helper/headers";
import { createError } from "./helper/error";

export function xhr(config: AxiosRequestConfig): AxiosPromise {
	return new Promise((resolve, reject) => {
		const { data = null, url, method = "get", headers = {}, responseType, timeout } = config;
		const request = new XMLHttpRequest();
		if (responseType) request.responseType = responseType;
		if (timeout) request.timeout = timeout;

		request.open(method.toUpperCase(), url, true);
		// 批量设置requestHeaders
		for (const [key, val] of Object.entries(headers)) {
			if (data === null && key.toLowerCase() === "context-type") {
				delete headers[key];
			} else request.setRequestHeader(key, val);
		}
		request.onreadystatechange = () => {
			if (request.readyState !== 4) return;
			if (request.status === 0) return;

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
			handleResponse(response);
		};

		request.send(data);
		request.onerror = (e) => reject(createError("Network Error!" + e, config, null, request));
		request.ontimeout = (e) => reject(createError(`Timeout of ${timeout}ms exceeded`, config, "ECONNABORTED", request));

		function handleResponse(response: AxiosResponse) {
			if (response.status >= 200 && response.status < 300) resolve(response);
			else reject(createError(`Request failed with status code ${response.status}`, config, null, request, response));
		}
	});
}
