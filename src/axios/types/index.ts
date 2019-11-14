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
	/** 请求发出前修改header */
	transformRequest?: AxiosTransformer | AxiosTransformer[];
	/** responseData预处理 */
	transformResponse?: AxiosTransformer | AxiosTransformer[];
	cancelToken?: AxiosCancelToken;
}
/**  转换resquest/response接口 */
export type AxiosTransformer = (data: any, headers?: any) => any;

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
	defaults: AxiosRequestConfig;
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
/** 创建新的Axios实例 */
export interface AxiosStatic extends AxiosInstance {
	/**
	 * 创建新的axios实例
	 * @param config 新axios的配置参数
	 */
	create(config?: AxiosRequestConfig): AxiosInstance;
}

/** 拦截器管理类接口 */
export interface AxiosInterceptorManager<T> {
	forEach(fn: (interceptor: AxiosInterceptor<T>) => void);
	use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number;
	eject(id: number): void;
}
/** 拦截器实例接口对象 */
export interface AxiosInterceptor<T> {
	resolved: ResolvedFn<T>;
	rejected: RejectedFn;
}
/** 拦截成功回调 */
export type ResolvedFn<T = AxiosRequestConfig | AxiosResponse> = (val: T) => T | Promise<T>;
/** 拦截失败回调 */
export type RejectedFn = (error: any) => any;

/** cancelToken实例接口 */
export interface AxiosCancelToken {
	promise: Promise<string>;
	reason?: string;
}
/** cancel取消方法接口 */
export type Canceler = (message?: string) => void;
/** cancelToken类构造函数参数接口 */
export type CancelExecutor = (cancel: Canceler) => void;
