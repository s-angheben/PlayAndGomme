<script>
  import SvelteTable from "svelte-table";
  import { onMount } from 'svelte';
  
  let sortBy = "id";
  let sortOrder = 1;
  let iconAsc = "↑";
  let iconDesc = "↓";
  let selectedCols = ["id", "service", "client", "date"];
  let numRows = 10;
  let data = [{"id":"1", "first_name":"hei", "client":"ho"}];

 
  let appointments = [];

    onMount(async () => {
        const response = await fetch('../api/v1/appointments');
        const data = await response.json();
        appointments = data.map( (/** @type {{ self: any; service: any; userId: any; date: any; }} */ item) => {
			return {
				"self" : item.self,
				"service" : item.service,
				"userId" : item.userId,
				"date" : item.date
			}
		});
    })

	function hello() {
		console.log("helo");	
	}

  const COLUMNS = {
    id: {
      key: "id",
      title: "ID",
      value: v => v.self,
      sortable: true,
    },
    service: {
      key: "service",
      title: "SERVICE",
      value: v => v.service,
      sortable: true,
      filterOptions: rows => {
        let letrs = {};
        rows.forEach(row => {
          let letr = row.service.charAt(0);
          if (letrs[letr] === undefined)
            letrs[letr] = {
              name: `${letr.toUpperCase()}`,
              value: letr.toLowerCase()
            };
        });
        // fix order
        letrs = Object.entries(letrs)
          .sort()
          .reduce((o, [k, v]) => ((o[k] = v), o), {});
        return Object.values(letrs);
      },
      filterValue: v => v.service.charAt(0).toLowerCase()
    },
    client: {
      key: "client",
      title: "CLIENT",
      value: v => v.userId,
      sortable: true,
      filterOptions: rows => {
        let letrs = {};
        rows.forEach(row => {
          let letr = row.userId.charAt(0);
          if (letrs[letr] === undefined)
            letrs[letr] = {
              name: `${letr.toUpperCase()}`,
              value: letr.toLowerCase()
            };
        });
        // fix order
        letrs = Object.entries(letrs)
          .sort()
          .reduce((o, [k, v]) => ((o[k] = v), o), {});
        return Object.values(letrs);
      },
      filterValue: v => v.userId.charAt(0).toLowerCase()
    },
    date: {
      key: "date",
      title: "DATE",
      value: v => v.date,
      sortable: true,
      class: "text-center"
    }
  };

  $: cols = selectedCols.map(key => COLUMNS[key]);
</script>

<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css" integrity="sha384-r4NyP46KrjDleawBgD5tp8Y7UzmLA05oM1iAEQ17CSuDqnUK2+k9luXQOfXJCJ4I" crossorigin="anonymous">
<div class="container">
  <h1>Appuntamenti</h1>

  <div class="row">
    <SvelteTable
      columns={cols}
      rows={appointments}
      bind:sortBy
      bind:sortOrder
      classNameTable={['table table-striped']}
      classNameThead={['table-primary']}
      classNameSelect={['custom-select']} />
  </div>
</div>
