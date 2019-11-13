import { isDate, isPlainObject } from "./util";

const tools = {
	/**
	 *序列化字符串,并保留部分特殊字符( @、:、$、,、空格、[、])
	 * @param val 待序列化的字符串
	 */
	encode: function(val: string): string {
		return encodeURIComponent(val)
			.replace(/%40/g, "@")
			.replace(/%3A/gi, ":")
			.replace(/%24/g, "$")
			.replace(/%2C/gi, ",")
			.replace(/%20/g, "+")
			.replace(/%5B/gi, "[")
			.replace(/%5D/gi, "]");
	},
	/**
	 * 序列化参数集合,处理各种边界情况
	 * @param params 待参数集合
	 */
	buildParams: function(params: object) {
		let parts: string[] = [];
		for (let [key, val] of Object.entries(params)) {
			// 空值忽略 删除value为null的键值对
			if (val === null || typeof val === "undefined") continue;
			let values: string[];
			// value为数组 {foo: ['bar', 'baz']} => ?foo[]=bar&foo[]=baz'
			if (Array.isArray(val)) {
				values = val;
				key += "[]";
			} else values = [val];
			values.forEach((val) => {
				// 参数为Date类型 date.toISOString()
				if (isDate(val)) val = val.toISOString();
				// 参数为对象 /base/get?foo=%7B%22bar%22:%22baz%22%7D
				else if (isPlainObject(val)) val = JSON.stringify(val);
				parts.push(`${tools.encode(key)}=${tools.encode(val)}`);
			});
		}
		return parts;
	},
};

/** 将请求参数合并到url中
 * @param url url地址
 * @param params 请求参数集合
 */
export function buildURL(url: string, params?: object): string {
	// 保留URL中已存在的参数
	if (!params) return url;

	const parts: string[] = tools.buildParams(params);
	if (!parts.length) return url;

	// 删除url锚点 删除#哈希标记
	const markIndex = url.indexOf("#");
	if (markIndex !== -1) url = url.slice(0, markIndex);

	url += url.includes("?") ? "&" : "?" + parts.join("&");
	return url;
}
