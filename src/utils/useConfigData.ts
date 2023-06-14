import { useEffect, useState } from 'react'
import { type DataProvider, useDataProvider } from 'react-admin'

export const useConfigData = (
  dataProvider?: DataProvider
): ConfigData | undefined => {
  const provider = dataProvider ?? useDataProvider()
  const [configData, setConfigData] = useState<ConfigData | undefined>()
  useEffect(() => {
    async function getConfigData(): Promise<void> {
      if (provider !== undefined) {
        setConfigData(await provider.configData())
      }
    }
    getConfigData().catch(console.log)
  }, [provider])

  return configData !== undefined ? configData : undefined
}
