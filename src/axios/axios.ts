import { AxiosInstance } from "./types";
import Axios from "./core/Axios";
import { extend } from "./helper/util";

/** 创建axios混合对象实例 */
function createInstance(): AxiosInstance {
	const context = new Axios();
	// 因为request方法内部会用到axios实例,所以先绑定好this
	const instance = Axios.prototype.request.bind(context);

	// 之所以不能使用Object.setPrototypeOf(instance, Axios.prototype)
	// 是因为 interceptors 属性存在于Axios实例中而不是其原型中.
	extend(instance, context);
	return instance as AxiosInstance;
}
const axios = createInstance();
export default axios;
