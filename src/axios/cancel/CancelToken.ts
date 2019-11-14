import { CancelExecutor, AxiosCancelToken } from "../types";

type ResolvePromise = (reason?: string) => void;

export default class CancelToken implements AxiosCancelToken {
	promise: Promise<string>;
	reason?: string;

	/**
	 * CancelToken类,内部利用闭包缓存promiseResolve方法,供executor函数使用
	 * @param executor Cancel执行器函数,接收changePromiseStateFn
	 */
	constructor(executor: CancelExecutor) {
		let resolvePromise: ResolvePromise;
		this.promise = new Promise<string>((resolve) => {
			resolvePromise = resolve;
		});

		let cancelFn = (message) => {
			if (this.reason) return;
			this.reason = message;
			resolvePromise(this.reason); // 通过resolve触发xhr的then回调,从而调用xhr.abort()
		};
		// 用户传入的执行器函数,将"更改promise状态的函数"作为参数传入
		executor(cancelFn);
	}
}
