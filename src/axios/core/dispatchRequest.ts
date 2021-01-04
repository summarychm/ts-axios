import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "../types/index";
import { xhr } from "./xhr";
import { buildURL, combineURL, isAbsoluteURL } from "../helper/url";
import { flatterHeaders } from "../helper/headers";
import transformRequestOrResponse from "./transform";

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
	throwIfCancellationRequested(config);
	processConfig(config);
	return xhr(config).then(transformResponseData);
}

/** 集中规范化处理config对象
 * @param config axiosConfig对象
 */
function processConfig(config: AxiosRequestConfig): void {
	config.url = transformURL(config); // 转换URL
	// 处理headers被抽取到了defaults.transformRequest中了.
	// 处理数据(如序列化)
	config.data = transformRequestOrResponse(config.data, config.headers, config.transformRequest);
	// 合并并剪除无用headers
	config.headers = flatterHeaders(config.headers, config.method);
}

/** 处理urlParams参数集合
 * @param config axiosConfig对象
 */
export function transformURL(config: AxiosRequestConfig): string {
	let { url, params, paramsSerializer, baseURL } = config;
	if (baseURL && !isAbsoluteURL(url)) {
		url = combineURL(baseURL, url);
	}
	return buildURL(url!, params, paramsSerializer); // 这里的URL为必传
}

/** 规范化 AxiosResponse
 * @param res AxiosResponse
 */
function transformResponseData(res: AxiosResponse): AxiosResponse {
	// 尝试将res.data转为JSON格式
	res.data = transformRequestOrResponse(res.data, res.headers, res.config.transformResponse);
	return res;
}

/** 检测cancelToken是否已经使用过了,如果已使用则抛错
 * @param config axiosConfig
 */
function throwIfCancellationRequested(config: AxiosRequestConfig): void {
	if (config.cancelToken) {
		config.cancelToken.throwIfRequested();
	}
}
