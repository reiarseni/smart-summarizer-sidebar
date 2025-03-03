document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('save');
  const status = document.getElementById('status');

  // Aplicar traducciones para q el html funcione y me traduzca tambien los input y los textarea

  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.placeholder = chrome.i18n.getMessage(key);
    } else {
      element.textContent = chrome.i18n.getMessage(key);
    }

  });
  // Cargar API Key existente
  const { apiKey } = await chrome.storage.sync.get('apiKey');
  apiKeyInput.value = apiKey || '';

  // Manejador de guardado
  saveButton.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();

    /*utilizamos el chorme.i18n (utiliza la libreria q sea del idioma del Chrome) para 
    * coger de locales tanto los status como las alertas de diferentes idiomas 
    */
    if (!apiKey) {
      var statusMessage = chrome.i18n.getMessage("status_message");
      showStatus(statusMessage, 'error');
      return;
    }

    await chrome.storage.sync.set({ apiKey });
    var statusMessage1 = chrome.i18n.getMessage("status_message1");
      showStatus(statusMessage1, 'success');
  });

  function showStatus(message, type = 'info') {
    status.textContent = message;
    status.style.color = type === 'error' ? '#dc2626' : '#34a853';
    setTimeout(() => status.textContent = '', 3000);
  }
});


 const promptElement = document.getElementById('prompt');
 const savePromptButton = document.getElementById('save');
 const promptStatus = document.getElementById('promptstatus');
 const maxContentLength = document.getElementById('maxContentLength');
 const wordLimit = document.getElementById('wordLimit');


 savePromptButton.addEventListener('click', function() {

  const template = promptElement.value.trim();

  const finalTemplate = template;
   
  if (finalTemplate.includes('{wordLimit}') && finalTemplate.includes('{maxContentLength}')  ){
    chrome.storage.local.set({ 'promptTemplate': finalTemplate }, function () {
      var alertMessage = chrome.i18n.getMessage("alert_message");
      alert( alertMessage);
    });
  } else if (finalTemplate.includes('{WORD_LIMIT}') && finalTemplate.includes('{MAX_CONTENT_LENGTH}')) {
    chrome.storage.local.set({ 'promptTemplate': finalTemplate }, function () {
      var alertMessage1 = chrome.i18n.getMessage("alert_message1");
      alert( alertMessage1);
    });
  };
});