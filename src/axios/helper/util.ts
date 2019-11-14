const toString = Object.prototype.toString;

export function isDate(val: any): val is Date {
	return toString.call(val) === "[object Date]";
}

export function isPlainObject(val: any): val is Object {
	return toString.call(val) === "[object Object]";
}

/** 将form自身及其原型上的属性和方法拷贝到to上
 * @param to 接收方
 * @param form 发送发
 */
export function extend<T, U>(to: T, form: U): T & U {
	for (const key in form) {
		to[key as string] = form[key];
	}
	return to as T & U;
}
