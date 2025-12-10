const axios = require('axios')
const cron = require('node-cron')

const { AnalyzeService } = require("../config")
const qywx = require("./Qywx")

// 告警，可以根据需要修改为实际的告警机制
const sendAlert = async (webhookKey, message) => {
  let messageData = {
    msgtype: 'text',
    text: {
      content: `【服务周报】\n\n${message}`,
    },
  }
  return await qywx.sendMessage(webhookKey, messageData)
}

// 获取指标报告
const getReport = async (message, dashboard_uid, start_time) => {
  try {
    let data = {
      message: message,
      dashboard_uid: dashboard_uid,
      start_time: start_time,
    };
    const response = await axios.post(AnalyzeService.URL, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data.data;
  } catch (err) {
    console.error('❌ POST /analyze-metrics failed:', {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      url: err.config?.url
    });
    return "获取服务周报失败"
  }
}

const report = async (config) => {
  let report = await getReport(config.prompt, config.dashboardUid, config.startTime)
  sendAlert(config.webhookKey, report)
}

const start = async (config) => {
  console.log(`Metrics ${config.dashboardUid} report script is running.`)
  // 初始执行一次
  report(config)
  // 定时执行
  cron.schedule(config.cron, () => {
    report(config)
  })
}

module.exports = {
  start,
}
