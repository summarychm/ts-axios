// 请求方法
export type Method = "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "patch" | "PATCH";
// axios RequestConfig
export interface AxiosRequestConfig {
	url: string;
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
export interface AxiosPromise extends Promise<AxiosResponse> {}

/**
 * 对外界提供啊AxiosError类型注解
 */
export interface AxiosError extends Error {
	config: AxiosRequestConfig;
	code?: string;
	request?: any;
	response?: any;
	isAxiosError: boolean;
}

// export type AxiosInterface = <T = any>(config: AxiosRequestConfig) => AxiosPromise<T>;
