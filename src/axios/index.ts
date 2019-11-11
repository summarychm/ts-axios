import { AxiosRequestConfig } from "./types/index";
import { xhr } from "./xhr";

// function createInstance(): AxiosInterface {
// 	const instance = new Axios();
// 	return instance;
// }
// const axios = createInstance();

function axios(config: AxiosRequestConfig) {
	xhr(config);
}
export default axios;
