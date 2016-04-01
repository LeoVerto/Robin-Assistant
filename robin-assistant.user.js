// ==UserScript==
// @name        Robin Assistant
// @namespace   com.github.leoverto
// @include     https://www.reddit.com/robin/
// @include     https://www.reddit.com/robin
// @version     2
// @author      LeoVerto, Wiiplay123
// @grant       none
// ==/UserScript==

function clearSpam() {
  var blacklist = ["","autovoter","staying","group to stay","pasta","automatically voted","stayers are betrayers","stayers aint players","mins remaining. status",">>>>>>>>>>>>>>>>>>>>>>>","<<<<<<<<<<<<<<<<<<<<<<","growing is all we know","f it ends on you","timecube"];
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

// Custom options
function addOptions() {
  var disableVoteMsgs = createCheckbox("disable-vote-msgs", "Disable Vote Messages", true, filterVoteMsgs);

  document.getElementById("robinDesktopNotifier").appendChild(disableVoteMsgs);
}

function createCheckbox(name, description, checked, listener) {
  var label = document.createElement("label");

  var checkbox = document.createElement("input");
  checkbox.name = name;
  checkbox.type = "checkbox";
  checkbox.onclick = listener;
  $(checkbox).prop("checked", checked);

  var description = document.createTextNode("Disable Vote Messages");

  label.appendChild(checkbox);
  label.appendChild(description);

  return label;
}

addOptions();

// Filters
function filterVoteMsgs(event) {
  if (event !== undefined) {
    // ToDo
  }
}

// Auto-grow
setTimeout(function () {
  $(".robin--vote-class--increase")[0].click();
  console.log("WE SHALL GROW!");
}, 10000);
