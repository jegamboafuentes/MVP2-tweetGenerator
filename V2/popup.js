// Replace 'sample-extension' with the id of the extension you
// registered on ExtensionPay.com to test payments. You may need to
// uninstall and reinstall the extension to make it work.
// Don't forget to change the ID in background.js too!
const extpay = ExtPay('test3')

document.querySelector('#pay-now').addEventListener('click', function () {
    extpay.openPaymentPage();
});

extpay.getUser().then(user => {
    if (user.paid == false) {
        document.querySelector('#pay-now').addEventListener('click', extpay.openTrialPage())
    }
    const now = new Date();
    //const sevenDays = 1000*60*60*24*7 // in milliseconds
    //const thirtySeconds = 30 * 1000  //# in milliseconds
    //const elevenMinutes = 11 * 60 * 1000
    //const threeMinutes = 3 * 60 * 1000
    const fourMinutes = 4 * 60 * 1000
    
    if (user.trialStartedAt && (now - user.trialStartedAt) < fourMinutes) {
        const remainingTimeInMinutes = (fourMinutes - (now - user.trialStartedAt)) / 60000
        document.querySelector('#user-message').innerHTML = `trial active, remaining time ⌛ ${remainingTimeInMinutes.toFixed(2)} minutes`
        document.querySelector('button').remove()
        // user's trial is active
    } else {
        // user's trial is not active
        if (user.paid) {
            document.querySelector('#user-message').innerHTML = 'User has paid ✅'
            document.querySelector('button').remove()
        } else if (user.trialStartedAt == null) {
            document.querySelector('#user-message').innerHTML = 'User has not started a trial yet.'
        }
        else {
            document.querySelector('#user-message').innerHTML = 'Trial ended 🫥, please pay to continue using this extension.'
        }
    }
}).catch(err => {
    document.querySelector('#user-message').innerHTML = "Error fetching data :( Check that your ExtensionPay id is correct and you're connected to the internet"
})

// extpay.onPaid(function() { console.log('popup paid')});
document.addEventListener('DOMContentLoaded', () => {
    // Fetch summarized text from local storage
    chrome.storage.local.get(['summarizedText'], function (result) {
        document.getElementById('summary').innerText = result.summarizedText;
    });

    // Add event listener for tweet button
    document.getElementById('tweet').addEventListener('click', () => {
        let tweetText = document.getElementById('summary').innerText;
        let tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(tweetUrl, "_blank");
    });

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // Update the popup's content
        document.getElementById('summary').innerText = request.summarizedText;
    });
});
