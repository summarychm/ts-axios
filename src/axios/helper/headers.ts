import { isPlainObject } from "./util";

function normalizeHeaderName(headers: object = {}, normalizedName: string) {
	if (!headers) return;
	const UpperCaseKey = normalizedName.toUpperCase();
	for (const [key, val] of Object.entries(headers)) {
		if (key !== normalizedName && key.toUpperCase() === UpperCaseKey) {
			headers[normalizedName] = val;
			delete headers[key];
		}
	}
}

/** 规范化RequestHeaders
 * @param headers requestHeader
 * @param data requestData
 */
export function transformRequestHeaders(headers: object = {}, data: any): object {
	headers = autoSetContextType(headers, data);
	return headers;
}

/** 如果data是plainObject且header未设置contextType,则补全contextType为json
 * @param headers requestHeaders
 * @param data requestData
 */
function autoSetContextType(headers: object, data: any): object {
	const contextType = "Content-Type";
	normalizeHeaderName(headers, contextType);
	if (isPlainObject(data)) {
		if (!headers[contextType]) headers[contextType] = "application/json;charset=utf-8";
	}
	return headers;
}
/** 将headers字符串转为对象
 * @param headers responseHeaderStr
 */
export function parseHeaders(headers: string): object {
	let parsed = Object.create(null);
	if (!headers) return parsed;
	headers.split("\r\n").forEach((str) => {
		let [key, val] = str.split(":");
		key = key.trim().toLowerCase();
		if (!key) return;
		if (val) parsed[key] = val.trim();
	});
	return parsed;
}
