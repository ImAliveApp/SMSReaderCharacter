/// <reference path="Scripts/collections.ts" />
var AliveClass = (function () {
    function AliveClass() {
        this.currentVoiceIndex = 0;
        this.voiceIndexSet = false;
    }
    /**
     * This method gets called once when the character is being activated by the system.
     * @param handler An object that allows the code to get reference to the managers.
     * @param disabledPermissions A list of permissions that the user disabled.
     */
    AliveClass.prototype.onStart = function (handler, disabledPermissions) {
        this.textToSpeechManager = handler.getTextToSpeechManager();
        this.configurationManager = handler.getConfigurationManager();
        this.menuManager = handler.getMenuManager();
        for (var i = 0; i < disabledPermissions.length; i++)
            if (disabledPermissions[i] == "SMS") {
                handler.getActionManager().showMessage("SMS permission is disabled, exiting character.");
                handler.getActionManager().terminate();
            }
    };
    /**
     * This method gets called every 250 milliseconds by the system, any logic updates to the state of your character should occur here.
     * Note: onTick only gets called when the screen is ON.
     * @param time The current time (in milliseconds) on the device.
     */
    AliveClass.prototype.onTick = function (time) {
        if (this.voices == null || this.voices.length == 0)
            this.voices = this.textToSpeechManager.getVoices();
        var index = this.databaseManager.getObject("Index");
        if (index == null && this.voices != null) {
            var phoneLanguage = this.configurationManager.getSystemISO3Language();
            for (var i = 0; i < this.voices.length; i++) {
                if (this.voices[i].getISO3Language() == phoneLanguage) {
                    this.currentVoiceIndex = i;
                    break;
                }
            }
            this.changeVoice(true);
        }
        else {
            this.currentVoiceIndex = parseInt(index);
            this.changeVoice(false);
        }
    };
    /**
     * This method gets called by the system every 1 hour (may be in a different rate depending on the device).
     * Note: this method only gets called when the screen is OFF.
     * @param time The current time (in milliseconds) on the device.
     */
    AliveClass.prototype.onBackgroundTick = function (time) {
    };
    /**
     * This method sets the Text-To-Speech voice to a different voice (using the currentVoiceIndex).
     * @param force If true, we force a change.
     */
    AliveClass.prototype.changeVoice = function (force) {
        if (this.voiceIndexSet && !force)
            return;
        this.voiceIndexSet = true;
        this.actionManager.showMessage("changing..");
        var name = this.getVoiceTextPresentation(this.voices[this.currentVoiceIndex]);
        this.menuManager.setProperty("LangTextBox", "Text", name);
        this.textToSpeechManager.setVoice(this.currentVoiceIndex);
        this.databaseManager.saveObject("Index", this.currentVoiceIndex.toString());
        this.databaseManager.saveObject("VoiceName", name);
    };
    /**
     * This method changes the text in the menu to the correct voice text.
     * @param v The current voice that we use.
     */
    AliveClass.prototype.getVoiceTextPresentation = function (v) {
        var gender = v.getName().indexOf("female") != -1 ? "female" : "";
        if (gender == "")
            gender = v.getName().indexOf("male") != -1 ? "male" : "unknown gender";
        return v.getISO3Language() + " " + gender + " " + this.currentVoiceIndex.toString() + "/" + (this.voices.length - 1).toString();
    };
    /**
     * This method gets called whenever a phone event (that you registered to) occur on the phone.
     * @param eventName The name of the event that occurred.
     * @param jsonedData The data of the event that occurred.
     * For example, SMS_RECEIVED event will hold data about who sent the SMS, and the SMS content.
     */
    AliveClass.prototype.onPhoneEventOccurred = function (eventName, jsonedData) {
        if (eventName == AgentConstants.SMS_RECEIVED) {
            this.textToSpeechManager.say(jsonedData);
        }
    };
    /**
     * This method gets called when the user is holding and moving the image of your character (on screen).
     * @param oldX The X coordinate in the last tick (Top left).
     * @param oldY The Y coordinate in the last tick (Top left).
     * @param newX The X coordinate in the current tick (Top left).
     * @param newY The Y coordinate in the current tick (Top left).
     */
    AliveClass.prototype.onMove = function (oldX, oldY, newX, newY) {
    };
    /**
     * This method gets called when the user raised his finger off the character image (on screen).
     * @param currentX The X coordinate of the character image on screen (Top left).
     * @param currentY The Y coordinate of the character image on the screen (Top left).
     */
    AliveClass.prototype.onRelease = function (currentX, currentY) {
    };
    /**
     * This method gets called whenever the user is holding the character image (on screen).
     * @param currentX The current X coordinate of the character image (Top left).
     * @param currentY The current Y coordinate of the character image (Top left).
     */
    AliveClass.prototype.onPick = function (currentX, currentY) {
    };
    /**
     * This method gets called whenever the user has pressed a view in the character menu.
     * @param viewName The 'Name' property of the view that was pressed.
     */
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
    /**
     * This method gets called once just before the onStart method and is where the character menu views are defined.
     * @param menuBuilder An object that fills the character menu.
     */
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
    /**
     * This method gets called when the system done processing the speech recognition input.
     * @param results A stringed version of what the user said.
     */
    AliveClass.prototype.onSpeechRecognitionResults = function (results) { };
    /**
     * This method is called when the system received a reply from a previously HTTP request made by the character.
     * @param response The reply body in a JSON form.
     */
    AliveClass.prototype.onResponseReceived = function (response) {
    };
    /**
     * This method gets called when the system done collecting information about the device location.
     * @param location The location information collected by the system.
     */
    AliveClass.prototype.onLocationReceived = function (location) {
    };
    /**
     * This method gets called when the system done collecting information about the user activity.
     * @param state Information about the user activity.
     * Possible states: IN_VEHICLE, ON_BICYCLE, ON_FOOT, STILL, TILTING, WALKING, RUNNING, UNKNOWN.
     */
    AliveClass.prototype.onUserActivityStateReceived = function (state) {
    };
    /**
     * This method gets called when the system done collecting information about nearby places around the device.
     * @param places A list of places that are near the device.
     */
    AliveClass.prototype.onPlacesReceived = function (places) {
    };
    /**
     * This method gets called when the system done collecting information about the headphone state.
     * @param state 1 - the headphones are PLUGGED, 2 - the headphones are UNPLUGGED.
     */
    AliveClass.prototype.onHeadphoneStateReceived = function (state) {
    };
    /**
     * This method gets called when the system done collecting information about the weather in the location of the device.
     * @param weather Information about the weather.
     */
    AliveClass.prototype.onWeatherReceived = function (weather) {
    };
    return AliveClass;
}());
//# sourceMappingURL=app.js.map