// ==UserScript==
// @name        Robin Assistant
// @namespace   com.github.leoverto
// @include     https://www.reddit.com/robin/
// @version     2
// @author      LeoVerto
// @grant       none
// ==/UserScript==

function clearSpam() {
  var blacklist = ["autovoter","staying","group to stay","pasta","automatically voted","stayers are betrayers","stayers aint players","mins remaining. status",">>>>>>>>>>>>>>>>>>>>>>>","<<<<<<<<<<<<<<<<<<<<<<","growing is all we know","f it ends on you","timecube"];
  var messages = $(".robin-message");
  for (i = 0; i < messages.length; i++) {
    for (o = 0; o < blacklist.length; o++) {
      if (messages[i].innerHTML.toLowerCase().search(blacklist[o]) != -1) {
        messages[i].remove();
        break;
      }
    }
  }
}

function sendMessage(msg) {
  $(".text-counter-input")[0].value = msg;
  $(".text-counter-input")[0].nextSibling.click();
}

function addOptions() {
  var disableVoteMsgs = document.createElement("label");

  var checkbox = document.createElement("input");
  checkbox.name = "disable-vote-msgs";
  checkbox.type = "checkbox";

  var description = document.createTextNode("Disable Vote Messages");

  disableVoteMsgs.appendChild(checkbox);
  disableVoteMsgs.appendChild(description);

  $("#robinDesktopNotifier").appendChild(disableVoteMsgs);
}

setTimeout(function () {
  $(".robin--vote-class--increase")[0].click();
  console.log("WE SHALL GROW!");
}, 10000);
