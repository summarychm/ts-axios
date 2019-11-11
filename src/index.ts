import axios from "axios";

console.log("111");

axios({
	method: "get",
	url: "/api/user",
	params: {
		a: 1,
		b: 2,
	},
});
