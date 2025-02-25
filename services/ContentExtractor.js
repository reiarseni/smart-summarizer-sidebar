
class ContentExtractor {
  constructor() {
    this.semanticTags = CONSTANTS.SEMANTIC_TAGS;
  }

  async extract() {
    try {
      const mainContent = this.findMainContent();
      return this.cleanContent(mainContent);
    } catch (error) {
      console.error('Content extraction failed:', error);
      return this.fallbackExtract();
    }
  }

  findMainContent() {
    const candidates = Array.from(document.querySelectorAll(this.semanticTags))
      .map(el => ({ element: el, score: this.calculateScore(el) }))
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score);

    return candidates.length > 0 
      ? this.processCandidate(candidates[0].element)
      : document.body.textContent;
  }

  calculateScore(element) {
    let score = 1.0 * this.getBaseScore(element);
    score += 1.0 * this.getTextDensityScore(element);
    score -= 1.0 * this.getLinkDensityPenalty(element);
    score *= 1.0 * this.getHierarchyBonus(element);
    return score;
  }

  getBaseScore(element) {
    const matches = CONSTANTS.SEMANTIC_TAGS.filter(selector => element.matches(selector));
    return matches.reduce((max, selector) => Math.max(max, CONSTANTS.CONTENT_WEIGHTS[selector] || 0.5), 0.5);
  }

  getTextDensityScore(element) {
    const textLength = element.textContent.trim().length;
    const childCount = element.children.length || 1;
    return textLength / childCount;
  }

  getLinkDensityPenalty(element) {
    const links = element.querySelectorAll("a").length;
    const textLength = element.textContent.trim().length;
    return links > 0 ? (links / textLength) * 10 : 0;
  }

  getHierarchyBonus(element) {
    // Bonus por profundidad en el DOM (sitios antiguos usan más anidación)
    const depth = this.getDomDepth(element);
    return 1 + (depth * 0.05);
  }

  getDomDepth(element) {
    let depth = 0;
    while (element.parentNode) {
      depth++;
      element = element.parentNode;
    }
    return depth;
  }

  processCandidate(element) {
    const clone = element.cloneNode(true);
    this.removeNonContentElements(clone);
    return clone.textContent;
  }

  removeNonContentElements(element) {
    const selectors = ['script', 'style', 'iframe', 'nav', 'footer', '.ad'];
    selectors.forEach(selector => {
      element.querySelectorAll(selector).forEach(el => el.remove());
    });
  }

  cleanContent(content) {
    return content
      .replace(/\s+/g, ' ')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
      .replace(/https?:\/\/[^\s]+/g, '')
      .trim();
  }

  fallbackExtract() {
    return document.body.textContent;
  }
}
