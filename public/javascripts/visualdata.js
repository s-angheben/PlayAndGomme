//elementi html
var barraSelGiorno = document.getElementById('sel_giorno');
var divTabella = document.getElementById('div_tabella');
var tabella = document.getElementById('tab');
var scrittaFestivo = document.getElementById('fest');
var json;
var bottoni = [document.getElementById('1'), document.getElementById('2'), document.getElementById('3'), document.getElementById('4'), document.getElementById('5'), document.getElementById('6'), document.getElementById('7'), document.getElementById('8'), document.getElementById('9'), document.getElementById('10'), document.getElementById('11'), document.getElementById('12'), document.getElementById('13'), document.getElementById('14'), document.getElementById('15'), document.getElementById('16'), document.getElementById('17'), document.getElementById('18'), document.getElementById('19'), document.getElementById('20'), document.getElementById('21'), document.getElementById('22'), document.getElementById('23'), document.getElementById('24'), document.getElementById('25'), document.getElementById('26'), document.getElementById('27'), document.getElementById('28'), document.getElementById('29'), document.getElementById('30'), document.getElementById('31'), document.getElementById('32'), document.getElementById('33'), document.getElementById('34'), document.getElementById('35'), document.getElementById('36')];


// EVENTI
function barra(){
    console.log(barraSelGiorno.value);
    if((json.dateInvio[barraSelGiorno.value].gSettimana == "Sabato")||(json.dateInvio[barraSelGiorno.value].gSettimana == "Domenica")){//sabato e domenica festivi
        tabella.style.display="none";
        scrittaFestivo.style.display="";
    }else{
        scrittaFestivo.style.display="none";
        tabella.style.display="";
        for(var i = 0; i<36; i++){
            if(json.dateInvio[barraSelGiorno.value].slotOrari[i] == false){//slot libero
                bottoni[i].style.opacity="1";
            }else if(json.dateInvio[barraSelGiorno.value].slotOrari[i] == true){//slot occupato
                bottoni[i].style.opacity="0.3";
                console.log(json.dateInvio[barraSelGiorno.value].slotOrari[i]);
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

function dataajax(){
    fetch('visualdata/dat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'richiesta': 'slotdate'})
    }).then(res => res.json()).then(data => {
        json = data;
        for (var i=0; i<10 ; i++){
            console.log(json.dateInvio[i]);
            aggBarra(i, json.dateInvio[i].gSettimana+" "+json.dateInvio[i].giorno);
        }
        barra();
        console.log(json);
    })
}




//programma
dataajax();