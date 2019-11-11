// 请求方法
export type Method = "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "patch" | "PATCH";
// axios RequestConfig
export interface AxiosRequestConfig {
	url?: string;
	method?: Method;
	params?: any;
	headers?: object;
	responseType?: XMLHttpRequestResponseType;
	data?: any;
	timeout?: number;
}

export interface AxiosResponse<T = any> {
	data: T;
	status: number;
	statusText: string;
	headers: object;
	config: AxiosRequestConfig;
	request: XMLHttpRequest;
}
// export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

// export type AxiosInterface = <T = any>(config: AxiosRequestConfig) => AxiosPromise<T>;
