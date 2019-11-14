import { Axios, AxiosInterceptorManager, AxiosResponse, ResolvedFn, RejectedFn } from "./../types/index";
// 实现axios接口定义的公共方法
// 包装的方法都调用request方法,统一dispatchRequest,

import { AxiosRequestConfig, AxiosPromise, Method } from "../types";
import InterceptorManager from "./InterceptorManager";
import dispatchRequest from "./dispatchRequest";
import mergeConfig from "./mergeConfig";

/** 拦截器实例集合接口
 */
interface AxiosInterceptors {
	request: AxiosInterceptorManager<AxiosRequestConfig>;
	response: AxiosInterceptorManager<AxiosResponse>;
}

/** 拦截器执行链中单个chain接口
 */
interface AxiosPromiseChain {
	resolved: ResolvedFn;
	rejected?: RejectedFn;
}

/** Axios的原型类,方便AxiosInstance扩展实用方法
 */
export default class implements Axios {
	interceptors: AxiosInterceptors; // 拦截器属性
	defaults: AxiosRequestConfig; // 默认配置属性
	constructor(initConfig: AxiosRequestConfig) {
		this.defaults = initConfig;
		this.interceptors = {
			request: new InterceptorManager<AxiosRequestConfig>(),
			response: new InterceptorManager<AxiosResponse>(),
		};
	}
	/**
	 * axiosRequestAjax
	 * @param config AxiosConfig
	 */
	request(url: any, config?: AxiosRequestConfig): AxiosPromise {
		// 根据传入的参数动态处理config
		// 传入url+config的情况,将url合并到config中
		if (typeof url === "string") {
			if (!config) config = {};
			config.url = url;
		} else config = url; // 只传入config的情况.将url指定为config

		// 合并defaultConfig和userConfig,方便从headers上取值
		config = mergeConfig(this.defaults, config);

		// chain[] 拦截器集合,通过遍历该数组实现一次循环,触发全部拦截器
		// !  执行顺序: request拦截器  -> dispatchRequest  -> response拦截器
		// 将dispatchRequest作为拦截器chain 的初始项,利用while+promise实现链式调用
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

		let promise = Promise.resolve(config); // 将config作为初始param传入chain
		while (chain.length) {
			const { resolved, rejected } = chain.shift(); // 取出第一个chainItem
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

	/** 基于method & url 构建config,调用request
	 * @param method 方法名
	 * @param url 网址
	 * @param config axiosConfig
	 */
	_requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise {
		const newConfig = Object.assign(config || {}, { method, url });
		return this.request(newConfig);
	}
	/** 基于method & url & data构建config,调用request
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
