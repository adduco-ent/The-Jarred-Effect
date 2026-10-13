/* privacy.html, 404.html, unsubscribed.html — the footer year, plus the unsubscribe outcome from ?link= */
(function () {
var DCLogic = TJE.DCLogic;
class Component extends DCLogic {
  renderVals() {
    var link = '';
    try { link = new URLSearchParams(location.search).get('link') || ''; } catch (e) { link = ''; }
    return {
      year: String(new Date().getFullYear()),
      linkOk: link !== 'invalid' && link !== 'retry',
      linkInvalid: link === 'invalid',
      linkRetry: link === 'retry'
    };
  }
}
TJE.mount(Component);
})();
