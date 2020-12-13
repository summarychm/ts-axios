import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "../types/index";
import { xhr } from "./xhr";
import { buildURL } from "../helper/url";
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
	config.url = transformURL(config);
	// 调用预处理函数
	config.data = transformRequestOrResponse(config.data, config.headers, config.transformRequest);
	// 因为规范化data时需要最新的headers所以先处理headers
	config.headers = flatterHeaders(config.headers, config.method); // 合并并剪除无用header
}

/** 处理urlParams参数集合
 * @param config axiosConfig对象
 */
function transformURL(config: AxiosRequestConfig): string {
	const { url, params = {} } = config;
	return buildURL(url!, params); // 这里的URL为必传
}

/** 规范化 AxiosResponse
 * @param res AxiosResponse
 */
function transformResponseData(res: AxiosResponse): AxiosResponse {
	// 尝试将res.data转为JSON格式
	res.data = transformRequestOrResponse(res.data, res.headers, res.config.transformResponse);
	return res;
}

/** 检测cancelToken是否已经使用过了
 * @param config axiosConfig
 */
function throwIfCancellationRequested(config: AxiosRequestConfig): void {
	if (config.cancelToken) {
		config.cancelToken.throwIfRequested();
	}
}
