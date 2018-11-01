import m from "mithril";
import stream from "mithril/stream";
import Navigator from "Navigator";

const createPage = (name, authRequired = 0) => ({
	name,
	requireAuth: authRequired,
	view: () => m("h1", name)
});

test("navigator can register and lookup pages", () => {
	const update = stream();
	const navigator = new Navigator(update);
	const Somewhere = createPage("Somewhere");
	const Elsewhere = createPage("Elsewhere");
	navigator.registerPages({
		Somewhere,
		Elsewhere
	});
	expect(navigator.getPage({ pageId: "Somewhere" })).toBe(Somewhere);
	expect(navigator.getPage({ pageId: "Elsewhere" })).toBe(Elsewhere);
});

test("navigator defaults to login when no auth", () => {
	const update = stream();
	const navigator = new Navigator(update);
	const Somewhere = createPage("Somewhere");
	const Login = createPage("Login");
	navigator.registerPages({
		Somewhere,
		Login
	});
	expect(navigator.getCurrentPage({})).toBe(Login);
	expect(navigator.getCurrentPage({ pageId: "Somewhere" })).toBe(Login);
	expect(navigator.getCurrentPage({ auth: 1, pageId: "Somewhere" })).toBe(
		Somewhere
	);
});

test("navigator's navigateTo updates the model appropriately", () => {
	const update = stream({});
	const navigator = new Navigator(update);
	const Somewhere = createPage("Somewhere");
	const Login = createPage("Login");
	navigator.registerPages({
		Somewhere,
		Login
	});
    expect.assertions(3);
	return navigator.navigateTo("Somewhere", {id: 1}).then(model => {
        expect(update()).toBe(model);
		expect(model).toEqual({ pageId: "Somewhere", id: 1 });
		expect(navigator.getCurrentPage(model)).toBe(Login);
	});
});

