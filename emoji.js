const { Builder, By, until } = require('selenium-webdriver');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

(async function example() {
    let driver = await new Builder().forBrowser('chrome').build();
    let i = 1; // Declare page counter
    try {
        // Navigate to URL
        console.log('Navigating to https://chaturbate.com/female-cams/');
        await driver.get('https://chaturbate.com/female-cams/');
        await driver.manage().window().maximize();
        console.log('Window maximized');

        // Accept terms and conditions
        console.log('Waiting for terms and conditions button');
        await driver.wait(until.elementLocated(By.id('close_entrance_terms')), 10000);
        const termsButton = await driver.findElement(By.id('close_entrance_terms'));
        await termsButton.click();
        console.log('Clicked terms and conditions button');

        // Function to count and display emojis
        async function countAndDisplayEmojis() {
            console.log('Fetching page source to count emojis');
            const pageSource = await driver.getPageSource();
            const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
            const emojis = pageSource.match(emojiRegex);
            const emojiCount = emojis ? emojis.length : 0;
            console.log(`Number of emojis on the page: ${emojiCount}`);

            if (emojis) {
                const uniqueEmojis = [...new Set(emojis)];
                console.log('Emojis found on the page:');
                uniqueEmojis.forEach((emoji, index) => {
                    console.log(`${index + 1}: ${emoji}`);
                });
                return uniqueEmojis;
            } else {
                console.log('No emojis found on the page.');
                return [];
            }
        }

        // Function to prompt user and search for emoji
        async function promptAndSearch(page = 1) {
            const emojis = await countAndDisplayEmojis();
            if (emojis.length === 0) {
                console.log('No emojis available, closing prompt and quitting browser');
                readline.close();
                await driver.quit();
                return;
            }

            readline.question('Enter the number of the emoji you want to search for, type \'=\' to go to the next page for new results, (or press Enter to exit): ', async (input) => {
                if (!input.trim()) {
                    console.log('Empty input received, closing prompt and quitting browser');
                    readline.close();
                    await driver.quit();
                    return;
                }

                if (input === '=') {
                    i++; // Increment page number
                    if (i > 5) {
                        console.log('Reached page limit, resetting to page 1...');
                        i = 1;
                    }
                    console.log(`Navigating to next page: https://chaturbate.com/female-cams/?page=${i}`);
                    await driver.get(`https://chaturbate.com/female-cams/?page=${i}`);
                    console.log(`Waiting for page ${i} to load`);
                    await driver.wait(until.elementsLocated(By.css('li.roomCard')), 15000);
                    console.log(`Page ${i} loaded, prompting for input again...`);
                    promptAndSearch(i); // Re-prompt on the new page
                    return;
                }

                const index = parseInt(input) - 1;
                if (isNaN(index) || index < 0 || index >= emojis.length) {
                    console.log('Invalid number, prompting again...');
                    promptAndSearch(page);
                    return;
                }

                const selectedEmoji = emojis[index];
                console.log(`You selected: ${selectedEmoji}`);

                try {
                    // Wait for room cards to load
                    console.log(`Waiting for room cards to load on page ${page}`);
                    await driver.wait(until.elementsLocated(By.css('li.roomCard')), 15000);
                    console.log('Room cards found');

                    // Find room cards and filter by emoji in subject text
                    console.log(`Searching for room card with emoji: ${selectedEmoji}`);
                    const roomCards = await driver.findElements(By.css('li.roomCard'));
                    console.log(`Found ${roomCards.length} room cards`);
                    let targetElement = null;
                    for (const card of roomCards) {
                        const subjectElement = await card.findElement(By.css('ul.subject'));
                        const subjectText = await subjectElement.getText();
                        if (subjectText.includes(selectedEmoji)) {
                            targetElement = card;
                            break;
                        }
                    }

                    if (!targetElement) {
                        throw new Error(`No room card found with emoji: ${selectedEmoji}`);
                    }

                    console.log(`Found room card with emoji: ${selectedEmoji}`);
                    await targetElement.click();
                    console.log(`Clicked room card with emoji: ${selectedEmoji}`);
                    readline.close();
                    await driver.sleep(5000); // Wait for page to load after click
                    // await driver.quit();
                } catch (error) {
                    console.log(`Element with emoji "${selectedEmoji}" not found on page ${page}, error: ${error.message}`);
                    i++; // Increment page number
                    if (i > 5) {
                        console.log('Reached page limit, resetting to page 1...');
                        i = 1;
                        await driver.get('https://chaturbate.com/female-cams/');
                        console.log('Navigated back to page 1');
                        await driver.wait(until.elementsLocated(By.css('li.roomCard')), 15000);
                        console.log('Room cards found on page 1');
                        promptAndSearch(i);
                        return;
                    }
                    console.log(`Navigating to next page: https://chaturbate.com/female-cams/?page=${i}`);
                    await driver.get(`https://chaturbate.com/female-cams/?page=${i}`);
                    console.log(`Waiting for page ${i} to load`);
                    await driver.wait(until.elementsLocated(By.css('li.roomCard')), 15000);
                    console.log(`Page ${i} loaded, prompting for input again...`);
                    promptAndSearch(i); // Re-prompt on the new page
                }
            });
        }

        // Start the prompt and search process
        console.log('Starting emoji prompt');
        await promptAndSearch(i);

    } catch (error) {
        console.error('Critical error:', error.message);
        readline.close();
        await driver.quit();
    }
})();
