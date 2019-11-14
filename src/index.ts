import qs from "qs";
import axios, { AxiosError, AxiosTransformer } from "./axios/index";

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
axiosCreateTest();

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
}

function errorBaseTest() {
	axios({
		method: "get",
		url: "/error/get1",
	})
		.then((res) => {
			console.log(res);
		})
		.catch((e) => {
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
			function(data) {
				return qs.stringify(data);
			},
			...(axios.defaults.transformRequest as AxiosTransformer[]),
		],
		transformResponse: [
			...(axios.defaults.transformResponse as AxiosTransformer[]),
			function(data) {
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
			function(data) {
				return qs.stringify(data);
			},
			...(axios.defaults.transformRequest as AxiosTransformer[]),
		],
		transformResponse: [
			...(axios.defaults.transformResponse as AxiosTransformer[]),
			function(data) {
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
