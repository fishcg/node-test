const ExRateCheck = require("./lib/ExRateCheck")
const HealthNotice = require("./lib/HealthNotice")

const cmdsStr = process.argv[2]
if (cmdsStr === undefined) {
  console.log(`No cmd start`)
  return
}

let cmds = cmdsStr.split(',')
for (let cmd of cmds) {
  switch (cmd) {
    case 'ExRateCheck':
      ExRateCheck.start()
      break
    case 'HealthNotice':
      HealthNotice.start()
      break
    default:
      console.log(`Cmd "${cmd}" is not supported`)
      break
  }
}
