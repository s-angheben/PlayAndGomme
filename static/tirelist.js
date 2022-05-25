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
tiretable();