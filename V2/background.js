importScripts('ExtPay.js')

// To test payments, replace 'sample-extension' with the ID of
// the extension you registered on ExtensionPay.com. You may
// need to uninstall and reinstall the extension.
// And don't forget to change the ID in popup.js too!
var extpay = ExtPay('test3'); 
extpay.startBackground(); // this line is required to use ExtPay in the rest of your extension

extpay.getUser().then(user => {
	console.log(user)
})

chrome.runtime.onInstalled.addListener(async () => {
    let url = chrome.runtime.getURL("welcome/hello.html");
    let tab = await chrome.tabs.create({ url });
    console.log(`Created tab ${tab.id}`);
});

chrome.runtime.onInstalled.addListener(function () {
    // Create context menu
    chrome.contextMenus.create({
      id: "tweetCreator",
      title: "Create Tweet about this text",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "tweetCreator") {
      let selectedText = info.selectionText;
  
      // Call to GPT API for text generation
      console.log(selectedText);
      fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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' // Replace YOUR_API_KEY with your actual API key
        },
        body: JSON.stringify({
          prompt: selectedText + " Create a tweet about that text,  include emojis and hashtags, text limit 280 characters",
          max_tokens: 1000
        })
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          console.log(data.choices[0].text);
          // Store generated tweet in local storage
          chrome.storage.local.set({ summarizedText: data.choices[0].text });
        })
        .catch(error => {
          console.error('Error:', error);
          chrome.storage.local.set({ summarizedText: "GPT API ERROR: " + error.message });
        });
    }
  });