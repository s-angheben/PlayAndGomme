function loadAppointments() {
    const appointmentsTable = document.getElementById('appointmentsTable');

    fetch('../api/v1/appointments')
	.then(response => response.json())
	.then(data => {

        console.log(data);
       
	return data.map( (entry) => {

            let item = document.createElement('li');
	    item.innerHTML = `${entry.appointmentId} ${entry.userId}`;
	    
            appointmentsTable.appendChild(item);
        })

    })
    .catch( error => console.error(error)); //catch all error of all then
}

loadAppointments()
