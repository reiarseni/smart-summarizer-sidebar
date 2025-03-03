chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' })
    .catch((error) => {
      console.error('No se pudo enviar el mensaje a la pestaña:', error);
    });
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'openOptions') {
    chrome.runtime.openOptionsPage();
  }
});


