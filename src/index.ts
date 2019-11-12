import axios from "./axios/index";

console.log("---begin--");

// paramsTest();
// dataTest();
headersTest();

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
