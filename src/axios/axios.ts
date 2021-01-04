import { AxiosRequestConfig, AxiosStatic } from "./types/index";
import Axios from "./core/Axios";
import { extend } from "./helper/util";
import defaults from "./defaults";
import mergeConfig from "./core/mergeConfig";
import CancelToken from "./cancel/CancelToken";
import Cancel, { isCancel } from "./cancel/Cancel";

/** 创建axios混合对象实例
 * @param config defaultConfig
 */
function createInstance(config: AxiosRequestConfig): AxiosStatic {
	const context = new Axios(config);
	// 混合实例默认方法其实就是axios实例的request方法,所以这里直接指向axios实例,并将this指定为该实例
	const instance = Axios.prototype.request.bind(context);

	// 这里之所以不能使用Object.setPrototypeOf(instance, Axios.prototype)
	// 是因为 interceptors/defaults/put 等属性和方法存在于Axios实例中而不是其原型中.
	extend(instance, context); // 将axios实例属性和方法拷贝到混合实例中
	return instance as AxiosStatic;
}

const axios = createInstance(defaults); // 导入默认配置

axios.create = function create(config) {
	return createInstance(mergeConfig(defaults, config));
};

// 扩展cancel相关的静态属性和方法
axios.CancelToken = CancelToken;
axios.Cancel = Cancel; // cancelMessage类
axios.isCancel = isCancel; // 是否是cancelMessage类实例

axios.all = function all(promises) {
	return Promise.all(promises);
};
axios.spread = function spread(callback) {
	return function wrap(arr) {
		return callback.apply(null, arr);
	};
};
axios.Axios = Axios;

export default axios;
