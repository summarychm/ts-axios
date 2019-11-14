import axios from "./axios";
import CancelToken from "./cancel/CancelToken";

export default axios;
export * from "./types";
export let Cancel = CancelToken;
