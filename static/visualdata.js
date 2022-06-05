//elementi html
var barraSelGiorno = document.getElementById('sel_giorno');
var divTabella = document.getElementById('div_tabella');
var tabella = document.getElementById('tab');
var scrittaFestivo = document.getElementById('fest');
var json;
var bottoni = [document.getElementById('1'), document.getElementById('2'), document.getElementById('3'), document.getElementById('4'), document.getElementById('5'), document.getElementById('6'), document.getElementById('7'), document.getElementById('8'), document.getElementById('9'), document.getElementById('10'), document.getElementById('11'), document.getElementById('12'), document.getElementById('13'), document.getElementById('14'), document.getElementById('15'), document.getElementById('16'), document.getElementById('17'), document.getElementById('18'), document.getElementById('19'), document.getElementById('20'), document.getElementById('21'), document.getElementById('22'), document.getElementById('23'), document.getElementById('24'), document.getElementById('25'), document.getElementById('26'), document.getElementById('27'), document.getElementById('28'), document.getElementById('29'), document.getElementById('30'), document.getElementById('31'), document.getElementById('32'), document.getElementById('33'), document.getElementById('34'), document.getElementById('35'), document.getElementById('36')];
var slotSelezionato = null;
var bottoni2 = [document.getElementById('ind'), document.getElementById('ava')];

// EVENTI
function barra(){
    console.log(barraSelGiorno.value);
    slotSelezionato = null;
    for(var i=0; i<36; i++){
        bottoni[i].style.border = "2px solid black";
    }
    if((json[barraSelGiorno.value].gSettimana == "Sabato")||(json[barraSelGiorno.value].gSettimana == "Domenica")){//sabato e domenica festivi
        tabella.style.display="none";
        scrittaFestivo.style.display="";
    }else{
        scrittaFestivo.style.display="none";
        tabella.style.display="";
        for(var i = 0; i<36; i++){
            if(json[barraSelGiorno.value].slotOrari[i] == false){//slot libero
                bottoni[i].style.opacity="1";
            }else if(json[barraSelGiorno.value].slotOrari[i] == true){//slot occupato
                bottoni[i].style.opacity="0.3";
                console.log(json[barraSelGiorno.value].slotOrari[i]);
            }
        }
    }
}

function aggBarra(valore, testo){
    var b = document.createElement("option");
    b.value = valore;
    b.text = testo;
    barraSelGiorno.add(b);
}

function datadati(){
        fetch('../api/v2/data')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            json = data;
            for (var i=0; i<10 ; i++){
                console.log(json[i]);
                aggBarra(i, json[i].gSettimana+" "+json[i].giorno);
            }
            barra();
            console.log(json);
        });
}

function mouses(id){
    if(json[barraSelGiorno.value].slotOrari[id] == false){
        bottoni[id].style.background = "red";
    }
}

function mouseg(id){
    bottoni[id].style.background = "brown";
}

function reds(id){
    bottoni2[id].style.background = "red";
}

function redn(id){
    bottoni2[id].style.background = "brown";
}

function redsb(){
    barraSelGiorno.style.background = "red";
}

function rednb(){
    barraSelGiorno.style.background = "brown";
}

function mouseclick(id){
    if(json[barraSelGiorno.value].slotOrari[id] == false){
        for(var i=0; i<36; i++){
            if (i == id){
                bottoni[i].style.border = "3px solid yellow";
                //data selezionata
                var arr = json[barraSelGiorno.value].giorno.split("/");
                if(arr[1] <= 9){
                    if(arr[0]<= 9){
                        var string = arr[2]+'-0'+arr[1]+'-0'+arr[0]+'T'+bottoni[i].value;
                    }else{
                        var string = arr[2]+'-0'+arr[1]+'-'+arr[0]+'T'+bottoni[i].value;
                    }
                }else{
                    if(arr[0]<= 9){
                        var string = arr[2]+'-'+arr[1]+'-0'+arr[0]+'T'+bottoni[i].value;
                    }else{
                        var string = arr[2]+'-'+arr[1]+'-'+arr[0]+'T'+bottoni[i].value;
                    }
                }
                slotSelezionato = new Date(string.toString());
                console.log(slotSelezionato);
            }else if (i != id){
                bottoni[i].style.border = "2px solid black";
            }
        }
    }
}

function continua(){
    if (slotSelezionato == null){//no slot selezionato
        alert("Seleziona uno slot!");
    }else{//slot selezionato correttamente
        fetch('../api/v2/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { slot: slotSelezionato, durataSlot: 1 } ),
        })
        .then(response => response.json())
        .then((res) => {
            console.log(res);
            if (res.status == 201){
                //corretto vai avanti
                console.log(res.successo);
                alert("Orario selezionato con successo!");
            }else if (res.status == 400){
                //errore
                console.log(res.successo);
                alert("Errore nella selezione dello slot ricaricare la pagina e riprovare");
            }
            return;
        })
        .catch( error => console.error(error) );
    }
}


//programma
datadati();