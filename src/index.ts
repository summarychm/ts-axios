import qs from "qs";
import axios, { AxiosError, AxiosTransformer, Canceler } from "./axios/index";
import "nprogress/nprogress.css";
import NProgress from "nprogress";

console.log("---axios test begin--");

// paramsTest();
// dataTest();
// headersTest();
// responseDataTest();
// errorBaseTest();
// errorEnhancerTest();
// axiosInstanceTest();
// interceptorTest();
// configTest();
// transformReqResTest();
// axiosCreateTest();
// cancelTokenTest();
// withCredentialsTest();
xsrfTest();
uploadTest();

function paramsTest() {
	axios({
		method: "get",
		url: "/base/get",
		params: {
			foo: ["bar", "baz"],
		},
	});

	axios({
		method: "get",
		url: "/base/get",
		params: {
			foo: {
				bar: "baz",
			},
		},
	});

	const date = new Date();

	axios({
		method: "get",
		url: "/base/get",
		params: {
			date,
		},
	});

	axios({
		method: "get",
		url: "/base/get",
		params: {
			foo: "@:$, ",
		},
	});

	axios({
		method: "get",
		url: "/base/get",
		params: {
			foo: "bar",
			baz: null,
		},
	});

	axios({
		method: "get",
		url: "/base/get#hash",
		params: {
			foo: "bar",
		},
	});

	axios({
		method: "get",
		url: "/base/get?foo=bar",
		params: {
			bar: "baz",
		},
	});
}

function dataTest() {
	axios({
		method: "post",
		url: "/base/post",
		data: {
			a: 1,
			b: 2,
		},
	});

	const arr = new Int32Array([21, 31]);

	axios({
		method: "post",
		url: "/base/buffer",
		data: arr,
	});
}

function headersTest() {
	axios({
		method: "post",
		url: "/base/post",
		data: {
			a: 1,
			b: 2,
		},
	});
	axios({
		method: "post",
		url: "/base/post",
		headers: {
			"content-type": "application/json;charset=utf-8",
		},
		data: {
			a: 1,
			b: 2,
		},
	});

	const paramsString = "q=URLUtils.searchParams&topic=api";
	const searchParams = new URLSearchParams(paramsString);

	axios({
		method: "post",
		url: "/base/post",
		data: searchParams,
	});
}

function responseDataTest() {
	axios({
		method: "post",
		url: "/base/post",
		data: {
			a: 1,
			b: 2,
		},
	}).then((res) => {
		console.log(res);
	});

	axios({
		method: "post",
		url: "/base/post",
		responseType: "json",
		data: {
			a: 3,
			b: 4,
		},
	}).then((res) => {
		console.log(res);
	});

	/******* 相应数据支持泛型测试 begin ********/
	interface ResponseData<T> {
		result: T;
		message: string;
		code: number;
	}
	interface User {
		name: string;
		age: number;
	}
	function getUser<T>() {
		return axios<ResponseData<T>>("/extend/user")
			.then((res) => res.data)
			.catch((e) => {
				console.error(e);
			});
	}
	(async function () {
		let user = await getUser<User>();
		if (user) {
			console.log("user.result.age", user.result.age);
		}
	})();
	/******* 相应数据支持泛型测试 end ********/
}

function errorBaseTest() {
	axios({
		method: "get",
		url: "/error/get1",
	})
		.then((res) => {
			console.log(res);
		})
		.catch((e: AxiosError) => {
			console.log(e);
		});

	axios({
		method: "get",
		url: "/error/get",
	})
		.then((res) => {
			console.log(res);
		})
		.catch((e) => {
			console.log(e);
		});

	setTimeout(() => {
		axios({
			method: "get",
			url: "/error/get",
		})
			.then((res) => {
				console.log(res);
			})
			.catch((e) => {
				console.log(e);
			});
	}, 5000);

	axios({
		method: "get",
		url: "/error/timeout",
		timeout: 2000,
	})
		.then((res) => {
			console.log(res);
		})
		.catch((e) => {
			console.log(e.message);
		});
}
function errorEnhancerTest() {
	axios({
		method: "get",
		url: "/error/timeout",
		timeout: 2000,
	})
		.then((res) => {
			console.log(res);
		})
		.catch((e: AxiosError) => {
			console.log(e.message);
			console.log(e.code);
		});
}
function axiosInstanceTest() {
	// 常规调用
	axios({
		url: "/extend/post",
		method: "post",
		data: {
			msg: "hi",
		},
	});
	// 通过axios.request调用
	axios.request({
		url: "/extend/post",
		method: "post",
		data: {
			msg: "hello",
		},
	});
	// 通过工具方法调用
	axios.get("/extend/get");

	axios.options("/extend/options");

	axios.delete("/extend/delete");

	axios.head("/extend/head");

	axios.post("/extend/post", { msg: "post" });

	axios.put("/extend/put", { msg: "put" });

	axios.patch("/extend/patch", { msg: "patch" });
}
function interceptorTest() {
	axios.interceptors.request.use((config) => {
		config.headers.test += "1";
		return config;
	});
	axios.interceptors.request.use((config) => {
		config.headers.test += "2";
		return config;
	});
	axios.interceptors.request.use((config) => {
		config.headers.test = "3";
		return config;
	});

	axios.interceptors.response.use((res) => {
		res.data += "1";
		return res;
	});
	let interceptor = axios.interceptors.response.use((res) => {
		res.data += "2";
		return res;
	});
	axios.interceptors.response.use((res) => {
		res.data += "3";
		return res;
	});

	axios.interceptors.response.eject(interceptor);
	axios({
		url: "/interceptor/get",
		method: "get",
		headers: {
			test: "",
		},
	}).then((res) => {
		console.log(res.data);
	});
}
function configTest() {
	axios.defaults.headers.common["test2"] = 123;

	axios({
		url: "/config/post",
		method: "post",
		data: qs.stringify({
			a: 1,
		}),
		headers: {
			test: "321",
		},
	}).then((res) => {
		console.log(res.data);
	});
}

