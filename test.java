import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.Selenide;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.List;

import static com.codeborne.selenide.Selenide.*;
import static com.codeborne.selenide.Condition.*;
import static com.codeborne.selenide.Selectors.*;

public class WebTests {

    @BeforeMethod
    public void setUp() {
        Configuration.startMaximized = true;
        Configuration.timeout = 10000;
        // file path
        open(" "); 
    }

    @AfterMethod
    public void tearDown() {
        Selenide.closeWebDriver();
    }

    @Test
    public void testThemeSwitch() {
        if ($(By.id("theme-switch")).exists()) {
            $("#theme-switch").click();
            $("body").shouldHave(cssClass("dark-mode"));
            $("#theme-switch").click();
            $("body").shouldNotHave(cssClass("dark-mode"));
        }
    }

    @Test
    public void testLogsVisibility() {
        if ($(By.id("show-logs")).exists()) {
            $("#show-logs").click();
            $("#log-container").shouldBe(visible);
            $("#show-logs").click();
            $("#log-container").shouldNotBe(visible);
        }
    }

    @Test
    public void testModules() {
        List<String> moduleIds = $$("div.module").texts();

        for (String moduleId : moduleIds) {
            if (moduleId.equals("test-attachments")) continue;

            WebElement module = $(byId(moduleId));

            testModuleSettings(module, moduleId);
            testModuleActions(module, moduleId);
            testModuleResults(module, moduleId);
        }
    }

    private void testModuleSettings(WebElement module, String moduleId) {
        if ($(module).$(byText("Ustawienia")).exists()) {
            $(module).$(byText("Ustawienia")).click();

            List<WebElement> settings = $(module).$$(".settings-container input, .settings-container select");

            for (WebElement setting : settings) {
                String settingType = setting.getAttribute("type");
                String settingName = setting.getAttribute("name");
                String settingTagName = setting.getTagName();

                try {
                    if ("input".equals(settingTagName) && ("radio".equals(settingType) || "checkbox".equals(settingType))) {
                        $(setting).click();
                        $(setting).shouldBe(selected);
                    } else if ("input".equals(settingTagName) && "number".equals(settingType)) {
                        $(setting).clear();
                        $(setting).setValue("10");
                        $(setting).shouldHave(value("10"));
                        validateInvalidValues(moduleId, setting, settingName);
                    } else if ("input".equals(settingTagName) && "text".equals(settingType)) {
                        $(setting).clear();
                        $(setting).setValue("test");
                        $(setting).shouldHave(value("test"));
                    } else if ("select".equals(settingTagName)) {
                        for (WebElement option : $(setting).findAll("option")) {
                            $(option).click();
                            $(option).shouldBe(selected);
                        }
                    }
                } catch (Exception e) {
                    System.out.println("Interaction with setting " + settingName + " in module " + moduleId + " should be performed: " + e.getMessage());
                }
            }
        }
    }

    private void testModuleActions(WebElement module, String moduleId) {
        if ($(module).$(byText("Odśwież")).exists()) {
            $(module).$(byText("Odśwież")).click();
            $(module).$(".module-data").shouldNotBe(empty);
        }

        if ($(module).$(byText("Kopiuj")).exists()) {
            $(module).$(byText("Kopiuj")).click();
        }
    }

    private void testModuleResults(WebElement module, String moduleId) {
        if ($(module).$("select[name='quantity']").exists()) {
            $(module).$("select[name='quantity']").selectOptionByValue("50");
            $(module).$(byText("Odśwież")).click();
            checkGeneratedResults(moduleId, 50);

            if (moduleId.equals("companyName") || moduleId.equals("street")) {
                if ($(module).$("input[name='funny']").exists()) {
                    $(module).$("input[name='funny']").click();
                    $(module).$(byText("Odśwież")).click();
                    checkGeneratedResults(moduleId, 50, true);
                }
            } else if (moduleId.equals("comment")) {
                WebElement wordsInput = $(module).$("input[name='words']");
                int wordsPerComment = Integer.parseInt(wordsInput.getAttribute("value"));
                checkCommentResults(moduleId, wordsPerComment, 50);
            }
        }
    }

