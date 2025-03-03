class GeminiAPI {
  constructor() {
    this.apiKey = null;
  }

  async initialize() {
    const { apiKey } = await chrome.storage.sync.get('apiKey');
    if (!apiKey) throw new Error('API_KEY_MISSING');
    this.apiKey = apiKey;
  }

  async generateSummary(content) {
    await this.initialize();
    const payload = await this.buildPayload(content);
    const response = await fetch(
      `${CONSTANTS.API_BASE_URL}/${CONSTANTS.MODEL_NAME}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );
    
    if (!response.ok) throw new Error('API_ERROR_' + response.status);
    
    const data = await response.json();
    return this.parseResponse(data);
  }
  /* cree la variable textAPI para almacenar el mensaje de texto de la API en el archivo de mensajes de Chrome,
  * reemplazando las variables de sustitución con los valores correspondientes segun el idioma del chrome
  */

  async buildPayload(content) {

    const result = await chrome.storage.local.get('promptTemplate');
    var promptTemplate = result.promptTemplate;

    var textAPI = chrome.i18n.getMessage("textAPI");

    var defaulttemplate = promptTemplate || textAPI;

    var prompt = defaulttemplate.replace('{WORD_LIMIT}' || '{wordLimit}' , CONSTANTS.WORD_LIMIT )
    .replace('{MAX_CONTENT_LENGTH}' || '{maxContentLength}' ,  CONSTANTS.MAX_CONTENT_LENGTH)
      .replace('{CONTENT}', helpers.truncateContent(content));

    return {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: CONSTANTS.WORD_LIMIT * 2
      }
    };
  }

  parseResponse(data) {
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('NO_SUMMARY');
    }
    return data.candidates[0].content.parts[0].text;
  }
}