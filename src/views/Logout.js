// src/views/Logout.js

export default (navigator, update) => ({
	view: () => {
		const user = new User();
		user.logout().then(() => {
			update(O);
			navigator.navigateTo({ pageId: "Login" });
		});
	}
});
