
let pos;
let burger;

let toppingIndex  = 0,
    insertIndex   = 0,
    totalCalories = 0;

const addToppingOptions = document.getElementsByClassName('add-topping');
const selectToppingType = document.getElementsByClassName('toppings__type-selector');
const editToppingButtons = document.getElementsByClassName('options__option');
const clearBurgerButton = document.getElementById('clear-burger-toppings');
const toppingType = document.getElementsByClassName('toppings__type');

const listenerAssigner = function(nodelist, type, fn) {
    for(var i = 0; i < nodelist.length; i++) {
        nodelist[i].addEventListener('click', fn);
    }
};

const UIController = (function() {

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

    const getPositionInArray = function(arr, id) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].match(`id="${id}"`)) {
                return pos = arr.indexOf(arr[i]);
            }
        }
    };

    const swapArrayElements = function(arr, indexA, indexB) {
        let temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
    };

    const buildBurger = function() {
        document.getElementById('holder').innerHTML = burger.join("");
        listenerAssigner(editToppingButtons, 'click', editTopping);
        localStorage.setItem('burger', JSON.stringify(burger));
    };

    const insertTopping = function() {
        let el = this.closest('.topping');
        insertIndex = getPositionInArray(burger, el.id) + 1;
    };

    const removeTopping = function(el) {
        burger.splice(getPositionInArray(burger, el.closest('.topping').id), 1);
        totalCalories = totalCalories - el.closest('.topping').getAttribute('data-calories');
    };

    const editTopping = function() {
        getPositionInArray(burger, this.closest('.topping').id);
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
        createToppingLinks: function(topping, type) {
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

        triggerTypeMenu: function() {
            let toppingModalOptions = document.getElementsByClassName('toppings__type');

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

            burger.splice(insertIndex, 0, toppingTemplate(toppingImage, toppingCalories, toppingType, toppingName));
            totalCalories = totalCalories + toppingCalories;
            buildBurger();
        },


    }

})();

const BurgerController = (function() {

    const setUpEventListeners = function() {
        listenerAssigner(addToppingOptions, 'click', UIController.addTopping);
        listenerAssigner(selectToppingType, 'click', UIController.triggerTypeMenu);
        clearBurgerButton.addEventListener('click', UIController.clearBurger);

    };

    const buildToppingNavigation = function() {
        UIController.createToppingLinks(Object.keys(toppings.cheese), 'cheese');
        UIController.createToppingLinks(Object.keys(toppings.sauce), 'sauce');
        UIController.createToppingLinks(Object.keys(toppings.meat), 'meat');
        UIController.createToppingLinks(Object.keys(toppings.greens), 'greens');
    }

    const checkForLocalStorage = function() {
        if(!localStorage.getItem('burger')) {
            burger = [];
        } else {
            burger = JSON.parse(localStorage.getItem('burger'));
        }
    }

    return {
        init: function() {
            buildToppingNavigation();
            setUpEventListeners();
            checkForLocalStorage();
        }
    };

})();

BurgerController.init();
