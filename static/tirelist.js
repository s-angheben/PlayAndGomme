function tirelist(){

    const tire = document.getElementById('tire');
    fetch('../api/v1/tires')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data.map( (entry) => {
                let item = document.createElement('li');
                item.innerHTML = `<a href="${entry.self}"> ${entry.brand} ${entry.model} ${entry.type} ${entry.length}/${entry.height}R${entry.diameter} PZ:${entry.quantity} Prezzo:${entry.price} euro`;
                tire.appendChild(item);
            })
        });

}
function tiretable(){
    const tabella = document.getElementById('tabella');
        fetch('../api/v1/tires')
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
tirelist();
tiretable();