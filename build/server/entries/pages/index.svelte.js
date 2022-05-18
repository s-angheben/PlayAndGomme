import { c as create_ssr_component, v as validate_component } from "../../chunks/index-9471c4ee.js";
import { N as Nav } from "../../chunks/Nav-59a3a3aa.js";
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<main>${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})}

    <h1>Home</h1>
    <p>Visit <a href="${"https://kit.svelte.dev"}">kit.sddvelte.dev</a> to read the documentation</p></main>`;
});
export { Routes as default };
