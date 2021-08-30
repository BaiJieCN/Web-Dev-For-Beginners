// let account = null;
let state = Object.freeze({
    account: null
});

const storageKey = 'savedAccount';

function updateState(property, newData) {
    state = Object.freeze({
        ...state,
        [property]: newData
    });
    localStorage.setItem(storageKey, JSON.stringify(state.account))
}

const routes = {
    '/login': { templateId: 'login' },
    '/dashboard': { templateId: 'dashboard', init: refresh},
  };

function navigate(path) {
    window.history.pushState({}, path, path);
    updateRoute();
}

function updateRoute() {
    const path = window.location.pathname;
    const route = routes[path];

    if (!route) {
        return navigate('/dashboard');
    }
    const template = document.getElementById(route.templateId);
    const view = template.content.cloneNode(true);
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(view);
    if (typeof route.init == 'function') {
        route.init();
    }
}
  

  
function onLinkClick(event) {
    event.preventDefault();
    navigate(event.target.href);
}
  
async function register() {
    const registerForm = document.getElementById("registerForm");
    const fromData = new FormData(registerForm);
    const jsonData = JSON.stringify(Object.fromEntries(fromData));
    const result = await createAccount(jsonData);
    
    if (result.error) {
        // return console.log('An error occured:', result.error);
        return updateElement('registerError', result.error);
    }
    console.log('Account created!', result);
    // state.account = result;
    updateState('account', result)
    navigate('/dashboard');
}

async function createAccount(account) {
    try {
        const response = await fetch('//localhost:5000/api/accounts', {
            method: "POST",
            headers: {'Content-Type' : 'application/json'},
            body:  account
        });
        return await response.json();
    } catch (error) {
        return {error: error.message || 'Unknown error'};
    }
}

async function login() {
    const loginForm = document.getElementById("loginForm");
    const user = loginForm.user.value;
    const data = await getAccount(user);
    if (data.error) {
        // return console.log('login error', data.error)
        return updateElement('loginError', data.error)
    } 
    // state.account = data;
    updateState('account', data)
    navigate('/dashboard');
}

async function getAccount(user) {
    try {
        const response = await fetch('//localhost:5000/api/accounts/' + encodeURIComponent(user));
        return await response.json();
    } catch (error) {
        return {error: error.message || 'Unknown error'}
    }
}

function updateElement(id, textOrNode) {
    console.log("Z1 ", id)
    const element = document.getElementById(id);
    console.log("Z2 ", element)
    element.textContent = ''; // Removes all children
    element.append(textOrNode);
}

function updateDashboard() {
    if (!state.account) {
        return logout();
    }
    updateElement('description', state.account.description);
    updateElement('balance', state.account.balance.toFixed(2));
    updateElement('currency', state.account.currency);
    
    const transactionRows = document.createDocumentFragment();
    for (const transaction of state.account.transactions) {
        const transactionRow = createTransactionRow(transaction);
        transactionRows.appendChild(transactionRow);
    }
    updateElement('transactions',transactionRows);
    // console.log(state)
}

function createTransactionRow(transaction) {
    const template = document.getElementById('transaction');
    const transactionRow = template.content.cloneNode(true);
    const tr = transactionRow.querySelector('tr');
    tr.children[0].textContent = transaction.date;
    tr.children[1].textContent = transaction.object;
    tr.children[2].textContent = transaction.amount.toFixed(2);
    return transactionRow;
}

function logout() {
    updateState('account', null);
    navigate('/login');
}

function init() {
    const savedAccount = localStorage.getItem(storageKey);
    if (savedAccount) {
        updateState('account', JSON.parse(savedAccount));
    }

    window.onpopstate = () => updateRoute();
    updateRoute();
}

async function updateAccountData() {
    const account = state.account;
    if (!account) {
        return logout();
    }
    const data = await getAccount(account.user);
    if (data.error) {
        return logout();
    } 
    updateState('account', data)
}

async function refresh() {
    await updateAccountData();
    updateDashboard();
}

init();



// updateRoute('login');
// updateRoute('dashboard');

