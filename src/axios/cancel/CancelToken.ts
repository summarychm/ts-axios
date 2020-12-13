import { Canceler, CancelInstance } from "./../types/index";
import { CancelExecutor, CancelTokenInstance, CancelTokenSource } from "../types";
import Cancel from "../cancel/Cancel";

type ResolvePromise = (reason?: CancelInstance) => void;

export default class CancelToken implements CancelTokenInstance {
	/** 静态source方法,cancelToken的一种方式 */
	static source(): CancelTokenSource {
		let cancel: Canceler; // cancel取消方法
		// CancelToken{ token,cancel } cancel属性可以借由promise实现xhr.abort()
		const token = new CancelToken((c) => {
			cancel = c;
		});
		return {
			cancel,
			token,
		};
	}
	promise: Promise<CancelInstance>;
	reason?: CancelInstance;
	/**
	 * CancelToken类,内部利用闭包缓存promiseResolve方法,供executor函数使用
	 * @param executor Cancel执行器函数,接收changePromiseStateFn
	 */
	constructor(executor: CancelExecutor) {
		let resolvePromise: ResolvePromise;
		this.promise = new Promise<CancelInstance>((resolve) => {
			resolvePromise = resolve;
		});

		let cancelFn = (message: string) => {
			if (this.reason) return;
			this.reason = new Cancel(message);
			resolvePromise(this.reason); // 通过resolve触发xhr的then回调,从而调用xhr.abort
		};
		// 用户传入的执行器函数,将"更改promise状态的函数"作为参数传入
		executor(cancelFn);
	}
	throwIfRequested(): void {
		if (this.reason) {
			throw this.reason;
		}
	}
}
