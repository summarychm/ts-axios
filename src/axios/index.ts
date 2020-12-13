import axios from "./axios";
import CancelTokenClass from "./cancel/CancelToken";

export default axios;
export * from "./types"; // 导出所有类型定义
export let CancelToken = CancelTokenClass;
