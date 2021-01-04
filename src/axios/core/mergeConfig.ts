import { AxiosRequestConfig } from "../types";
import { isPlainObject, deepMerge } from "../helper/util";

let strats = {}; // 合并规则集合
/** 合并策略1(默认): 优先取用val2
 * @param val1
 * @param val2
 */
function defaultStrat(val1: any, val2: any): any {
	return typeof val2 !== "undefined" ? val2 : val1;
}

/** 合并策略2: 只取val2
 * @param val1
 * @param val2
 */
function fromVal2Strat(val1: any, val2: any): any {
	if (typeof val2 !== "undefined") return val2;
}

/** 合并策略3: 复杂对象合并
 * @param val1
 * @param val2
 */
function deepMergeStrat(val1: any, val2: any): any {
	// val2纯对象,深拷贝
	if (isPlainObject(val2)) return deepMerge(val1, val2);
	// val2为特殊对象,直接保留val2
	else if (typeof val2 !== "undefined") return val2;
	// val2为空,且val1为纯对象,深拷贝val1
	else if (isPlainObject(val1)) return deepMerge(val1);
	// val2为空,val1为特殊对象,直接保留val1
	else if (typeof val1 !== "undefined") return val1;
}

const stratKeyFromVal2 = ["url", "params", "data"]; // 指定使用策略2的key
stratKeyFromVal2.forEach((key) => {
	strats[key] = fromVal2Strat;
});

const stratKeyDeepMerge = ["headers", "auth"]; // 指定需要使用策略3的key
stratKeyDeepMerge.forEach((key) => {
	strats[key] = deepMergeStrat;
});

/** 合并axios的配置
 * @param config1 默认配置
 * @param config2 自定义配置
 */
export default function mergeConfig(config1: AxiosRequestConfig, config2: AxiosRequestConfig = {}): AxiosRequestConfig {
	const config: object = Object.create(null);
	// 1. 先合并config2
	for (const key in config2) {
		mergeField(key);
	}
	// 2. 再合并config1(如果config2中不存在则使用config1中的默认配置)
	for (const key in config1) {
		if (!config2[key]) mergeField(key);
	}

	/**
	 * 合并指定属性
	 * @param key 属性名
	 */
	function mergeField(key: string): void {
		const stratFn = strats[key] || defaultStrat; //! 根据key获取对应的合并策略(策略模式)
		config[key] = stratFn(config1[key], config2[key]);
	}

	return config;
}
