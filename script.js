document.addEventListener('DOMContentLoaded', function () {

    const sampleFiles = {
        'excel': 'sampleFiles/sample.xls',
        'pdf': 'sampleFiles/sample.pdf',
        'word': 'sampleFiles/sample.doc',
        'txt': 'sampleFiles/sample.txt',
        'jpg': 'sampleFiles/sample.jpg',
        'png': 'sampleFiles/sample.png'
    };

    // Funkcja do pobierania pliku
    function downloadFile(url) {
        const tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.download = url.split('/').pop();
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    }

    // Funkcja do tworzenia modułu załączników
    function createAttachmentsModule() {
        const module = document.createElement('div');
        module.classList.add('module');
        module.id = 'test-attachments';

        const header = document.createElement('div');
        header.classList.add('module-header');
        header.innerHTML = '<span>Załączniki testowe</span>';
        module.appendChild(header);

        const content = document.createElement('div');
        content.classList.add('module-content');
        
        const grid = document.createElement('div');
        grid.classList.add('attachments-grid');

        Object.keys(sampleFiles).forEach(fileType => {
            const button = document.createElement('button');
            button.classList.add('download-button');
            button.id = `${fileType}-link`;
            button.innerText = `Plik ${fileType.charAt(0).toUpperCase() + fileType.slice(1)}`;
            button.addEventListener('click', function (event) {
                event.preventDefault();
                const url = sampleFiles[fileType];
                downloadFile(url);
            });
            grid.appendChild(button);
        });

        content.appendChild(grid);
        module.appendChild(content);

        const modulesGrid = document.getElementById('modules');
        modulesGrid.appendChild(module);
    }

    // Funkcja do obsługi zdarzenia kliknięcia na checkbox logów
    const logCheckbox = document.getElementById('show-logs');
    const logContainer = document.getElementById('log-container');

    logCheckbox.addEventListener('change', function () {
        if (logCheckbox.checked) {
            logContainer.style.display = 'block';
        } else {
            logContainer.style.display = 'none';
        }
    });

    const themeSwitch = document.getElementById('theme-switch');
    themeSwitch.addEventListener('change', function () {
        document.body.classList.toggle('dark-mode', themeSwitch.checked);
        updateButtonColors();
        updateThemeBorder();
    });

    // Funkcja aktualizująca kolory przycisków
    function updateButtonColors() {
        const themeButton = document.getElementById('theme-switch');
        if (themeButton) {
            if (document.body.classList.contains('dark-mode')) {
                themeButton.checked = true;
                themeButton.classList.add('light-button');
                themeButton.classList.remove('dark-button');
            } else {
                themeButton.checked = false;
                themeButton.classList.add('dark-button');
                themeButton.classList.remove('light-button');
            }
        }
    }

    // Funkcja aktualizująca obramowanie tematu
    function updateThemeBorder() {
        const themeContainer = document.getElementById('theme-container');
        if (themeContainer) {
            if (document.body.classList.contains('dark-mode')) {
                themeContainer.classList.add('light-border');
                themeContainer.classList.remove('dark-border');
            } else {
                themeContainer.classList.add('dark-border');
                themeContainer.classList.remove('light-border');
            }
        }
    }

    // Inicjalizacja koloru przycisku i obramowania checkboxa "Tło" na podstawie aktualnego motywu
    updateButtonColors();
    updateThemeBorder();

    // Funkcja logowania wiadomości
    let logCount = 0;
    function logMessage(message) {
        const logOutput = document.getElementById('log-output');
        const timestamp = new Date().toLocaleTimeString();
        logOutput.value += `${++logCount}. [${timestamp}] ${message}\n`;
        logOutput.scrollTop = logOutput.scrollHeight;  // Przewiń do dołu
    }

    // Funkcja generująca losowe liczby
    function generateRandomNumber(min, max) {
        logMessage(`generateRandomNumber(${min}, ${max})`);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Funkcja generująca losową płeć
    function randomGender() {
        logMessage(`randomGender()`);
        return Math.random() < 0.5 ? 'male' : 'female';
    }

    // Funkcja generująca imiona
    function generateName(gender = 'all', quantity = 1) {
        logMessage(`generateName(${gender}, ${quantity})`);
        const names = {
            male: ['Jan', 'Piotr', 'Paweł', 'Adam', 'Michał'],
            female: ['Anna', 'Maria', 'Katarzyna', 'Agnieszka'],
            all: ['Anna', 'Maria', 'Katarzyna', 'Agnieszka', 'Barbara', 'Magdalena', 'Ewa', 'Krystyna', 'Elżbieta', 'Marta', 'Jan', 'Piotr', 'Paweł', 'Adam', 'Michał']
        };
        const result = [];
        for (let i = 0; i < quantity; i++) {
            const selectedNames = names[gender] || names.all;
            result.push(selectedNames[Math.floor(Math.random() * selectedNames.length)]);
        }
        return result.join(', ');
    }

    // Funkcja generująca nazwiska
    function generateSurname(gender = 'all', quantity = 1) {
        logMessage(`generateSurname(${gender}, ${quantity})`);
        const surnames = {
            male: ['Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk'],
            female: ['Nowak', 'Kowalska', 'Wiśniewska', 'Wójcik', 'Kowalczyk'],
            all: ['Nowak', 'Kowalska', 'Wiśniewska', 'Wójcik', 'Kowalczyk', 'Tober']
        };
        const result = [];
        for (let i = 0; i < quantity; i++) {
            const selectedSurnames = surnames[gender] || surnames.all;
            result.push(selectedSurnames[Math.floor(Math.random() * selectedSurnames.length)]);
        }
        return result.join(', ');
    }

    // Funkcja generująca daty
    function generateDate(quantity = 1, format = 'DD-MM-YYYY', separator = '-') {
        logMessage(`generateDate(${quantity}, ${format}, ${separator})`);
        const result = [];
        for (let i = 0; i < quantity; i++) {
            const year = generateRandomNumber(1900, 2023);
            const month = String(generateRandomNumber(1, 12)).padStart(2, '0');
            const day = String(generateRandomNumber(1, 28)).padStart(2, '0');
            let date;
            switch (format) {
                case 'YYYY-MM-DD':
                    date = `${year}${separator}${month}${separator}${day}`;
                    break;
                case 'YYYY-DD-MM':
                    date = `${year}${separator}${day}${separator}${month}`;
                    break;
                case 'MM-DD-YYYY':
                    date = `${month}${separator}${day}${separator}${year}`;
                    break;
                default:
                    date = `${day}${separator}${month}${separator}${year}`;
            }
            result.push(date);
        }
        return result.join(', ');
    }

    // Funkcja generująca numery PESEL
    function generatePESEL(gender = randomGender(), quantity = 1, year) {
        const result = [];
        const genderDigit = gender === 'male' ? [1, 3, 5, 7, 9] : [0, 2, 4, 6, 8];
        for (let i = 0; i < quantity; i++) {
            const birthYear = (year && year.toString().length === 4 && year >= 1800 && year <= 2299) ? year : generateRandomNumber(1924, 2024);
            const birthMonth = generateRandomNumber(1, 12);
            const birthDay = String(generateRandomNumber(1, 28)).padStart(2, '0');

            let month;
            if (birthYear >= 1800 && birthYear <= 1899) {
                month = birthMonth + 80;
            } else if (birthYear >= 2000 && birthYear <= 2099) {
                month = birthMonth + 20;
            } else if (birthYear >= 2100 && birthYear <= 2199) {
                month = birthMonth + 40;
            } else if (birthYear >= 2200 && birthYear <= 2299) {
                month = birthMonth + 60;
            } else {
                month = birthMonth;
            }
            month = String(month).padStart(2, '0');
            
            const serial = String(generateRandomNumber(0, 999)).padStart(3, '0');
            const genderSpecificDigit = genderDigit[generateRandomNumber(0, genderDigit.length - 1)];
            const peselWithoutChecksum = `${String(birthYear).slice(-2)}${month}${birthDay}${serial}${genderSpecificDigit}`;
            const checksum = calculatePESELChecksum(peselWithoutChecksum);
            result.push(`${peselWithoutChecksum}${checksum}`);
        }
        return result.join(', ');
    }

    // Funkcja obliczająca sumę kontrolną dla PESEL
    function calculatePESELChecksum(peselWithoutChecksum) {
        logMessage(`calculatePESELChecksum(${peselWithoutChecksum})`);
        const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
        const sum = peselWithoutChecksum
            .split('')
            .reduce((acc, digit, index) => acc + parseInt(digit, 10) * weights[index], 0);
        const modulo = sum % 10;
        return modulo === 0 ? 0 : 10 - modulo;
    }

    // Funkcja generująca numery dowodów osobistych
    function generateID(quantity = 1) {
        logMessage(`generateID(${quantity})`);
        const result = [];
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < quantity; i++) {
            const series = `${letters.charAt(generateRandomNumber(0, 25))}${letters.charAt(generateRandomNumber(0, 25))}${letters.charAt(generateRandomNumber(0, 25))}`;
            const number = String(generateRandomNumber(100000, 999999));
            result.push(`${series}${number}`);
        }
        return result.join(', ');
    }

    // Funkcja generująca kody SWIFT
    function generateSwift(quantity = 1) {
        logMessage(`generateSwift(${quantity})`);
        const result = [];
        const swifts = [
            "ALBPPLPW", "ALBPPLPW", "ABNAPLPW", "PPABPLPK", "BPHKPLPK", "GOSKPLPW", "CITIPLPX", "BIGBPLPW", "EBOSPLPW", "BKCHPLPX", "PKOPPLPW", "POLUPLPR", "CAIXPLPW", "PCBCPLPW", "AGRIPLPR", "DABAPLPW", "DEUTPLPX", "MHBFPLPW", "FBPLPLPW", "GBGCPLPK", "ESSIPLPX", "HSBCPLPW", "ICBKPLPW", "IEEAPLPA", "INGBPLPW", "BCITPLPW", "SKOKPLPW", "BREXPLPW", "MBBPPLPW", "BOTKPLPW", "NBPLPLPW", "NESBPLPW", "BPKOPLPW", "IVSEPLPP", "POCZPLP4", "RCBWPLPW", "ABNAPLPW", "WBKPPLPP", "SCFBPLPW", "GBWCPLPP", "ESSEPLPW", "SOGEPLPW", "HANDPLPW", "TOBAPLPW", "WARTPLPW", "VOWAPLP9"
        ];
        for (let i = 0; i < quantity; i++) {
            result.push(swifts[generateRandomNumber(0, swifts.length - 1)]);
        }
        return result.join(', ');
    }

    // Funkcja generująca numery NIP
    function generateNIP(quantity = 1) {
        logMessage(`generateNIP(${quantity})`);
        const result = [];
        for (let i = 0; i < quantity; i++) {
            const nipWithoutChecksum = `${generateRandomNumber(100000000, 999999999)}`;
            const checksum = calculateNIPChecksum(nipWithoutChecksum);
            result.push(`${nipWithoutChecksum}${checksum}`);
        }
        return result.join(', ');
    }

    // Funkcja obliczająca sumę kontrolną dla NIP
    function calculateNIPChecksum(nipWithoutChecksum) {
        logMessage(`calculateNIPChecksum(${nipWithoutChecksum})`);
        const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
        const sum = nipWithoutChecksum
            .split('')
            .reduce((acc, digit, index) => acc + parseInt(digit, 10) * weights[index], 0);
        const modulo = sum % 11;
        return modulo === 10 ? 0 : modulo;
    }

    // Funkcja generująca numery REGON
    function generateREGON(quantity = 1, type = 9) {
        if (isNaN(type) || (type !== 9 && type !== 14)) {
            type = 9; // Domyślnie 9, jeśli typ nie jest prawidłowy
        }
        logMessage(`generateREGON(${quantity}, ${type})`);
        const result = [];
        for (let i = 0; i < quantity; i++) {
            result.push(type === 9 ? generateRegon9() : generateRegon14());
        }
        return result.join(', ');
    }

    // Funkcja generująca 9-znakowy numer REGON
    function generateRegon9() {
        logMessage(`generateRegon9()`);
        const provinceCode = getRandomProvinceCode();
        const randomPart = getRegonRandomPart();
        const base = `${provinceCode}${randomPart}`;
        const controlSum = getRegonControlSumField(base);
        return base + controlSum;
    }

    // Funkcja generująca kod województwa dla REGON
    function getRandomProvinceCode() {
        logMessage(`getRandomProvinceCode()`);
        const random = getRandomInt(0, 48);
        const provinceCode = 2 * random + 1;
        return addLeadingZeros(provinceCode, 2);
    }

    // Funkcja generująca losową część numeru REGON
    function getRegonRandomPart() {
        logMessage(`getRegonRandomPart()`);
        const randomInt = getRandomInt(0, 999999);
        return addLeadingZeros(randomInt, 6);
    }

    // Funkcja obliczająca sumę kontrolną dla REGON
    function getRegonControlSumField(base) {
        logMessage(`getRegonControlSumField(${base})`);
        const controlSum = 8 * base[0] + 9 * base[1] + 2 * base[2] + 3 * base[3] + 4 * base[4]
            + 5 * base[5] + 6 * base[6] + 7 * base[7];
        const controlSumRest = controlSum % 11;
        if (controlSumRest === 10) {
            return 0;
        }
        return controlSumRest;
    }

    // Funkcja generująca 14-znakowy numer REGON
    function generateRegon14() {
        logMessage(`generateRegon14()`);
        const regon9 = generateRegon9();
        const randomPart = getRegon14RandomPart();
        const base = `${regon9}${randomPart}`;
        const controlSum = getRegon14ControlSumField(base);
        return base + controlSum;
    }

    // Funkcja generująca losową część numeru REGON14
    function getRegon14RandomPart() {
        logMessage(`getRegon14RandomPart()`);
        const randomInt = getRandomInt(0, 9994);
        return addLeadingZeros(randomInt, 4);
    }

    // Funkcja obliczająca sumę kontrolną dla REGON14
    function getRegon14ControlSumField(base) {
        logMessage(`getRegon14ControlSumField(${base})`);
        const controlSum = 2 * base[0] + 4 * base[1] + 8 * base[2] + 5 * base[3] + 0 * base[4]
            + 9 * base[5] + 7 * base[6] + 3 * base[7] + 6 * base[8] + 1 * base[9]
            + 3 * base[10] + 7 * base[11] + 9 * base[12];
        const controlSumRest = controlSum % 11;
        if (controlSumRest === 10) {
            return 0;
        }
        return controlSumRest;
    }

    // Funkcja dodająca wiodące zera do numeru
    function addLeadingZeros(number, length) {
        logMessage(`addLeadingZeros(${number}, ${length})`);
        return number.toString().padStart(length, '0');
    }

    // Funkcja generująca losową liczbę całkowitą w zakresie
    function getRandomInt(min, max) {
        logMessage(`getRandomInt(${min}, ${max})`);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Funkcja generująca numery ksiąg wieczystych
    function generateLandRegistryNumber(quantity = 1) {
        logMessage(`generateLandRegistryNumber(${quantity})`);
        const result = [];
        const codes = [
            'BB1B', 'BB1C', 'BB1Z', 'BI1B', 'BI1P', 'BI1S', 'BI2P', 'BI3P', 'BY1B', 'BY1I', 'BY1M', 'BY1N', 'BY1S', 'BY1T', 'BY1U', 'BY1Z', 'BY2T', 'CIKW', 'CZ1C', 'CZ1L', 'CZ1M', 'CZ1Z', 'CZ2C', 'DIRS', 'EL1B', 'EL1D', 'EL1E', 'EL1I', 'EL1N', 'EL1O', 'EL2O', 'GD1A', 'GD1E', 'GD1G', 'GD1I', 'GD1M', 'GD1R', 'GD1S', 'GD1T', 'GD1W', 'GD1Y', 'GD2I', 'GD2M', 'GD2W', 'GL1G', 'GL1J', 'GL1R', 'GL1S', 'GL1T', 'GL1W', 'GL1X', 'GL1Y', 'GL1Z', 'GW1G', 'GW1K', 'GW1M', 'GW1S', 'GW1U', 'JG1B', 'JG1J', 'JG1K', 'JG1L', 'JG1S', 'JG1Z', 'KA1B', 'KA1C', 'KA1D', 'KA1I', 'KA1J', 'KA1K', 'KA1L', 'KA1M', 'KA1P', 'KA1S', 'KA1T', 'KA1Y', 'KI1A', 'KI1B', 'KI1H', 'KI1I', 'KI1J', 'KI1K', 'KI1L', 'KI1O', 'KI1P', 'KI1R', 'KI1S', 'KI1T', 'KI1W', 'KN1K', 'KN1N', 'KN1S', 'KN1T', 'KO1B', 'KO1D', 'KO1E', 'KO1I', 'KO1K', 'KO1L', 'KO1W', 'KO2B', 'KR1B', 'KR1C', 'KR1E', 'KR1H', 'KR1I', 'KR1K', 'KR1M', 'KR1O', 'KR1P', 'KR1S', 'KR1W', 'KR1Y', 'KR2E', 'KR2I', 'KR2K', 'KR2P', 'KR2Y', 'KR3I', 'KS1B', 'KS1E', 'KS1J', 'KS1K', 'KS1S', 'KS2E', 'KZ1A', 'KZ1E', 'KZ1J', 'KZ1O', 'KZ1P', 'KZ1R', 'KZ1W', 'LD1B', 'LD1G', 'LD1H', 'LD1K', 'LD1M', 'LD1O', 'LD1P', 'LD1R', 'LD1Y', 'LE1G', 'LE1J', 'LE1L', 'LE1U', 'LE1Z', 'LM1G', 'LM1L', 'LM1W', 'LM1Z', 'LU1A', 'LU1B', 'LU1C', 'LU1I', 'LU1K', 'LU1O', 'LU1P', 'LU1R', 'LU1S', 'LU1U', 'LU1W', 'LU1Y', 'NS1G', 'NS1L', 'NS1M', 'NS1S', 'NS1T', 'NS1Z', 'NS2L', 'OL1B', 'OL1C', 'OL1E', 'OL1G', 'OL1K', 'OL1L', 'OL1M', 'OL1N', 'OL1O', 'OL1P', 'OL1S', 'OL1Y', 'OL2G', 'OP1B', 'OP1G', 'OP1K', 'OP1L', 'OP1N', 'OP1O', 'OP1P', 'OP1S', 'OP1U', 'OS1M', 'OS1O', 'OS1P', 'OS1U', 'OS1W', 'PL1C', 'PL1E', 'PL1G', 'PL1L', 'PL1M', 'PL1O', 'PL1P', 'PL1Z', 'PL2M', 'PO1A', 'PO1B', 'PO1D', 'PO1E', 'PO1F', 'PO1G', 'PO1H', 'PO1I', 'PO1K', 'PO1L', 'PO1M', 'PO1N', 'PO1O', 'PO1P', 'PO1R', 'PO1S', 'PO1T', 'PO1Y', 'PO1Z', 'PO2A', 'PO2H', 'PO2P', 'PO2T', 'PR1J', 'PR1L', 'PR1P', 'PR1R', 'PR2R', 'PT1B', 'PT1O', 'PT1P', 'PT1R', 'PT1T', 'RA1G', 'RA1K', 'RA1L', 'RA1P', 'RA1R', 'RA1S', 'RA1Z', 'RA2G', 'RA2Z', 'RZ1A', 'RZ1D', 'RZ1E', 'RZ1R', 'RZ1S', 'RZ1Z', 'RZ2Z', 'SI1G', 'SI1M', 'SI1P', 'SI1S', 'SI1W', 'SI2S', 'SL1B', 'SL1C', 'SL1L', 'SL1M', 'SL1S', 'SL1Z', 'SR1L', 'SR1S', 'SR1W', 'SR1Z', 'SR2L', 'SR2W', 'SU1A', 'SU1N', 'SU1S', 'SW1D', 'SW1K', 'SW1S', 'SW1W', 'SW1Z', 'SW2K', 'SZ1C', 'SZ1G', 'SZ1K', 'SZ1L', 'SZ1M', 'SZ1O', 'SZ1S', 'SZ1T', 'SZ1W', 'SZ1Y', 'SZ2S', 'SZ2T', 'TB1K', 'TB1M', 'TB1N', 'TB1S', 'TO1B', 'TO1C', 'TO1G', 'TO1T', 'TO1U', 'TO1W', 'TR1B', 'TR1D', 'TR1O', 'TR1T', 'TR2T', 'WA1G', 'WA1I', 'WA1L', 'WA1M', 'WA1N', 'WA1O', 'WA1P', 'WA1W', 'WA2M', 'WA3M', 'WA4M', 'WA5M', 'WA6M', 'WL1A', 'WL1L', 'WL1R', 'WL1W', 'WL1Y', 'WR1E', 'WR1K', 'WR1L', 'WR1M', 'WR1O', 'WR1S', 'WR1T', 'WR1W', 'ZA1B', 'ZA1H', 'ZA1J', 'ZA1K', 'ZA1T', 'ZA1Z', 'ZG1E', 'ZG1G', 'ZG1K', 'ZG1N', 'ZG1R', 'ZG1S', 'ZG1W', 'ZG2K', 'ZG2S'
        ];

        for (let i = 0; i < quantity; i++) {
            const code = codes[generateRandomNumber(0, codes.length - 1)];
            const number = String(generateRandomNumber(1, 99999999)).padStart(8, '0');
            const landRegistryNumberWithoutChecksum = `${code}${number}`;
            const checksum = calculateLandRegistryNumberChecksum(landRegistryNumberWithoutChecksum);
            result.push(`${code}/${number}/${checksum}`);
        }
        return result.join(', ');
    }

    // Funkcja obliczająca sumę kontrolną dla numeru księgi wieczystej
    function calculateLandRegistryNumberChecksum(numberWithoutChecksum) {
        logMessage(`calculateLandRegistryNumberChecksum(${numberWithoutChecksum})`);
        const weights = [1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
        const values = {
            '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
            'X': 10, 'A': 11, 'B': 12, 'C': 13, 'D': 14, 'E': 15, 'F': 16,
            'G': 17, 'H': 18, 'I': 19, 'J': 20, 'K': 21, 'L': 22, 'M': 23, 'N': 24, 'O': 25, 'P': 26,
            'R': 27, 'S': 28, 'T': 29, 'U': 30, 'W': 31, 'Y': 32, 'Z': 33
        };
        const sum = numberWithoutChecksum
            .split('')
            .reduce((acc, char, index) => acc + (values[char] || 0) * weights[index], 0);
        return sum % 10;
    }

    // Kody jednostek do generowania IBAN
    const unitCodes = [
        "10100000", "10100039", "10100055", "10100068", "10101010", "10101023", "10101049"
    ];

    // Funkcja generująca IBAN
    function generateIBAN(quantity = 1) {
        logMessage(`generateIBAN(${quantity})`);
        const result = [];
        for (let i = 0; i < quantity; i++) {
            result.push(generateIbanWithPrefix(true, false)); // generujemy IBAN z prefiksem PL
        }
        return result.join(', ');
    }

    // Funkcja generująca numery rachunków bankowych
    function generateBankAccountNumber(quantity = 1) {
        logMessage(`generateBankAccountNumber(${quantity})`);
        const result = [];
        for (let i = 0; i < quantity; i++) {
            result.push(generateIbanWithPrefix(false, false)); // generujemy numer rachunku bez prefiksu PL
        }
        return result.join(', ');
    }

    // Funkcja generująca IBAN z prefiksem
    function generateIbanWithPrefix(prefix, spaces) {
        logMessage(`generateIbanWithPrefix(${prefix}, ${spaces})`);
        const unitCode = getRandomUnitCode();
        const randomPart = getIbanRandomPart();
        const base = `${unitCode}${randomPart}`;
        const controlSum = getIbanControlSumField(base);
        let iban = `${controlSum}${base}`;
        if (spaces) {
            iban = prettyFormatted(iban);
        }
        if (prefix) {
            iban = `PL${iban}`;
        }
        return iban;
    }

    // Funkcja zwracająca losowy kod jednostki do IBAN
    function getRandomUnitCode() {
        logMessage(`getRandomUnitCode()`);
        const index = getRandomInt(0, unitCodes.length - 1);
        return unitCodes[index];
    }

    // Funkcja generująca losową część IBAN
    function getIbanRandomPart() {
        logMessage(`getIbanRandomPart()`);
        const randomInt = getRandomInt(0, 9999999999999999);
        return addLeadingZeros(randomInt, 16);
    }

    // Funkcja obliczająca sumę kontrolną dla IBAN
    function getIbanControlSumField(base) {
        logMessage(`getIbanControlSumField(${base})`);
        const baseNumber = BigInt(`${base}252100`);
        const remainder = baseNumber % 97n;
        const controlNumber = 98n - remainder;
        return addLeadingZeros(controlNumber.toString(), 2);
    }

    // Funkcja formatująca IBAN do czytelnej formy
    function prettyFormatted(iban) {
        logMessage(`prettyFormatted(${iban})`);
        let formatted = iban.substring(0, 2);
        for (let i = 2; i < 26; i += 4) {
            formatted += ` ${iban.substring(i, i + 4)}`;
        }
        return formatted;
    }

    // Funkcja generująca nazwy firm
    function generateCompanyName(quantity = 1, wordCount = 1, funny = false) {
        logMessage(`generateCompanyName(${quantity}, ${wordCount}, ${funny})`);
        const companyNames = funny ? ["Gorący trójkąt", "Lodziarnia Zimny Drań", "Ministerstwo Wakacji", "Samo Spadło Centrum Serwisowe", "Brudny Harry"] : ["Brygadex", "Świeżex", "Słoneczex", "Spółdzielex", "Konsulex", "Dywanex"];
        const companyTypes = ["Spółka z o.o", "Spółka jawna", "Spółka cywilna", "Korporacja", "Konsorcjum"];
        if (!companyNames.length) return '';
        const result = [];
        for (let i = 0; i < quantity; i++) {
            const words = [];
            for (let j = 0; j < wordCount; j++) {
                words.push(companyNames[generateRandomNumber(0, companyNames.length - 1)]);
            }
            const companyType = companyTypes[generateRandomNumber(0, companyTypes.length - 1)];
            result.push(`${words.join(' ')} ${companyType}`);
        }
        return result.join(', ');
    }

    // Funkcja generująca nazwy ulic
    function generateStreet(quantity = 1, wordCount = 1, funny = false) {
        logMessage(`generateStreet(${quantity}, ${wordCount}, ${funny})`);
        const streets = ["Kościuszki", "Mickiewicza", "Słowackiego", "Sienkiewicza"];
        const funnyStreetNames = ["10 Zakładników", "Alibaby", "Amora", "Beznazwy", "Braci Polskich", "Chatka Puchatka"];
        const namesArray = funny ? funnyStreetNames : streets;
        if (!namesArray.length) return '';
        const result = [];
        for (let i = 0; i < quantity; i++) {
            const words = [];
            for (let j = 0; j < wordCount; j++) {
                words.push(namesArray[generateRandomNumber(0, namesArray.length - 1)]);
            }
            result.push(words.join(' '));
        }
        return result.join(', ');
    }

    // Funkcja generująca nazwy miast
    function generateCity(quantity = 1) {
        logMessage(`generateCity(${quantity})`);
        const cities = ["Warszawa", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz", "Lublin", "Katowice"];
        if (!cities.length) return '';
        const result = [];
        for (let i = 0; i < quantity; i++) {
            result.push(cities[generateRandomNumber(0, cities.length - 1)]);
        }
        return result.join(', ');
    }

    // Funkcja generująca kody pocztowe
    function generatePostalCode(quantity = 1) {
        logMessage(`generatePostalCode(${quantity})`);
        const result = [];
        for (let i = 0; i < quantity; i++) {
            result.push(generateSinglePostalCode());
        }
        return result.join(', ');
    }

    // Funkcja generująca pojedynczy kod pocztowy
    function generateSinglePostalCode() {
        logMessage(`generateSinglePostalCode()`);
        const part1 = getRandomInt(0, 99);
        const part2 = getRandomInt(0, 999);
        return `${addLeadingZeros(part1, 2)}-${addLeadingZeros(part2, 3)}`;
    }

    // Funkcja generująca komentarze
    function generateComment(quantity = 1, wordCount, characterCount) {
        logMessage(`generateComment(${quantity}, ${wordCount}, ${characterCount})`);
        const words = [
            "poprawić", "szybko", "potrzeba", "pilnie", "albo", "zwrócić", "przygotować", "napisać", "zadzwonić", "wysłać", "ponieważ", "dlatego", "bardzo", "nalegać"
        ]; // Przykładowe słowa do generowania komentarza
        const result = [];
        for (let i = 0; i < quantity; i++) {
            let comment = '';
            if (characterCount) {
                while (comment.length < characterCount) {
                    comment += `${words[generateRandomNumber(0, words.length - 1)]} `;
                }
                comment = comment.substring(0, characterCount).trim();
            } else if (wordCount) {
                for (let j = 0; j < wordCount; j++) {
                    comment += `${words[generateRandomNumber(0, words.length - 1)]} `;
                }
                comment = comment.trim();
            }
            result.push(comment);
        }
        return result.join(', ');
    }

    // Funkcja generująca specjalne komentarze (SQL Injection, Znaki specjalne)
    function generateSpecialComment(quantity = 1, type, characterCount = 20) {
        logMessage(`generateSpecialComment(${quantity}, ${type}, ${characterCount})`);
        const sqlInjectionExamples = ["' OR '1'='1", "admin'--", "admin' #"];
        const specialCharacters = 'ąćęłńóśźżÄäÖöÜüßàâæçéèêëîïôœùûüÿÇÉÀÈÙÂÊÎÔÛŒaeiouyãẽĩõũâêîôûŕãẽĩõũ❤️✈️⬛️⚪️';
        const diacriticalCharacters = 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ';
    
        const result = [];
        for (let i = 0; i < quantity; i++) {
            if (type === 'sqlInjection') {
                result.push(sqlInjectionExamples[generateRandomNumber(0, sqlInjectionExamples.length - 1)]);
            } else if (type === 'specialCharacters') {
                let specialCharactersString = '';
                for (let j = 0; j < 20; j++) {
                    specialCharactersString += specialCharacters.charAt(generateRandomNumber(0, specialCharacters.length - 1));
                }
                result.push(specialCharactersString);
            } else {
                let shuffled = diacriticalCharacters.split('').sort(() => 0.5 - Math.random()).join('').slice(0, 20);
                result.push(shuffled);
            }
        }
        return result.join(', ');
    }

    // Definicja modułów z ich ustawieniami i funkcjami generowania
    const modules = [
        { id: 'name', title: 'Imię', settings: [{ type: 'radio', name: 'gender', options: { all: 'Losowe', male: 'Męskie', female: 'Damskie' }, default: 'all' }], generateFunction: generateName },
        { id: 'surname', title: 'Nazwisko', settings: [{ type: 'radio', name: 'gender', options: { all: 'Losowe', male: 'Męskie', female: 'Damskie' }, default: 'all' }], generateFunction: generateSurname },
        { id: 'date', title: 'Data', settings: [{ type: 'select', name: 'format', options: { 'DD-MM-YYYY': 'DD-MM-RRRR', 'YYYY-MM-DD': 'RRRR-MM-DD', 'YYYY-DD-MM': 'RRRR-DD-MM', 'MM-DD-YYYY': 'MM-DD-RRRR' }, default: 'DD-MM-YYYY' }, { type: 'select', name: 'separator', options: { '-': '-', '/': '/', '.': '.', ' ' : ' ' }, default: '-' }], generateFunction: generateDate },
        { id: 'pesel', title: 'PESEL', settings: [{ type: 'radio', name: 'gender', options: { male: 'Męskie', female: 'Damskie' }, default: 'male' }, { type: 'number', name: 'year', placeholder: 'Rok (RRRR)' }], generateFunction: generatePESEL },
        { id: 'id', title: 'Numer Dowodu', settings: [], generateFunction: generateID },
        { id: 'swift', title: 'SWIFT', settings: [], generateFunction: generateSwift },
        { id: 'nip', title: 'NIP', settings: [], generateFunction: generateNIP },
        { id: 'regon', title: 'REGON', settings: [{ type: 'radio', name: 'type', options: { 9: '9-znakowy', 14: '14-znakowy' }, default: '9' }], generateFunction: generateREGON },
        { id: 'landRegistry', title: 'Księga Wieczysta', settings: [], generateFunction: generateLandRegistryNumber },
        { id: 'bankAccount', title: 'Numer Rachunku Bankowego', settings: [], generateFunction: generateBankAccountNumber },
        { id: 'iban', title: 'IBAN', settings: [], generateFunction: generateIBAN },
        { id: 'companyName', title: 'Nazwa Firmy', settings: [{ type: 'number', name: 'wordCount', placeholder: 'Liczba słów (1-7)' }, { type: 'checkbox', name: 'funny', label: 'Zabawne nazwy' }], generateFunction: generateCompanyName },
        { id: 'street', title: 'Ulica', settings: [{ type: 'number', name: 'wordCount', placeholder: 'Liczba słów (1-7)' }, { type: 'checkbox', name: 'funny', label: 'Zabawne nazwy' }], generateFunction: generateStreet },
        { id: 'city', title: 'Miasto', settings: [], generateFunction: generateCity },
        { id: 'postalCode', title: 'Kod Pocztowy', settings: [], generateFunction: generatePostalCode },
        { id: 'comment', title: 'Komentarz', settings: [{ type: 'number', name: 'words', placeholder: 'Liczba słów', value: 4 }, { type: 'number', name: 'characters', placeholder: 'Liczba znaków' }], generateFunction: generateComment },
        { id: 'specialComment', title: 'Komentarz Specjalny', settings: [{ type: 'radio', name: 'type', options: { sqlInjection: 'SQL Injection', specialCharacters: 'Znaki specjalne' }, default: 'diacriticalCharacters' }], generateFunction: generateSpecialComment }
    ];

    const modulesContainer = document.getElementById('modules');

    modules.forEach(module => {
        const moduleElement = document.createElement('div');
        moduleElement.classList.add('module');
        moduleElement.id = module.id;

        const header = document.createElement('div');
        header.classList.add('module-header');
        header.innerHTML = `<span>${module.title}</span><span class="copy-message" style="display: none;">Skopiowano</span>`;

        const content = document.createElement('div');
        content.classList.add('module-content');

        const data = document.createElement('div');
        data.classList.add('module-data');
        data.id = `${module.id}-data`;
        data.onclick = () => {
            copyToClipboard(module.id);
            logMessage(`Kliknięto na dane w module ${module.id}`);
        };

        const buttons = document.createElement('div');
        buttons.classList.add('module-buttons');

        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Odśwież';
        refreshButton.onclick = () => {
            logMessage(`Kliknięto przycisk Odśwież w module ${module.id}`);
            fetchData(module.id, module.generateFunction);
        };

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Kopiuj';
        copyButton.onclick = () => {
            copyToClipboard(module.id);
            logMessage(`Kliknięto przycisk Kopiuj w module ${module.id}`);
        };

        const settingsButton = document.createElement('button');
        settingsButton.textContent = 'Ustawienia';
        settingsButton.onclick = () => {
            toggleSettings(module.id);
            logMessage(`Kliknięto przycisk Ustawienia w module ${module.id}`);
        };

        buttons.appendChild(refreshButton);
        buttons.appendChild(copyButton);
        buttons.appendChild(settingsButton);

        content.appendChild(data);
        content.appendChild(buttons);

        moduleElement.appendChild(header);
        moduleElement.appendChild(content);

        if (module.settings.length) {
            const settingsContainer = document.createElement('div');
            settingsContainer.id = `${module.id}-settings`;
            settingsContainer.style.display = 'none';
            settingsContainer.classList.add('settings-container');

            module.settings.forEach(setting => {
                const settingElement = document.createElement('div');
                settingElement.classList.add('setting');

                if (setting.type === 'number') {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.name = setting.name;
                    input.placeholder = setting.placeholder;
                    if (setting.value) {
                        input.value = setting.value;
                    }
                    input.oninput = validateAndToggleInput;
                    settingElement.appendChild(input);
                } else if (setting.type === 'radio') {
                    for (const [value, label] of Object.entries(setting.options)) {
                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.name = setting.name;
                        input.value = value;
                        if (setting.default === value) {
                            input.checked = true;
                        }

                        const inputLabel = document.createElement('label');
                        inputLabel.textContent = label;
                        inputLabel.prepend(input);

                        settingElement.appendChild(inputLabel);
                    }
                } else if (setting.type === 'checkbox') {
                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    input.name = setting.name;

                    const inputLabel = document.createElement('label');
                    inputLabel.textContent = setting.label;
                    inputLabel.prepend(input);

                    input.onchange = () => fetchData(module.id, module.generateFunction);

                    settingElement.appendChild(inputLabel);
                    settingElement.appendChild(input);
                } else if (setting.type === 'select') {
                    const select = document.createElement('select');
                    select.name = setting.name;
                    for (const [value, label] of Object.entries(setting.options)) {
                        const option = document.createElement('option');
                        option.value = value;
                        option.textContent = label;
                        if (setting.default === value) {
                            option.selected = true;
                        }
                        select.appendChild(option);
                    }
                    settingElement.appendChild(select);
                }
                settingsContainer.appendChild(settingElement);
            });

            const quantitySelect = document.createElement('select');
            quantitySelect.name = 'quantity';
            [1, 10, 50].forEach(qty => {
                const option = document.createElement('option');
                option.value = qty;
                option.textContent = qty;
                if (qty === 1) {
                    option.selected = true;
                }
                quantitySelect.appendChild(option);
            });
            settingsContainer.appendChild(quantitySelect);

            const clearButton = document.createElement('button');
            clearButton.textContent = 'Wyczyść filtr ustawień';
            clearButton.onclick = () => resetSettingsToDefault(module.id);
            settingsContainer.appendChild(clearButton);

            moduleElement.appendChild(settingsContainer);
        } else {
            const settingsContainer = document.createElement('div');
            settingsContainer.id = `${module.id}-settings`;
            settingsContainer.style.display = 'none';
            settingsContainer.classList.add('settings-container');

            const quantitySelect = document.createElement('select');
            quantitySelect.name = 'quantity';
            [1, 10, 50].forEach(qty => {
                const option = document.createElement('option');
                option.value = qty;
                option.textContent = qty;
                if (qty === 1) {
                    option.selected = true;
                }
                quantitySelect.appendChild(option);
            });
            settingsContainer.appendChild(quantitySelect);

            const clearButton = document.createElement('button');
            clearButton.textContent = 'Wyczyść filtr ustawień';
            clearButton.onclick = () => resetSettingsToDefault(module.id);
            settingsContainer.appendChild(clearButton);

            moduleElement.appendChild(settingsContainer);
        }

        modulesContainer.appendChild(moduleElement);
        fetchData(module.id, module.generateFunction);
    });

    // Funkcja pobierająca dane dla modułu
    function fetchData(moduleId, generateFunction) {
        logMessage(`Kliknięto przycisk Odśwież w module ${moduleId}`);
        const moduleElement = document.getElementById(moduleId);
        const settings = moduleElement.querySelectorAll('.settings-container input, .settings-container select');
        const params = {};
        let quantity = 1; // Domyślna ilość

        settings.forEach(setting => {
            if (setting.type === 'radio' && !setting.checked) return;
            if (setting.type === 'checkbox' && !setting.checked) return;
            if (setting.name === 'year') {
                const yearValue = parseInt(setting.value, 10);
                if (setting.value !== '' && (isNaN(yearValue) || yearValue < 1800 || yearValue > 2299)) {
                    showValidationMessage(setting, 'dopuszczalne wartości od 1800 do 2299 lub puste');
                    setting.value = '';
                } else {
                    params[setting.name] = yearValue;
                }
            } else if (setting.name === 'quantity') {
                quantity = parseInt(setting.value, 10);
            } else if (setting.type === 'radio' && setting.checked) {
                params[setting.name] = setting.value; // Upewnij się, że typ jest traktowany jako string i przetwarzany według potrzeb
            } else if (setting.name === 'words' || setting.name === 'characters') {
                params[setting.name] = parseInt(setting.value, 10);
            } else if (setting.type === 'checkbox' && setting.name === 'funny') {
                params[setting.name] = setting.checked;
            } else if (setting.value) {
                params[setting.name] = setting.value;
            }
        });

        logMessage(`Rozpoczęcie generowania danych: funkcja ${generateFunction.name}, parametry: ${JSON.stringify(params)}, ilość: ${quantity}`);

        let data;
        if (generateFunction.name === 'generateDate') {
            data = generateFunction(quantity, params.format, params.separator);
        } else if (generateFunction.name === 'generatePESEL') {
            data = generateFunction(params.gender, quantity, params.year);
        } else if (generateFunction.name === 'generateSpecialComment') {
            data = generateFunction(quantity, params.type, params.characters); // Upewnij się, że typ jest przekazany
        } else if (generateFunction.name === 'generateComment') {
            data = generateFunction(quantity, params.words, params.characters);
        } else if (generateFunction.name === 'generateCompanyName' || generateFunction.name === 'generateStreet') {
            data = generateFunction(quantity, params.wordCount, params.funny);
        } else if (generateFunction.name === 'generateREGON') {
            data = generateFunction(quantity, parseInt(params.type, 10)); // Upewnij się, że typ jest przetwarzany jako liczba całkowita
        } else if (generateFunction.name === 'generateName' || generateFunction.name === 'generateSurname') {
            data = generateFunction(params.gender, quantity); // Upewnij się, że płeć jest przekazana
        } else {
            data = generateFunction(quantity);
        }

        const dataElement = moduleElement.querySelector('.module-data');
        dataElement.textContent = data;
        logMessage(`Zakończenie generowania danych: ${data}`);
    }

    // Funkcja przełączająca ustawienia modułu
    function toggleSettings(moduleId) {
        const settingsContainer = document.getElementById(`${moduleId}-settings`);
        const isVisible = settingsContainer.style.display === 'block';
        settingsContainer.style.display = isVisible ? 'none' : 'block';
    }

    // Funkcja walidująca i przełączająca input
    function validateAndToggleInput(event) {
        const input = event.target;
        const value = input.value;
        const minValue = parseInt(input.min, 10);
        const maxValue = parseInt(input.max, 10);

        if (value === '' || (minValue && value < minValue) || (maxValue && value > maxValue)) {
            input.classList.add('invalid');
        } else {
            input.classList.remove('invalid');
        }
    }

    function resetSettingsToDefault(moduleId) {
        const module = modules.find(m => m.id === moduleId);
        const settingsContainer = document.getElementById(`${moduleId}-settings`);
        const inputs = settingsContainer.querySelectorAll('input, select');

        inputs.forEach(input => {
            if (input.type === 'radio') {
                input.checked = input.value === module.settings.find(setting => setting.name === input.name).default;
            } else if (input.type === 'checkbox') {
                input.checked = false;
            } else if (input.name === 'quantity') {
                input.value = 1; // Domyślna ilość ustawiona na 1
            } else if (input.name === 'words') {
                input.value = 4; // Domyślna liczba słów ustawiona na 4
            } else if (input.name === 'characters') {
                input.value = ''; // Domyślna liczba znaków jest pusta
            } else {
                const setting = module.settings.find(setting => setting.name === input.name);
                input.value = setting && setting.default ? setting.default : '';
            }
        });

        fetchData(moduleId, module.generateFunction); // Odśwież moduł z domyślnymi ustawieniami
    }

    // Funkcja kopiująca dane do schowka
    function copyToClipboard(moduleId) {
        const dataElement = document.getElementById(`${moduleId}-data`);
        const textToCopy = dataElement.textContent;

        navigator.clipboard.writeText(textToCopy).then(() => {
            showCopyMessage(moduleId);
            logMessage(`Skopiowano dane z modułu ${moduleId}: ${textToCopy}`);
        }).catch(err => {
            logMessage(`Błąd podczas kopiowania danych z modułu ${moduleId}: ${err}`);
        });
    }

    // Funkcja pokazująca komunikat o skopiowaniu
    function showCopyMessage(moduleId) {
        const moduleElement = document.getElementById(moduleId);
        const copyMessage = moduleElement.querySelector('.copy-message');
        copyMessage.style.display = 'inline';

        setTimeout(() => {
            copyMessage.style.display = 'none';
        }, 2000);
    }

    // Funkcja do walidacji i ograniczania wejścia dla pól liczby słów
    function validateWordCountInput(event) {
        const input = event.target;
        const value = parseInt(input.value, 10);
        if (isNaN(value) || value < 1 || value > 1000) {
            showValidationMessage(input, 'dopuszczalne wartości od 1 do 1000');
            input.value = ''; // Wyczyść nieprawidłowe wejście
        } else {
            clearOtherField(input);
        }
    }  
    
    // Dodaj listenery zdarzeń do pól "Liczba słów"
    function addWordCountValidation() {
        const wordCountFields = document.querySelectorAll('input[name="wordCount"], input[name="words"]');
        wordCountFields.forEach(field => {
            field.addEventListener('input', validateWordCountInput);
            field.addEventListener('change', validateWordCountInput);
        });
    }

    // Dodaj listenery zdarzeń do pól "Liczba znaków"
    function addCharacterCountValidation() {
        const characterCountFields = document.querySelectorAll('input[name="characters"]');
        characterCountFields.forEach(field => {
            field.addEventListener('input', validateCharacterCountInput);
            field.addEventListener('change', validateCharacterCountInput);
        });
    }

    // Funkcja pokazująca wiadomości walidacyjne
    function showValidationMessage(input, message) {
        let messageElement = input.nextElementSibling;
        if (!messageElement || !messageElement.classList.contains('validation-message')) {
            messageElement = document.createElement('div');
            messageElement.className = 'validation-message';
            messageElement.style.color = 'red';
            messageElement.style.fontWeight = 'bold';
            input.parentNode.insertBefore(messageElement, input.nextSibling);
        }
        messageElement.textContent = message;
        messageElement.style.display = 'block';

        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }

    // Dodaj listenery zdarzeń do pola "Rok" w module PESEL
    function addPeselYearValidation() {
        const yearField = document.querySelector('#pesel input[name="year"]');
        if (yearField) {
            yearField.addEventListener('blur', (event) => {
                const value = parseInt(event.target.value, 10);
                if (event.target.value !== '' && (isNaN(value) || value < 1800 || value > 2299)) {
                    showValidationMessage(yearField, 'dopuszczalne wartości od 1800 do 2299 lub puste');
                    yearField.value = ''; // Wyczyść nieprawidłowe wejście
                }
            });
        }
    }

    // Funkcja do walidacji i ograniczania wejścia dla pól liczby znaków
    function validateCharacterCountInput(event) {
        const input = event.target;
        const value = parseInt(input.value, 10);
        if (input.value !== '' && (isNaN(value) || value < 1 || value > 1000)) {
            showValidationMessage(input, 'dopuszczalne wartości od 1 do 1000 lub puste');
            input.value = ''; // Wyczyść nieprawidłowe wejście
        } else {
            clearOtherField(input);
        }
    }

    // Funkcja czyszcząca inne pole, gdy jedno pole jest wypełnione
    function clearOtherField(input) {
        const moduleElement = input.closest('.module');
        const otherField = input.name === 'words' 
            ? moduleElement.querySelector('input[name="characters"]') 
            : moduleElement.querySelector('input[name="words"]');
        if (otherField) {
            otherField.value = '';
        }
    }

    // Sprawdź lokalne przechowywanie preferencji tematu i zastosuj je
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        themeSwitch.checked = savedTheme === 'dark';
    }

    updateButtonColors();
    createAttachmentsModule();
    addWordCountValidation(); // Wywołaj tę funkcję, aby dodać walidację do pól liczby słów
    addCharacterCountValidation(); // Wywołaj tę funkcję, aby dodać walidację do pól liczby znaków
    addPeselYearValidation(); // Wywołaj tę funkcję, aby dodać walidację do pola roku w module PESEL
    
});
