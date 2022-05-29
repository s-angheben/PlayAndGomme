class visualizzaDate{
    constructor(gsettimana, giorno, mese, anno){
        if(gsettimana == 0){
            this.gSettimana = "Domenica";
        }else if(gsettimana == 1){
            this.gSettimana = "Lunedi";
        }else if(gsettimana == 2){
            this.gSettimana = "Martedi";
        }else if(gsettimana == 3){
            this.gSettimana = "Mercoledi";
        }else if(gsettimana == 4){
            this.gSettimana = "Giovedi";
        }else if(gsettimana == 5){
            this.gSettimana = "Venerdi";
        }else if(gsettimana == 6){
            this.gSettimana = "Sabato";
        }
        this.giorno = giorno + "/" + (mese + 1) + "/" +anno;
        this.slotOrari = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    }

    trovaSlot(ora, minuti){
        var num = 0;
        if(minuti == 0){
            num = 0;
        }else if((minuti > 0)&&(minuti <= 15)){
            num = 1;
        }else if((minuti > 15)&&(minuti <= 30)){
            num = 2;
        }else if((minuti > 30)&&(minuti <= 45)){
            num = 3;
        }else if(minuti > 45){
            ora = ora + 1;
        }
        var slot = 0; 
        if (ora < 8){
           return -1;
        }else if (ora == 8){
            slot = 0;
        }else if (ora == 9){
            slot = 4;
        }else if (ora == 10){
            slot = 8;
        }else if (ora == 11){
            slot = 12;
        }else if (ora == 12){
            slot = 16;
        }else if (ora == 13){
            slot = 16;
        }else if (ora == 14){
            slot = 20;
        }else if (ora == 15){
            slot = 24;
        }else if (ora == 16){
            slot = 28;
        }else if (ora == 17){
            slot = 32;
        }else if (ora > 17){
            return -2;
        }
        return slot + num;
    }

    orarioPartenza(ora, minuti){
        var slot = this.trovaSlot(ora, minuti);
        if (slot > 0){
            for (var i=0; i<slot; i++){
                this.slotOrari[i] = true;
            }
        }else if (slot == -2){
            slot = 36;
            for (var i=0; i<slot; i++){
                this.slotOrari[i] = true;
            }
        }
    }
    
    aggiungiSlot(oraInizio, minutiInizio, oraFine, minutiFine){
        var slotInizio = this.trovaSlot(oraInizio, minutiInizio);
        var slotFine = this.trovaSlot(oraFine, minutiFine);
        console.log(slotInizio);
        console.log(slotFine);
        if ((slotInizio >= 0)&&(slotInizio <= 35)&&(slotFine >= 0)&&(slotFine <= 35)){
            for (var i=slotInizio; i<slotFine; i++){
                this.slotOrari[i] = true;
            }
        }
        else if((slotInizio <= 35)&&(slotFine == -2)){
            for (var i=slotInizio; i<36; i++){
                this.slotOrari[i] = true;
            }
        }else if((slotInizio == -1)&&(slotFine <= 35)){
            for (var i=0; i<slotFine; i++){
                this.slotOrari[i] = true;
            }
        }else if((slotInizio == -1)&&(slotFine == -2)){
            for (var i=0; i<36; i++){
                this.slotOrari[i] = true;
            }
        }
    }
}

module.exports = visualizzaDate 