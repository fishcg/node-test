const axios = require('axios');

// 替换为你的机器人 Webhook URL
const webhookUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key='

/**
 * 发送企业微信消息
 *
 * @param key
 * @param data 发送内容，e.g.
 * data = {
 *   msgtype: 'text',
 *   text: {
 *     content: 'Hello, this is a message from alert script',
 *   },
 * }
 * @returns {Promise<void>}
 */
const sendMessage = async (key, data) => {
  try {
    const response = await axios.post(webhookUrl+key, data)
    if (response.data.errcode !== 0) {
      console.log(response.data)
    }
    return response.data
  } catch (error) {
    console.error('Error send message:', error)
  }
}

module.exports = {
  sendMessage,
}
