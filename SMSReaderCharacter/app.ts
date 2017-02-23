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

    getVoiceTextPresentation(v: IVoice): string {
        let gender = v.getName().indexOf("female") != -1 ? "female" : "male";
        return v.getISO3Language() + " " + gender + " " + this.currentVoiceIndex.toString() + "/" + (this.voices.length - 1).toString();
    }

    onBackgroundTick(time: number) {

    }

    onStart(handler: IManagersHandler, disabledPermissions: string[]): void {
        this.textToSpeechManager = handler.getTextToSpeechManager();
        this.configurationManager = handler.getConfigurationManager();
        this.menuManager = handler.getMenuManager();
    }

    onActionReceived(actionName: string, jsonedData: string): void {
        if (actionName == AgentConstants.SMS_RECEIVED) {
            this.textToSpeechManager.say(jsonedData);
        }
    }

    onMove(oldX: number, oldY: number, newX: number, newY: number): void {

    }

    onRelease(currentX: number, currentY: number): void {

    }

    onPick(currentX: number, currentY: number): void {

    }

    onMenuItemSelected(itemName: string): void {
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

        let name = this.getVoiceTextPresentation(this.voices[this.currentVoiceIndex]);
        this.menuManager.setProperty("LangTextBox", "Text", name);
        this.textToSpeechManager.setVoice(this.currentVoiceIndex);
    }

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

    onSpeechRecognitionResults(results: string): void { }

    onResponseReceived(response: string): void {

    }

    onLocationReceived(location: IAliveLocation): void {

    }

    onUserActivityStateReceived(state: IAliveUserActivity) {

    }

    onPlacesReceived(places: IAlivePlaceLikelihood[]): void {

    }

    onHeadphoneStateReceived(state: number) {

    }

    onWeatherReceived(weather: IAliveWeather) {

    }
}