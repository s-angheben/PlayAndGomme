import { c as create_ssr_component, a as createEventDispatcher, e as escape, n as null_to_empty, b as each, d as add_attribute, v as validate_component, m as missing_component, g as globals } from "../../chunks/index-9471c4ee.js";
var SvelteTable_svelte_svelte_type_style_lang = "";
const { Object: Object_1 } = globals;
const css = {
  code: "table.svelte-dsaf7t.svelte-dsaf7t{width:100%}.isSortable.svelte-dsaf7t.svelte-dsaf7t{cursor:pointer}.isClickable.svelte-dsaf7t.svelte-dsaf7t{cursor:pointer}tr.svelte-dsaf7t th select.svelte-dsaf7t{width:100%}",
  map: null
};
const SvelteTable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let colspan;
  let { columns } = $$props;
  let { rows } = $$props;
  let { c_rows } = $$props;
  let { sortOrders = [1, -1] } = $$props;
  let { sortBy = "" } = $$props;
  let { sortOrder = (sortOrders == null ? void 0 : sortOrders[0]) || 1 } = $$props;
  let { filterSelections = {} } = $$props;
  let { expanded = [] } = $$props;
  let { expandRowKey = null } = $$props;
  let { expandSingle = false } = $$props;
  let { iconAsc = "\u25B2" } = $$props;
  let { iconDesc = "\u25BC" } = $$props;
  let { iconSortable = "" } = $$props;
  let { iconExpand = "\u25BC" } = $$props;
  let { iconExpanded = "\u25B2" } = $$props;
  let { showExpandIcon = false } = $$props;
  let { classNameTable = "" } = $$props;
  let { classNameThead = "" } = $$props;
  let { classNameTbody = "" } = $$props;
  let { classNameSelect = "" } = $$props;
  let { classNameInput = "" } = $$props;
  let { classNameRow = "" } = $$props;
  let { classNameCell = "" } = $$props;
  let { classNameRowExpanded = "" } = $$props;
  let { classNameExpandedContent = "" } = $$props;
  let { classNameCellExpand = "" } = $$props;
  createEventDispatcher();
  let sortFunction = () => "";
  if (!Array.isArray(expanded))
    throw "'expanded' needs to be an array";
  let showFilterHeader = columns.some((c) => {
    return c.filterOptions !== void 0 || c.searchValue !== void 0;
  });
  let filterValues = {};
  let columnByKey;
  const asStringArray = (v) => [].concat(v).filter((v2) => typeof v2 === "string" && v2 !== "").join(" ");
  const calculateFilterValues = () => {
    filterValues = {};
    columns.forEach((c) => {
      if (typeof c.filterOptions === "function") {
        filterValues[c.key] = c.filterOptions(rows);
      } else if (Array.isArray(c.filterOptions)) {
        filterValues[c.key] = c.filterOptions.map((val) => ({ name: val, value: val }));
      }
    });
  };
  if ($$props.columns === void 0 && $$bindings.columns && columns !== void 0)
    $$bindings.columns(columns);
  if ($$props.rows === void 0 && $$bindings.rows && rows !== void 0)
    $$bindings.rows(rows);
  if ($$props.c_rows === void 0 && $$bindings.c_rows && c_rows !== void 0)
    $$bindings.c_rows(c_rows);
  if ($$props.sortOrders === void 0 && $$bindings.sortOrders && sortOrders !== void 0)
    $$bindings.sortOrders(sortOrders);
  if ($$props.sortBy === void 0 && $$bindings.sortBy && sortBy !== void 0)
    $$bindings.sortBy(sortBy);
  if ($$props.sortOrder === void 0 && $$bindings.sortOrder && sortOrder !== void 0)
    $$bindings.sortOrder(sortOrder);
  if ($$props.filterSelections === void 0 && $$bindings.filterSelections && filterSelections !== void 0)
    $$bindings.filterSelections(filterSelections);
  if ($$props.expanded === void 0 && $$bindings.expanded && expanded !== void 0)
    $$bindings.expanded(expanded);
  if ($$props.expandRowKey === void 0 && $$bindings.expandRowKey && expandRowKey !== void 0)
    $$bindings.expandRowKey(expandRowKey);
  if ($$props.expandSingle === void 0 && $$bindings.expandSingle && expandSingle !== void 0)
    $$bindings.expandSingle(expandSingle);
  if ($$props.iconAsc === void 0 && $$bindings.iconAsc && iconAsc !== void 0)
    $$bindings.iconAsc(iconAsc);
  if ($$props.iconDesc === void 0 && $$bindings.iconDesc && iconDesc !== void 0)
    $$bindings.iconDesc(iconDesc);
  if ($$props.iconSortable === void 0 && $$bindings.iconSortable && iconSortable !== void 0)
    $$bindings.iconSortable(iconSortable);
  if ($$props.iconExpand === void 0 && $$bindings.iconExpand && iconExpand !== void 0)
    $$bindings.iconExpand(iconExpand);
  if ($$props.iconExpanded === void 0 && $$bindings.iconExpanded && iconExpanded !== void 0)
    $$bindings.iconExpanded(iconExpanded);
  if ($$props.showExpandIcon === void 0 && $$bindings.showExpandIcon && showExpandIcon !== void 0)
    $$bindings.showExpandIcon(showExpandIcon);
  if ($$props.classNameTable === void 0 && $$bindings.classNameTable && classNameTable !== void 0)
    $$bindings.classNameTable(classNameTable);
  if ($$props.classNameThead === void 0 && $$bindings.classNameThead && classNameThead !== void 0)
    $$bindings.classNameThead(classNameThead);
  if ($$props.classNameTbody === void 0 && $$bindings.classNameTbody && classNameTbody !== void 0)
    $$bindings.classNameTbody(classNameTbody);
  if ($$props.classNameSelect === void 0 && $$bindings.classNameSelect && classNameSelect !== void 0)
    $$bindings.classNameSelect(classNameSelect);
  if ($$props.classNameInput === void 0 && $$bindings.classNameInput && classNameInput !== void 0)
    $$bindings.classNameInput(classNameInput);
  if ($$props.classNameRow === void 0 && $$bindings.classNameRow && classNameRow !== void 0)
    $$bindings.classNameRow(classNameRow);
  if ($$props.classNameCell === void 0 && $$bindings.classNameCell && classNameCell !== void 0)
    $$bindings.classNameCell(classNameCell);
  if ($$props.classNameRowExpanded === void 0 && $$bindings.classNameRowExpanded && classNameRowExpanded !== void 0)
    $$bindings.classNameRowExpanded(classNameRowExpanded);
  if ($$props.classNameExpandedContent === void 0 && $$bindings.classNameExpandedContent && classNameExpandedContent !== void 0)
    $$bindings.classNameExpandedContent(classNameExpandedContent);
  if ($$props.classNameCellExpand === void 0 && $$bindings.classNameCellExpand && classNameCellExpand !== void 0)
    $$bindings.classNameCellExpand(classNameCellExpand);
  $$result.css.add(css);
  {
    {
      columnByKey = {};
      columns.forEach((col) => {
        columnByKey[col.key] = col;
      });
    }
  }
  colspan = (showExpandIcon ? 1 : 0) + columns.length;
  {
    {
      let col = columnByKey[sortBy];
      if (col !== void 0 && col.sortable === true && typeof col.value === "function") {
        sortFunction = (r) => col.value(r);
      }
    }
  }
  c_rows = rows.filter((r) => {
    return Object.keys(filterSelections).every((f) => {
      let resSearch = filterSelections[f] === "" || columnByKey[f].searchValue && (columnByKey[f].searchValue(r) + "").toLocaleLowerCase().indexOf((filterSelections[f] + "").toLocaleLowerCase()) >= 0;
      let resFilter = resSearch || filterSelections[f] === void 0 || filterSelections[f] === (typeof columnByKey[f].filterValue === "function" ? columnByKey[f].filterValue(r) : columnByKey[f].value(r));
      return resFilter;
    });
  }).map((r) => Object.assign({}, r, {
    $sortOn: sortFunction(r),
    $expanded: expandRowKey !== null && expanded.indexOf(r[expandRowKey]) >= 0
  })).sort((a, b) => {
    if (!sortBy)
      return 0;
    else if (a.$sortOn > b.$sortOn)
      return sortOrder;
    else if (a.$sortOn < b.$sortOn)
      return -sortOrder;
    return 0;
  });
  {
    {
      if (showFilterHeader && columns && rows) {
        calculateFilterValues();
      }
    }
  }
  return `<table class="${escape(null_to_empty(asStringArray(classNameTable))) + " svelte-dsaf7t"}"><thead class="${escape(null_to_empty(asStringArray(classNameThead))) + " svelte-dsaf7t"}">${showFilterHeader ? `<tr class="${"svelte-dsaf7t"}">${each(columns, (col) => {
    return `<th class="${escape(null_to_empty(asStringArray([col.headerFilterClass]))) + " svelte-dsaf7t"}">${col.searchValue !== void 0 ? `<input class="${escape(null_to_empty(asStringArray(classNameInput))) + " svelte-dsaf7t"}"${add_attribute("value", filterSelections[col.key], 0)}>` : `${filterValues[col.key] !== void 0 ? `<select class="${escape(null_to_empty(asStringArray(classNameSelect))) + " svelte-dsaf7t"}"><option${add_attribute("value", void 0, 0)}></option>${each(filterValues[col.key], (option) => {
      return `<option${add_attribute("value", option.value, 0)}>${escape(option.name)}</option>`;
    })}</select>` : ``}`}
          </th>`;
  })}
        ${showExpandIcon ? `<th></th>` : ``}</tr>` : ``}
    ${slots.header ? slots.header({ sortOrder, sortBy }) : `
      <tr>${each(columns, (col) => {
    return `<th class="${escape(null_to_empty(asStringArray([col.sortable ? "isSortable" : "", col.headerClass]))) + " svelte-dsaf7t"}">${escape(col.title)}
            ${sortBy === col.key ? `<!-- HTML_TAG_START -->${sortOrder === 1 ? iconAsc : iconDesc}<!-- HTML_TAG_END -->` : `${col.sortable ? `<!-- HTML_TAG_START -->${iconSortable}<!-- HTML_TAG_END -->` : ``}`}
          </th>`;
  })}
        ${showExpandIcon ? `<th></th>` : ``}</tr>
    `}</thead>

  <tbody class="${escape(null_to_empty(asStringArray(classNameTbody))) + " svelte-dsaf7t"}">${each(c_rows, (row, n) => {
    return `${slots.row ? slots.row({ row, n }) : `
        <tr class="${escape(null_to_empty(asStringArray([classNameRow, row.$expanded && classNameRowExpanded]))) + " svelte-dsaf7t"}">${each(columns, (col) => {
      return `<td class="${escape(null_to_empty(asStringArray([col.class, classNameCell]))) + " svelte-dsaf7t"}">${col.renderComponent ? `${validate_component(col.renderComponent.component || col.renderComponent || missing_component, "svelte:component").$$render($$result, Object_1.assign(col.renderComponent.props || {}, { row }, { col }), {}, {})}` : `<!-- HTML_TAG_START -->${col.renderValue ? col.renderValue(row) : col.value(row)}<!-- HTML_TAG_END -->`}
            </td>`;
    })}
          ${showExpandIcon ? `<td class="${escape(null_to_empty(asStringArray(["isClickable", classNameCellExpand]))) + " svelte-dsaf7t"}"><!-- HTML_TAG_START -->${row.$expanded ? iconExpand : iconExpanded}<!-- HTML_TAG_END -->
            </td>` : ``}</tr>
        ${row.$expanded ? `<tr class="${escape(null_to_empty(asStringArray(classNameExpandedContent))) + " svelte-dsaf7t"}"><td${add_attribute("colspan", colspan, 0)}>${slots.expanded ? slots.expanded({ row, n }) : ``}
            </td></tr>` : ``}
      `}`;
  })}</tbody>
</table>`;
});
const Test = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let cols;
  let sortBy = "id";
  let sortOrder = 1;
  let selectedCols = ["id", "service", "client", "date"];
  let appointments = [];
  const COLUMNS = {
    id: {
      key: "id",
      title: "ID",
      value: (v) => v.self,
      sortable: true
    },
    service: {
      key: "service",
      title: "SERVICE",
      value: (v) => v.service,
      sortable: true,
      filterOptions: (rows) => {
        let letrs = {};
        rows.forEach((row) => {
          let letr = row.service.charAt(0);
          if (letrs[letr] === void 0)
            letrs[letr] = {
              name: `${letr.toUpperCase()}`,
              value: letr.toLowerCase()
            };
        });
        letrs = Object.entries(letrs).sort().reduce((o, [k, v]) => (o[k] = v, o), {});
        return Object.values(letrs);
      },
      filterValue: (v) => v.service.charAt(0).toLowerCase()
    },
    client: {
      key: "client",
      title: "CLIENT",
      value: (v) => v.userId,
      sortable: true,
      filterOptions: (rows) => {
        let letrs = {};
        rows.forEach((row) => {
          let letr = row.userId.charAt(0);
          if (letrs[letr] === void 0)
            letrs[letr] = {
              name: `${letr.toUpperCase()}`,
              value: letr.toLowerCase()
            };
        });
        letrs = Object.entries(letrs).sort().reduce((o, [k, v]) => (o[k] = v, o), {});
        return Object.values(letrs);
      },
      filterValue: (v) => v.userId.charAt(0).toLowerCase()
    },
    date: {
      key: "date",
      title: "DATE",
      value: (v) => v.date,
      sortable: true,
      class: "text-center"
    }
  };
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    cols = selectedCols.map((key) => COLUMNS[key]);
    $$rendered = `<link rel="${"stylesheet"}" href="${"https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css"}" integrity="${"sha384-r4NyP46KrjDleawBgD5tp8Y7UzmLA05oM1iAEQ17CSuDqnUK2+k9luXQOfXJCJ4I"}" crossorigin="${"anonymous"}">
<div class="${"container"}"><h1>Appuntamenti</h1>

  <div class="${"row"}">${validate_component(SvelteTable, "SvelteTable").$$render($$result, {
      columns: cols,
      rows: appointments,
      classNameTable: ["table table-striped"],
      classNameThead: ["table-primary"],
      classNameSelect: ["custom-select"],
      sortBy,
      sortOrder
    }, {
      sortBy: ($$value) => {
        sortBy = $$value;
        $$settled = false;
      },
      sortOrder: ($$value) => {
        sortOrder = $$value;
        $$settled = false;
      }
    }, {})}</div></div>`;
  } while (!$$settled);
  return $$rendered;
});
export { Test as default };
