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

function addOptions() {
  var disableVoteMsgs = document.createElement("label");

  var checkbox = document.createElement("input");
  checkbox.name = "disable-vote-msgs";
  checkbox.type = "checkbox";

  var description = document.createTextNode("Disable Vote Messages");

  disableVoteMsgs.appendChild(checkbox);
  disableVoteMsgs.appendChild(description);

  document.getElementById("robinDesktopNotifier").appendChild(disableVoteMsgs);
}

setTimeout(function () {
  document.getElementsByClassName("robin--vote-class--increase")[0].click();
  console.log("WE SHALL GROW!");
}, 10000);
