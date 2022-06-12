// Database
let incomeDatabase = []
let expenseDatabase = []
let positive = []
let negative = []
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

// Generate items when adding transaction
const generateIncomeItem = (name, value, index) => {
    let incomeItem = document.createElement('li')
    incomeItem.classList.add('green-hist')
    incomeItem.innerHTML = `
        <p title="${name}">${name}</p>
        <p title=" +${Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD'})}">
            ${Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD'})}
        </p>
        <span class="clean-button-green" data-index=${index}>X</span>
        <small class="div-ref-green"></small>`
    document.querySelector('section div div.hist ul.container-list-hist').appendChild(incomeItem);
}
const generateExpenseItem = (name, value, index) => {
    let expenseItem = document.createElement('li')
    expenseItem.classList.add('red-hist')
    expenseItem.innerHTML = `
        <p title="${name}">${name}</p>
        <p title=" +${Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD'})}">
            ${Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD'})}
        </p>
        <span class="clean-button-red" data-index=${index}>X</span>
        <small class="div-ref-red"></small>`
    document.querySelector('section div div.hist ul.container-list-hist').appendChild(expenseItem);
}

// Makes items not repeat/duplicate
const clean = () => {
    let income = document.querySelector('section div div ul.container-list-hist');
    let expense = document.querySelector('section div div ul.container-list-hist');

    while (income.firstChild) {
        income.removeChild(income.lastChild);
    }
    while (expense.firstChild) {
        expense.removeChild(expense.lastChild);
    }
}

// "Refresh" the screen
const refresh = () => {
    clean()
    // Database connection
    let incomeDatabase = getIncomeDatabase();
    let expenseDatabase = getExpenseDatabase();
    let displayIncome = hasInitialDataPositive ? JSON.parse(localStorage.getItem('positiveStorage')).reduce(function (accumulator, currentValor) {
        return accumulator + currentValor
        }, 0) : 0;
    let displayExpense = hasInitialDataNegative ? JSON.parse(localStorage.getItem('negativeStorage')).reduce(function (accumulator, currentValor) {
        return accumulator + currentValor
        }, 0) : 0;
    let displayTotal = displayIncome + displayExpense
        
    // Put the content of the database in the HTML
    document.querySelector('p#incomeValue').innerHTML = `<p id="incomeValue" title="${displayIncome.toLocaleString('en-US' ,{style: 'currency', currency: 'USD'})}">
	    ${displayIncome.toLocaleString('en-US' ,{style: 'currency', currency: 'USD'})}</p>`
    document.querySelector('p#expenseValue').innerHTML = `<p id="expenseValue" title="${displayExpense.toLocaleString('en-US' ,{style: 'currency', currency: 'USD'})}">
	    ${displayExpense.toLocaleString('en-US' ,{style: 'currency', currency: 'USD'})}</p>`
    document.querySelector('p#valueBalance').innerHTML = `<p id="valueBalance" title="${displayTotal.toLocaleString('en-US' ,{style: 'currency', currency: 'USD'})}">
	    ${displayTotal.toLocaleString('en-US' ,{style: 'currency', currency: 'USD'})}</p>`

    // Pass through database arrays
    incomeDatabase.forEach((incomeItem, index) => generateIncomeItem(incomeItem.name, incomeItem.value, index))
    expenseDatabase.forEach((expenseItem, index) => generateExpenseItem(expenseItem.name, expenseItem.value, index))   
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
        let incomeDatabase = getIncomeDatabase();
        let positive = getPositive();
        incomeDatabase.push({'name': name, 'value': valor})
        positive.push(Number(valor))
        setIncomeDatabase(incomeDatabase);
        setPositive(positive)
        refresh()
        document.location.reload(true)
    } 
    // Add item with negative value
    else if (element.id === 'addItem' && valor.includes('-')) {
        let expenseDatabase = getExpenseDatabase();
        let negative = getNegative();
        expenseDatabase.push({'name': name, 'value': valor})
        negative.push(Number(valor))
        setExpenseDatabase(expenseDatabase);
        setNegative(negative)
        refresh()
        document.location.reload(true)
    }
}

const deleteItem = (event) => {
    let element = event.target;
    let index =  element.dataset.index;

    // Delete positive item
    if (element.className === "clean-button-green") {
        let incomeDatabase = getIncomeDatabase();
        let positive = getPositive();
        incomeDatabase.splice(index, 1)
        positive.splice(index, 1)
        setIncomeDatabase(incomeDatabase);
        setPositive(positive)
        refresh()
    }
    // Delete negative item
    else if (element.className === "clean-button-red") {
        let expenseDatabase = getExpenseDatabase();
        let negative = getNegative();
        expenseDatabase.splice(index, 1)
        negative.splice(index, 1)
        setExpenseDatabase(expenseDatabase);
        setNegative(negative)
        refresh()
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