// 请求方法
export type Method = "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "patch" | "PATCH";
// axios RequestConfig
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
	headers: string;
	config: AxiosRequestConfig;
	request: XMLHttpRequest;
}
export interface AxiosPromise extends Promise<AxiosResponse> {}

// export type AxiosInterface = <T = any>(config: AxiosRequestConfig) => AxiosPromise<T>;
