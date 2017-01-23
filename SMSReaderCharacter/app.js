/// <reference path="Scripts/collections.ts" />
var AliveClass = (function () {
    function AliveClass() {
        this.currentVoiceIndex = 0;
        this.changeInFirstTen = 0;
    }
    AliveClass.prototype.onTick = function (time) {
        if (this.voices == null || this.voices.length == 0)
            this.voices = this.textToSpeechManager.getVoices();
        if (this.changeInFirstTen < 10 && this.voices != null) {
            var phoneLanguage = this.configurationManager.getSystemISO3Language();
            for (var i = 0; i < this.voices.length; i++) {
                if (this.voices[i].getISO3Language() == phoneLanguage) {
                    this.currentVoiceIndex = i;
                    break;
                }
            }
            var name_1 = this.getVoiceTextPresentation(this.voices[this.currentVoiceIndex]);
            this.menuManager.setProperty("LangTextBox", "Text", name_1);
            this.textToSpeechManager.setVoice(this.currentVoiceIndex);
            this.changeInFirstTen++;
        }
    };
    AliveClass.prototype.getVoiceTextPresentation = function (v) {
        var gender = v.getName().indexOf("female") != -1 ? "female" : "male";
        return v.getISO3Language() + " " + gender + " " + this.currentVoiceIndex.toString() + "/" + (this.voices.length - 1).toString();
    };
    AliveClass.prototype.onBackgroundTick = function (time) {
    };
    AliveClass.prototype.onStart = function (handler, disabledPermissions) {
        this.textToSpeechManager = handler.getTextToSpeechManager();
        this.configurationManager = handler.getConfigurationManager();
        this.menuManager = handler.getMenuManager();
    };
    AliveClass.prototype.onActionReceived = function (categoryName, jsonedData) {
        if (categoryName == AgentConstants.SMS_RECEIVED) {
            this.textToSpeechManager.say(jsonedData);
        }
    };
    AliveClass.prototype.onMove = function (oldX, oldY, newX, newY) {
    };
    AliveClass.prototype.onRelease = function (currentX, currentY) {
    };
    AliveClass.prototype.onPick = function (currentX, currentY) {
    };
    AliveClass.prototype.onMenuItemSelected = function (itemName) {
        if (this.voices == null || this.voices.length == 0)
            this.voices = this.textToSpeechManager.getVoices();
        switch (itemName) {
            case "PrevButton":
                if (this.currentVoiceIndex > 0)
                    this.currentVoiceIndex--;
                else
                    this.currentVoiceIndex = this.voices.length - 1;
                break;
            case "NextButton":
                if (this.currentVoiceIndex == this.voices.length - 1)
                    this.currentVoiceIndex = 0;
                else
                    this.currentVoiceIndex++;
                break;
        }
        var name = this.getVoiceTextPresentation(this.voices[this.currentVoiceIndex]);
        this.menuManager.setProperty("LangTextBox", "Text", name);
        this.textToSpeechManager.setVoice(this.currentVoiceIndex);
    };
    AliveClass.prototype.onConfigureMenuItems = function (menuBuilder) {
        var PrevButton = new ButtonMenuItem();
        PrevButton.Height = 1;
        PrevButton.Width = 2;
        PrevButton.InitialX = 0;
        PrevButton.InitialY = 3;
        PrevButton.BackgroundColor = "#000000";
        PrevButton.Text = "Prev lang";
        PrevButton.TextColor = "#0591de";
        PrevButton.Name = "PrevButton";
        var NextButton = new ButtonMenuItem();
        NextButton.Height = 1;
        NextButton.Width = 2;
        NextButton.InitialX = 2;
        NextButton.InitialY = 3;
        NextButton.BackgroundColor = "#000000";
        NextButton.Text = "Next lang";
        NextButton.TextColor = "#0591de";
        NextButton.Name = "NextButton";
        var TextBox = new TextBoxMenuItem();
        TextBox.BackgroundColor = "#000000";
        TextBox.Height = 3;
        TextBox.InitialX = 0;
        TextBox.InitialY = 0;
        TextBox.Name = "LangTextBox";
        TextBox.Text = "Current Language: English";
        TextBox.TextColor = "#0591de";
        TextBox.Width = menuBuilder.getMaxColumns();
        menuBuilder.createButton(PrevButton);
        menuBuilder.createButton(NextButton);
        menuBuilder.createTextBox(TextBox);
    };
    AliveClass.prototype.onSpeechRecognitionResults = function (results) { };
    AliveClass.prototype.onResponseReceived = function (response) {
    };
    AliveClass.prototype.onLocationReceived = function (location) {
    };
    AliveClass.prototype.onUserActivityStateReceived = function (state) {
    };
    AliveClass.prototype.onPlacesReceived = function (places) {
    };
    AliveClass.prototype.onHeadphoneStateReceived = function (state) {
    };
    AliveClass.prototype.onWeatherReceived = function (weather) {
    };
    return AliveClass;
}());
//# sourceMappingURL=app.js.map