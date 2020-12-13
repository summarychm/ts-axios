import axios from "./axios";
import CancelTokenClass from "./cancel/CancelToken";

export default axios;
export * from "./types";
export let CancelToken = CancelTokenClass;
