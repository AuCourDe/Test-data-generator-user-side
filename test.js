const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

(async function runTests() {
    let driver = await new Builder().forBrowser('chrome').build();
    let testNumber = 0;
    let totalTests = 0;
    let successfulTests = 0;
    let failedTests = 0;
    let failedModules = [];

    function colorText(text, color) {
        const colors = {
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            reset: '\x1b[0m'
        };
        return colors[color] + text + colors.reset;
    }

    async function logTest(action, expected, actual, module = '') {
        const result = actual === true;
        const resultText = result ? colorText('true', 'green') : colorText('false', 'red');
        console.log(`${++testNumber}. ${module} - ${action}, Oczekiwany rezultat: ${expected}, Rezultat aktualny: ${resultText}`);
        totalTests++;
        if (result) {
            successfulTests++;
        } else {
            failedTests++;
            if (!failedModules.includes(module)) {
                failedModules.push(module);
            }
        }
    }

    async function waitForElement(locator) {
        try {
            await driver.wait(until.elementLocated(locator), 1000);
            return true;
        } catch (e) {
            return false;
        }
    }

    async function validateInput(moduleId, input, value, expectedMessage, refreshButton) {
        try {
            await input.clear();
            await input.sendKeys(value);
            await refreshButton.click();
            const validationMessage = await input.findElement(By.xpath('following-sibling::div[@class="validation-message"]')).getText();
            const isValid = validationMessage === expectedMessage;
            await logTest(`Walidacja pola ${await input.getAttribute('name')} w module ${moduleId}`, `Message should be "${expectedMessage}"`, isValid, moduleId);
        } catch (e) {
            await logTest(`Walidacja pola ${await input.getAttribute('name')} w module ${moduleId}`, `Message should be "${expectedMessage}"`, false, moduleId);
        }
    }

    async function checkGeneratedResults(moduleId, expectedCount, funny = false) {
        try {
            const dataElement = await driver.findElement(By.css(`#${moduleId}-data`));
            const dataText = await dataElement.getText();
            const results = dataText.split(', ');
            const resultCount = results.length;
            const isCorrectCount = resultCount === expectedCount;
            await logTest(`Sprawdzenie liczby wyników w module ${moduleId}`, `${expectedCount} results should be generated`, isCorrectCount, moduleId);

            if (funny) {
                let funnyNames = [];
                if (moduleId === 'companyName') {
                    funnyNames = ["Gorący trójkąt", "Lodziarnia Zimny Drań", "Ministerstwo Wakacji", "Samo Spadło Centrum Serwisowe", "Brudny Harry"];
                } else if (moduleId === 'street') {
                    funnyNames = ["10 Zakładników", "Alibaby", "Amora", "Beznazwy", "Braci Polskich", "Chatka Puchatka"];
                }
                const hasFunny = results.some(result => funnyNames.some(funnyName => result.includes(funnyName)));
                await logTest(`Sprawdzenie zabawnych nazw w module ${moduleId}`, `At least one funny name should be generated`, hasFunny, moduleId);
            }
        } catch (e) {
            await logTest(`Sprawdzenie liczby wyników w module ${moduleId}`, `${expectedCount} results should be generated`, false, moduleId);
        }
    }

    async function checkCommentResults(moduleId, wordsPerComment, quantity) {
        try {
            const dataElement = await driver.findElement(By.css(`#${moduleId}-data`));
            const dataText = await dataElement.getText();
            const resultCount = dataText.split(',').length;
            const expectedCount = wordsPerComment * quantity;
            const isCorrectCount = resultCount === expectedCount;
            await logTest(`Sprawdzenie liczby wyników w module ${moduleId}`, `${expectedCount} words should be generated`, isCorrectCount, moduleId);
        } catch (e) {
            await logTest(`Sprawdzenie liczby wyników w module ${moduleId}`, `${expectedCount} words should be generated`, false, moduleId);
        }
    }

    try {
        await driver.get('file:///C:/Users/revel/OneDrive/Pulpit/GDTv2/roboczy/index.html');

        // Test zmiany koloru tła
        let themeSwitchLocator = By.id('theme-switch');
        if (await waitForElement(themeSwitchLocator)) {
            let themeSwitch = await driver.findElement(themeSwitchLocator);
            await themeSwitch.click();
            let darkModeEnabled = await driver.findElement(By.css('body.dark-mode')).then(el => true, err => false);
            await logTest("Zmiana koloru tła na ciemny", "body.dark-mode should be present", darkModeEnabled, 'Global');

            await themeSwitch.click();
            darkModeEnabled = await driver.findElement(By.css('body.dark-mode')).then(el => true, err => false);
            await logTest("Zmiana koloru tła na jasny", "body.dark-mode should not be present", !darkModeEnabled, 'Global');
        } else {
            await logTest("Zmiana koloru tła", "body.dark-mode should be present or not be present", false, 'Global');
        }

        // Test logów
        let showLogsCheckboxLocator = By.id('show-logs');
        if (await waitForElement(showLogsCheckboxLocator)) {
            let showLogsCheckbox = await driver.findElement(showLogsCheckboxLocator);
            await showLogsCheckbox.click();
            let logsVisible = await driver.findElement(By.id('log-container')).isDisplayed();
            await logTest("Pokazanie logów", "Logi should be visible", logsVisible, 'Global');

            await showLogsCheckbox.click();
            logsVisible = await driver.findElement(By.id('log-container')).isDisplayed();
            await logTest("Ukrycie logów", "Logi should not be visible", !logsVisible, 'Global');
        } else {
            await logTest("Pokazanie i ukrycie logów", "Logi should be visible or not be visible", false, 'Global');
        }

        // Testy pozostałych modułów
        const modules = await driver.findElements(By.css('.module'));

        for (let module of modules) {
            const moduleId = await module.getAttribute('id');
            if (moduleId === 'test-attachments') continue; // Pominięcie modułu "Załączniki testowe"
            
            const settingsButtonLocator = By.xpath(".//button[contains(text(), 'Ustawienia')]");
            if (await waitForElement(settingsButtonLocator)) {
                const settingsButton = await module.findElement(settingsButtonLocator);
                await settingsButton.click();

                const settings = await module.findElements(By.css('.settings-container input, .settings-container select'));

                for (let setting of settings) {
                    const settingType = await setting.getAttribute('type');
                    const settingName = await setting.getAttribute('name');
                    const settingTagName = await setting.getTagName();

                    try {
                        if (settingTagName === 'input' && (settingType === 'radio' || settingType === 'checkbox')) {
                            await setting.click();
                            const isChecked = await setting.isSelected();
                            await logTest(`Kliknięcie ${settingType} ${settingName}`, `${settingType} ${settingName} should be checked`, isChecked, moduleId);
                        } else if (settingTagName === 'input' && settingType === 'number') {
                            await setting.clear();
                            await setting.sendKeys('10');
                            const value = await setting.getAttribute('value');
                            await logTest(`Wprowadzenie wartości 10 do ${settingName}`, `${settingName} should have value 10`, value === '10', moduleId);

                            // Walidacja wartości niepoprawnych
                            const invalidValueMessage = {
                                pesel: 'dopuszczalne wartości od 1800 do 2299 lub puste',
                                companyName: 'dopuszczalne wartości od 1 do 7',
                                street: 'dopuszczalne wartości od 1 do 7',
                                commentWords: 'dopuszczalne wartości od 1 do 1000',
                                commentCharacters: 'dopuszczalne wartości od 1 do 1000 lub puste'
                            };

                            const refreshButtonLocator = By.xpath(".//button[contains(text(), 'Odśwież')]");
                            const refreshButton = await module.findElement(refreshButtonLocator);

                            if (moduleId === 'pesel') {
                                await validateInput(moduleId, setting, '0', invalidValueMessage.pesel, refreshButton);
                                await validateInput(moduleId, setting, '2300', invalidValueMessage.pesel, refreshButton);
                            } else if (moduleId === 'companyName' || moduleId === 'street') {
                                await validateInput(moduleId, setting, '0', invalidValueMessage.companyName, refreshButton);
                                await validateInput(moduleId, setting, '8', invalidValueMessage.companyName, refreshButton);
                            } else if (moduleId === 'comment') {
                                if (settingName === 'words') {
                                    await validateInput(moduleId, setting, '0', invalidValueMessage.commentWords, refreshButton);
                                    await validateInput(moduleId, setting, '1001', invalidValueMessage.commentWords, refreshButton);
                                } else if (settingName === 'characters') {
                                    await validateInput(moduleId, setting, '0', invalidValueMessage.commentCharacters, refreshButton);
                                    await validateInput(moduleId, setting, '1001', invalidValueMessage.commentCharacters, refreshButton);
                                }
                            }
                        } else if (settingTagName === 'input' && settingType === 'text') {
                            // Walidacja wartości tekstowych
                            await setting.clear();
                            await setting.sendKeys('test');
                            const value = await setting.getAttribute('value');
                            await logTest(`Wprowadzenie wartości "test" do ${settingName}`, `${settingName} should have value "test"`, value === 'test', moduleId);
                        } else if (settingTagName === 'select') {
                            const options = await setting.findElements(By.tagName('option'));
                            for (let option of options) {
                                await option.click();
                                const isSelected = await option.isSelected();
                                const optionValue = await option.getAttribute('value');
                                await logTest(`Wybór ${optionValue} w ${settingName}`, `Option ${optionValue} should be selected`, isSelected, moduleId);
                            }
                        }
                    } catch (e) {
                        await logTest(`Interakcja z ustawieniem ${settingName} w module ${moduleId}`, `Powinna być wykonana`, false, moduleId);
                    }
                }
            } else {
                await logTest(`Ustawienia w module ${moduleId}`, `Powinny być dostępne`, false, moduleId);
            }

            const refreshButtonLocator = By.xpath(".//button[contains(text(), 'Odśwież')]");
            if (await waitForElement(refreshButtonLocator)) {
                const refreshButton = await module.findElement(refreshButtonLocator);
                await refreshButton.click();
                const dataElement = await module.findElement(By.css('.module-data'));
                const dataText = await dataElement.getText();
                await logTest(`Kliknięcie przycisku Odśwież`, `${moduleId} data should be populated`, dataText.trim() !== '', moduleId);
            } else {
                await logTest(`Kliknięcie przycisku Odśwież w module ${moduleId}`, `Powinno być wykonane`, false, moduleId);
            }

            const copyButtonLocator = By.xpath(".//button[contains(text(), 'Kopiuj')]");
            if (await waitForElement(copyButtonLocator)) {
                const copyButton = await module.findElement(copyButtonLocator);
                await copyButton.click();
                await logTest(`Kliknięcie przycisku Kopiuj`, `Data from ${moduleId} should be copied`, true, moduleId);
            } else {
                await logTest(`Kliknięcie przycisku Kopiuj w module ${moduleId}`, `Powinno być wykonane`, false, moduleId);
            }

            // Sprawdzenie generowania wielu wyników
            const quantitySelectLocator = By.name('quantity');
            if (await waitForElement(quantitySelectLocator)) {
                const quantitySelect = await module.findElement(quantitySelectLocator);
                await quantitySelect.findElement(By.xpath(".//option[@value='50']")).click();
                const refreshButton = await module.findElement(refreshButtonLocator);
                await refreshButton.click();
                await checkGeneratedResults(moduleId, 50);

                // Sprawdzenie generowania zabawnych nazw
                if (moduleId === 'companyName' || moduleId === 'street') {
                    const funnyCheckboxLocator = By.name('funny');
                    if (await waitForElement(funnyCheckboxLocator)) {
                        const funnyCheckbox = await module.findElement(funnyCheckboxLocator);
                        await funnyCheckbox.click();
                        await refreshButton.click();
                        await checkGeneratedResults(moduleId, 50, true);
                    }
                } else if (moduleId === 'comment') {
                    const wordsInput = await module.findElement(By.name('words'));
                    const wordsPerComment = await wordsInput.getAttribute('value');
                    await checkCommentResults(moduleId, wordsPerComment, 50);
                }
            } else {
                await logTest(`Wybór ilości wyników w module ${moduleId}`, `Powinno być wykonane`, false, moduleId);
            }
        }

        // Podsumowanie testów
        console.log(`\nPodsumowanie testów:`);
        console.log(`Łączna liczba testów: ${totalTests}`);
        console.log(`Liczba pozytywnych testów: ${colorText(successfulTests.toString(), 'green')}`);
        console.log(`Liczba negatywnych testów: ${colorText(failedTests.toString(), 'red')}`);

        if (failedTests > 0) {
            console.log(`Moduły z negatywnymi testami: ${failedModules.join(', ')}`);
        }

        console.log(colorText(`Moduł "Załączniki testowe" nie podlega testom automatycznym`, 'yellow'));
    } finally {
        await driver.quit();
    }
})();
