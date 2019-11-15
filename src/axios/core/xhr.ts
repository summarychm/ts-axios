import { AxiosPromise, AxiosResponse } from "../types/index";
import { AxiosRequestConfig } from "../types";
import { parseHeaders } from "../helper/headers";
import { createError } from "../helper/error";
import { isURLSameOrigin } from "../helper/url";
import cookie from "../helper/cookie";

export function xhr(config: AxiosRequestConfig): AxiosPromise {
	return new Promise((resolve, reject) => {
		const { data = null, url, method = "get", headers = {}, responseType, timeout, cancelToken, withCredentials, xsrfCookieName, xsrfHeaderName } = config;
		const request = new XMLHttpRequest();
		if (responseType) request.responseType = responseType;
		if (timeout) request.timeout = timeout;

		request.open(method.toUpperCase(), url, true);

		if (withCredentials) request.withCredentials = true;
		// xsrf 跨域自动为 header 添加 token 键值对
		if ((withCredentials || isURLSameOrigin(url)) && xsrfCookieName) {
			const xsrfValue = cookie.read(xsrfCookieName);
			if (xsrfValue) headers[xsrfHeaderName] = xsrfValue;
		}

		setRequestHeader(headers, data, request); // 更新request的headers

		if (cancelToken) {
			// 注册cancelTokenPromise的回调,用户通过resolve该Promise实现xhr.abort的目的.
			cancelToken.promise.then((reason) => {
				request.abort(); // 取消ajax
				reject(reason);
			});
		}

		request.onreadystatechange = () => {
			if (request.readyState !== 4) return;
			if (request.status === 0) return;
			handleResponse(request);
		};
		request.send(data);
		request.onerror = (e) => reject(createError("Network Error!" + e, config, null, request));
		request.ontimeout = (e) => reject(createError(`Timeout of ${timeout}ms exceeded`, config, "ECONNABORTED", request));

		/** 构造response,并返回
		 * @param request request对象
		 */
		function handleResponse(request: XMLHttpRequest) {
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
			if (response.status >= 200 && response.status < 300) resolve(response);
			else reject(createError(`Request failed with status code ${response.status}`, config, null, request, response));
		}
	});
	/**
	 * 更新request的headers
	 * @param headers configHeader
	 * @param data configData
	 * @param request ajax的request对象
	 */
	function setRequestHeader(headers: object, data: any, request: XMLHttpRequest) {
		for (const [key, val] of Object.entries(headers)) {
			if (data === null && key.toLowerCase() === "context-type") {
				delete headers[key];
			} else request.setRequestHeader(key, val);
		}
	}
}
