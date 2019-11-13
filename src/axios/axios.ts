import { AxiosInstance } from "./types";
import { AxiosPublicFnClass } from "./core/Axios";

/**
 * 创建axios混合对象实例
 */
function createInstance(): AxiosInstance {
	const context = new AxiosPublicFnClass();
	// 因为request方法内部会用到axios实例,所以先绑定好this
	const instance = AxiosPublicFnClass.prototype.request.bind(context);

	// 将instance.prototype指向Axios.prototype,这样instance就可以直接工具方法了
	// 或使用浅拷贝复制 extend(instance, context);
	Object.setPrototypeOf(instance, AxiosPublicFnClass.prototype);
	return instance as AxiosInstance;
}
const axios = createInstance();
export default axios;
