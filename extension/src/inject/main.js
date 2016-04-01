require(
  { baseUrl: chrome.extension.getURL("/") },
  ["src/inject/main-init"],
  function (App) {
      console.log('main.js')

  }
);