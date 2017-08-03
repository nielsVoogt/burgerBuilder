/**
 * Kunnen deze niet in een van je classes? Is beter om het
 * binnen je eigen scope te houden. Anders misschien eens
 * checken hoe 'namespaces' in JS werken. Is vast al wel
 * eens ergens in een tutorial langsgeweest.
 */
let pos, burger;
let toppingIndex  = 0,
    insertIndex   = 0,
    totalCalories = 0;

/**
 * Sommige variable names zijn meervoud en sommige enkelvoud. Dat
 * verschil maakt natuurlijk niet uit, maar in principe is het idee
 * wel dat erbij enkelvoud ook maar 1 ding in zit. Dus niet zoals
 * hieronder dat toppingType, meerdere element bevat.
 */
const selectToppingType   = document.getElementsByClassName('toppings__type-selector'),
      editToppingButtons  = document.getElementsByClassName('options__option'),
      // What is up met de naam 'Modal' hierin?
      toppingModalOptions = document.getElementsByClassName('toppings__type'),
      clearBurgerButton   = document.getElementById('clear-burger-toppings'),
      addToppingOptions   = document.getElementsByClassName('add-topping'),
      toppingType         = document.getElementsByClassName('toppings__type');

/**
 * Ik zou deze addEventListenerToNodeList noemen. Uit deze naam kon
 * ik niet eens vaag opmaken wat het runnen ervan zou betekeken.
 *
 * Het argument type gebruik je nu trouwens helemaal niet. Je moet
 * hem wel overal includen omdat je de fn wel gebruikt.
 *
 * Je zou deze variable dus helemaal weg kunnen halen en het in
 * deze functie altijd op 'click' kunnen laten staan. Dan zou ik de
 * naam van de functie wel eenpassen naar addClickListenerToNodeList.
 *
 * Of je gebruikt de variable wel en noemt de functie zoals ik aan
 * het begin van dit blok zei. Dan zou ik echter wel ook nog
 * de volgorde van de argumenten aanpassen naar (type, fn, nodelist)
 * omdat de standaard addEventListener (type, fn) heeft en je in principe
 * deze uitbreidt met je 'node list' functionaliteit.
 */
const listenerAssigner = function(nodelist, type, fn) {
    // Hoezo var en niet let?
    for(var i = 0; i < nodelist.length; i++) {
        nodelist[i].addEventListener('click', fn);
    }
};

