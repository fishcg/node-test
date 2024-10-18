const axios = require('axios')
const cron = require('node-cron')

const { qywxAlert, exRate } = require("../config")
const qywx = require("./Qywx")

// 告警，可以根据需要修改为实际的告警机制
const sendAlert = async (alertRecords) => {
  let messages = []
  for (let record of alertRecords) {
    messages.push(`货币代码：${record[0]}，正常汇率阈值：${record[1]}，当前汇率：${record[2]}`)
  }
  let content = messages.join("\r\n")
  let messageData = {
    msgtype: 'text',
    text: {
      content: `Alert: 货币汇率异常告警\n${content}`,
    },
  }
  // console.log(messageData.text.content)
  return await qywx.sendMessage(qywxAlert.exRate.webhookKey, messageData)
}

// 检查汇率
const checkExchangeRates = async () => {
  try {
    // NOTICE: 第三方数据，接口可能不稳定
    const response = await axios.get('https://www.chinamoney.com.cn/r/cms/www/chinamoney/data/fx/sdds-exch-rate.json')
    const data = response.data
    if (data && data.records) {
      let alertRecords = []
      data.records.forEach(record => {
        const { vrtEName, price } = record
        const currentPriceNum = parseFloat(price)

        // 查看是否在我们关心的国家列表中
        if (exRate[vrtEName] !== undefined) {
          const threshold = exRate[vrtEName]
          if (threshold !== 0 && currentPriceNum > threshold) {
            alertRecords.push([vrtEName, threshold, currentPriceNum])
          }
        }
      })
      if (alertRecords.length > 0) {
        await sendAlert(alertRecords)
      }
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
  }
}

const start = async () => {
  console.log('Exchange rate check script is running.')
  // 初始执行一次
  checkExchangeRates()
  // 定时执行
  cron.schedule(qywxAlert.exRate.cron, () => {
    checkExchangeRates()
  })
}

module.exports = {
  start,
}