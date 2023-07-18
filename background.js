
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
        prompt: "Create a tweet about " + selectedText,
        max_tokens: 50
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