    private void validateInvalidValues(String moduleId, WebElement setting, String settingName) {
        String invalidValueMessage = "";
        switch (moduleId) {
            case "pesel":
                invalidValueMessage = "valid values are from 1800 to 2299 or empty";
                validateInput(moduleId, setting, "0", invalidValueMessage);
                validateInput(moduleId, setting, "2300", invalidValueMessage);
                break;
            case "companyName":
            case "street":
                invalidValueMessage = "valid values are from 1 to 7";
                validateInput(moduleId, setting, "0", invalidValueMessage);
                validateInput(moduleId, setting, "8", invalidValueMessage);
                break;
            case "comment":
                if (settingName.equals("words")) {
                    invalidValueMessage = "valid values are from 1 to 1000";
                    validateInput(moduleId, setting, "0", invalidValueMessage);
                    validateInput(moduleId, setting, "1001", invalidValueMessage);
                } else if (settingName.equals("characters")) {
                    invalidValueMessage = "valid values are from 1 to 1000 or empty";
                    validateInput(moduleId, setting, "0", invalidValueMessage);
                    validateInput(moduleId, setting, "1001", invalidValueMessage);
                }
                break;
        }
    }

    private void validateInput(String moduleId, WebElement input, String value, String expectedMessage) {
        try {
            $(input).clear();
            $(input).setValue(value);
            $(input).sibling(0).$(byText("Odśwież")).click();
            WebElement validationMessageElement = $(input).sibling(1).$(".validation-message");
            String validationMessage = validationMessageElement.getText();
            boolean isValid = validationMessage.equals(expectedMessage);
            System.out.println("Validation of field " + input.getAttribute("name") + " in module " + moduleId + " should be \"" + expectedMessage + "\": " + isValid);
        } catch (Exception e) {
            System.out.println("Validation of field " + input.getAttribute("name") + " in module " + moduleId + " should be \"" + expectedMessage + "\": false");
        }
    }

    private void checkGeneratedResults(String moduleId, int expectedCount) {
        checkGeneratedResults(moduleId, expectedCount, false);
    }

    private void checkGeneratedResults(String moduleId, int expectedCount, boolean funny) {
        try {
            WebElement dataElement = $("#" + moduleId + "-data");
            String dataText = dataElement.getText();
            String[] results = dataText.split(", ");
            int resultCount = results.length;
            boolean isCorrectCount = resultCount == expectedCount;
            System.out.println("Check result count in module " + moduleId + ": " + expectedCount + " results should be generated: " + isCorrectCount);

            if (funny) {
                String[] funnyNames = {};
                if (moduleId.equals("companyName")) {
                    funnyNames = new String[]{"Gorący trójkąt", "Lodziarnia Zimny Drań", "Ministerstwo Wakacji", "Samo Spadło Centrum Serwisowe", "Brudny Harry"};
                } else if (moduleId.equals("street")) {
                    funnyNames = new String[]{"10 Zakładników", "Alibaby", "Amora", "Beznazwy", "Braci Polskich", "Chatka Puchatka"};
                }
                boolean hasFunny = false;
                for (String result : results) {
                    for (String funnyName : funnyNames) {
                        if (result.contains(funnyName)) {
                            hasFunny = true;
                            break;
                        }
                    }
                    if (hasFunny) break;
                }
                System.out.println("Check funny names in module " + moduleId + ": At least one funny name should be generated: " + hasFunny);
            }
        } catch (Exception e) {
            System.out.println("Check result count in module " + moduleId + ": " + expectedCount + " results should be generated: false");
        }
    }

    private void checkCommentResults(String moduleId, int wordsPerComment, int quantity) {
        try {
            WebElement dataElement = $("#" + moduleId + "-data");
            String dataText = dataElement.getText();
            int resultCount = dataText.split(",").length;
            int expectedCount = wordsPerComment * quantity;
            boolean isCorrectCount = resultCount == expectedCount;
            System.out.println("Check result count in module " + moduleId + ": " + expectedCount + " words should be generated: " + isCorrectCount);
        } catch (Exception e) {
            System.out.println("Check result count in module " + moduleId + ": " + expectedCount + " words should be generated: false");
        }
    }
}
