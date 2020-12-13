import { isPlainObject } from "./util";

/** 如果requestData为PlainObject,则将其JSON.stringify
 * 不转换FormData/ArrayBuffer等数据结构
 * @param data requestData
 */
export function transformRequestData(data: any): any {
	if (isPlainObject(data)) return JSON.stringify(data);
	return data;
}

/** 尝试将string类型的responseData转为object(JSON)
 * @param data responseData
 */
export function transformResponseData(data: any) {
	if (typeof data !== "string") return data;
	try {
		if (data.length > 0) data = JSON.parse(data);
	} catch (error) {
		// console.error("transformResponseData Error", error);
	}
	return data;
}
