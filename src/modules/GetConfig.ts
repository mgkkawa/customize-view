export const getConfig = () => {
  const config = kintone.plugin.app.getConfig(kintone.$PLUGIN_ID)
  for (let key in config) {
    config[key] = JSON.parse(config[key])
  }
  return config
}
