var titolo = document.getElementById('tit');
var descrizione = document.getElementById('desc');
var indirizzo = document.getElementById('ind');
var orari = document.getElementById('ora');
var telefono = document.getElementById('telefono');
var email = document.getElementById('email');
var link = document.getElementById('link');
var youtube = document.getElementById('youtube');
var instagram = document.getElementById('instagram');
var facebook = document.getElementById('facebook');
var json;
var news = document.getElementById('news');

//FUNZIONI
function datiAzienda(){
    fetch('../api/v2/azienda')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            json = data;
            titolo.textContent = data.nome;
            descrizione.textContent = data.descrizione;
            indirizzo.textContent = data.indirizzo;
            orari.textContent = data.orari;
            telefono.textContent = data.numero_telefono;
            email.textContent = data.email;
            link.style.display="none";
            youtube.style.display="none";
            facebook.style.display="none";
            instagram.style.display="none";
            if(((data.youtube != null)&&(data.youtube != 'null'))||((data.instagram != null)&&(data.instagram != 'null'))||((data.facebook != null)&&(data.facebook != 'null'))){
                link.style.display="";
                if((data.youtube != null)&&(data.youtube != "null")){
                    youtube.style.display="";
                }
                if((data.facebook != null)&&(data.facebook != "null")){
                    facebook.style.display="";
                }
                if((data.instagram != null)&&(data.instagram != "null")){
                    instagram.style.display="";
                }
            }
            for (var i=0; i<data.news.length; i++){
                news.innerHTML += "<div class='riquadri'><h3>"+data.news[i].Titolo+"</h3><h5>"+data.news[i].Testo+"</h5></div>";
            }

        });
}

function youtubee(){
    alert('open link: '+json.youtube);
    window.location.replace(json.youtube);
}

function instagramm(){
    alert('open link: '+json.instagram);
    window.location.replace(json.instagram);
}

function facebookk(){
    alert('open link: '+json.facebook);
    window.location.replace(json.facebook);
}

function modifica(){
    window.open("infoaziendaModifica.html", "_self");
}




//programma
datiAzienda();
