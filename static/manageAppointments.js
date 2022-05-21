function loadAppointments() {
    const appointmentsTable = document.getElementById('appointmentsTable');

    fetch('../api/v1/appointments')
	.then(response => response.json())
	.then(data => {

	return data.map( (entry) => {

        let item = document.createElement('tr');
	    item.innerHTML = `<td><a href="${entry.self}">${entry.self}</a></td>
                          <td>${entry.data}</td>
                          <td>${entry.service}</td>
                          <td><a href="${entry.userId}">${entry.userId}</a></td>`;
	    
        appointmentsTable.appendChild(item);
        })

    })
    .catch( error => console.error(error)); //catch all error of all then
}

loadAppointments()
