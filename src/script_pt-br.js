// Banco de dados
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

// Gerar itens ao adicionar transação
const generateItem = (name, value, index, type, color) => {
    let item = document.createElement('li')
    item.classList.add(type)
    item.innerHTML = `
        <p title="${name}">${name}</p>
        <p title=" +${Number(value).toLocaleString('pt-BR' ,{style: 'currency', currency: 'BRL'})}">
            ${Number(value).toLocaleString('pt-BR' ,{style: 'currency', currency: 'BRL'})}
        </p>
        <span class="clean-button-${color}" data-index=${index}>X</span>
        <small class="div-ref-${color}"></small>
    `
    document.querySelector('section div div.hist ul.container-list-hist').appendChild(item);
}

// Faz com que os itens não sejam repetidos/duplicados
const clean = () => {
    let item = document.querySelector('section div div ul.container-list-hist');

    while (item.firstChild) {
        item.removeChild(item.lastChild);
    }
}

// "Atualiza" a tela
const refresh = () => {
    clean()
    // Conexão com o banco de dados
    let incomeDatabase = getIncomeDatabase();
    let expenseDatabase = getExpenseDatabase();
    let displayIncome = hasInitialDataPositive ? JSON.parse(localStorage.getItem('positiveStorage')).reduce((accumulator, currentValor) => { return accumulator + currentValor}, 0) : 0;
    let displayExpense = hasInitialDataNegative ? JSON.parse(localStorage.getItem('negativeStorage')).reduce(function (accumulator, currentValor) { return accumulator + currentValor}, 0) : 0;
    
    let displayTotal = displayIncome + displayExpense
        
    // Coloca no HTML o conteúdo do banco de dados
    document.querySelector('p#incomeValue').innerHTML = `
    <p 
    id="incomeValue" 
    title="${displayIncome.toLocaleString('pt-BR' ,{style: 'currency', currency: 'BRL'})}"
    >
	    ${displayIncome.toLocaleString('pt-BR' ,{style: 'currency', currency: 'BRL'})}
    </p>
    `
    document.querySelector('p#expenseValue').innerHTML = `
    <p 
    id="expenseValue" 
    title="${displayExpense.toLocaleString('pt-BR' ,{style: 'currency', currency: 'BRL'})}"
    >
	    ${displayExpense.toLocaleString('pt-BR' ,{style: 'currency', currency: 'BRL'})}
    </p>
    `
    document.querySelector('p#valueBalance').innerHTML = `
    <p 
    id="valueBalance" 
    title="${displayTotal.toLocaleString('pt-BR' ,{style: 'currency', currency: 'BRL'})}"
    >
	    ${displayTotal.toLocaleString('pt-BR' ,{style: 'currency', currency: 'BRL'})}
    </p>
    `

    // Passa pelos arrays do banco de dados
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
        alert('A transação precisa de um nome e um valor')
        return
    }
    // Adicionar item com valor positivo
    else if (element.id === 'addItem' & valor.indexOf('-')) {
        shortener('add', incomeDatabase, setIncomeDatabase, positive, setPositive, name, valor)
        document.location.reload(true)
    } 
    // Adicionar item com valor negativo
    else if (element.id === 'addItem' && valor.includes('-')) {
        shortener('add', expenseDatabase, setExpenseDatabase, negative, setNegative, name, valor)
        document.location.reload(true)
    }
}

const deleteItem = (event) => {
    let element = event.target;
    let index =  element.dataset.index;

    // Apagar item positivo
    if (element.className === "clean-button-green") {
        shortener('remove', incomeDatabase, setIncomeDatabase, positive, setPositive, null, null, index)
    }
    // Apagar item negativo
    else if (element.className === "clean-button-red") {
        shortener('remove', expenseDatabase, setExpenseDatabase, negative, setNegative, null, null, index)
    }
}

// Permite que os itens sejam adicionados com a tecla 'Enter'
document.getElementsByName("valueCamp").forEach((i)=>i.addEventListener('keydown', (event)=>{
    if(event.code.includes('Enter')){
        let enter = {target: document.querySelector('section div button#addItem')}
        insertItem(enter)
    }
}))

// Ouvidor de eventos click para as funções
document.querySelector('section div button#addItem').addEventListener('click', insertItem)
document.querySelector('section div div ul.container-list-hist').addEventListener('click', deleteItem)
refresh()