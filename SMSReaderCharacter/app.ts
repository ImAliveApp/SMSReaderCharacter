/// <reference path="Scripts/collections.ts" />

class AliveClass implements IAliveAgent {
    private resourceManagerHelper: ResourceManagerHelper;
    private configurationManager: IConfigurationManager;
    private textToSpeechManager: ITextToSpeechManager;
    private menuManager: IMenuManager;
    private currentVoiceIndex: number;
    private voices: IVoice[];

    private changeInFirstTen: number;

    public constructor() {
        this.currentVoiceIndex = 0;
        this.changeInFirstTen = 0;
    }

    /**
     * This method gets called once when the character is being activated by the system.
     * @param handler An object that allows the code to get reference to the managers.
     * @param disabledPermissions A list of permissions that the user disabled.
     */
    onStart(handler: IManagersHandler, disabledPermissions: string[]): void {
        this.textToSpeechManager = handler.getTextToSpeechManager();
        this.configurationManager = handler.getConfigurationManager();
        this.menuManager = handler.getMenuManager();

        for (let i = 0; i < disabledPermissions.length; i++)
            if (disabledPermissions[i] == "SMS")
                handler.getActionManager().terminate();
    }

    /**
     * This method gets called every 250 milliseconds by the system, any logic updates to the state of your character should occur here.
     * Note: onTick only gets called when the screen is ON.
     * @param time The current time (in milliseconds) on the device.
     */
    onTick(time: number): void {
        if (this.voices == null || this.voices.length == 0)
            this.voices = this.textToSpeechManager.getVoices();

        if (this.changeInFirstTen < 10 && this.voices != null) {
            let phoneLanguage = this.configurationManager.getSystemISO3Language();
            for (let i = 0; i < this.voices.length; i++) {
                if (this.voices[i].getISO3Language() == phoneLanguage) {
                    this.currentVoiceIndex = i;
                    break;
                }
            }

            let name = this.getVoiceTextPresentation(this.voices[this.currentVoiceIndex]);
            this.menuManager.setProperty("LangTextBox", "Text", name);
            this.textToSpeechManager.setVoice(this.currentVoiceIndex);
            this.changeInFirstTen++;
        }
    }

    /**
     * This method gets called by the system every 1 hour (may be in a different rate depending on the device).
     * Note: this method only gets called when the screen is OFF.
     * @param time The current time (in milliseconds) on the device.
     */
    onBackgroundTick(time: number) {

    }

    getVoiceTextPresentation(v: IVoice): string {
        let gender = v.getName().indexOf("female") != -1 ? "female" : "male";
        return v.getISO3Language() + " " + gender + " " + this.currentVoiceIndex.toString() + "/" + (this.voices.length - 1).toString();
    }

    /**
     * This method gets called whenever a phone event (that you registered to) occur on the phone.
     * @param eventName The name of the event that occurred.
     * @param jsonedData The data of the event that occurred.
     * For example, SMS_RECEIVED event will hold data about who sent the SMS, and the SMS content.
     */
    onPhoneEventOccurred(eventName: string, jsonedData: string): void {
        if (eventName == AgentConstants.SMS_RECEIVED) {
            this.textToSpeechManager.say(jsonedData);
        }
    }

    /**
     * This method gets called when the user is holding and moving the image of your character (on screen).
     * @param oldX The X coordinate in the last tick (Top left).
     * @param oldY The Y coordinate in the last tick (Top left).
     * @param newX The X coordinate in the current tick (Top left).
     * @param newY The Y coordinate in the current tick (Top left).
     */
    onMove(oldX: number, oldY: number, newX: number, newY: number): void {

    }

    /**
     * This method gets called when the user raised his finger off the character image (on screen).
     * @param currentX The X coordinate of the character image on screen (Top left).
     * @param currentY The Y coordinate of the character image on the screen (Top left).
     */
    onRelease(currentX: number, currentY: number): void {

    }

    /**
     * This method gets called whenever the user is holding the character image (on screen).
     * @param currentX The current X coordinate of the character image (Top left).
     * @param currentY The current Y coordinate of the character image (Top left).
     */
    onPick(currentX: number, currentY: number): void {

    }

    /**
     * This method gets called whenever the user has pressed a view in the character menu.
     * @param viewName The 'Name' property of the view that was pressed.
     */
    onMenuItemSelected(viewName: string): void {
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

        let name = this.getVoiceTextPresentation(this.voices[this.currentVoiceIndex]);
        this.menuManager.setProperty("LangTextBox", "Text", name);
        this.textToSpeechManager.setVoice(this.currentVoiceIndex);
    }

    /**
     * This method gets called once just before the onStart method and is where the character menu views are defined.
     * @param menuBuilder An object that fills the character menu.
     */
    onConfigureMenuItems(menuBuilder: IMenuBuilder): void {
        let PrevButton = new ButtonMenuItem();
        PrevButton.Height = 1;
        PrevButton.Width = 2;
        PrevButton.InitialX = 0;
        PrevButton.InitialY = 3;
        PrevButton.BackgroundColor = "#000000";
        PrevButton.Text = "Prev lang";
        PrevButton.TextColor = "#0591de";
        PrevButton.Name = "PrevButton";

        let NextButton = new ButtonMenuItem();
        NextButton.Height = 1;
        NextButton.Width = 2;
        NextButton.InitialX = 2;
        NextButton.InitialY = 3;
        NextButton.BackgroundColor = "#000000";
        NextButton.Text = "Next lang";
        NextButton.TextColor = "#0591de";
        NextButton.Name = "NextButton";

        let TextBox = new TextBoxMenuItem();
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
    }

    /**
     * This method gets called when the system done processing the speech recognition input.
     * @param results A stringed version of what the user said.
     */
    onSpeechRecognitionResults(results: string): void { }

    /**
     * This method is called when the system received a reply from a previously HTTP request made by the character.
     * @param response The reply body in a JSON form.
     */
    onResponseReceived(response: string): void {

    }

    /**
     * This method gets called when the system done collecting information about the device location.
     * @param location The location information collected by the system.
     */
    onLocationReceived(location: IAliveLocation): void {

    }

    /**
     * This method gets called when the system done collecting information about the user activity.
     * @param state Information about the user activity.
     * Possible states: IN_VEHICLE, ON_BICYCLE, ON_FOOT, STILL, TILTING, WALKING, RUNNING, UNKNOWN.
     */
    onUserActivityStateReceived(state: IAliveUserActivity) {

    }

    /**
     * This method gets called when the system done collecting information about nearby places around the device.
     * @param places A list of places that are near the device.
     */
    onPlacesReceived(places: IAlivePlaceLikelihood[]): void {

    }

    /**
     * This method gets called when the system done collecting information about the headphone state.
     * @param state 1 - the headphones are PLUGGED, 2 - the headphones are UNPLUGGED.
     */
    onHeadphoneStateReceived(state: number) {

    }

    /**
     * This method gets called when the system done collecting information about the weather in the location of the device.
     * @param weather Information about the weather.
     */
    onWeatherReceived(weather: IAliveWeather) {

    }
}