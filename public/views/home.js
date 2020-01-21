function loadHome() {
  state = { view: 'home' };
  const inputTitleContainer = document.getElementById('input-title-container');
  const inputBodyContainer = document.getElementById('input-body-container');
  const httpBtnContainer = document.getElementById('http-btn-container');
  const messageContainer = document.getElementById('message-container');
  inputTitleContainer.innerHTML = `
  <div id="welcome">Welcome!</div>
  <div id="instruction">Please select an API to test from the menu.</div>
  `;
  inputBodyContainer.innerHTML = '';
  httpBtnContainer.hidden = true;
  for (let httpBtn of httpBtnContainer.children) httpBtn.hidden = true;
  messageContainer.hidden = true;
  for (let element of messageContainer.children) element.hidden = true;
};