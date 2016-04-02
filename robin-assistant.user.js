// ==UserScript==
// @name        Robin Assistant
// @description Growth in peace
// @namespace   com.github.leoverto
// @include     https://www.reddit.com/robin/
// @include     https://www.reddit.com/robin
// @version     1.2
// @author      LeoVerto, Wiiplay123
// @grant       none
// ==/UserScript==

var autoVote = true;
var disableVoteMsgs = true;
var filterSpam = true;
var version = "1.2";

var spamCount = 0;
var voteCount = 0;

var spamBlacklist = ["autovote", "staying", "group to stay", "pasta",
  "automatically voted", "stayers are betrayers", "stayers aint players",
  "mins remaining. status", ">>>>>>>>>>>>>>>>>>>>>>>",
  "<<<<<<<<<<<<<<<<<<<<<<", "growing is all we know", "f it ends on you",
  "timecube", "( ͡° ͜ʖ ͡°)"
];

function rewriteCSS() {
  //Don't expand chat, bad stuff
  //$(".robin-chat--body").css({"height":"100%"});
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
  customOptions.className = "robin-chat--sidebar-widget robin-chat--notification-widget";

  var header = "<b style=\"font-size: 14px;\">Robin-Assistant " + version + " Configuration</b>"

  var autoVoteOption = createCheckbox("auto-vote",
    "Automatically vote Grow", autoVote, autoVoteListener, false);
  var voteMsgOption = createCheckbox("disable-vote-msgs",
    "Hide Vote Messages", disableVoteMsgs, disableVoteMsgsListener, true);
  var filterSpamOption = createCheckbox("filter-spam",
    "Filter common spam", filterSpam, filterSpamListener, true);

  $(customOptions).insertAfter("#robinDesktopNotifier");
  $(customOptions).append(header);
  $(customOptions).append(autoVoteOption);
  $(customOptions).append(voteMsgOption);
  $(customOptions).append(filterSpamOption);
}


function createCheckbox(name, description, checked, listener, counter) {
  var label = document.createElement("label");

  var checkbox = document.createElement("input");
  checkbox.name = name;
  checkbox.type = "checkbox";
  checkbox.onclick = listener;
  $(checkbox).prop("checked", checked);

  var description = document.createTextNode(description);

  label.appendChild(checkbox);
  label.appendChild(description);

  if (counter) {
    var counter = "&nbsp;Blocked: <span id=\"" + name + "-counter\">0</span>";
    $(label).append(counter);
  }

  return label;
}

rewriteCSS();
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

function filterSpamListener(event) {
  if (event !== undefined) {
    filterSpam = $(event.target).is(":checked");
  }
}

function updateCounter(id, value) {
  $("#" + id).text(value);
}

// Spam Filter
function checkSpam(message) {
  for (o = 0; o < spamBlacklist.length; o++) {
    if (message.toLowerCase().search(spamBlacklist[o]) != -1) {
      spamCount += 1;
      updateCounter("filter-spam-counter", spamCount);
      return true;
    }
  }
  return false;
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

      // Filter spam
      if (filterSpam) {
        if (checkSpam(msgText)) {
          $(msg).remove();
        }
      }
    }
  });
});
observer.observe($("#robinChatMessageList").get(0), {
  childList: true
});

console.log("Robin-Assistant " + version + " enabled!");

// Auto-grow
setTimeout(function() {
  if (autoVote) {
    $(".robin--vote-class--increase")[0].click();
    console.log("WE SHALL GROW!");
  }
}, 10000);
