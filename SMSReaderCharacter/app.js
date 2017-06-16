var AliveClass = (function () {
    function AliveClass() {
        this.currentVoiceIndex = 0;
        this.voiceIndexSet = false;
    }
    AliveClass.prototype.onStart = function (handler, disabledPermissions) {
        this.textToSpeechManager = handler.getTextToSpeechManager();
        this.configurationManager = handler.getConfigurationManager();
        this.menuManager = handler.getMenuManager();
        for (var i = 0; i < disabledPermissions.length; i++)
            if (disabledPermissions[i] == "SMS") {
                handler.getActionManager().showSystemMessage("SMS permission is disabled, exiting character.");
                handler.getActionManager().terminate();
            }
    };
    AliveClass.prototype.onTick = function (time) {
        if (this.voices == null || this.voices.length == 0)
            this.voices = this.textToSpeechManager.getVoices();
        var index = this.databaseManager.getObject("Index");
        if (index != null) {
            this.currentVoiceIndex = parseInt(index);
            this.changeVoice(true);
        }
    };
    AliveClass.prototype.onBackgroundTick = function (time) {
    };
    AliveClass.prototype.changeVoice = function (force) {
        if (this.voiceIndexSet && !force)
            return;
        this.voiceIndexSet = true;
        this.actionManager.showSystemMessage("changing..");
        var name = this.getVoiceTextPresentation(this.voices[this.currentVoiceIndex]);
        this.menuManager.setProperty("LangTextBox", "Text", name);
        this.textToSpeechManager.setVoice(this.currentVoiceIndex);
        this.databaseManager.saveObject("Index", this.currentVoiceIndex.toString());
        this.databaseManager.saveObject("VoiceName", name);
    };
    AliveClass.prototype.getVoiceTextPresentation = function (v) {
        var gender = v.getName().indexOf("female") != -1 ? "female" : "";
        if (gender == "")
            gender = v.getName().indexOf("male") != -1 ? "male" : "unknown gender";
        return v.getISO3Language() + " " + gender + " " + this.currentVoiceIndex.toString() + "/" + (this.voices.length - 1).toString();
    };
    AliveClass.prototype.onPhoneEventOccurred = function (eventName, jsonedData) {
        if (eventName == AgentConstants.SMS_RECEIVED) {
            this.textToSpeechManager.say(jsonedData);
        }
    };
    AliveClass.prototype.onMove = function (oldX, oldY, newX, newY) {
    };
    AliveClass.prototype.onRelease = function (currentX, currentY) {
    };
    AliveClass.prototype.onPick = function (currentX, currentY) {
    };
    AliveClass.prototype.onMenuItemSelected = function (viewName) {
        if (this.voices == null || this.voices.length == 0)
            this.voices = this.textToSpeechManager.getVoices();
        switch (viewName) {
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
        this.changeVoice(true);
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
        var text = this.databaseManager.getObject("VoiceName");
        if (text == null)
            text = "Current Language: English";
        var TextBox = new TextBoxMenuItem();
        TextBox.BackgroundColor = "#000000";
        TextBox.Height = 3;
        TextBox.InitialX = 0;
        TextBox.InitialY = 0;
        TextBox.Name = "LangTextBox";
        TextBox.Text = text;
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
    AliveClass.prototype.onUserEventOccurred = function (eventName, jsonedData) {
    };
    return AliveClass;
}());
//# sourceMappingURL=app.js.map