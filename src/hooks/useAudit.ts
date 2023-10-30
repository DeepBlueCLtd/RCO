import { useDataProvider } from 'react-admin'
import { trackEvent, type AuditData } from '../utils/audit'

export type AuditFunction = (args: AuditData) => Promise<void>

export default function useAudit(): AuditFunction {
  const dataProvider = useDataProvider()
  const audit = trackEvent(dataProvider)
  return audit
}
