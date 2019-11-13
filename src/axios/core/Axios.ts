import { Axios } from "./../types/index";
// 实现axios接口定义的公共方法
// 包装的方法都调用request方法,统一dispatchRequest,

import { AxiosRequestConfig, AxiosPromise, Method } from "../types";
import dispatchRequest from "./dispatchRequest";

/**
 * Axios的原型类,方便AxiosInstance扩展实用方法
 */
export class AxiosPublicFnClass implements Axios {
	request(config: AxiosRequestConfig): AxiosPromise {
		return dispatchRequest(config);
	}
	get(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData("get", url, config);
	}
	delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData("delete", url, config);
	}
	head(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData("head", url, config);
	}
	options(url: string, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithoutData("options", url, config);
	}
	post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithData("post", url, data, config);
	}
	put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithData("put", url, data, config);
	}
	patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
		return this._requestMethodWithData("patch", url, data, config);
	}

	/**
	 * 基于method & url 构建config,调用request
	 * @param method 方法名
	 * @param url 网址
	 * @param config axiosConfig
	 */
	_requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise {
		const newConfig = Object.assign(config || {}, { method, url });
		return this.request(newConfig);
	}
	/**
	 * 基于method & url & data构建config,调用request
	 * @param method 要调用的Method
	 * @param url url
	 * @param data requestData
	 * @param config axiosConfig
	 */
	_requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
		const newConfig = Object.assign(config || {}, { method, url, data });
		return this.request(newConfig);
	}
}
