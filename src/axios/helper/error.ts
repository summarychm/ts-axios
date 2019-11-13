import { AxiosRequestConfig, AxiosResponse } from "../types";
export class AxiosError extends Error {
	public isAxiosError: boolean;
	public config: AxiosRequestConfig;
	public code?: string | null;
	public request?: any;
	public response?: AxiosResponse;
	public constructor(message: string, config: AxiosRequestConfig, code?: string | null, request?: any, response?: AxiosResponse) {
		super(message);
		this.config = config;
		this.code = code;
		this.request = request;
		this.response = response;
		this.isAxiosError = true;
		// https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
		Object.setPrototypeOf(this, AxiosError.prototype);
	}
}

/** 创建AxiosError的实例
 * @param message 错误信息
 * @param config axiosConfig
 * @param code code
 * @param request request对象
 * @param response response对象
 */
export function createError(message: string, config: AxiosRequestConfig, code?: string | null, request?: any, response?: AxiosResponse): AxiosError {
	return new AxiosError(message, config, code, request, response);
}
