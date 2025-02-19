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
