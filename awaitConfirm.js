const amqp = require('amqplib')
const url = 'amqp://39.108.184.93:5672'

var NUM_MSGS = 20;

function mkCallback(i) {
  // 偶数执行 错误
  return (i % 2) === 0 ? function(err) {
    if (err !== null) { console.error('Message %d failed!', i); }
    else { console.log('Message %d confirmed', i); }
  } : null;
}

amqp.connect(url).then(function(c) {
  c.createConfirmChannel().then(function(ch) {
    for (var i=0; i < NUM_MSGS; i++) {
      ch.publish('amq.topic', 'hello', Buffer.from('blah'), {}, mkCallback(i));
    }
    ch.waitForConfirms().then(function() {
      console.log('All messages done');
      c.close();
    }).catch(console.error);
  });
});
