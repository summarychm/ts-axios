import { isPlainObject } from "./util";

/**
 * 如果requestData为PlainObject,则将其JSON.stringify
 * 不转换FormData/ArrayBuffer等数据结构
 * @param data requestData
 */
export function transformRequestData(data: any): any {
	if (isPlainObject(data)) return JSON.stringify(data);
	return data;
}
