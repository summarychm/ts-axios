import { AxiosRequestConfig } from "./types/index";
import { xhr } from "./xhr";
import { buildURL } from "./helper/url";
import { transformRequestData } from "./helper/data";

function axios(config: AxiosRequestConfig) {
	processConfig(config);
	xhr(config);
}

/**
 * 集中规范化处理config对象
 * @param config axiosConfig对象
 */
function processConfig(config: AxiosRequestConfig): void {
	config.url = transformUrl(config);
	config.data = transformRequestData(config.data);
	console.log("============ config.data begin ====================");
	console.log(config.data);
	console.log("============ config.data end ======================");
}

/**
 * 处理urlParams参数集合
 * @param config axiosConfig对象
 */
function transformUrl(config: AxiosRequestConfig): string {
	const { url, params = {} } = config;
	return buildURL(url, params);
}
export default axios;

// function createInstance(): AxiosInterface {
// 	const instance = new Axios();
// 	return instance;
// }
// const axios = createInstance();
