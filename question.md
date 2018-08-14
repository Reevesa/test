
direct,  // 发送到完全匹配的 queue
topic,   // '.' '#' 模糊匹配
headers, // 取消息的 headers
fanout  // 发送所有绑定的 queue

TODO:
1. promise 方法, error 测试
2. 一定用 buffer ?
3. 消息持久性测试, 若先写入消息, 后启动消费，是否可行