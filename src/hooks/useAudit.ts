import { useDataProvider } from 'react-admin'
import { trackEvent, type Props } from '../utils/audit'

type AuditFunction = (args: Props) => Promise<void>

export default function useAudit(): AuditFunction {
  const dataProvider = useDataProvider()
  const audit = trackEvent(dataProvider)
  return audit
}
