export { matchers } from './client-matchers.js';

export const components = [
	() => import("../runtime/components/layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/index.svelte"),
	() => import("../../src/routes/manageAppointments.svelte"),
	() => import("../../src/routes/test.svelte")
];

export const dictionary = {
	"": [[0, 2], [1]],
	"manageAppointments": [[0, 3], [1]],
	"test": [[0, 4], [1]]
};