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
  /* cree la variable textAPI la cual en español indica que se debe generar un resumen profesional de un contenido
  *
  *
  */

  async buildPayload(content) {

    const result = await chrome.storage.local.get('promptTemplate');
    const promptTemplate = result.promptTemplate;

    const textAPI=  `Genera un resumen profesional en español del siguiente contenido:
    tu decides la longitud del resumen en dependencia de la longitud del contenido
    pero la longitud del resumen debe ser de menos de {WORD_LIMIT} palabras, con {MAX_CONTENT_LENGTH} caracteres
    luego del resumen se deben agregar una sección listado de puntos claves con no mas de 10 Puntos Claves,
    al final del resumen se debe agregar una sección de conclusiones,
    determinar el mejor titulo posible para el contenido 
    toda tu respuesta debe estar formateada usando markdown,
    en el resumen debes mantener los puntos clave del siguiente contenido:\n\n{CONTENT}`;

    const defaulttemplate = promptTemplate || textAPI

    const prompt = defaulttemplate.replace('{WORD_LIMIT}' || '{wordLimit}' , CONSTANTS.WORD_LIMIT )
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