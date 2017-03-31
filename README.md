## SMSReader Project:

### Main concept:
This is an actual code of the SMSReader character that is in the app.
This character will read the content of an incoming sms using the Text-To-Speech engine that is installed in the users phone.

### How to use:
In order to use this template, do the following steps:

1. Download and build it this project ([guide](https://github.com/hay12396/ImAliveGuide/wiki/How-to:-Build-and-upload-a-character-code))

2. Register your character to the SMS_RECEIVED event ([guide](http://HowToRegisterToActionsGuide.com)).

3. Publish your character and see the results! ([guide](https://github.com/hay12396/ImAliveGuide/wiki/How-to:-Publish-your-character))

### The code:
Most of the work is done in the "onActionReceived" method:
```javascript
    onActionReceived(actionName: string, jsonedData: string): void {
        if (actionName == AgentConstants.SMS_RECEIVED) {
            this.textToSpeechManager.say(jsonedData);
        }
    }
```
Once a SMS is received, the "onActionReceived" method will be called with the actionName being "SMS_RECEIVED", 
the jsonedData object will be:
```javascript
{
  "From": "The contact who sent this message (unknown if the contact does not exists)",
  "Message": "The SMS content."
}
```
The textToSpeechManager will than activate the default Text-To-Speech engine of the phone and the content will have read by the engine.

**Note**:

We check if the `SMS` permission is not disabled in the `onStart` method, as if this permission is disabled we should not run.
