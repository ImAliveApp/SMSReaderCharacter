## SMSReader Project:

### Main concept:
This is an actual code of the SMSReader character that is in the app.
This character will read the content of an incoming sms using the Text-To-Speech engine that is installed in the users phone.

### How to use:
In order to use this template, do the following steps:

1. Download and build it this project (following [this](https://github.com/hay12396/ImAliveGuide/wiki/How-to:-Build-and-upload-a-character-code) guide)

2. Register your character to the SMS_RECEIVED action (following [this](http://HowToRegisterToActionsGuide.com).

3. Publish your character and see the results! (following [this](https://github.com/hay12396/ImAliveGuide/wiki/How-to:-Publish-your-character) guide)

### The code:
Most of the work is done in the "onActionReceived" method:
```
    onActionReceived(actionName: string, jsonedData: string): void {
        if (actionName == AgentConstants.SMS_RECEIVED) {
            this.textToSpeechManager.say(jsonedData);
        }
    }
```
Once a SMS is received, the "onActionReceived" method will be called with the actionName being "SMS_RECEIVED", 
the jsonedData object will be:
```
{
  From: "The contact who sent this message (unknown if the contact is not exists)",
  Message: "The SMS content."
}
```
The textToSpeechManager will than activate the default Text-To-Speech engine of the phone and the content will have read by the engine.
