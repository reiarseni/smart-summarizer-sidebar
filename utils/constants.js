const CONSTANTS = {
  SIDEBAR_ID: 'smart-summarizer-sidebar',
  API_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
  MODEL_NAME: 'gemini-1.5-flash',
  WORD_LIMIT: 500,
  MAX_CONTENT_LENGTH: 1000,


  SEMANTIC_TAGS: [
    'article', 
    'main', 
    'section', 
    '[role="main"]',
    // Nuevos selectores para sitios antiguos
    'div.entry',       // WordPress, Blogger
    'div.content',     // Sitios genéricos
    'div.post',        // Foros y blogs
    'div.article',     // Sitios de noticias
    'div.main-content', // Bootstrap y otros frameworks
    'div.container'
    
  ],
  
  CONTENT_WEIGHTS: {
    // Peso original para etiquetas HTML5
    'article': 3.0,
    'main': 2.5,
    'section': 2.3,
    '[role="main"]': 2.0,
    
    // Nuevos pesos para divs clásicos
    'div.entry': 1.5,
    'div.content': 1.4,
    'div.post': 1.3,
    'div.article': 1.2,
    'div.main-content': 1.1,
    'div.container': 1.0
  }
};
