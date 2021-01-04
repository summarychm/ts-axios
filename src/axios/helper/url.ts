import { AxiosRequestConfig } from "../types";
import { isDate, isPlainObject, isURLSearchParams } from "./util";

const tools = {
	/**
	 *序列化字符串,并保留部分特殊字符( @、:、$、,、空格、[、])
	 * @param val 待序列化的字符串
	 */
	encode: function (val: string): string {
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
	buildParams: function (params: object) {
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
export function buildURL(url: string, params?: object, paramsSerializer?: AxiosRequestConfig["paramsSerializer"]): string {
	if (!params) return url;
	let serializedParams;
	if (paramsSerializer) {
		// 自定义序列化器
		serializedParams = paramsSerializer(params);
	} else if (isURLSearchParams(params)) {
		// params是UrlSearchParams实例
		serializedParams = params.toString();
	} else {
		const parts: string[] = tools.buildParams(params);
		if (!parts.length) return url;

		serializedParams = parts.join("&");
	}
	if (serializedParams) {
		// 删除url锚点 删除#哈希标记
		const markIndex = url.indexOf("#");
		if (markIndex !== -1) {
			let params = ""; // 处理既包含锚点又包含url参数的情况
			if (url.indexOf("?")) {
				params = url.slice(url.indexOf("?"));
			}
			url = url.slice(0, markIndex) + params;
		}
	}
	url += url.includes("?") ? "&" : "?" + serializedParams;
	return url;
}

/*********** XSRF/CSRF相关 begin  ***************/
interface URLOrigin {
	protocol: string;
	host: string;
}

const currentOrigin = resolveURL(window.location.href);

/** 获取当前url的protocol & host(借助于a标签的自动解析)
 * @param url 网址
 */
function resolveURL(url: string): URLOrigin {
	const urlParsingNode = document.createElement("a");
	urlParsingNode.setAttribute("href", url);
	const { protocol, host } = urlParsingNode;
	urlParsingNode.remove();
	return { protocol, host };
}
/** 是否是同域请求(parsedOrigin vs currentOrigin)
 * @param requestURL 请求地址url
 */
export function isURLSameOrigin(requestURL: string): boolean {
	const parsedOrigin = resolveURL(requestURL);
	return parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host;
}
/*********** XSRF/CSRF相关 end  ***************/

/** 是否是绝对地址 */
export function isAbsoluteURL(url: string): boolean {
	return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

/** 整合相对地址与baseURL */
export function combineURL(baseURL: string, relativeURL?: string): string {
	return relativeURL ? `${baseURL.replace(/\/+$/, "")}/${relativeURL.replace(/^\/+/, "")}` : baseURL;
}
