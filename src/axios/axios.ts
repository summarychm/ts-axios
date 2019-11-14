import { AxiosRequestConfig, AxiosStatic } from "./types/index";
import { AxiosInstance } from "./types";
import Axios from "./core/Axios";
import { extend } from "./helper/util";
import defaults from "./defaults";
import mergeConfig from "./core/mergeConfig";

/** 创建axios混合对象实例
 * @param config defaultConfig
 */
function createInstance(config: AxiosRequestConfig): AxiosStatic {
	const context = new Axios(config);
	// 因为request方法内部会用到axios实例,所以先绑定好this
	const instance = Axios.prototype.request.bind(context);

	// 这里之所以不能使用Object.setPrototypeOf(instance, Axios.prototype)
	// 是因为 interceptors/defaults 等属性存在于Axios实例中而不是其原型中.
	extend(instance, context);
	return instance as AxiosStatic;
}

const axios = createInstance(defaults);

axios.create = function create(config) {
	return createInstance(mergeConfig(defaults, config));
};
export default axios;
