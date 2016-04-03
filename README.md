# Robin-Assistant
Robin-Assistant is a neat userscript for [reddit robin](https://www.reddit.com/robin/). [Reddit post](https://www.reddit.com/r/sglafo/comments/4d1j68/robin_assistant_lightweight_and_featurerich/)

## Features

* **Auto-vote for either grow or stay, you decide!** (Grow is the default)
* **Filter vote messages**
* Extensive **spam message and user blacklist**
* Filter repetition spam, messages containing non-ASCII characters
* Displays user count, tally and current vote outcome
* **Persistent config** options for everything!
* Chat and user list use the **entire available site height**
* **Highlight** messages containing your name (thanks to /u/rlemon, who made [this](https://gist.github.com/rlemon/cc13cb4c31861e5d5ba2a92bfc920aeb) great script)
* Automatically try to rejoin, if kicked out of robin (again, thanks to /u/rlemon)
* **Error page detection** and automatic reload
* Fresh room detection and subsequently switching to auto-grow
* **Only keep 200 most recent messages** to prevent memory leaking

[![screenshot](https://raw.githubusercontent.com/LeoVerto/Robin-Assistant/dev/screenshot.png)](#screenshot)

## Installation

The by far easiest way to install this script is by pasting it into your browser's developer console (`ctrl` + `shift` + `K` on **Firefox** or `ctrl` + `shift` + `J` on **Chrome**. This will however require you do do that again after every reload or growth.

Install [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) for **Firefox** or [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) for **Chrome** to use this userscript.
Opera has built-in userscript support

Next open this [raw url](https://github.com/LeoVerto/Robin-Assistant/raw/master/robin-assistant.user.js) of the script and you should get an installation popup.

## Planned

* Use online spam blacklist
* Add ratelimit counter
* Add single-user mute
* Add friend list with highlighting
* Add configurable chat prefixes to filter
