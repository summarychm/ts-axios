// Axios声明文件
export type Method = "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "patch" | "PATCH";

export interface AxiosRequestConfig {
	url?: string;
	method?: Method;
	params?: any;
	headers?: any;
	responseType?: XMLHttpRequestResponseType; // 响应类型
	data?: any;
	timeout?: number;
}

export interface AxiosResponse {
	data: any;
	status: number;
	statusText: string;
	headers: object;
	config: AxiosRequestConfig;
	request: XMLHttpRequest;
}
// export interface AxiosPromise extends Promise<AxiosResponse> {}
export type AxiosPromise = Promise<AxiosResponse>;

export interface AxiosError extends Error {
	config: AxiosRequestConfig;
	code?: string;
	request?: any;
	response?: any;
	isAxiosError: boolean;
}

/** Axios的公共方法类
 */
export interface Axios {
	interceptors: {
		request: AxiosInterceptorManager<AxiosRequestConfig>;
		response: AxiosInterceptorManager<AxiosResponse>;
	};
	request(config: AxiosRequestConfig): AxiosPromise;
	get(url: string, config?: AxiosRequestConfig): AxiosPromise;
	delete(url: string, config?: AxiosRequestConfig): AxiosPromise;
	head(url: string, config?: AxiosRequestConfig): AxiosPromise;
	options(url: string, config?: AxiosRequestConfig): AxiosPromise;
	post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise;
	put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise;
	patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise;
}
/** axios混合对象接口(自身实现request+挂载Axios.prototype的公共属性和方法)
 */
export interface AxiosInstance extends Axios {
	(config: AxiosRequestConfig): AxiosPromise;
}

/** 拦截器管理类接口 */
export interface AxiosInterceptorManager<T> {
	forEach(fn: (interceptor: AxiosInterceptor<T>) => void);
	use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number;
	eject(id: number): void;
}
/** 拦截成功回调 */
export type ResolvedFn<T = AxiosRequestConfig | AxiosResponse> = (val: T) => T | Promise<T>;
/** 拦截失败回调 */
export type RejectedFn = (error: any) => any;
/** 拦截器实例接口对象 */
export interface AxiosInterceptor<T> {
	resolved: ResolvedFn<T>;
	rejected: RejectedFn;
}
