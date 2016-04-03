// ==UserScript==
// @name        Robin Assistant
// @description Growth in peace
// @namespace   com.github.leoverto
// @include     https://www.reddit.com/robin/
// @include     https://www.reddit.com/robin
// @updateURL   https://raw.githubusercontent.com/LeoVerto/Robin-Assistant/master/robin-assistant.user.js
// @version     1.17
// @author      LeoVerto, Wiiplay123, Getnamo, K2L8M11N2
// @grant       none
// ==/UserScript==

var version = "1.17";

var config = {
  autoVote: "auto-vote-grow",
  filterVoteMsgs: true,
  filterSpam: true,
  filterNonAscii: true,
  keepMessageCount: 500,
  keepOnlyRecent: true,
  channelPrefixes: []
}

var ownName = $("#header-bottom-right .user a").first().text();
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

var useStorage = false;
var votesLastUpdated = 0;
var startTime = new Date();

// Spam filter config
var userWhitelist = ["nbagf", "dthunder"]
var userBlacklist = ["OldenNips", "chapebrone", "JohnMadden"];
var userHighlight = ["nbagf", "dthunder"];

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
  "ｍｅｍｅｓ ｏｆ ｃａｐｉｔａｌｉｓｍ", "𝐁𝐄𝐑𝐍𝐈𝐄 𝐒𝐀𝐍𝐃𝐌𝐀𝐍", "█▄█▄", "卐",
  "spam the most used phrase", "moob hunter", "someone in chat annoying",
  "cool ppl list", "can't beat me", "smexy", "my ruler", "bean", "nsfw",
  "current standings", "numbers & tits", "numbers and tits", "nigglets",
  "voting will end", "madden", "peaman", "turn off your bots", "zoeq",
  "stay to win", "nigger", "nomorespam", "digest before sleeping",
  "channel stats", "the best the best", "redrobin"
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

// Config
function loadConfig() {
  if(typeof(Storage) !== "undefined") {
    useStorage = true;

    if (localStorage.getItem("robin-assistant-config") !== null) {
      var newConfig = JSON.parse(localStorage.getItem("robin-assistant-config"));
      // Config might have been saved by older version of script with less options
      for (property in config) {
        if (newConfig[property] !== undefined) {
          config[property] = newConfig[property];
        }
      }

      console.log("Loaded config!");
    }
  }
}

function writeConfig() {
  if (useStorage) {
    localStorage.setItem("robin-assistant-config", JSON.stringify(config));
    console.log("Saving config...")
  }
}

function updateConfigVar(variable, value) {
  config[variable] = value;
  writeConfig();
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

  var autoVoteGrow = createRadio("auto-vote", "auto-vote-grow",
    "Automatically vote \"Grow\"", config.autoVote, autoVoteListener);
  var autoVoteStay = createRadio("auto-vote", "auto-vote-stay",
    "Automatically vote \"Stay\"", config.autoVote, autoVoteListener);
  var keepOnlyRecentOption = createCheckbox("keep-only-recent",
    "Keep only the most recent 500 messages", config.keepOnlyRecent,
    keepOnlyRecentListener, false)
  var channelPrefixes = createTextbox("channel-prefixes",
    "Prefixes of channels to filter:", config.channelPrefixes.join(""),
    channelPrefixesListener, 5)

  var filters = "<b style=\"font-size: 13px;\">Filters</b>"

  var filterVotesOption = createCheckbox("filter-votes",
    "Vote Messages", config.filterVoteMsgs, filterVotesListener, true);
  var filterSpamOption = createCheckbox("filter-spam",
    "Common spam", config.filterSpam, filterSpamListener, true);
  var filterNonAsciiOption = createCheckbox("filter-nonascii",
    "Non-ascii", config.filterNonAscii, filterNonAsciiListener, true);

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
  $(customOptions).append(
    header,
    autoVoteGrow,
    autoVoteStay,
    keepOnlyRecentOption,
    channelPrefixes,
    filters,
    filterVotesOption,
    filterSpamOption,
    filterNonAsciiOption,
    userCounter,
    voteGrow,
    voteStay,
    voteAbandon,
    voteAbstain,
    nextAction,
    timer
  )
}

