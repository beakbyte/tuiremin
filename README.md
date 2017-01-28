#Project: Advance Topics (Sem 2)

##TUIremin

```
.
└───firmware
│   │
│   └───_003__distance_sensor.ino // Arduino IDE-Project file
│   
└───media // media files like mp3s etc.
│   
└───webclient // html5/js synthesizer client app
│   │
│   └───app.html // client app main file
|   └───...
│   
└───webserver // node server: broadcast serial usb to websocket
│   │
|   └───server.js // server app main file
|   └───...
|
└───README.md  
```


Startup:

1. connect device
2. start node server with console: <i>"node server.js"</i>
3. start synthesizer client <i>app.html</i> in webbrowser