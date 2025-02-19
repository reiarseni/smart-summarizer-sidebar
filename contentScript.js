class SmartSummarizer {
  constructor() {
    this.sidebar = null;
    this.extractor = new ContentExtractor();
    this.api = new GeminiAPI();
    this.initialize();
  }

  initialize() {
    this.injectSidebar();
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.action === 'toggleSidebar') this.toggleSidebar();
    });
  }

  injectSidebar() {

    const existingSidebar = document.getElementById(CONSTANTS.SIDEBAR_ID);
    if (existingSidebar) {
      existingSidebar.remove();
    }

    const sidebarHTML = `
      <div id="${CONSTANTS.SIDEBAR_ID}" class="smart-summarizer-sidebar">
        <div class="sidebar-header">
          <h2>${chrome.i18n.getMessage("sidebarTitle")}</h2>
          <button class="close-button">×</button>
        </div>
        <div class="sidebar-content"></div>
      </div>
    `;
    document.body.appendChild(helpers.createElement(sidebarHTML));
    this.setupEventListeners();
  }

  setupEventListeners() {
    const closeButton = document.querySelector(`#${CONSTANTS.SIDEBAR_ID} .close-button`);
    closeButton.addEventListener('click', () => this.toggleSidebar());
  }

  async toggleSidebar() {
    const sidebar = document.getElementById(CONSTANTS.SIDEBAR_ID);
    sidebar.classList.toggle('active');
    if (sidebar.classList.contains('active')) {
      await this.generateSummary();
    }
  }

  async generateSummary() {
    const container = document.querySelector(`#${CONSTANTS.SIDEBAR_ID} .sidebar-content`);
    this.showLoadingState(container);

    try {
      const content = await this.extractor.extract();
      const summary = await this.api.generateSummary(content);
      this.showSummary(summary, container);
    } catch (error) {
      this.showError(error, container);
    }
  }

  showLoadingState(container) {
    container.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>${chrome.i18n.getMessage("loadingMessage")}</p>
      </div>
    `;
  }

  showSummary(summary, container) {
    /*container.innerHTML = `
      <div class="summary-content">
        ${helpers.escapeHTML(summary)}
      </div>
    `;*/

      // Convertir Markdown a HTML
      const rawHtml = marked.parse(summary);
  
      // Sanitizar el HTML
      const cleanHtml = DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: ['div', 'p', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'a'],
        ALLOWED_ATTR: ['href', 'target']
      });
  
      container.innerHTML = `
        <div class="summary-content">
          ${cleanHtml}
        </div>
      `;
      
      this.applyMarkdownStyles();
  }

  applyMarkdownStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .summary-content {
        font-family: system-ui, sans-serif;
        line-height: 1.6;
      }
      .summary-content h1 { font-size: 1.5em; color: #1a1a1a; }
      .summary-content h2 { font-size: 1.3em; color: #2d2d2d; }
      .summary-content ul { padding-left: 1.5em; }
      .summary-content a { color: #4285f4; text-decoration: underline; }
    `;
    document.head.appendChild(style);
  }

  showError(error, container) {
    let message = chrome.i18n.getMessage("errorGeneric");

    let isApiError = false;
    
    if (error.message.includes('API_KEY_MISSING')) {
      message = chrome.i18n.getMessage("errorAPIKey");
      isApiError = true;
    } else if (error.message.includes('NO_SUMMARY')) {
      message = chrome.i18n.getMessage("errorNoSummary");
    }

    if (isApiError) {
        container.innerHTML = `
        <div class="error-container">
          <a href="#" id="open-options">${message}</a>
        </div>
        `;
        
        // Agrega este evento
        document.getElementById('open-options').addEventListener('click', (e) => {
          e.preventDefault();
          chrome.runtime.sendMessage({ action: 'openOptions' });
        }); 

    } else {
        container.innerHTML = `
        <div class="error-container">
          <p>${message}</p>
          <button class="retry-button">${chrome.i18n.getMessage("retryButton")}</button>
        </div>
        `;

        container.querySelector('.retry-button').addEventListener('click', () => this.generateSummary());
    }
  }
}

new SmartSummarizer();
