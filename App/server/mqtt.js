// connecting mosquitto in our server
var mqttClient = mqtt.connect({
  host: 'localhost',
  port: 2000
});



/**
 *  Using test mosquitto
 */
//var mqttClient = mqtt.connect('mqtt://test.mosquitto.org');


/*mqttClient = mqtt.connect([{
  host: 'test.mosquitto.org',
  port: 1883
}]);
*/
MessageServer = new Mongo.Collection(null);



_.each(Teams, function(team) {
  mqttClient.subscribe("arduino-day/" + team + "/sensor/value");
  //  mqttClient.subscribe("arduino-day/team0");
});



/*Meteor.setInterval(function(argument) {
  mqttClient.publish('arduino-day/team0/sensor/value', '85.12312');
}, 5000);*/

var messagePub;
Meteor.publish('messages', function(argument) {
  var self = this;
  var counter = {};
  var handle = MessageServer.find({}).observeChanges({
    added: function(id, fields) {
      var date = new Date();
      if (!counter[fields.topic]) {
        counter[fields.topic] = 0;
        self.added('counter', fields.topic, {
          count: counter[fields.topic]
        });

      }
      counter[fields.topic] = counter[fields.topic] + 1;

      self.changed('counter', fields.topic, {
        count: counter[fields.topic]
      });
      self.added('messages', id, fields);
    }
  });

  self.ready();
  ready = true;
  self.onStop(function() {
    handle.stop();
  });
});

mqttClient.on('message', Meteor.bindEnvironment(function(topic, message) {

  var value = Number(message.toString());
  topic = topic.split("/");
  if (!isNaN(value)) {

    var msg = {
      measurament: value,
      topic: topic[1],
      ts: new Date(),
    };
    MessageServer.insert(msg);
  } else {
    console.log("Your message is in invalid format: " + topic[1]);
  }
  //self.changed('messages', 1, msg);

}));


Meteor.methods({
  teamConnectLed: Meteor.bindEnvironment(function(argument) {
    check(argument.teamName, String);
    check(argument.ledStatus, Boolean);
    var led = "";
    if (argument.ledStatus) {
      led = "1";
    } else {
      led = "0";
    }
    var msg = led;

    mqttClient.publish('arduino-day/command/' + argument.teamName, msg,
      function(error) {
        if (error) {
          console.log(error);
        }

      });

    return led;

  })
});


Meteor.setInterval(function() {
  MessageServer.remove({});
}, 100000);
