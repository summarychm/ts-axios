// import { CancelStatic } from "../types";
export default class Cancel {
	message?: string;
	constructor(message?: string) {
		this.message = message;
	}
}
/** 判断是否是Cancel类实例
 * @param value
 */
export function isCancel(value: any): boolean {
	return value instanceof Cancel;
}
