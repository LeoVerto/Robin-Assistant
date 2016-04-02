# Robin-Assistant
Robin-Assistant is a neat userscript for [reddit robin](https://www.reddit.com/robin/) adding features such as:

## Features

* Automatically vote for growth
* Filter vote messages
* Filter common spam, repetition spam
* Configuration options for everything!
* Chat and user list use the entire available site height
* Highlight messages containing your name (thanks to /u/rlemon, who made [this](https://gist.github.com/rlemon/cc13cb4c31861e5d5ba2a92bfc920aeb) great script)
* Displays user count, tally and current vote outcome
* Filter all messages containing non-ASCII characters
* Automatically try to rejoin, if kicked out of robin (again, thanks to /u/rlemon)
* Block a (currently hardcoded) list of users

[![screenshot](https://raw.githubusercontent.com/LeoVerto/Robin-Assistant/dev/screenshot.png)](#screenshot)

## Installation

The by far easiest way to install this script is by pasting it into your browser's developer console (`ctrl` + `shift` + `K` on **Firefox** or `ctrl` + `shift` + `J` on **Chrome**. This will however require you do do that again after every reload or growth.

Install [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) for **Firefox** or [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) for **Chrome** to use this userscript.
Opera has built-in userscript support

Next open this [raw url](https://github.com/LeoVerto/Robin-Assistant/raw/master/robin-assistant.user.js) of the script and you should get an installation popup.

## Planned

* Add time left counter
* Use online spam blacklist
* Add ratelimit counter
* Add single-user mute
* Limit vote count polling (especially important in bigger rooms)
