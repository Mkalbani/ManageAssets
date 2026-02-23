import api from './client';
import { ReportSummary } from '../users';

export async function getReportsSummary(): Promise<ReportSummary> {
  const res = await api.get('/api/reports/summary');
  return res.data;
}
