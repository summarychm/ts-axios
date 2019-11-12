import { AxiosRequestConfig } from "./types/index";
import { xhr } from "./xhr";
import { buildURL } from "./helper/url";
import { transformRequestData } from "./helper/data";
import { transformRequestHeaders } from "./helper/headers";

function axios(config: AxiosRequestConfig) {
	processConfig(config);
	xhr(config);
}

/**
 * 集中规范化处理config对象
 * @param config axiosConfig对象
 */
function processConfig(config: AxiosRequestConfig): void {
	processRequestUrl(config);
	// 因为规范化data时需要最新的headers所以先处理headers
	processRequestHeaders(config);
	processRequestData(config);
}

/**
 * 处理urlParams参数集合
 * @param config axiosConfig对象
 */
function processRequestUrl(config: AxiosRequestConfig) {
	const { url, params = {} } = config;
	config.url = buildURL(url, params);
}

/**
 *规范化RequestData对象
 * @param config axiosConfig对象
 */
function processRequestData(config: AxiosRequestConfig) {
	config.data = transformRequestData(config.data);
}

/**
 * 规范化RequestHeaders对象
 * @param config axiosConfig对象
 */
function processRequestHeaders(config: AxiosRequestConfig) {
	let { headers, data } = config;

	headers = transformRequestHeaders(headers, data);
	config.headers = headers;
}

export default axios;

// function createInstance(): AxiosInterface {
// 	const instance = new Axios();
// 	return instance;
// }
// const axios = createInstance();
