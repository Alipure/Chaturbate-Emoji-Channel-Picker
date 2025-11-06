**IF YOU ARE RELIGIOUS FEEL FREE TO AVOID THIS**
**THANK YOU**


# Chaturbate Emoji Searcher

![Emoji Search Banner](https://via.placeholder.com/800x200?text=Chaturbate+Emoji+Searcher)

Welcome to the **Chaturbate Emoji Searcher**, a Node.js script powered by Selenium WebDriver that automates browsing the [Chaturbate female cams page](https://chaturbate.com/female-cams/). This tool scans the page for emojis, lists them for you to choose from, and clicks the corresponding room card containing your selected emoji. Need to check the next page? Just type `=` to keep exploring!

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)

## Features

- **Emoji Detection**: Scans the page source to list unique emojis with numbered options (e.g., `1: 😈`, `2: ✨`).
- **Interactive Prompt**: Choose an emoji by number, type `=` to navigate to the next page, or press Enter to exit.
- **Smart Pagination**: Automatically moves to the next page (up to 15) if the emoji isn’t found, then resets to page 1.
- **Reliable Search**: Finds emojis in room card subject text (`<ul class="subject">`) using JavaScript filtering.
- **Robust Error Handling**: Manages missing elements, network issues, and invalid inputs with detailed logs.
- **Dynamic Loading**: Uses explicit waits to ensure room cards and elements are ready before interaction.

## Prerequisites

Before running the script, ensure you have:

- **Node.js**: Version 14 or higher. [Download here](https://nodejs.org/).
- **Google Chrome**: Latest version installed.
- **Selenium WebDriver & ChromeDriver**:
  ```bash
  npm install selenium-webdriver chromedriver
