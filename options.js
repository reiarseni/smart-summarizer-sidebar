document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('save');
  const status = document.getElementById('status');

  // Cargar API Key existente
  const { apiKey } = await chrome.storage.sync.get('apiKey');
  apiKeyInput.value = apiKey || '';

  // Manejador de guardado
  saveButton.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      showStatus('¡Debes ingresar una API Key!', 'error');
      return;
    }

    await chrome.storage.sync.set({ apiKey });
    showStatus('¡Configuración guardada correctamente!', 'success');
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
      alert("Plantilla personalizada guardada correctamente.");
    });
  } else if (finalTemplate.includes('{WORD_LIMIT}') && finalTemplate.includes('{MAX_CONTENT_LENGTH}')) {
    chrome.storage.local.set({ 'promptTemplate': finalTemplate }, function () {
      alert("Plantilla default guardada correctamente.");
    });
  } else {
    alert('La plantilla debe contener los placeholders {WORD_LIMIT} y {MAX_CONTENT_LENGTH}.');
  }
});