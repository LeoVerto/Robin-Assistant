// ==UserScript==
// @name        Robin Assistant
// @description Growth in peace
// @namespace   com.github.leoverto
// @include     https://www.reddit.com/robin/
// @include     https://www.reddit.com/robin
// @version     1.10
// @author      LeoVerto, Wiiplay123, Getnamo, K2L8M11N2
// @grant       none
// ==/UserScript==

var autoVote = true;
var disableVoteMsgs = true;
var filterSpam = true;
var filterNonAscii = true;
var version = "1.10";

var ownName = $('.user a').text();
var filteredSpamCount = 0;
var filteredVoteCount = 0;
var filteredNonAsciiCount = 0;
var userCount = 0;

var votes = {
  grow: 0,
  stay: 0,
  abandon: 0,
  abstain: 0,
  action: 'Unknown'
}

var votesLastUpdated = 0;

var startTime = new Date();

var userBlacklist = ["OldenNips", "chapebrone"];

var manualThaiList = ["̍", "̎", "̄", "̅", "̿", "̑", "̆", "̐", "͒", "͗", "\
", "͑", "̇", "̈", "̊", "͂", "̓", "̈́", "͊", "͋", "͌", "\
", "̃", "̂", "̌", "͐", "̀", "́", "̋", "̏", "̒", "̓", "\
", "̔", "̽", "̉", "ͣ", "ͤ", "ͥ", "ͦ", "ͧ", "ͨ", "ͩ", "\
", "ͪ", "ͫ", "ͬ", "ͭ", "ͮ", "ͯ", "̾", "͛", "͆", "̚", "\
", "̕", "̛", "̀", "́", "͘", "̡", "̢", "̧", "̨", "̴", "\
", "̵", "̶", "͏", "͜", "͝", "͞", "͟", "͠", "͢", "̸", "\
", "̷", "͡", "҉", "\
", "̖", "̗", "̘", "̙", "̜", "̝", "̞", "̟", "̠", "̤", "\
", "̥", "̦", "̩", "̪", "̫", "̬", "̭", "̮", "̯", "̰", "\
", "̱", "̲", "̳", "̹", "̺", "̻", "̼", "ͅ", "͇", "͈", "\
", "͉", "͍", "͎", "͓", "͔", "͕", "͖", "͙", "͚", "̣", "\
"];

var spamBlacklist = ["spam the most used",
  "ຈل͜ຈ", "hail", "autovoter", "﷽", "group to stay", "pasta", "robinplus",
  "automatically voted", "stayers are betrayers", "stayers aint players",
  "mins remaining. status", ">>>>", "trump", "#420", "้", "็", "◕_◕",
  "<<<<", "growing is all we know", "f it ends on you", "heil", "hitler",
  "timecube", "\( ͡° ͜ʖ ͡°\)", "◕", "guys can you please not spam the chat",
  "ｍｅｍｅｓ ｏｆ ｃａｐｉｔａｌｉｓｍ", "𝐁𝐄𝐑𝐍𝐈𝐄 𝐒𝐀𝐍𝐃𝐌𝐀𝐍", "█▄█▄",  "卐",
  "spam the most used phrase", "moob hunter", "someone in chat annoying",
  "cool ppl list", "can't beat me", "smexy", "my ruler", "bean",
  "current standings", "numbers & tits", "numbers and tits", "nigglets",
  "voting will end"
];

var nonEnglishSpamRegex = "[^\x00-\x7F]+";

