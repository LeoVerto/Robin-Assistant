// ==UserScript==
// @name        Robin Assistant
// @namespace   com.github.leoverto
// @include     https://www.reddit.com/robin/
// @include     https://www.reddit.com/robin
// @version     2
// @author      LeoVerto, Wiiplay123
// @grant       none
// ==/UserScript==

var autoVote = true;
var disableVoteMsgs = true;

function clearSpam() {
  var blacklist = ["", "autovoter", "staying", "group to stay", "pasta",
    "automatically voted", "stayers are betrayers", "stayers aint players",
    "mins remaining. status", ">>>>>>>>>>>>>>>>>>>>>>>",
    "<<<<<<<<<<<<<<<<<<<<<<", "growing is all we know", "f it ends on you",
    "timecube"
  ];
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
  // Remove possible existing custom options
  $("#customOptions").remove();

  var customOptions = document.createElement("div");
  customOptions.id = "customOptions";

  var voteMsgOption = createCheckbox("disable-vote-msgs",
    "Disable Vote Messages", disableVoteMsgs, disableVoteMsgsListener);
  var autoVoteOption = createCheckbox("auto-vote",
    "Automatically vote Grow", autoVote, autoVoteListener);

  document.getElementById("robinDesktopNotifier").appendChild(customOptions);
  document.getElementById("customOptions").appendChild(voteMsgOption);
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

// Listeners
function disableVoteMsgsListener(event) {
  if (event !== undefined) {
    disableVoteMsgs = $(event.target).is(":checked");
  }
}

function autoVoteListener(event) {
  if (event !== undefined) {
    autoVote = $(event.target).is(":checked");
  }
}

// Mutation observer for new messages
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var added = mutation.addedNodes[0];

    // Filters all new messages
    if ($(added).hasClass("robin-message")) {
      var msg = added;
      var msgText = $(msg).find(".robin-message--message").text();
      //console.log(msgText)

      // Filter vote messages
      if (disableVoteMsgs
        && $(msg).hasClass("robin--message-class--action")
        && msgText.startsWith("voted to ")) {
          $(msg).remove();
        }
    }
  });
});
observer.observe($("#robinChatMessageList").get(0), {
  childList: true
});

// Auto-grow
setTimeout(function() {
  $(".robin--vote-class--increase")[0].click();
  console.log("WE SHALL GROW!");
}, 10000);
