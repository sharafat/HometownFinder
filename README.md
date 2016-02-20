# HometownFinder
HometownFinder is an Android app developed using React Native that shows a user's Facebook friends' hometowns on map.

This is my first app using React Native and kind of a proof-of-concept that React Native is cool!

# Screenshots

![alt text](https://farm2.staticflickr.com/1547/24853917320_4c758a4c6f_c.jpg "Screenshots")

# Android APK

See the release tab for downloading the apk.

Note that from amongst your Facebook friends, only the friends who use the app and give permission to reveal their hometown would be displayed on the map. Therefore, initially you will see only your own pin on the map. Giving the apk to some of your friends so that they install and use it is the only way to see more pins on the map.

# Limitations

1. **Animation Performance:** The animations are too sluggish. Need to research on ways to optimize animations.
2. **Custom Map Markers:** The map markers are supposed to be faces of Facebook friends. For unknown reasons the faces aren't showing up. Seems to be an issue with the map marker library component. Need to figure out workarounds.
3. **Sidebar Menu Size:** The sidebar menu is supposed to take the full height of the screen, overlaying the map.

# Known Issues

1. Although running the app from source code in debug mode shows the menu icon properly, the apk doesn't display the menu icon due to image location issue. However, tapping on the right sight of the title bar does open up the menu and close it.
2. After a user is selected from the menu, the map center gets saved with that user's location. Even if another user is selected, the map gets centered to the previous user's location. (Saw this after releasing the apk, don't have the time to fix it, though the fix is pretty simple.)
