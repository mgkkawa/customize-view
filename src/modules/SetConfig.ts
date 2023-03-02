export const setConfig = (config: any) => {
  for (let key in config) {
    config[key] = JSON.stringify(config[key])
  }
  kintone.plugin.app.setConfig(config, () => {})
}
