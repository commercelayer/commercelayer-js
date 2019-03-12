let clayerConfig = document.querySelector('#clayer-config');

module.exports = {
  baseUrl: clayerConfig.dataset.baseUrl,
  clientId: clayerConfig.dataset.clientId,
  marketId: clayerConfig.dataset.marketId,
  countryCode: clayerConfig.dataset.countryCode,
  languageCode: clayerConfig.dataset.languageCode.split("-")[0],
  cartUrl: clayerConfig.dataset.cartUrl,
  returnUrl: clayerConfig.dataset.returnUrl,
  privacyUrl: clayerConfig.dataset.privacyUrl,
  termsUrl: clayerConfig.dataset.termsUrl,
  devSettings: {
    debug: clayerConfig.dataset.devSettingsDebug,
    console: clayerConfig.dataset.devSettingsConsole,
    trace: clayerConfig.dataset.devSettingsTrace
  }
}