function createCheckbox(name, description, checked, listener, counter) {
  var label = document.createElement("label");
  var checkbox = document.createElement("input");
  checkbox.name = name;
  checkbox.id = name;
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

function createRadio(name, id, description, selectedRadio, listener) {
  var label = document.createElement("label");
  var radio = document.createElement("input");
  radio.name = name;
  radio.id = id;
  radio.type = "radio";
  radio.onclick = listener;
  if (selectedRadio === id) {
    $(radio).prop("checked", true);
  }

  var description = "<span>" + description + "</span>";

  $(label).append(description);
  label.appendChild(radio);

  return label;
}

function createTextbox(name, description, value, listener, size) {
  var label = document.createElement("label");
  var textbox = document.createElement("input");
  textbox.name = name;
  textbox.id = name;
  textbox.type = "text";
  textbox.value = value;
  $(textbox).change(listener);
  textbox.maxLength = size;
  textbox.size = size;


  var description = document.createTextNode(description);

  label.appendChild(description);
  label.appendChild(textbox);

  return label;
}

// Listeners
function autoVoteListener(event) {
  if (event !== undefined) {
    updateConfigVar("autoVote", $(event.target).attr("id"));
    vote();
  }
}

function keepOnlyRecentListener(event) {
  if (event !== undefined) {
    updateConfigVar("keepOnlyRecent", $(event.target).is(":checked"));
  }
}

function channelPrefixesListener(event) {
  if (event !== undefined) {
    var prefixes = $(event.target).val().split("");
    updateConfigVar("channelPrefixes", prefixes);

    console.log("HELLO");

    // This might be a bit laggy, but we only keep 500 messages
    $("#robinChatMessageList div").each(function () {
      var msgText = $(this).find(".robin-message--message").text();
      if (prefixes.length == 0) {
        $(this).show();
      } else if (checkPrefix(msgText)) {
        console.log("SHOW!");
        $(this).show();
      } else {
        console.log("HIDE!");
        $(this).hide();
      }
    });
  }
}

function filterVotesListener(event) {
  if (event !== undefined) {
    updateConfigVar("filterVoteMsgs", $(event.target).is(":checked"));
  }
}


function filterSpamListener(event) {
  if (event !== undefined) {
    updateConfigVar("filterSpam", $(event.target).is(":checked"));
  }
}

function filterNonAsciiListener(event) {
  if (event !== undefined) {
    updateConfigVar("filterNonAscii", $(event.target).is(":checked"));
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
    return "Awaiting merge";
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

// Channel Filter

function checkPrefix(message) {
  var prefixes = config.channelPrefixes;
  for (i = 0; i < prefixes.length; i++) {
    // Use startsWith to not deal with unescaped regex
    if (message.startsWith(prefixes[i])) {
      return true;
    }
  }
  return false;
}

// Spam Filter
function checkSpam(user, message) {
  for (i = 0; i < userWhitelist.length; i++) {
    if (user === userWhitelist[i]) {
      return false;
    }
  }

  if (config.filterNonAscii){
    if (message.match(nonEnglishSpamRegex)) {
      filteredNonAsciiCount += 1;
      updateCounter("filter-nonascii-counter", filteredNonAsciiCount);
      console.log("Blocked spam message (non-ASCII): " + message);
      return true;
    }
  }

  if (config.filterSpam){
    // Check for 6 or more repetitions of the same character
    if (message.search(/(.)\1{5,}/) != -1) {
      filteredSpamCount += 1;
      updateCounter("filter-spam-counter", filteredSpamCount);
      console.log("Blocked spam message (Repetition): " + message);
      return true;
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

function processMessage(msg) {
  var msgText = $(msg).find(".robin-message--message").text();
  var msgUser = $(msg).find(".robin-message--from").text();
  var systemMessage = false;

  if ($(msg).hasClass("robin--user-class--system")) {
    systemMessage = true;
  }

  // Highlight messages containing own user name
  var re = new RegExp(ownName, "i");
  if (msgText.match(re)) {
    $(msg).css({
      background: 'rgba(255, 0, 0, 0.3)',
      color: '#242424'
    });
  }

  //Highlight messages containing specific user
  for (i = 0; i < userHighlight.length; i++) {
    if (msgUser === userHighlight[i]) {
      $(msg).css({
        background: 'rgba(60, 180, 20, 0.3)',
        color: '#242424'
      });
    }
  }

  // Filter vote messages
  if ($(msg).hasClass("robin--message-class--action") && msgText.startsWith(
      "voted to ")) {
    updateVotes();
    if (config.filterVoteMsgs) {
      $(msg).remove();
      console.log("Blocked spam message (Voting): " + msgText);
      filteredVoteCount += 1;
      updateCounter("filter-votes-counter", filteredVoteCount);
    }
    updateVotes();
  }

  // Filter spam
  if (!systemMessage && checkSpam(msgUser, msgText)) {
    $(msg).remove();
    return;
  }

  // Filter channels
  if (config.channelPrefixes.length > 0) {
    if (!checkPrefix(msgText)) {
      $(msg).hide();
    }
  }
}

// Mutation observer for new messages
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    var added = mutation.addedNodes[0];

    // Processes all new messages
    if ($(added).hasClass("robin-message")) {
      processMessage(added);
    }
  });
});
observer.observe($("#robinChatMessageList").get(0), {
  childList: true
});

function vote() {
  if (config.autoVote === "auto-vote-grow") {
    $(".robin--vote-class--increase")[0].click();
    console.log("Voting grow!");
  } else {
    $(".robin--vote-class--continue")[0].click();
    console.log("Voting stay!");
  }
}

function deleteOldMessages() {
  var messageCount = $("#robinChatMessageList div").length;
  var removeMessageCount = messageCount - config.keepMessageCount;

  if (removeMessageCount < 10) {
    console.log("Not enough messages to remove any (" + messageCount + ")");
    return;
  }

  // Remove all but most recent x messages, keep first four from robin
  $("#robinChatMessageList div").slice(3, removeMessageCount + 3).remove();
  console.log("Removed " + removeMessageCount + " old messages.")
}

// Checks whether room name is not empty
function checkError() {
  if($(".robin-chat--room-name").text().length == 0) {
    // Something went wrong, hit reload after a 10 to 20 seconds!
    var timeout = Math.floor((Math.random() * 10 ) + 10);
    setTimeout(function() {
      window.location.reload();
    }, timeout);
  }
}

// Main run
console.log("Robin-Assistant " + version + " enabled!");

loadConfig();
rewriteCSS();
addOptions();
updateVotes();
update();

//Check for startup messages for timing
function fetchTimeIntervals() {
  var minArray = $(".robin-message--message:contains('approx')").text().match(
    "\\d+");
}

// Auto-vote
setTimeout(function() {
  // Check whether we are in a fresh room
  if ($(".robin-chat--room-name").text().length < 20) {
    // Reset auto-vote to grow
    updateConfigVar("autoVote", "auto-vote-grow");
  }
  vote();
}, 10000);

// Update every 3 seconds
setInterval(function() {
  update();
  // Update votes at least every 30 seconds
  if (Date.now - votesLastUpdated > 30000) {
    updateVotes();
    // Also check if we're on an error page now
    checkError();
  }
}, 3000);

// Executed once a minute
setInterval(function() {
  if (config.keepOnlyRecent) {
    deleteOldMessages();
  }

  // Attempt to join new robin room
  if ($("#joinRobinContainer".length)) {
    $("#joinRobinContainer.click()");
    setTimeout(function() {
      jQuery("#joinRobin").click();
    }, 1000);
  }
}, 60000);