const UIController = (function() {

    /**
     * Hierboven heb je een daadwerkelijk button element gesuffixed
     * met 'button'. Een (niet door iedereen gebruikte) conventie is
     * om buttons met 'btn' te prefixen. Wat voor conventie je aanhoudt
     * is minder belangrijk nu, maar door hieronder wel een 'btn' prefix
     * te gebruiken ontstaat er wel verwarring. Er zit namelijk geen
     * echte button in, maar alleen nog maar een string. Door de rest
     * van het document heen kom ik af en toe dingen met een 'Template'
     * suffix tegen. Dit ziet er verdacht veel uit als een template
     * dus daar zou ik dan eigenlijk wel diezelfde consistentie verwachten.
     * Nu zou je zomaar kunnen denken dat er een button element in zit
     * en er een event aan proberen te koppen ofzo.
     *
     * Daarnaast bevatten deze template id waardes. Op het moment dat
     * je dus meerdere toppings toevoegt heb je dezelfde id's meerdere
     * keren op de pagina. Wat natuurlijk wel werkt, maar totaal niet
     * de bedoeling is en voor gekke shizzles kan zorgen.
     */
    const btnMoveDown = '<a class="options__option" id="down">D</a>',
            btnMoveUp = '<a class="options__option" id="up">U</a>',
            btnRemove = '<a class="options__option" id="delete">X</a>';

    const toppingTemplate = function(toppingImage, calories, category, name) {
        return `<div
                    class="topping"
                    id="${toppingIndex++}"
                    data-calories="${calories}"
                    data-category="${category}"
                    data-name="${name}"
                    style="background-image: url(${toppingImage});"
                >
                    <div class="options">
                        ${btnMoveUp}
                        ${btnMoveDown}
                        ${btnRemove}
                    </div>
                </div>`;
    }

    /**
     * Met deze functie ben je constant de DOM aan het doorspitten op zoek
     * naar de positie van de desbetreffende topping. Dit komt doordat je
     * de template toevoegt als string en niet als daadwerkelijk DOM
     * element. Zou eens kijken naar document.createElement om te zien hoe
     * je daadwerkelijk on-the-fly DOM elementen aan kunt maken. Als je die
     * bewaart (zowel geheugen als localStorage) wordt het waarschijnlijk een
     * stuk makkelijker om ze terug te vinden, omdat je niet met gekke
     * query selectors (zie: .match(...)) aan de slag hoeft om de element
     * terug te vinden. Als je een array hebt met daarin topping elementen
     * en je klikt vervolgens ergens op een functie van zo'n element (remove ofzo)
     * dan kun je in dat event met de referentie naar zichzelf (this of this.closest ofzo)
     * in de array kijken waar dat element dan zit. Zal wel bijzonder veel
     * wijzigingen aan een heleboel functionaliteiten vereisen, dus misschien
     * leuk om voor een volgende ding te proberen.
     *
     * Los van het bovenstaande verhaal geef je nu elke keer dat je deze functie
     * aanroept de burger array mee. Mooier zou zijn om een functie te maken
     * die getPositionInBurger(id) heeft dus vervolgens deze functie weer aanroept
     * met altijd de burger. Op die manier wordt de betekenis van de code duidelijker.
     *
     * Verder is het hier heel onduidelijk wat voor id je verwacht. Zou duidelijker
     * zijn als iets van domElementId.
     */
    const getPositionInArray = function(arr, id) {
        /**
         * Probeer consistent te zijn in 'for(' of 'for ('. En ook bij
         * 'if', 'while', etc.. Welke je kiest heeft meer met persoonlijke
         * smaak te maken, maar consistentie is wel belangrijk.
         */
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].match(`id="${id}"`)) {
                /*
                 * Lolol, eigenlijk gewoon 'return arr.indexOf(arr[i])' van
                 * maken, die pos doet niets.
                 *
                 * En nu ik er verder naar kijk komt er volgens mij
                 * uit 'arr.indexOf(arr[i])' altijd hetzelfde getal
                 * als 'i'. 'i' is namelijk de index waar je op dat
                 * moment bent, dus de index opvragen van het element
                 * op index 'i' is natuurlijk altijd gewoon 'i'.
                 */
                return pos = arr.indexOf(arr[i]);
            }
        }
    };

    const swapArrayElements = function(arr, indexA, indexB) {
        let temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
    };

    /**
     * Zou deze functie renderBurger noemen om duidelijker aan te duiden
     * dat hier de element naar het scherm gerendered worden.
     *
     * Daarom roep je nu ook elke keer die listenerAssigner functie
     * aan omdat de events anders niet gebind zijn. Misschien is dat ook wel
     * anders op te lossen als je de echte element bouwt ipv de HTML, zoals
     * ik hierboven geprobeerd heb uit te leggen.
     */
    const buildBurger = function() {
        document.getElementById('holder').innerHTML = burger.join("");
        listenerAssigner(editToppingButtons, 'click', editTopping);
        localStorage.setItem('burger', JSON.stringify(burger));
    };

    const removeTopping = function(el) {
        burger.splice(getPositionInArray(burger, el.closest('.topping').id), 1);
        /**
         * Attributen die in 'data' van een DOM element zitten kun je ook benaderen
         * met dataset.<naam attribute - 'data-'>. In dit geval zou dat dus
         * el.closest('.topping').dataset.calories zijn.
         *
         * Verder zou het netter zijn als: totalCalories -= <number>
         */
        totalCalories = totalCalories - el.closest('.topping').getAttribute('data-calories');
    };

    const editTopping = function() {
        /**
         * Wat doet dit hier? Aangezien je de return niet eens toewijst
         * en dit verder dus niets doet.
         */
        getPositionInArray(burger, this.closest('.topping').id);

        /**
         * Mooiste zou zijn als je de inhoud van de if checks in losse
         * functies stopt. Dan krijg je namelijk
         *     if (this.movingToppingUp()) {
         *         ..function calls
         *     } else if (this.movingToppingDown()) {
         *         ... function calls
         *     } else if (this.deletingTopping()) {
         *         .. function callc
         *     }
         *
         *     Daarnaast roep je in elke situatie de functie
         *     builderBurger aan. Dus die kan/moet weg uit alle if
         *     checks en helemaal aan het eind van de functie.
         *
         *     Verder is het een goede practice om voor dingen hieronder
         *     zoals 'up', 'down', 'delete' constants aan te maken op
         *     een plek waar alle code erbij kan. Dus ergens bovenin dan:
         *         const UP = 'up'
         *         const DOWN = 'down'
         *         const DELETE = 'delete'
         *
         *     Als je vervolgens in je checks de constants gebruikt ipv
         *     de strings dan wordt het minder foutgevoelig. Als je nu
         *     per ongeluk 'upp' typt dan werkt het niet. Als je per ongeluk
         *     UPP zou typen zou je een error krijgen dat die constant niet
         *     bestaat.
         */
        if (this.id === 'up' && pos != 0) {
            swapArrayElements(burger, pos, pos - 1);
            buildBurger();
        } else if (this.id === 'down' && pos != burger.length - 1) {
            swapArrayElements(burger, pos, pos + 1);
            buildBurger();
        } else if (this.id === 'delete') {
            removeTopping(this);
            buildBurger();
        }
    };

    return {
        /**
         * De variable topping is hier enkelvoud, maar er komt een lijst
         * van meerdere toppings binnen. Zou dus meervoud moeten zijn.
         */
        createToppingLinks: function(topping, type) {
            // Hoezo var en geen let?
            for (var i = topping.length - 1; i >= 0; i--) {
                let toppingName = topping[i].replace('_', ' ');
                let addToppingTemplate = `<li><a class="add-topping" type="${type}" id=${topping[i]}>${toppingName}</a></li>`;
                document.getElementById(type).insertAdjacentHTML('beforeend', addToppingTemplate);
            }
        },

        clearBurger: function() {
            burger = [];
            buildBurger();
        },

        /**
         * Warum die init achter de naam? Vind het er verwarrend uitzien,
         * Misschien gedaan om verwarring met de const buildBurger te voorkomen?
         * Zou het dan toch anders proberen op de lossen, waarom de buildBurger
         * functie zoals ie hierboven staat niet gewoon hier neerzetten? De tussenlaag
         * van de buildBurgerInit functie voegt niets toe en maakt het alleen minder
         * overzichtelijk nu.
         *
         * Los daarvan return je nu de uitkomst van de functie, maar de functie levert
         * helemaal geen uitkomst.
         */
        buildBurgerInit: function() {
            return buildBurger();
        },

        triggerTypeMenu: function() {
            /**
             * Waarom hier door al die elementen heen loopen en niet gewoon
             * alleen degene selecteren die nu active zijn? (Als het goed
             * is, is dat er steeds maar 1)
             */
            for(let i = 0; i < toppingModalOptions.length; i++) {
                toppingModalOptions[i].classList.remove('toppings__type--active');
            }

            document.getElementById(this.getAttribute('trigger')).classList.toggle('toppings__type--active');
        },

        addTopping: function() {
            let  toppingName     = this.id,
                 toppingType     = this.getAttribute('type'),
                 toppingCalories = toppings[toppingType][toppingName].calories,
                 toppingImage    = toppings[toppingType][toppingName].shape;

            /**
             * Je update de variable insertIndex nooit, die blijft dus altijd 0. Dus daar kun je gewoon
             * het getal 0 neerzetten en de variable weggooien.
             */
            burger.splice(insertIndex, 0, toppingTemplate(toppingImage, toppingCalories, toppingType, toppingName));
            /**
             * Zou netter zijn als: totalCalories += toppingCalories
             */
            totalCalories = totalCalories + toppingCalories;
            buildBurger();
        },
    }
})();

