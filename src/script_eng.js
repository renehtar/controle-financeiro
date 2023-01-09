// Database
let hasInitialDataPositive = Boolean(localStorage.getItem('positiveStorage'))
let hasInitialDataNegative = Boolean(localStorage.getItem('negativeStorage'))                        

const getIncomeDatabase = () => JSON.parse(localStorage.getItem('incomeStorage')) ?? [];
const setIncomeDatabase = (incomeDatabase) => localStorage.setItem('incomeStorage', JSON.stringify(incomeDatabase));
const getExpenseDatabase = () => JSON.parse(localStorage.getItem('expenseStorage')) ?? [];
const setExpenseDatabase = (expenseDatabase) => localStorage.setItem('expenseStorage', JSON.stringify(expenseDatabase));
const getPositive = () => hasInitialDataPositive ? JSON.parse(localStorage.getItem('positiveStorage')) : [];
const setPositive = (positive) => localStorage.setItem('positiveStorage',JSON.stringify(positive));
const getNegative =() => hasInitialDataNegative ? JSON.parse(localStorage.getItem('negativeStorage')) : [];
const setNegative = (negative)=> localStorage.setItem('negativeStorage',JSON.stringify(negative));

let incomeDatabase = getIncomeDatabase();
let positive = getPositive();
let expenseDatabase = getExpenseDatabase();
let negative = getNegative();

// Generate items when adding transaction
const generateItem = (name, value, index, type, color) => {
    let item = document.createElement('li')
    item.classList.add(type)
    item.innerHTML = `
        <p title="${name}">${name}</p>
        <p title=" +${Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD'})}">
            ${Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD'})}
        </p>
        <span class="clean-button-${color}" data-index=${index}>X</span>
        <small class="div-ref-${color}"></small>
    `
    document.querySelector('section div div.hist ul.container-list-hist').appendChild(item);
}

// Makes items not repeat/duplicate
const clean = () => {
    let item = document.querySelector('section div div ul.container-list-hist');

    while (item.firstChild) {
        item.removeChild(item.lastChild);
    }
}

// "Refresh" the screen
const refresh = () => {
    clean()
    // Database connection
    let incomeDatabase = getIncomeDatabase();
    let expenseDatabase = getExpenseDatabase();
    let displayIncome = hasInitialDataPositive ? JSON.parse(localStorage.getItem('positiveStorage')).reduce((accumulator, currentValor) => { return accumulator + currentValor }, 0) : 0;
    let displayExpense = hasInitialDataNegative ? JSON.parse(localStorage.getItem('negativeStorage')).reduce((accumulator, currentValor) => { return accumulator + currentValor}, 0) : 0;

    let displayTotal = displayIncome + displayExpense
        
    // Put the content of the database in the HTML
    document.querySelector('p#incomeValue').innerHTML = `
    <p 
    id="incomeValue" 
    title="${displayIncome.toLocaleString('en-US' ,{style: 'currency', currency: 'USD'})}"
    >
	    ${displayIncome.toLocaleString('en-US' ,{style: 'currency', currency: 'USD'})}
    </p>
    `
    document.querySelector('p#expenseValue').innerHTML = `
    <p 
    id="expenseValue" 
    title="${displayExpense.toLocaleString('en-US' ,{style: 'currency', currency: 'USD'})}"
    >
	    ${displayExpense.toLocaleString('en-US' ,{style: 'currency', currency: 'USD'})}
    </p>
    `
    document.querySelector('p#valueBalance').innerHTML = `
    <p 
    id="valueBalance" 
    title="${displayTotal.toLocaleString('en-US' ,{style: 'currency', currency: 'USD'})}"
    >
	    ${displayTotal.toLocaleString('en-US' ,{style: 'currency', currency: 'USD'})}
    </p>
    `

    // Pass through database arrays
    incomeDatabase.forEach((incomeItem, index) => {
        generateItem(incomeItem.name, incomeItem.value, index, 'green-hist', 'green')
    })
    expenseDatabase.forEach((expenseItem, index) => {
        generateItem(expenseItem.name, expenseItem.value, index, 'red-hist', 'red')
    })   
}

const shortener = (operation, capital, setCapital, type, setType, name, valor, index) => {
    if (operation === 'add') {
        capital.push({'name': name, 'value': valor})
        type.push(Number(valor))
    } else {
        capital.splice(index, 1)
        type.splice(index, 1)
    }
    setCapital(capital);
    setType(type)
    refresh()
}

const insertItem = (event) => {
    let element = event.target;
    let name = document.querySelector('section div div input.input-name').value;
    let valor = document.querySelector('section div div input.input-valor').value;
    
    if (name === "" || valor === "") {
        alert('The transaction needs a name and a value')
        return
    }
    // Add item with positive value
    else if (element.id === 'addItem' & valor.indexOf('-')) {
        shortener('add', incomeDatabase, setIncomeDatabase, positive, setPositive, name, valor)
        document.location.reload(true)
    } 
    // Add item with negative value
    else if (element.id === 'addItem' && valor.includes('-')) {
        shortener('add', expenseDatabase, setExpenseDatabase, negative, setNegative, name, valor)
        document.location.reload(true)
    }
}

const deleteItem = (event) => {
    let element = event.target;
    let index =  element.dataset.index;

    // Delete positive item
    if (element.className === "clean-button-green") {
        shortener('remove', incomeDatabase, setIncomeDatabase, positive, setPositive, null, null, index)
    }
    // Delete negative item
    else if (element.className === "clean-button-red") {
        shortener('remove', expenseDatabase, setExpenseDatabase, negative, setNegative, null, null, index)
    }
}

// Allows items to be added with the 'Enter' key
document.getElementsByName("valueCamp").forEach((i)=>i.addEventListener('keydown', (event)=>{
    if(event.code.includes('Enter')){
        let enter = {target: document.querySelector('section div button#addItem')}
        insertItem(enter)
    }
}))

// Click event listener for insert and delete items functions.
document.querySelector('section div button#addItem').addEventListener('click', insertItem)
document.querySelector('section div div ul.container-list-hist').addEventListener('click', deleteItem)
refresh()