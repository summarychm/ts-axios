// 请求方法
export type Method = "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "patch" | "PATCH";

export interface AxiosRequestConfig {
	url?: string;
	method?: Method;
	params?: any;
	headers?: object;
	// 响应类型
	responseType?: XMLHttpRequestResponseType;
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

/** 对外界提供啊AxiosError类型注解
 */
export interface AxiosError extends Error {
	config: AxiosRequestConfig;
	code?: string;
	request?: any;
	response?: any;
	isAxiosError: boolean;
}

/** Axios的公共方法
 */
export interface Axios {
	request(config: AxiosRequestConfig): AxiosPromise;
	get(url: string, config?: AxiosRequestConfig): AxiosPromise;
	delete(url: string, config?: AxiosRequestConfig): AxiosPromise;
	head(url: string, config?: AxiosRequestConfig): AxiosPromise;
	options(url: string, config?: AxiosRequestConfig): AxiosPromise;
	post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise;
	put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise;
	patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise;
}
/** axios混合对象接口(自身实现request+挂载Axios.prototype的其他方法)
 */
export interface AxiosInstance extends Axios {
	(config: AxiosRequestConfig): AxiosPromise;
}
