import { AxiosInterceptorManager, AxiosInterceptor } from "../types";

// interface forEachClFn<T> {
// 	(interceptor: Interceptor<T>): void;
// }

export default class InterceptorManager<T> implements AxiosInterceptorManager<T> {
	// 拦截器集合
	private interceptors: Array<AxiosInterceptor<T> | null>;
	constructor() {
		this.interceptors = [];
	}
	/**
	 * 注册拦截器
	 * @param resolved 拦截成功回调
	 * @param rejected 拦截失败回调
	 * @returns 拦截器id
	 */
	use(resolved, rejected): number {
		this.interceptors.push({ resolved, rejected });
		return this.interceptors.length - 1;
	}
	/**
	 * 删除指定拦截器
	 * @param id 拦截器id
	 */
	eject(id: number): void {
		if (this.interceptors[id]) this.interceptors[id] = null;
	}
	/**
	 * 遍历拦截器集合
	 * @param fn 拦截器遍历函数
	 */
	forEach(fn: (interceptor: AxiosInterceptor<T>) => void) {
		this.interceptors.forEach((interceptor) => {
			interceptor && fn(interceptor);
		});
	}
}
