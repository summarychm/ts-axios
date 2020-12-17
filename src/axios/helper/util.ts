const toString = Object.prototype.toString;

export function isDate(val: any): val is Date {
	return toString.call(val) === "[object Date]";
}

export function isPlainObject(val: any): val is Object {
	return toString.call(val) === "[object Object]";
}

export function isFormData(val: any): val is FormData {
	return typeof val !== "undefined" && val instanceof FormData;
}

/** 将form自身及其原型上的属性和方法拷贝到to上
 * @param to 接收方
 * @param form 发送方
 */
export function extend<T, U>(to: T, form: U): T & U {
	for (const key in form) {
		to[key.toString()] = form[key];
	}
	return to as T & U;
}

/** 递归合并所传对象
 * @param obj 待合并对象集合
 */
export function deepMerge(...obj: any[]): object {
	const result = Object.create(null);
	obj.forEach((obj) => {
		if (!obj) return;
		Object.keys(obj).forEach((key) => {
			const val = obj[key];
			// 如果val是纯对象,则深度合并
			if (isPlainObject(val)) {
				// 如果result中已经存在该key,则深度合并result[key]和val
				if (isPlainObject(result[key])) {
					result[key] = deepMerge(result[key], val);
				} else result[key] = deepMerge({}, val);
			} else result[key] = val; // 如果val不为纯对象,则直接赋值
		});
	});
	return result;
}