function rewriteCSS() {
  $(".robin-chat--body").css({
    "height": "80vh"
  });
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
  customOptions.className =
    "robin-chat--sidebar-widget robin-chat--notification-widget";

  var header = "<b style=\"font-size: 14px;\">Robin-Assistant " + version +
    " Configuration</b>"

  var autoVoteOption = createCheckbox("auto-vote",
    "Automatically vote Grow", autoVote, autoVoteListener, false);

  var filters = "<b style=\"font-size: 13px;\">Filters</b>"

  var filterVotesOption = createCheckbox("filter-votes",
    "Vote Messages", disableVoteMsgs, disableVoteMsgsListener, true);
  var filterSpamOption = createCheckbox("filter-spam",
    "Common spam", filterSpam, filterSpamListener, true);
  var filterNonAsciiOption = createCheckbox("filter-nonascii",
    "Non-ascii", filterNonAscii, filterNonAsciiListener, true);

  var userCounter =
    "<br><span style=\"font-size: 14px;\">Users here: <span id=\"user-count\">0</span></span>";
  var voteGrow =
    "<br><span style=\"font-size: 14px;\">Grow: <span id=\"vote-grow\">0</span></span>";
  var voteStay =
    "<br><span style=\"font-size: 14px;\">Stay: <span id=\"vote-stay\">0</span></span>";
  var voteAbandon =
    "<br><span style=\"font-size: 14px;\">Abandon: <span id=\"vote-abandon\">0</span></span>";
  var voteAbstain =
    "<br><span style=\"font-size: 14px;\">Abstain: <span id=\"vote-abstain\">0</span></span>";
  var timer =
    "<br><span style=\"font-size: 14px;\">Time Left: <span id=\"time-left\">0</span></span>";
  var nextAction =
    "<br><i><span id=\"next-action\" style=\"font-size: 14px;\">Unknown</span></i>";

  $(customOptions).insertAfter("#robinDesktopNotifier");
  $(customOptions).append(header);
  $(customOptions).append(autoVoteOption);
  $(customOptions).append(filters);
  $(customOptions).append(filterVotesOption);
  $(customOptions).append(filterSpamOption);
  $(customOptions).append(filterNonAsciiOption);
  $(customOptions).append(userCounter);
  $(customOptions).append(voteGrow);
  $(customOptions).append(voteStay);
  $(customOptions).append(voteAbandon);
  $(customOptions).append(voteAbstain);
  $(customOptions).append(nextAction);
  $(customOptions).append(timer);
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
    var counter = "&nbsp;Filtered: <span id=\"" + name + "-counter\">0</span>";
    $(label).append(counter);
  }

  return label;
}

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

function filterNonAsciiListener(event) {
  if (event !== undefined) {
    filterNonAscii = $(event.target).is(":checked");
  }
}

function addMins(date, mins) {
  var newDateObj = new Date(date.getTime() + mins * 60000);
  return newDateObj;
}

function howLongLeft() { // mostly from /u/Yantrio
  var soonMessageArray = $(".robin-message--message:contains('soon')");
  if (soonMessageArray.length > 0) {
    // for cases where it says "soon" instead of a time on page load
    return "Soon";
  }

  var remainingMessageArray = $(".robin-message--message:contains('approx')");

  if (remainingMessageArray.length == 0) {
    //This shouldn't happen
    return "Unknown";
  }

  var message = remainingMessageArray.text();
  var time = new Date(jQuery(
    ".robin--user-class--system:contains('approx') .robin-message--timestamp"
  ).attr("datetime"));
  try {
    var endTime = addMins(time, message.match(/\d+/)[0]);
    var fraction = Math.floor((endTime - new Date()) / 60 / 1000 * 10) / 10;
    var min = Math.floor(fraction);
    var sec = Math.round((fraction - min) * 60);
    return min + " m " + sec + " s";
  } catch (e) {
    return "Fail";
  }

  //grab the timestamp from the first post and then calc the difference using the estimate it gives you on boot
}

function updateCounter(id, value) {
  $("#" + id).text(value);
}

// Spam Filter
function checkSpam(user, message) {
  // Check for 6 or more repetitions of the same character
  if (message.search(/(.)\1{5,}/) != -1) {
    filteredSpamCount += 1;
    updateCounter("filter-spam-counter", filteredSpamCount);
    console.log("Blocked spam message (Repetition): " + message);
    return true;
  }

  if(filterNonAscii){
    if(message.match(nonEnglishSpamRegex)){
      filteredNonAsciiCount += 1;
      updateCounter("filter-nonascii-counter", filteredNonAsciiCount);
      console.log("Blocked spam message (non-ASCII): " + message);
      return true;
    }
  }

  for (i = 0; i < userBlacklist.length; i++) {
    if (user === userBlacklist[i]) {
      updateCounter("filter-spam-counter", filteredSpamCount);
      console.log("Blocked spam message (Blacklisted User): " + message);
      return true;
    }
  }

  for (o = 0; o < spamBlacklist.length; o++) {
    if (message.toLowerCase().search(spamBlacklist[o]) != -1) {
      filteredSpamCount += 1;
      updateCounter("filter-spam-counter", filteredSpamCount);
      console.log("Blocked spam message (Blacklist): " + message);
      return true;
    }
  }
  return false;
}

