// const playButton = document.getElementById('play');
document.getElementById('play').addEventListener( "click",
    function(){
        createNewGame();
    }
)

// funzione per generare una nuova partita SOVRASCRIVENDO la precedente
function createNewGame(){
    // Reset generale per il contenitore interno della grid
    document.querySelector('#grid').innerHTML = "";

    // domanda, il gioco è finito?
    let isGameOver = false;

    // prima di tutto recupero il livello selezionato dall'utente
    // stabilisco le condizioni date dal livello selezionato
    const level = parseInt( document.getElementById('level').value );
    console.log(level);

    // GENERAZIONE DELLA GRIGLIA
    // stabilire il numero delle caselle che devono apparire:
        //  prendere il valore in base alla difficoltà
        // due valori : numero di celle per riga e numero di celle totali

    let cellsPerRow;
    let cellsNumber;

    let points = 0;
    const NUMBER_OF_BOMBS = 16;

    switch (level ) {
        case 1:
        default:
            cellsNumber = 100;
            cellsPerRow = 10;
            break;
        case 2:
            cellsNumber = 81;
            cellsPerRow = 9;
            break;
        case 3:
            cellsNumber = 49;
            cellsPerRow = 7;
            break;
    }
    //  cellsPerRow => radice quadrata di cellsNumber
    // cellsPerRow = Math.sqrt(cellsNumber);

    //  ? genero la lista delle bombe casuali
    const bombs = generateBombList(NUMBER_OF_BOMBS, cellsNumber);
    console.log(bombs);

    //  prendo il parent
    //  ciclo per tutti gli elementi che voglio creare
    //  aggiungo un event listener per far colorare il bottone
    //  li inserisco come elementi figli del nostro parent selezionato

    for ( let i = 1; i <= cellsNumber; i++){
        const cell = createSquare(i, cellsPerRow);

        cell.addEventListener('click', function(){
            // se il gioco non è finito allora
            if (!isGameOver){
                // se non ho cliccato su una bomba
                if (!bombs.includes(i)){
                    this.classList.add('clicked'); // this === cell
                    points++;   //points = points + 1;
                    writeInElementById('points', `Il tuo punteggio è: ${points}`);
                    //  aggiungi un punto
                } else {  // se invece ho cliccato su una bomba
                    this.classList.add('clicked-bomb'); // this === cell
                    writeInElementById('points', `Mi dispiace, hai perso, il tuo punteggio è: ${points}`);
                    checkAndAddClass('grid', bombs, 'clicked-bomb');
                    isGameOver = true;
                }
            }
        });
        document.querySelector('#grid').appendChild(cell);
    }
}

// genera il singolo quadrato e me lo restituisce
function createSquare(number, cellsPerRow){
    let cell = document.createElement('div');
    // cell.className = ('square');
    cell.classList.add('square');
    cell.style.width = `calc(100% / ${cellsPerRow})`
    cell.style.height = cell.style.width;
    cell.innerHTML = `<span>${number}</span>`;

    return cell;
}


function generateBombList(bombs, numberOfCells){
    // dati il numero di bombe da generare "bombs"
    // ed il numero di celle disponibili (generate) "numberOfCells"
    // inizializzo a vuoto un nuovo array
    const bombList = [];
    // per ogni bomba
    for(i = 0 ; i < bombs ; i++){
        // ne genero una nuova che non sia già presente e la aggiungo alla lista delle bombe
        bombList.push(generateUniqueRandomNumber(bombList, 1, numberOfCells));
    }
    // restituisco la lista delle bombe
    return bombList;
}

/**
 * Function that generates a random number between two included values, which is not already present in the given blacklist.
 *
 * @param {*} numsBlacklist The blacklist to check.
 * @param {*} min The minimum value of the random generated integer.
 * @param {*} max The maximum value of the random generated integer.
 * @returns A random generated integer which is not present in the blacklist.
 */
function generateUniqueRandomNumber( numsBlacklist, min, max){
    // mi creo una variabile inizializzata a false, che mi controlla se ho generato un numero
    // valido oppure no
    let check = false;
    let randomInt;

    // creo un ciclo che continua finché non ho trovato un numero valido (assente in blacklist)
    while ( !check ){
        //  genero randomicamente un numero intero tra il min e il max passati come argomenti
        randomInt  = Math.floor(Math.random() * ((max + 1) - min) + min);
        // se il numero non è presente nella blacklist allora
        if ( !numsBlacklist.includes(randomInt)  ){
            // informo il resto della funzione che il numero è stato trovato ed è valido
            // ==> esco dal ciclo while
            check = true;
        }
    }

    // restituisco il numero valido che ho trovato
    return randomInt;
}

// Funzione che scrive in un elemento del dom preso da id "elementId" sovrascrivendo ciò che è presente
function writeInElementById(elementId, stringToWrite){
    document.getElementById(elementId).innerHTML = stringToWrite;
}

function checkAndAddClass( parentElementId , bombList, classToAdd){
    const squares = document.getElementById(parentElementId).children;

    // per ogni quadrato presente
    for (let i= 0 ; i < squares.length ; i++ ){
        // se è anche una bomba
        if ( bombList.includes(parseInt(squares[i].firstChild.innerHTML)) ){
            // la faccio esplodere
            squares[i].classList.add(classToAdd);
        }
    }
}