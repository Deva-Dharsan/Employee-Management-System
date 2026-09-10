export interface IUser {
  employeeId: number
  employeeName: string
  contactNo: string
  emailId: string
  deptId: number
  password: string
  gender: string
  role: string
  createdDate: string
}

export interface IApiResponseModel {
  message : "",
  result : boolean,
  data : any;
}

export interface IparentDept
 {
      departmentId   : number,
      departmentName : string,
      departmentLogo : string
 }
export interface IChildDept
 {
      childDeptId    : number,
      ParentDeptId   : number,
      departmentName : string
 }

export interface IProject {
  _id          : string;
  projectName  : string;
  projectCode  : string;
  description  : string;
  clientName   : string;
  startDate    : string;
  endDate      : string;
  priority     : 'Low' | 'Medium' | 'High' | 'Critical';
  status       : 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  createdDate  : string;
}

export interface IAssignment {
  _id          : string;
  employeeId   : string;
  projectId    : string;
  role         : string;
  allocation   : number;
  startDate    : string;
  endDate      : string;
  status       : 'Planned' | 'Active' | 'Completed' | 'Cancelled';
  createdDate  : string;
}