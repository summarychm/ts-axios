/* Axios声明文件 */

export type Method = "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "patch" | "PATCH";

export interface AxiosRequestConfig {
	url?: string;
	method?: Method;
	params?: any;
	headers?: any;
	data?: any;
	responseType?: XMLHttpRequestResponseType; // 响应类型
	timeout?: number;
	/** 请求发出前修改header */
	transformRequest?: AxiosTransformer | AxiosTransformer[];
	/** responseData预处理 */
	transformResponse?: AxiosTransformer | AxiosTransformer[];
	/** 取消当前xhr */
	cancelToken?: CancelTokenInstance;
	/** 是否强制携带cookie */
	withCredentials?: boolean;
}
export interface AxiosResponse {
	data: any;
	status: number;
	statusText: string;
	headers: object;
	config: AxiosRequestConfig;
	request: XMLHttpRequest;
}
export interface AxiosError extends Error {
	config: AxiosRequestConfig;
	code?: string;
	request?: any;
	response?: any;
	isAxiosError: boolean;
}
export type AxiosPromise = Promise<AxiosResponse>;

/** Axios的公共方法类 */
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
/** Axios实例接口 */
export interface AxiosStatic extends AxiosInstance {
	/** CancelToken类接口 */
	CancelToken: CancelTokenStatic;
	/** CancelToken实例 */
	Cancel: CancelStatic;
	/** 是否是Cancel类实例 */
	isCancel: (value: any) => boolean;
	/** 创建新的axios实例
	 * @param config 新axios的配置参数
	 */
	create(config?: AxiosRequestConfig): AxiosInstance;
}

/**  transformResquest/transformResponse接口 */
export type AxiosTransformer = (data: any, headers?: any) => any;

/************* interceptor begin  ********/
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
/************* interceptor end  ********/

/************* CancelToken begin  ********/
/** cancelToken实例接口 */
export interface CancelTokenInstance {
	promise: Promise<CancelInstance>;
	reason?: CancelInstance;
	/** 已cancel抛出报错 */
	throwIfRequested(): void;
}
/** CancelToken的类类型 */
export interface CancelTokenStatic {
	new (executor: CancelExecutor): CancelTokenInstance; //构造函数
	source(): CancelTokenSource; // 静态source方法
}
/** cancel取消方法接口 */
export type Canceler = (message?: string) => void;
/** cancelToken类构造函数参数接口 */
export type CancelExecutor = (cancel: Canceler) => void;
/** cancel实例类型接口 */
export interface CancelInstance {
	message?: string;
}
/** Cancel类类型 */
export interface CancelStatic {
	new (message?: string): CancelInstance;
}
/** CacnelToken.source 方法的返回值接口  */
export interface CancelTokenSource {
	token: CancelTokenInstance;
	cancel: Canceler;
}

/************* CancelToken end  ********/
