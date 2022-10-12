async function codec() {
    let url = window.location.href;
    console.log("Running ext for ", url)
    let matchResult = url.match(/https:\/\/music.apple.com\/(\w\w)\/album\/.+\/(\d+)/);
    let region = matchResult[1];
    let albumID = matchResult[2];
    let src = document.documentElement.innerHTML
    let token = src.match(/(eyJhbGc.+?)%22%7D/)[1]
    const result = await fetch(`https://amp-api.music.apple.com/v1/catalog/${region}/albums/${albumID}`, {
        "headers": {
            "authorization": `Bearer ${token}`
        },
        "referrer": "https://music.apple.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    var codecs = await result.json()
    codecs = codecs.data[0].attributes.audioTraits
    let str = "<div class=\"product-meta typography-callout-emphasized\">AVAILABLE IN "
    str += codecs.join(" | ");
    str += "</div>";
    let selector = document.querySelector("#web-main > div.loading-inner > div > div.product-info > div > div.product-header > div.product-page-header > div > div.product-meta.typography-callout-emphasized");
    selector.insertAdjacentHTML("afterend", str);
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
waitForElm('#web-main > div.loading-inner > div > div.product-info > div > div.product-header > div.product-page-header > div > div.product-meta.typography-callout-emphasized').then((elm) => {
    console.log('Element is ready');
    codec();
});

waitForElm('#web-navigation-container > div.web-navigation__native-upsell > div > button').then((elm) => {
    console.log('Page reloaded');
    codec();
});
//setTimeout(codec, 11000);

let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    //setTimeout(codec, 5000);
    waitForElm('#web-main > div.loading-inner > div > div.product-info > div > div.product-header > div.product-page-header > div > div.product-meta.typography-callout-emphasized').then((elm) => {
        console.log('Element is ready');
        codec();
    });
  }
}).observe(document, {subtree: true, childList: true});