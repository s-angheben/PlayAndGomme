var socket = io('http://localhost:3030')

socket.on('data updated', loadAppointments)

function loadAppointments() {
    const appointmentsTable = document.getElementById('appointmentsTable');
    appointmentsTable.innerHTML = "";
    
    fetch('../api/v1/appointments')
	.then(response => response.json())
	.then(data => {
	    console.log(data)

	    return data.map( (entry) => {

		let item = document.createElement('li');
		item.innerHTML = `<a href="${entry.self}"> ${entry.service} ${entry.date}`;
		
		appointmentsTable.appendChild(item);
            })

	})
	.catch( error => console.error(error)); //catch all error of all then
}

loadAppointments()
