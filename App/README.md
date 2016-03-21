# Internet of things using MQTT and ESP8826

Software used for the Arduino Day in 2/April/2016 to demonstrate  internet of things

This server subscribes data from mqtt clients and display the messages of form of bootstrap table.

Each team has a spefic topic. For instance, team 1 has to publish their data as following:
```
//arduino example
// declare buffer
char pubBuffer[50];

float measurament =  100;
// send as json for simplification to parse the data in the server
snprintf(pubBuffer,50,"{\"measurament\":\"%f\"}",measurament);

// client is a mqtt arduino client
client.publish("sensor/team1",pubBuffer);
```

For a complete example how to use ESP8826 or Arduino to publish the messages check [examples](https://github.com/knolleary/pubsubclient/tree/master/examples) from PubSubClient.
