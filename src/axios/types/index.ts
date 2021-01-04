/* Axios声明文件 */

export type Method = "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "patch" | "PATCH";

export interface AxiosRequestConfig {
	url?: string;
	method?: Method;
	params?: any;
	headers?: any;
	data?: any;
	responseType?: XMLHttpRequestResponseType; // 响应类型
	timeout?: number; // 请求过期时间
	/** 请求发出前修改header */
	transformRequest?: AxiosTransformer | AxiosTransformer[];
	/** responseData预处理 */
	transformResponse?: AxiosTransformer | AxiosTransformer[];
	/** 取消当前xhr */
	cancelToken?: CancelTokenInstance;
	/** 是否强制携带cookie */
	withCredentials?: boolean;
	// token的cookieName
	xsrfCookieName?: string;
	// token对应的headerName
	xsrfHeaderName?: string;
	// 下载进度
	onDownloadProgress?: (e: ProgressEvent) => void;
	// 上传进度
	onUploadProgress?: (e: ProgressEvent) => void;
	auth?: AxiosBasicCredentials;
	// [propName: string]: any;
}
export interface AxiosResponse<T = any> {
	data: T;
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
	response?: AxiosResponse;
	isAxiosError: boolean;
}
export type AxiosPromise<T = any> = Promise<AxiosResponse<T>>;

/** Axios的公共方法类 */
export interface Axios {
	interceptors: {
		request: AxiosInterceptorManager<AxiosRequestConfig>;
		response: AxiosInterceptorManager<AxiosResponse>;
	};
	defaults: AxiosRequestConfig;
	// 这里不定义axios(url,config)这种小众的调用方式,向开发者推荐axios(config)的形式
	request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
	get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
	delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
	head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
	options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
	post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
	put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
	patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>;
}
/** axios混合对象接口(支持axios(config),axios(url,config).axios.get(config)等多种调用方法)
 */
export interface AxiosInstance extends Axios {
	<T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
	// 函数重载,为axios混合类型添加新的定义,需调整Axios下的request方法
	<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>;
}
/** Axios实例接口 */
export interface AxiosStatic extends AxiosInstance {
	/** CancelToken的类类型 */
	CancelToken: CancelTokenStatic;
	/** CancelToken实例 */
	Cancel: CancelStatic;
	/** 判断是否是Cancel类实例 */
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
/** CancelToken类的实例类型 */
export interface CancelTokenInstance {
	promise: Promise<CancelInstance>;
	reason?: CancelInstance; // 取消原因
	/** 已cancel则抛出报错 */
	throwIfRequested(): void;
}
/** 对外的取消方法 */
export type Canceler = (message?: string) => void;
/** 对外取消方法的初始化方法(构造函数参数) */
export type CancelExecutor = (cancel: Canceler) => void;
/** CancelToken的类类型 */
export interface CancelTokenStatic {
	// 构造函数(接收执行器初始化函数)
	new (executor: CancelExecutor): CancelTokenInstance;
	source(): CancelTokenSource; // 静态source方法
}
/** CacnelToken.source方法的返回值接口  */
export interface CancelTokenSource {
	token: CancelTokenInstance; // 取消类的实例
	cancel: Canceler; // 取消方法
}

/** cancel实例类型接口 */
export interface CancelInstance {
	message?: string;
}

/** Cancel类的类类型 */
export interface CancelStatic {
	new (message?: string): CancelInstance;
}

/************* CancelToken end  ********/

// Authorization
export interface AxiosBasicCredentials {
	username: string;
	password: string;
}
