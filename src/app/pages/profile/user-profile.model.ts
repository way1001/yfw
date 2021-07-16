import { ShellModel } from '../../shell/data-store';

export class UserProfileModel extends ShellModel {
  headimgUrl: string;
  realName: string;
  nickName: string;
  phone: string;
  sex: string;
  refCount: string;
  avtiveCount: string;
  endCount: string;
  about: string;
  userRole : string;
  customers: Array<{image: string, name: string}> = [
    {
      image: '',
      name: ''
    },
    {
      image: '',
      name: ''
    },
    {
      image: '',
      name: ''
    },
    {
      image: '',
      name: ''
    }
  ];

  constructor() {
    super();
  }
}
