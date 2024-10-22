const axios = require('axios')
const cron = require('node-cron')

const { qywxAlert, healthTips } = require("../config")
const qywx = require("./Qywx")

// 告警，可以根据需要修改为实际的告警机制
const sendAlert = async (alertRecords) => {
  let tip = getRandomElement(healthTips)
  let messageData = {
    msgtype: 'text',
    text: {
      content: `喝水喝水~\n${tip}`,
    },
  }
  // console.log(messageData.text.content)
  return await qywx.sendMessage(qywxAlert.health.webhookKey, messageData)
}

function getRandomElement(arr) {
  if (arr.length === 0) {
    return undefined; // 返回 undefined 如果数组是空的
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const start = async () => {
  console.log('Health notice script is running.')
  // 定时执行
  cron.schedule(qywxAlert.health.cron, () => {
    sendAlert()
  })
}

module.exports = {
  start,
}
