import Cancel from "../cancel/Cancel"; // CancelMessage类
import { Canceler, CancelExecutor, CancelTokenInstance, CancelTokenSource } from "../types";

// 中心思想,利用Promise实现异步分离
// 在xhr中注册cancelTokenInstance.promise的then回调
// 通过更改cancelTokenInstance.promise的状态,进而触发xhr.about

// 该resolve用于触发xhr.about
type ResolvePromise = (reason?: Cancel) => void;

export default class CancelToken implements CancelTokenInstance {
	/** 静态source方法,cancelToken的另一种方式 */
	static source(): CancelTokenSource {
		let cancel: Canceler; // cancel取消方法,可以借由promise实现xhr.abort()
		const token = new CancelToken((c) => {
			cancel = c;
		});
		return {
			cancel,
			token,
		};
	}
	promise: Promise<Cancel>; // 用于取消xhr的Promise实例
	reason?: Cancel; // 取消原因
	/** 构造函数,将包含resolve的executor暴露给调用者
	 * @param executor Cancel执行器函数,接收changePromiseStateFn
	 */
	constructor(executor: CancelExecutor) {
		let resolveFn: ResolvePromise;
		// 构建用于取消xhr的promise并使用变量缓存其中的resolve方法
		this.promise = new Promise<Cancel>((resolve) => {
			resolveFn = resolve;
		});

		// 执行调用者的executorFn,将包含resolveFn的cancel函数传出,供用户调用
		executor((cancelMessage: string) => {
			if (this.reason) return; // 防止多次调用取消函数
			this.reason = new Cancel(cancelMessage);
			// 通过resolve更改自身用于取消xhr的Promise状态,进而触发xhr中的then回调,进而调用xhr.abort
			resolveFn(this.reason);
		});
	}

	/** 对于已取消的请求直接抛出原错误信息 */
	throwIfRequested(): void {
		if (this.reason) throw this.reason;
	}
}
