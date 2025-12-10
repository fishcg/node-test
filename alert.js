const { qywxAlert } = require("./config")
const ExRateCheck = require("./lib/ExRateCheck")
const HealthNotice = require("./lib/HealthNotice")
const MetricsReport = require("./lib/MetricsReport")

const cmdsStr = process.argv[2]
if (cmdsStr === undefined) {
  console.log(`No cmd start`)
  return
}

let cmds = cmdsStr.split(',')
for (let cmd of cmds) {
  if (cmd === 'ExRateCheck') {
    ExRateCheck.start()
  } else if (cmd === 'HealthNotice') {
    HealthNotice.start()
  } else if (cmd.startsWith('Metrics')) {
    // 以 metrics 开头的命令交给 MetricsReport 处理
    let reportConfig = qywxAlert[cmd] || ''
    if (!reportConfig) {
      throw new Error(`Cmd "${cmd}" is not configured in qywxAlert`)
    }
    MetricsReport.start(reportConfig)
  } else {
    throw new Error(`Cmd "${cmd}" is not supported`)
  }
}

