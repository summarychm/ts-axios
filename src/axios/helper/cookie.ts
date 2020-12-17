const cookie = {
	/**
	 * 读取指定name的cookie(通过正则分组获取指定name的cookie)
	 * @param name cookieName
	 */
	read(name: string): string | null {
		const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
		return match ? decodeURIComponent(match[3]) : null;
	},
};
export default cookie;
