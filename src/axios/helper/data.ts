import { isPlainObject } from "./util";

export function transformRequestData(data: any): any {
	// 只转换纯Object对象,不转换FornData/ArrayBuffer等数据结构
	if (isPlainObject(data)) return JSON.stringify(data);
	return data;
}
