

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

 // Esta parte la he implementado 
 const promptElement = document.getElementById('prompt');
 const savePromptButton = document.getElementById('saveprompt');
 const promptStatus = document.getElementById('promptstatus');


 // Reemplazar los placeholders con los valores correspondientes

savePromptButton.addEventListener('click', function() {

  const template = promptElement.value.trim();
  if (template.includes('{WORD_LIMIT}' ) && template.includes('{MAX_CONTENT_LENGTH}')) {
    chrome.storage.local.set({ 'promptTemplate': template }, function () {
      alert('Plantilla guardada correctamente.');
    });
  } else {
    alert('La plantilla debe contener los placeholders {WORD_LIMIT} y {MAX_CONTENT_LENGTH}.');
  }
});

 // Hasta acá

