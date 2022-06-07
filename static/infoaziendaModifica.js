var json;
var selezione = document.getElementById('sel');
var pagina = document.getElementById('pag');
var pagina2 = document.getElementById('pag2');
var btnsalva = document.getElementById('salva');
var veccio_cont = document.getElementById('veccont');
var newshow = document.getElementById('newshow');
var tabella = document.getElementById('tab');
var tabelladiv = document.getElementById('tabdiv');
var first = true;
var da_inv_noNews = document.getElementById('da_inv');
var da_inv_NewsTit = document.getElementById('newsTit');
var da_inv_NewsTxt = document.getElementById('newsText');
var lista_NWS = [];
var da_elininare = [];
var null_indication = document.getElementById('inserireelem');

//FUNZIONI
function datiAzienda(){
    fetch('../api/v2/azienda')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            json = data;
            barra();
        });
}

function back(){
    window.open("infoazienda.html", "_self");
}

function redsb(){
    selezione.style.background = "red";
}

function rednb(){
    selezione.style.background = "brown";
}

function reds(){
    btnsalva.style.background = "red";
}

function redn(){
    btnsalva.style.background = "brown";
}

function barra(){
    console.log(selezione.value);
    if(selezione.value == 'titolo'){
        pagina2.style.display="none";
        pagina.style.display="";
        veccio_cont.textContent = json.nome;
        null_indication.style.display="none";
    }else if(selezione.value == 'descrizione'){
        pagina2.style.display="none";
        pagina.style.display="";
        veccio_cont.textContent = json.descrizione;
        null_indication.style.display="none";
    }else if(selezione.value == 'indirizzo'){
        pagina2.style.display="none";
        pagina.style.display="";
        veccio_cont.textContent = json.indirizzo;
        null_indication.style.display="none";
    }else if(selezione.value == 'orari'){
        pagina2.style.display="none";
        pagina.style.display="";
        veccio_cont.textContent = json.orari;
        null_indication.style.display="none";
    }else if(selezione.value == 'numerotelefono'){
        pagina2.style.display="none";
        pagina.style.display="";
        veccio_cont.textContent = json.numero_telefono;
        null_indication.style.display="none";
    }else if(selezione.value == 'email'){
        pagina2.style.display="none";
        pagina.style.display="";
        veccio_cont.textContent = json.email;
        null_indication.style.display="none";
    }else if(selezione.value == 'news'){
        //
        pagina.style.display="none";
        pagina2.style.display="";
        if(first == true){
            if(json.news.length == 0){
                tabelladiv.style.display="none";
                newshow.innerHTML += "<div class='elementi3'><p class='tittt'>non ci sono News</p></div>";
                first = false;
            }else{
                tabelladiv.style.display="";
                for (var i=0; i<json.news.length; i++){
                    var idd = '"'+json.news[i]._id+'"';
                    tabella.innerHTML += "<tr><td class='colonne'><p class='texnews'>"+json.news[i].Titolo+"</p></td><td class='colonne'><p class='texnews'>"+json.news[i].Testo+"</p></td><td class='colonne'><input type='checkbox' class='checkbox' onchange='check("+i+", "+idd+")' id='chek"+i+"'></td></tr>";
                }
                for (var i=0; i<json.news.length; i++){
                    lista_NWS.push(document.getElementById('chek'+i));
                }
                first = false;
                console.log(lista_NWS);
            }
        }
        //
    }else if(selezione.value == 'youtube'){
        pagina2.style.display="none";
        pagina.style.display="";
        veccio_cont.textContent = json.youtube;
        null_indication.style.display="";
    }else if(selezione.value == 'facebook'){
        pagina2.style.display="none";
        pagina.style.display="";
        veccio_cont.textContent = json.facebook;
        null_indication.style.display="";
    }else if(selezione.value == 'instagram'){
        pagina2.style.display="none";
        pagina.style.display="";
        veccio_cont.textContent = json.instagram;
        null_indication.style.display="";
    }
    da_inv_noNews.value = "";
    da_inv_noNews.textContent = "";
    da_inv_NewsTit.value = "";
    da_inv_NewsTit.textContent = "";
    da_inv_NewsTxt.value = "";
    da_inv_NewsTxt.textContent = "";
    for(var z=0; z<lista_NWS.length; z++){
        lista_NWS[z].checked = false;
    }
    da_elininare.splice(0, da_elininare.length);
};


function check(num, id){
    console.log(lista_NWS[num]);
    if(lista_NWS[num].checked == true){
        console.log(id);
        da_elininare.push(id);
    }else if(lista_NWS[num].checked == false){
        console.log('rimosso');
        da_elininare.pop(id);
    }
    console.log(da_elininare);
};


function slv(){
    var inv_ogg;
    var inv_tit = "";
    var inv_txt;
    var inv_elim = [];
    inv_ogg = selezione.value;
    if((selezione.value == 'titolo')||(selezione.value == 'descrizione')||(selezione.value == 'indirizzo')||(selezione.value == 'orari')||(selezione.value == 'numerotelefono')||(selezione.value == 'email')||(selezione.value == 'youtube')||(selezione.value == 'facebook')||(selezione.value == 'instagram')){
        inv_txt = da_inv_noNews.value;
        if (inv_txt == ""){
            alert('Compilare i campi prima di procedere');
            return;
        }
    }else if(selezione.value == 'news'){
        inv_tit = da_inv_NewsTit.value;
        inv_txt = da_inv_NewsTxt.value;
        inv_elim = da_elininare;
        if (((inv_tit == "")||(inv_txt == ""))&&(inv_elim.length == 0)){
            alert('Compilare i campi prima di procedere');
            return;
        }
    }
    //
    fetch('../api/v2/azienda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { oggetto: inv_ogg, titolo: inv_tit, text: inv_txt, array: inv_elim } ),
    })
    .then(response => response.json())
    .then((res) => {
        console.log(res);
        if (res.status == 201){
            console.log(res.successo);
            alert("Operazione avvenuta con successo!");
            back();
        }else if ((res.status == 400)||(res.status == 404)){
            console.log(res.successo);
            alert(res.successo);
            barra();
        }
        return;
    })
    .catch( error => console.error(error) );
};



//programma
datiAzienda();