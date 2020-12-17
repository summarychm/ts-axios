import { AxiosPromise, AxiosResponse } from "../types/index";
import { parseHeaders } from "../helper/headers";
import { createError } from "../helper/error";
import { isURLSameOrigin } from "../helper/url";
import cookie from "../helper/cookie";
import { isFormData } from "../helper/util";
import { AxiosRequestConfig } from "../types";

export function xhr(config: AxiosRequestConfig): AxiosPromise {
	return new Promise((resolve, reject) => {
		const {
			data = null,
			url,
			method = "get",
			headers = {},
			responseType,
			timeout,
			cancelToken,
			withCredentials,
			xsrfCookieName,
			xsrfHeaderName,
			onDownloadProgress,
			onUploadProgress,
		} = config;
		const request = new XMLHttpRequest();

		request.open(method.toUpperCase(), url, true);
		configureRequest();
		addEvents();
		processHeaders();
		processCancel();
		request.send(data);

		/** 构造response(Promise版)
		 * @param request request对象
		 */
		function handleResponse(request: XMLHttpRequest) {
			const responseHeaders = request.getAllResponseHeaders();
			const responseData = responseType && responseType !== "text" ? request.response : request.responseText;
			// 基于原生request构造AxiosResponse
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
		/** 为request添加默认配置
		 */
		function configureRequest(): void {
			if (responseType) request.responseType = responseType;
			if (timeout) request.timeout = timeout;
			if (withCredentials) request.withCredentials = true;
		}
		/** 注册回调事件 */
		function addEvents(): void {
			if (onDownloadProgress) request.onprogress = onDownloadProgress;
			if (onUploadProgress) request.upload.onprogress = onUploadProgress;
			request.onerror = (e) => reject(createError("Network Error!" + e, config, null, request));
			request.ontimeout = (e) => reject(createError(`Timeout of ${timeout}ms exceeded`, config, "ECONNABORTED", request));
			request.onreadystatechange = () => {
				if (request.readyState !== 4) return;
				if (request.status === 0) return;
				handleResponse(request);
			};
		}
		/** 扩展requestHeader(如自动设置content-type和添加xsrfToken) */
		function processHeaders(): void {
			// xsrf 跨域自动为 header 添加 token 键值对
			if ((withCredentials || isURLSameOrigin(url)) && xsrfCookieName) {
				const xsrfValue = cookie.read(xsrfCookieName);
				if (xsrfValue) headers[xsrfHeaderName] = xsrfValue;
			}
			if (isFormData(data)) delete headers["Content-Type"]; // 删除默认contentType让浏览器自动设置
			setRequestHeader(headers, data, request); // 更新request的headers
		}
		/** 支持cancel功能 */
		function processCancel(): void {
			if (cancelToken) {
				// 注册cancelTokenPromise的回调,用户通过resolve该Promise实现xhr.abort的目的.
				cancelToken.promise.then((reason) => {
					request.abort(); // 取消xhr
					reject(reason); // 完成此次xhr
				});
			}
		}
	});
	/** 更新request的headers
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