const BurgerController = (function() {

    const setUpEventListeners = function() {
        listenerAssigner(addToppingOptions, 'click', UIController.addTopping);
        /**
         * Hier merk je dat de naam 'selectToppingType' een verwarrend effect heeft.
         * Blijkbaar zitten daar elementen in, maar door de naamgeving lijkt het
         * alsof het een functie is. Ik zou verwachten dat hier een 'click'
         * event gebind wordt aan allerlei elementen en als ik daar dan op click
         * dat er dan een functie genaamt selectToppingType uitgevoerd wordt.
         */
        listenerAssigner(selectToppingType, 'click', UIController.triggerTypeMenu);
        clearBurgerButton.addEventListener('click', UIController.clearBurger);

    };

    const buildToppingNavigation = function() {
        /**
         * Als je van plant om alle keys uit het burger-elements.js bestand
         * in te laden hier dan kun je ook door het complete toppings object
         * heen loopen, zodat je hier niet elke keer een aanpassing moet maken
         * als je een nieuwe toevoegt in het bestand.
         *
         * Daarnaast is het erg foutgevoelig om de toppings in een ander JS bestand
         * te plaatsen en deze eerder in te laden dan dit bestand. Als je dat vergeet
         * breekt alles en je hebt in dit bestaand geen flauw idee waar de toppings
         * vandaan komen. Ik zou even goed kijken naar de ES6 import mogelijkheden
         * en bovenin het bestand een import definieren om de toppings in te laden.
         */
        UIController.createToppingLinks(Object.keys(toppings.cheese), 'cheese');
        UIController.createToppingLinks(Object.keys(toppings.sauce), 'sauce');
        UIController.createToppingLinks(Object.keys(toppings.meat), 'meat');
        UIController.createToppingLinks(Object.keys(toppings.greens), 'greens');
    }

    /* Deze naam laat niet heel goed zien wat er gebeurt als je deze
     * functie uitvoert. Aangezien oudere browsers geen localStorage
     * ondersteunen had ik hier verwacht dat er een soort compatibility
     * check zou zijn. Ipv daarvan check je of iets bestaat in de localstorage.
     */
    const checkForLocalStorage = function() {

        /* In principe hebben we bij Branch afgesproken om als je
         * een if(<iets true>) {} else {} blok hebt, om dan te beginnen
         * met wat je wil doen als het true is. Hieronder begin je met de
         * false variant, wat imo niet heel logisch is. Is niet een
         * must, maar ik vind het zelf een chille conventie.
         *
         * Daarnaast doet het eerste stuk van deze code niet heel
         * veel nuttige dingen. Het is makkelijker om helemaal bovenin
         * dit betand de burger variable aan te maken als:
         *     let burger = []
         * en hier alleen te checken of er iets in de localStorage zit
         * en dat toewijzen als het nodig is. Dat is en duidelijker, kost
         * minder code en zorgt er ook voor dat de burger default altijd
         * een lege array is.
         */
        if(!localStorage.getItem('burger')) {
            burger = [];
        } else {
            burger = JSON.parse(localStorage.getItem('burger'));
            UIController.buildBurgerInit();
        }
    }

    /* Ik zou de functies die je hieronder aanroept onder de return zetten in
     * dit geval. En dan in dezelfde volgorde als je ze returned, dat leest
     * veel soepeler van boven naar beneden als je erachter probeert te komen
     * wat dit allemaal doet.
     */
    return {
        init: function() {
            buildToppingNavigation();
            setUpEventListeners();
            checkForLocalStorage();
        }
    };

})();

BurgerController.init();
