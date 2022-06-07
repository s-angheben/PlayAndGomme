var loggedUser = {};

function login()
{
    //get the book title
    var userName = document.getElementById("userName").value;
    var userPassword = document.getElementById("userPassword").value;
    fetch('../api/v2/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { username: userName, password: userPassword } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
        loggedUser.token = data.token;
        loggedUser.email = data.email;
        loggedUser.self = data.self;
        console.log('login');
        console.log(loggedUser.token);
        return;
    })
    .catch( error => console.error(error) );
};

function tiretable(){
    const tabella = document.getElementById('tabella');
        fetch('../api/v2/tires')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data.map( (entry) => {
                let item = document.createElement('tr');
                item.innerHTML = `<td>${entry.brand}</td><td><a href="${entry.self}">${entry.model}</a></td><td>${entry.type}</td><td>${entry.length}/${entry.height}R${entry.diameter}</td><td>${entry.quantity}</td><td>${entry.price} euro</td>`;
                tabella.appendChild(item);
            })
        });
}
//tiretable();

function appointmentLogin(){
    fetch('../api/v2/appointments', {
        method : 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': loggedUser.token
        },
    })
    .then((resp) => {
        console.log(resp);
        loadAppointments();
        return;
    })
    .catch( error => console.error(error) );
};
//appointmentLogin();

function loadAppointments() {
    const appointmentsTable = document.getElementById('appointmentsTable');
    console.log(loggedUser.token);
    fetch('../api/v2/appointments'+ '&token=' + loggedUser.token)
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
};

