import { Axios, AxiosInterceptorManager, AxiosResponse, ResolvedFn, RejectedFn } from "./../types/index";
// 实现axios接口定义的公共方法
// 包装的方法都调用request方法,统一dispatchRequest,

import { AxiosRequestConfig, AxiosPromise, Method } from "../types";
import InterceptorManager from "./InterceptorManager";
import dispatchRequest from "./dispatchRequest";

/**
 * 拦截器实例集合接口
 */
interface AxiosInterceptors {
	request: AxiosInterceptorManager<AxiosRequestConfig>;
	response: AxiosInterceptorManager<AxiosResponse>;
}

/**
 * 拦截器执行链中单个chain接口
 */
interface AxiosPromiseChain {
	resolved: ResolvedFn;
	rejected?: RejectedFn;
}

/**
 * Axios的原型类,方便AxiosInstance扩展实用方法
 */
export default class implements Axios {
	interceptors: AxiosInterceptors;
	constructor() {
		// axios实例化时创建拦截器集合
		this.interceptors = {
			request: new InterceptorManager<AxiosRequestConfig>(),
			response: new InterceptorManager<AxiosResponse>(),
		};
	}
	request(config: AxiosRequestConfig): AxiosPromise {
		// 使用数组存储拦截器chain,通过遍历该数组实现以下的执行顺序
		// !  执行顺序: request拦截器  -> dispatchRequest  -> response拦截器

		// 将dispatchRequest作为拦截器chain的初始项
		const chain: AxiosPromiseChain[] = [
			{
				resolved: dispatchRequest,
				rejected: undefined,
			},
		];

		// request拦截器,应为堆栈结构,所以使用unshift来模拟
		this.interceptors.request.forEach((interceptor) => chain.unshift(interceptor));
		// request拦截器,应为队列结构,所以直接使用push来模拟
		this.interceptors.response.forEach((interceptor) => chain.push(interceptor));
		let promise = Promise.resolve(config); // 将config作为param传入chain
		while (chain.length) {
			const { resolved, rejected } = chain.shift();
			promise = promise.then(resolved, rejected); // 遍历
		}
		return promise as AxiosPromise;
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
