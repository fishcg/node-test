const axios = require('axios')
const cron = require('node-cron')

const { qywxAlert, exRate } = require("../config")
const qywx = require("./Qywx")

// 告警，可以根据需要修改为实际的告警机制
const sendAlert = async (alertRecords) => {
  let messages = []
  for (let record of alertRecords) {
    let currentRate = getRate(record[1], record[3])
    let normalRate = getRate(record[1], record[2])
    let status = currentRate > normalRate ? '高于' : '低于'
    messages.push(`货币代码：${record[1]}（${record[0]}），当前汇率：${currentRate} ${status}标准汇率：${normalRate}`)
  }
  let content = messages.join("\r\n")
  let messageData = {
    msgtype: 'text',
    text: {
      content: `Alert: 货币汇率异常告警\r\n汇率值 x 计算公式：某地区 1 货币 = x 人民币\r\n汇率值高于标准值则赚，否则为亏\r\n\r\n${content}`,
    },
  }
  // console.log(messageData.text.content)
  return await qywx.sendMessage(qywxAlert.exRate.webhookKey, messageData)
}

function getRate(currencyCode, rate) {
  switch (currencyCode) {
    case 'MOP':
    case 'KRW':
    case 'THB':
    case 'MXN':
      return (1 / rate).toFixed(7)
    case 'JPY':
      return (rate / 100).toFixed(7)
    default:
      return rate
  }
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
          const threshold = exRate[vrtEName].rate
          if (threshold !== 0 && (currentPriceNum > threshold * 1.007 || currentPriceNum < threshold * 0.993)) {
            alertRecords.push([exRate[vrtEName].region, vrtEName, threshold, currentPriceNum])
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
