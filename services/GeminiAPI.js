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
    const response = await fetch(
      `${CONSTANTS.API_BASE_URL}/${CONSTANTS.MODEL_NAME}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.buildPayload(content))
      }
    );
    
    if (!response.ok) throw new Error('API_ERROR_' + response.status);
    
    const data = await response.json();
    return this.parseResponse(data);
  }

  buildPayload(content) {

    //console.log(helpers.truncateContent(content));

    //TODO: Poder cambiar el idioma
    return {
      contents: [{
        parts: [{
          text: `Genera un resumen profesional en lenguaje español 
             tu decides la longitud del resumen en dependencia de la longitud del contenido
             pero la longitud del resumen debe ser de menos de ${CONSTANTS.WORD_LIMIT} palabras, 
             luego del resumen se deben agregar una sección listado de puntos claves con no mas de 10 Puntos Claves,
             al final del resumen se debe agregar una sección de conclusiones,
             determinar el mejor titulo posible para el contenido 
             toda tu respuesta debe estar formateada usando markdown,
             en el resumen debes mantener los puntos clave del siguiente contenido:\n\n${helpers.truncateContent(content)}`
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