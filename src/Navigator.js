// src/Navigator.js

import O from "patchinko/constant";

export default update => {
	const pages = {};
	const registerPages = newPages => O(pages, newPages);

	const getCurrentPage = model => {
		// if we don't have auth return the Login page
		if (!model.auth) return getPage({ pageId: "Login" });

		const page = getPage(model);
		if (page) return page;
	};

	const getPage = model => pages[model.pageId];

	const navigateTo = (pageId, params) => {
		const page = getPage({ pageId });

		const navigate = Promise.resolve(O({ pageId }, params));

		if (page && page.navigate) navigate.then(page.navigate);

		navigate.then(update);

		return navigate;
	};

	return {
		getPage,
		getCurrentPage,
		navigateTo,
		registerPages
	};
};
