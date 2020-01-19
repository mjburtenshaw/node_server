function checkIfReadyToRequest() {
  const createBtn = document.getElementById('create-btn');
  if (createBtn.disabled && state.permissions && state.action) createBtn.disabled = false;
};

function getResources(app) {
  let resources = [];
  if (app === 'DRIVE') resources = ['about', 'changes', 'channels', 'comments', 'files', 'permissions', 'replies', 'revisions', 'drives'];
  if (app === 'DOCS' ) resources = ['documents'];
  return resources;
};

function getActions(resource) {
  let actions = [];
  if (state.app === 'DRIVE') {
    if (resource === 'about'      ) actions = ['get'];
    if (resource === 'changes'    ) actions = ['getStartPageToken', 'list', 'watch'];
    if (resource === 'channels'   ) actions = ['stop'];
    if (resource === 'comments'   ) actions = ['create', 'delete', 'get', 'list', 'update'];
    if (resource === 'files'      ) actions = ['copy', 'create', 'delete', 'emptyTrash', 'export', 'generateIds', 'get', 'list', 'update', 'watch'];
    if (resource === 'permissions') actions = ['create', 'delete', 'get', 'list', 'update'];
    if (resource === 'replies'    ) actions = ['create', 'delete', 'get', 'list', 'update'];
    if (resource === 'revisions'  ) actions = ['delete', 'get', 'list', 'update'];
    if (resource === 'drives'     ) actions = ['create', 'delete', 'get', 'hide', 'list', 'unhide', 'update'];
  } else if (state.app === 'DOCS') {
    if (resource === 'documents') actions = ['batchUpdate', 'create', 'get'];
  };
  return actions;
};

function handlePermissionsPicker(event) {
  const permissions = event.target.value;
  state.permissions = permissions;
  checkIfReadyToRequest();
};

function handleAppPicker(event) {
  const app = event.target.value;
  state.app = app;
  if (!state.resource) {
    const resources = getResources(app);
    const resourceOptions = resources.map(resource => {
      let displayValue = resource.slice();
      displayValue = displayValue.charAt(0).toUpperCase() + displayValue.substring(1);
      return `<option value="${resource}">${displayValue}</option>`;
    }).join('');
    const resourcePicker = document.getElementById('google-picker-resource');
    resourcePicker.innerHTML = `
      <option value="" disabled selected>Select a resource</option>
      ${resourceOptions}
    `;
  };
};

function handleResourcePicker(event) {
  const resource = event.target.value;
  state.resource = resource;
  if (!state.action) {
    const actions = getActions(resource);
    const actionOptions = actions.map(action => {
      let displayValue = action.slice();
      displayValue = displayValue.charAt(0).toUpperCase() + displayValue.substring(1);
      return `<option value="${action}">${displayValue}</option>`;
    });
    const actionPicker = document.getElementById('google-picker-action');
    actionPicker.innerHTML = `
      <option value="" disabled selected>Select an action</option>
      ${actionOptions}
    `;
  };
};

function handleActionPicker(event) {
  const action = event.target.value;
  state.action = action;
  const createBtn = document.getElementById('create-btn');
  if (createBtn.disabled && state.permissions) createBtn.disabled = false;
  checkIfReadyToRequest();
};

function handleBodyChange(event) {
  const args = event.target.value.replace(/\s/g, '');
  state.args = JSON.parse(`{${args}}`);
};

function assignGoogleEventHandlers() {
  const permissionsPicker = document.getElementById('google-picker-permissions');
  const appPicker = document.getElementById('google-picker-app')
  const resourcePicker = document.getElementById('google-picker-resource');
  const actionPicker = document.getElementById('google-picker-action');
  const bodyInput = document.getElementById('google-body-input');
  permissionsPicker.addEventListener('change', handlePermissionsPicker);
  appPicker.addEventListener('change', handleAppPicker);
  resourcePicker.addEventListener('change', handleResourcePicker);
  actionPicker.addEventListener('change', handleActionPicker);
  bodyInput.addEventListener('keyup', handleBodyChange);
};

function loadGoogle() {
  const inputTitleContainer = document.getElementById('input-title-container');
  const inputBodyContainer = document.getElementById('input-body-container');
  const httpBtnContainer = document.getElementById('http-btn-container');
  const messageContainer = document.getElementById('message-container');
  inputTitleContainer.innerHTML = `<div id="instruction">Google API</div>`;
  inputBodyContainer.innerHTML = `
    <div id="google-picker-container-permissions" class="google-picker-container">
      <span id="google-picker-title-permissions" class="google-picker-title">Permissions</span>
      <select id="google-picker-permissions" class="google-picker">
        <option value="" disabled selected>Select a permission scope</option>
        <option value="FULL">Full</option>
      </select>
    </div>
    <div id="google-picker-container-app" class="google-picker-container">
      <span id="google-picker-title-app" class="google-picker-title">App</span>
      <select id="google-picker-app" class="google-picker">
        <option value="" disabled selected>Select a Google App</option>
        <option value="DRIVE">Drive</option>
        <option value="DOCS">Docs</option>
      </select>
    </div>
    <div id="google-picker-container-resource" class="google-picker-container">
      <span id="google-picker-title-resource" class="google-picker-title">Resource</span>
      <select id="google-picker-resource" class="google-picker">
        <option value="" disabled selected>Select an app first</option>
      </select>
    </div>
    <div id="google-picker-container-action" class="google-picker-container">
      <span id="google-picker-title-action" class="google-picker-title">Action</span>
      <select id="google-picker-action" class="google-picker">
        <option value="" disabled selected>Select an app & resource first</option>
      </select>
    </div>
    <span id="google-body-input-title">Body</span>
    <textarea id="google-body-input" rows="10" cols="100">"params": {\n  "key": "value"\n}</textarea>
  `;
  httpBtnContainer.hidden = false;
  for (let httpBtn of httpBtnContainer.children) {
    httpBtn.hidden = false;
    httpBtn.disabled = true;
  };
  messageContainer.hidden = false;
  for (let element of messageContainer.children) element.hidden = false;
  assignGoogleEventHandlers();
};