// ==UserScript==
// @name        Robin Assistant
// @namespace   com.github.leoverto
// @include     https://www.reddit.com/robin/
// @version     1
// @author      LeoVerto
// @grant       none
// ==/UserScript==

function sendMessage(msg) {
  document.getElementsByClassName("text-counter-input")[0].value = msg;
  document.getElementById("robinSendMessage").submit();
}

setTimeout(function () {
  document.getElementsByClassName("robin--vote-class--increase")[0].click();
  console.log("WE SHALL GROW!");
}, 10000);
