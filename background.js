chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' })
    .catch((error) => {
      console.error('No se pudo enviar el mensaje a la pestaña:', error);
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openOptionsPage') {
    chrome.runtime.openOptionsPage()
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error }));
    // Retorna true para indicar que enviarás respuesta de forma asíncrona.
    return true;
  }
});