import { CancelExecutor } from "../types";

type ResolvePromise = (reason?: string) => void;

export default class CancelToken {
	promise: Promise<string>;
	reason?: string;
	// 将cancel传入
	constructor(executor: CancelExecutor) {
		let resolvePromise: ResolvePromise;
		this.promise = new Promise<string>((resolve) => {
			resolvePromise = resolve;
		});

		let cancelFn = (message) => {
			if (this.reason) return;
			this.reason = message;
			resolvePromise(this.reason);
		};
		// 用户传入的执行器函数,将"更改promise状态的函数"作为参数传入
		executor(cancelFn);
	}
}
