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

function insertTire()
{
    //get the book title
    var tireBrand = document.getElementById("tireBrand").value;
    var tireModel = document.getElementById("tireModel").value;
    var tireLength = document.getElementById("tireLength").value;
    var tireHeight = document.getElementById("tireHeight").value;
    var tireDiameter = document.getElementById("tireDiameter").value;
    var tireQuantity = document.getElementById("tireQuantity").value;
    var tireType = document.getElementById("tireType").value;
    var tirePrice = document.getElementById("tirePrice").value;

    fetch('../api/v2/tires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { brand: tireBrand, model: tireModel, length: tireLength, height: tireHeight,
        diameter: tireDiameter, quantity: tireQuantity, type: tireType, price: tirePrice } ),
    })
    .then((resp) => {
        console.log(resp);
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
    window.location.reload(true);
};