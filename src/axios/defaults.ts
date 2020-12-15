import { AxiosRequestConfig } from "./types";
import { transformRequestHeaders } from "./helper/headers";
import { transformRequestData, transformResponseData } from "./helper/data";

/** AxiosDefaultConfig */
const defaults: AxiosRequestConfig = {
	method: "get",
	timeout: 0,
	headers: {
		common: {
			Accept: "application/json, text/plain, */*",
		},
	},
	transformRequest: [
		// default transformRequest
		(data: any, headers: any): any => {
			transformRequestHeaders(headers, data);
			return transformRequestData(data);
		},
	],
	// defalut transformeResponse
	transformResponse: [(data: any): any => transformResponseData(data)],
	xsrfCookieName: "XSRF-TOKEN",
	xsrfHeaderName: "X-XSRF-TOKEN",
};

// 以下几种请求无需添加额外的headers
const methodsNoData = ["delete", "get", "head", "options"];
methodsNoData.forEach((method) => {
	defaults.headers[method] = {};
});

// 对于post,put,patch添加Content-Type属性
const methodsWithData = ["post", "put", "patch"];
methodsWithData.forEach((method) => {
	defaults.headers[method] = {
		"Content-Type": "application/x-www-form-urlencoded",
	};
});
export default defaults;