// Generic updates
function update() {
  updateCounter("time-left", howLongLeft());

  // update vote counters
  updateCounter("vote-grow", votes.grow);
  updateCounter("vote-stay", votes.stay);
  updateCounter("vote-abandon", votes.abandon);
  updateCounter("vote-abstain", votes.abstain);

  userCount = votes.grow + votes.stay + votes.abandon + votes.abstain;
  updateCounter("user-count", userCount);

  updateCounter("next-action", "Next round we will " + votes.action);
}

// Triggered whenever someone votes
function updateVotes() {
  // Cancel if updated during last 10 seconds
  if (Date.now() - votesLastUpdated < 10000) {
    return false;
  }

  console.log("Updating vote tally...");
  jQuery.get("/robin/", function(a) {
    var start = "{" + a.substring(a.indexOf("\"robin_user_list\": ["));
    var end = start.substring(0, start.indexOf("}]") + 2) + "}";
    list = JSON.parse(end).robin_user_list;
    votes.grow = list.filter(function(voter) {
      return voter.vote === "INCREASE"
    }).length;
    votes.stay = list.filter(function(voter) {
      return voter.vote === "CONTINUE"
    }).length;
    votes.abandon = list.filter(function(voter) {
      return voter.vote === "ABANDON"
    }).length;
    votes.abstain = list.filter(function(voter) {
      return voter.vote === "NOVOTE"
    }).length;

    var majority = userCount / 2;
    if (votes.grow > majority) {
      votes.action = "Grow";
    } else if (votes.stay > majority) {
      votes.action = "Stay";
    } else if (votes.abandon > majority) {
      votes.action = "Abandon";
    } else if (votes.abstain > majority) {
      votes.action = "Abstain";
    } else {
      vote.action = "No majority";
    }
  });

  votesLastUpdated = Date.now();
  return true;
}

// Mutation observer for new messages
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var added = mutation.addedNodes[0];

    // Filters all new messages
    if ($(added).hasClass("robin-message")) {
      var msg = added;
      var msgText = $(msg).find(".robin-message--message").text();
      var msgUser = $(msg).find(".robin-message--from").text();
      //console.log(msgText)

      // Highlight messages containing own user name
      var re = new RegExp(ownName, "i");
      if (msgText.match(re)) {
        $(msg).css({
          background: 'rgba(255, 0, 0, 0.3)',
          color: '#242424'
        });
      }

      // Filter vote messages
      if ($(msg).hasClass("robin--message-class--action") && msgText.startsWith(
          "voted to ")) {
        updateVotes();
        if (disableVoteMsgs) {
          $(msg).remove();
          console.log("Blocked spam message (Voting): " + message);
          filteredVoteCount += 1;
          updateCounter("filter-votes-counter", filteredVoteCount);
        }
        updateVotes();
      }

      // Filter spam
      if (filterSpam) {
        if (checkSpam(msgUser, msgText)) {
          $(msg).remove();
        }
      }
    }
  });
});
observer.observe($("#robinChatMessageList").get(0), {
  childList: true
});

// Main run
console.log("Robin-Assistant " + version + " enabled!");

rewriteCSS();
addOptions();
updateVotes();
update();

//Check for startup messages for timing
function fetchTimeIntervals() {
  var minArray = $(".robin-message--message:contains('approx')").text().match(
    "\\d+");
}

// Auto-grow
setTimeout(function() {
  if (autoVote) {
    $(".robin--vote-class--increase")[0].click();
    console.log("Voting grow!");
  }
}, 10000);

// Update every 3 seconds
setInterval(function() {
  update();
  // Update votes at least every 30 seconds
  if (Date.now - votesLastUpdated > 30000) {
    updateVotes();
  }
}, 3000);

// Try to join robin if not in a chat once a minute
setInterval(function() {
  if ($("#joinRobinContainer".length)) {
    $("#joinRobinContainer.click()");
    setTimeout(function() {
      jQuery("#joinRobin").click();
    }, 1000);
  }
}, 60000);
