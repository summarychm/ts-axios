import { AxiosRequestConfig } from "./types";
export function xhr(config: AxiosRequestConfig) {
	const { data = null, url, method } = config;
	const request = new XMLHttpRequest();
	request.open(method.toUpperCase(), url, true);
	request.send(data);
}
