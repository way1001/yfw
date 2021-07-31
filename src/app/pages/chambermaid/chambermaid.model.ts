import { ShellModel } from '../../shell/data-store';

export class ChambermaidModel extends ShellModel {
  affiliationId: string;
  updateTime: string;
  phone: string;
  customerName: string;
  gender: string;
  description: string;
  brokerId: string;
  brokerName: string;
  brokerPhone: string;
  currentHandler: string;

  constructor() {
    super();
  }
}