function transformReqResTest() {
	axios({
		transformRequest: [
			function (data) {
				return qs.stringify(data);
			},
			...(axios.defaults.transformRequest as AxiosTransformer[]),
		],
		transformResponse: [
			...(axios.defaults.transformResponse as AxiosTransformer[]),
			function (data) {
				if (typeof data === "object") {
					data.b = 2;
				}
				return data;
			},
		],
		url: "/config/post",
		method: "post",
		data: {
			a: 1,
		},
	}).then((res) => {
		console.log(res.data);
	});
}
function axiosCreateTest() {
	const instance = axios.create({
		transformRequest: [
			function (data) {
				return qs.stringify(data);
			},
			...(axios.defaults.transformRequest as AxiosTransformer[]),
		],
		transformResponse: [
			...(axios.defaults.transformResponse as AxiosTransformer[]),
			function (data) {
				if (typeof data === "object") {
					data.b = 2;
				}
				return data;
			},
		],
	});
	instance({
		url: "/config/post",
		method: "post",
		data: {
			a: 1,
		},
	}).then((res) => {
		console.log(res.data);
	});
}

function cancelTokenTest() {
	// 方法一 source.cancel
	const CancelToken = axios.CancelToken;
	const source = CancelToken.source();
	axios
		.get("/cancel/get", {
			cancelToken: source.token,
		})
		.catch(function (e) {
			if (axios.isCancel(e)) {
				console.log("Request canceled", e.message);
			}
		});

	setTimeout(() => {
		source.cancel("Operation canceled by the user.");
		axios.post("/cancel/post", { a: 1 }, { cancelToken: source.token }).catch(function (e) {
			if (axios.isCancel(e)) console.log("isCancel", e.message);
		});
	}, 100);

	// 方法二 new CancelToken
	let cancel: Canceler;
	axios
		.get("/cancel/get", {
			cancelToken: new CancelToken((cancelFn) => {
				cancel = cancelFn;
			}),
		})
		.catch(function (e) {
			if (axios.isCancel(e)) {
				console.log("Request canceled", e);
			}
		});

	setTimeout(() => {
		cancel("测试取消");
	}, 200);
}
function withCredentialsTest() {
	document.cookie = "a=b";

	axios.get("/more/get").then((res) => {
		console.log(res);
	});

	axios
		.post(
			"http://127.0.0.1:8088/more/server2",
			{},
			{
				withCredentials: true,
			},
		)
		.then((res) => {
			console.log(res);
		});
}

function xsrfTest() {
	const instance = axios.create({
		xsrfCookieName: "XSRF-TOKEN-D",
		xsrfHeaderName: "X-XSRF-TOKEN-D",
	});

	instance.get("/more/xsrf").then((res) => {
		console.log("该请求携带了xsrfToken,该实例的后续请求都会自动携带该token,可查看requestHeader", res);
	});
	instance.get("/base/get").then((res) => {
		console.log("查看requestHeader", res);
	});
	axios({
		method: "get",
		url: "/base/get",
		params: {
			foo: ["bar", "baz"],
		},
	}).then((res) => {
		console.log("没有设置xsrf头的请求,在requestHeader中就没有携带对应的token", res);
	});
}

function uploadTest() {
	const instance = axios.create();
	function calculatePercentage(loaded: number, total: number) {
		return Math.floor(Number(loaded)) / total;
	}

	function loadProgressBar() {
		const setupStartProgress = () => {
			instance.interceptors.request.use((config) => {
				NProgress.start();
				return config;
			});
		};
		const setupUpdateProgress = () => {
			const update = (e: ProgressEvent) => {
				console.log(e);
				NProgress.set(calculatePercentage(e.loaded, e.total));
			};
			instance.defaults.onDownloadProgress = update;
			instance.defaults.onUploadProgress = update;
		};
		const setupStopProgress = () => {
			instance.interceptors.response.use(
				(response) => {
					NProgress.done();
					return response;
				},
				(error) => {
					NProgress.done();
					return Promise.reject(error);
				},
			);
		};

		setupStartProgress();
		setupUpdateProgress();
		setupStopProgress();
	}

	loadProgressBar();

	const downloadEl = document.getElementById("download");

	downloadEl &&
		downloadEl.addEventListener("click", (e) => {
			instance.get("https://img.mukewang.com/5cc01a7b0001a33718720632.jpg");
		});

	const uploadEl = document.getElementById("upload");

	uploadEl &&
		uploadEl.addEventListener("click", (e) => {
			const data = new FormData();
			const fileEl = document.getElementById("file") as HTMLInputElement;
			if (fileEl.files) {
				data.append("file", fileEl.files[0]);
				instance.post("/more/upload", data);
			}
		});
}
