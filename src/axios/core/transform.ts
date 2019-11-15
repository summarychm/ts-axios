import { AxiosTransformer } from "../types";

/** 转换请求/响应的transformFn
 * @param data request.data
 * @param headers request.headers
 * @param fns 转换函数ary
 */
export default function transform(data: any, headers: any, fns?: AxiosTransformer | AxiosTransformer[]): any {
	if (!fns) return data;
	if (!Array.isArray(fns)) fns = [fns];
	fns.forEach((fn) => {
		data = fn(data, headers);
	});
	return data;
}
