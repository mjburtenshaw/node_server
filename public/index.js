var state = {};

async function getApiList() {
  try {
    const response = await axios.get('http://localhost:8080/api/list');
    if (response.status === 200) return response.data;
  } catch (error) {
    console.error(error);
  }
};

async function populateMenu() {
  const apiList = await getApiList();
  const menuOptions = apiList.map(api => {
    let displayName = api.slice();
    displayName = displayName.charAt(0).toUpperCase() + displayName.substring(1);
    return `<div id="${api}-menu-link" class="menu-link api-link" value="${api}">${displayName}</div>`
  }).join('');
  const menu = `
    <div id="home-link" class="menu-link" value="home">Home</div>
    <div id="api-list-container">
      ${menuOptions}
    </div>
  `;
  const menuContainer = document.getElementById('menu-container');
  menuContainer.innerHTML = menu;
};

function toggleMenuView(event) {
  const menuContainer = document.getElementById('menu-container');
  menuContainer.hidden = !menuContainer.hidden;
};

function toggleApiView(event) {
  const view = event.target.getAttribute('value');
  toggleMenuView();
  state.view = view;
  views[view].load();
  localStorage.setItem('view', view);
};

function constructBody() {
  let body = {};
  if (state.view === 'google') {
    body.permissions = state.permissions;
    body.app = state.app;
    body.resource = state.resource;
    body.action = state.action;
    body.args = Object.entries(state.args).map(arg => arg[1]);
  };
  return body;
};

async function handleHttpRequest(event) {
  const method = event.target.value;
  const endpoint = `http://localhost:8080/${state.view}/`;
  try {
    let response;
    const body = constructBody();
    if (method === 'POST') response = await axios.post(endpoint, body);
    if (response.status === 200) {
      const messageBody = document.getElementById('message-body');
      messageBody.innerHTML = `<div id="message">${JSON.stringify(response.data)}</div>`;
    } else console.log('There was an error: ', response);
  } catch (error) {
    console.log(`An error was caught while trying to make a ${method} request to ${endpoint}: `, error);
  }
};

function assignEventHandlers() {
  const menuIcon = document.getElementById('menu-icon-container');
  const apiLinks = document.getElementsByClassName('menu-link');
  const httpButtons = document.getElementsByClassName('http-btn');
  for (let httpButton of httpButtons) httpButton.addEventListener('click', handleHttpRequest);
  menuIcon.addEventListener('click', toggleMenuView);
  for (let apiLink of apiLinks) apiLink.addEventListener('click', toggleApiView);
};

async function initLoad() {
  await populateMenu();
  let view = localStorage.getItem('view');
  if (!view) {
    view = 'home';
    localStorage.setItem('view', view);
  };
  state.view = view;
  views[view].load();
  assignEventHandlers();
};

initLoad();