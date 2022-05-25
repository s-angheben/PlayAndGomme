function loadAppointments() {
    const appointmentsTable = document.getElementById('appointmentsTable');

    fetch('../api/v2/appointments')
	.then(response => response.json())
	.then(data => {

	return data.map( (entry) => {

        let item = document.createElement('tr');
        var appId = entry.self;
        appId = appId.slice(21);
        var userId = entry.userId;
        userId = userId.slice(14);
	    item.innerHTML = `<td><a href="${entry.self}">${appId}</a></td>
                          <td>${entry.date}</td>
                          <td>${entry.service}</td>
                          <td><a href="${entry.self}">Mostra Prodotti</td>
                          <td><a href="${entry.userId}">${userId}</a></td>`;
	    
        appointmentsTable.appendChild(item);
        })

    })
    .catch( error => console.error(error)); //catch all error of all then
}

loadAppointments()
