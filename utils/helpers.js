const helpers = {
  createElement(html) {
    const template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
  },

  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  truncateContent(text, maxLength = CONSTANTS.MAX_CONTENT_LENGTH) {
    if (text.length <= maxLength) return text;
    const trimmed = text.substr(0, maxLength);
    return trimmed.substr(0, trimmed.lastIndexOf(' ')) + ' [...]';
  },

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

};
