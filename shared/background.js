class HardMode {
  constructor() {
    this.isEnabled = true;
    this.initListeners();
  }

  initListeners() {
    this.addWebRequestListener();
    chrome.browserAction.onClicked.addListener(
      this.browserActionHandler.bind(this)
    );
  }

  // Allow the user to globally enable or disable the addon.
  // A more clever implementation would track this at per-top-level frame,
  // so you could unbreak sites on a per-site basis. But this is ~*Hard Mode*~.
  browserActionHandler() {
    if (this.isEnabled) {
      chrome.browserAction.setBadgeText({ text: "❌" });
      chrome.webRequest.onBeforeSendHeaders.removeListener(
        this.webRequestHandler
      );
      this.isEnabled = false;
    } else {
      chrome.browserAction.setBadgeText({ text: "" });
      this.addWebRequestListener();
      this.isEnabled = true;
    }
  }

  addWebRequestListener() {
    // This firefox detection isn't super robust,
    // but Firefox throws if extraHeaders is in extraInfoSpec.
    // ¯\_(ツ)_/¯
    let probsFirefox = window.browser && !navigator.vendor.length;
    let extraInfoSpec = ["blocking", "requestHeaders"];
    if (!probsFirefox) {
      extraInfoSpec.push("extraHeaders");
    }

    chrome.webRequest.onBeforeSendHeaders.addListener(
      this.webRequestHandler,
      { urls: ["<all_urls>"] },
      extraInfoSpec
    );
  }

  // Add some structured headers with different data types and dare
  // web servers to do anything about it.
  webRequestHandler(details) {
    let headers = details.requestHeaders;
    // Noisy headers modified from the examples in
    // Structured Field Values for HTTP
    // https://tools.ietf.org/html/draft-ietf-httpbis-header-structure-19
    headers.push({
      name: "sec-hardmode-list",
      value:
        `"b", c1/2, "good\"\\\\luck", ("foo"; a=1;b=?0);lvl=5, (), (e f);lvl=-1`,
    });
    headers.push({
      name: "sec-hardmode-dict",
      value:
        `lol="ok", sup=:w4ZibGV0w6ZydGU=:, a=(1 2.1), c=4;aa=bb, d=(5 6);cool`,
    });

    return { requestHeaders: headers };
  }
}

new HardMode();
