import { AxiosRequestConfig } from "../types";
import { isPlainObject, deepMerge } from "../helper/util";

let strats = {}; // 合并规则集合
/** 合并策略(默认): val2 ? val2: val1
 * @param val1
 * @param val2
 */
function defaultStrat(val1: any, val2: any): any {
	return typeof val2 !== "undefined" ? val2 : val1;
}

/** 合并策略: val2 && val2
 * @param val1
 * @param val2
 */
function fromVal2Strat(val1: any, val2: any) {
	if (typeof val2 !== "undefined") return val2;
}
const stratKeyFromVal2 = ["url", "params", "data"];
stratKeyFromVal2.forEach((key) => {
	strats[key] = fromVal2Strat;
});

/** 合并策略: 复杂对象合并
 * @param val1
 * @param val2
 */
function deepMergeStrat(val1: any, val2: any): any {
	// 纯对象:递归深度合并
	if (isPlainObject(val2)) return deepMerge(val1, val2);
	// val2为特殊对象的情况
	else if (typeof val2 !== "undefined") return val2;
	// 只传递val1的情况且val1为纯对象,采用val1
	else if (isPlainObject(val1)) return deepMerge(val1);
	// val1为特殊对象
	else if (typeof val1 !== "undefined") return val1;
}
const stratKeyDeepMerge = ["headers"];
stratKeyDeepMerge.forEach((key) => {
	strats[key] = deepMergeStrat;
});

/** 合并axios的配置
 * @param config1 默认配置
 * @param config2 自定义配置
 */
export default function mergeConfig(config1: AxiosRequestConfig, config2: AxiosRequestConfig = {}): AxiosRequestConfig {
	const config: object = Object.create(null);
	// 优先合并config2
	for (const key in config2) {
		mergeField(key);
	}
	// 再合并config1,如果config2中不存在则使用config1中的默认配置
	for (const key in config1) {
		if (!config2[key]) mergeField(key);
	}

	/**
	 * 合并指定属性
	 * @param key 属性名
	 */
	function mergeField(key: string): void {
		const stratFn = strats[key] || defaultStrat; // 获取key对应的合并策略
		config[key] = stratFn(config1[key], config2[key]);
	}

	return config;
}
