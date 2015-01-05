var win = Ti.UI.createWindow({
    backgroundColor: 'gray'
});
win.open();


var Parse = (Ti.Platform.name == "iPhone OS") ? require('rebel.parse') : require('eu.rebelcorp.parse');

if (Ti.Platform.name == "iPhone OS") {
    var deviceToken = null;
    // Check if the device is running iOS 8 or later
    if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {

        // Wait for user settings to be registered before registering for push notifications
        Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {

            // Remove event listener once registered for push notifications
            Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);

            Ti.Network.registerForPushNotifications({
                success: deviceTokenSuccess,
                error: deviceTokenError,
                callback: receivePush
            });
        });

        // Register notification types to use
        Ti.App.iOS.registerUserNotificationSettings({
            types: [
                Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
                Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
                Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
            ]
        });
    }

    // For iOS 7 and earlier
    else {
        Ti.Network.registerForPushNotifications({
            // Specifies which notifications to receive
            types: [
                Ti.Network.NOTIFICATION_TYPE_BADGE,
                Ti.Network.NOTIFICATION_TYPE_ALERT,
                Ti.Network.NOTIFICATION_TYPE_SOUND
            ],
            success: deviceTokenSuccess,
            error: deviceTokenError,
            callback: receivePush
        });
    }
    // Process incoming push notifications
    function receivePush(e) {
            alert('Received push: ' + JSON.stringify(e));
        }
        // Save the device token for subsequent API calls
    function deviceTokenSuccess(e) {
        Parse.registerDeviceToken(e.deviceToken);
        Parse.subscribeChannel('parse_module_test');
        deviceToken = e.deviceToken;
        alert(deviceToken);
    }

    function deviceTokenError(e) {
        alert('Failed to register for push notifications! ' + e.error);
    }
}


if (Ti.Platform.name == "android") {
    Parse.start();

    // Subscribe of unsubscribe to Parse Channels
    Parse.subscribeChannel('parse_module_test');
    Parse.putValue('user_id', '1234abcd');

    Parse.addEventListener('notificationreceive', function(e) {
        Ti.API.log("notification: ", JSON.stringify(e));
    });

    Parse.addEventListener('notificationopen', function(e) {
        Ti.API.log("notification: ", JSON.stringify(e));
    });

    Parse.subscribeChannel('user_123');
    //Parse.unsubscribeChannel('user_123');

    // 앱 종료 된 상태에서 push 클릭해서 실행되었을 때
    var data = Ti.App.Android.launchIntent.getStringExtra('com.parse.Data');

    if (data) {
        try {
            var json = JSON.parse(data);
            alert(json);
            // Now handle the click on the notification
        } catch (e) {}
    }
}