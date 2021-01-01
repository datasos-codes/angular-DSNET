import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from './../../../services';
import { ProjectsApi, InvoiceAPi, OrganizationApi } from '../../../shared/api';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import * as moment from 'moment';
import { RoleBasePermission } from '../../../shared/constances';
import { SortEvent } from 'primeng/api';
import { Table } from 'primeng/table/table';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.css']
})
export class InvoiceDetailsComponent implements OnInit {
  @ViewChild('invoiceDetailsTable') invoiceDetailsTable: Table;

  checkBrowser: boolean;
  projectNamesList: any;
  currentMonthAndYear: Date;
  filterProjectByNamesFrm: FormGroup;
  invoiceFilterForm: FormGroup;
  frmValue: any;
  weekDays: any;
  holidays: any;
  workingDays: any;
  invoicesData: any;
  invoicesDataLength: any;
  sumOfBillableAmt: any;
  array1: any = [];
  dataOfInvoices: any[];
  exportToExcelInvoiceJsonData: any;
  copyDataFromExcel: string;
  invoiceModulePermission: any;
  roleId: any;
  selectedAllProject: any;
  invoiceArr: FormArray;
  dynamicButtonsobj: any = {};

  constructor(
    private projectsApi: ProjectsApi,
    private invoiceAPi: InvoiceAPi,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private organizationApi: OrganizationApi
  ) { }

  ngOnInit(): void {
    this.currentMonthAndYear = new Date();
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      this.checkBrowser = false; // if Firefox
    } else {
      this.checkBrowser = true; // if Chrome
    }
    this.filterProjectByNamesFrm = this.formBuilder.group({
      filterByProjectName: [''],
      filterByMonth: [this.currentMonthAndYear],
    });
    this.getProjects();
    this.invoiceFilterForm = this.formBuilder.group({
      invoiceArr: this.formBuilder.array([])
    });
    this.onChangefilter();
    this.getLocalStoragePermissionData();
    this.pasteInvoiceDataFromExcelFile();
  }

  get f() { return this.invoiceFilterForm.controls; }
  get t() { return this.f.invoiceArr as FormArray; }

  private getLocalStoragePermissionData() {
    this.roleId = this.authenticationService.currentUserValue['data']['roleId'];
    this.organizationApi.getRolePermission(this.roleId).subscribe(res => {
      if (res && res['flag'] === 1) {
        this.invoiceModulePermission = res['data']['permissions'].
          filter(fname => fname.featureName === RoleBasePermission.INVOICE_SCREEN)[0];
        if (this.invoiceModulePermission && this.invoiceModulePermission !== undefined) {
          this.invoiceModulePermission.features.forEach(element => {
            this.dynamicButtonsobj[element.isLableDisplay.replace(/ /g, '')] = element.isLableValue;
          });
        }
      }
    });
  }

  private getProjects() {
    this.projectsApi.getAllProjectsByNames().subscribe(projectsRes => {
      if (projectsRes && projectsRes['flag'] === 1) {
        projectsRes['data'].map((data) => {
          data.value = data.id;
          data.label = data.name;
        });
        projectsRes['data'].unshift({ label: 'All Projects', value: null });
        this.projectNamesList = projectsRes['data'];
        if (this.projectNamesList.length > 0) {
          this.selectedAllProject = this.projectNamesList[0].value;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  onChangefilter(args?: any) {
    if (this.filterProjectByNamesFrm) {
      this.sumOfBillableAmt = 0;
      const pId = this.filterProjectByNamesFrm.controls.filterByProjectName.value;
      this.frmValue = {
        projectId: pId ? pId : 0,
        month: this.filterProjectByNamesFrm.controls.filterByMonth.value.getMonth() + 1,
        year: this.filterProjectByNamesFrm.controls.filterByMonth.value.getFullYear()
      };
      this.fetchInvoiceDataByParams(this.frmValue);
    }
  }

  private fetchInvoiceDataByParams(args: any) {
    this.invoiceAPi.getAllInvoices(args).subscribe(res => {
      if (res && res['flag'] === 1) {
        this.weekDays = res.data.weekDays;
        this.holidays = res.data.holidays;
        this.workingDays = res.data.workingDays;
        this.invoicesData = res.data.invoices;
        this.invoicesDataLength = this.invoicesData.length;
        const control = this.invoiceFilterForm.controls.invoiceArr as FormArray;
        if (this.invoicesData && this.invoicesData.length > 0) {
          control.controls = [];
          this.invoicesData.forEach((res: any, i: number) => {
            this.setInvoiceValues(control, res);
          });
        } else {
          control.controls = [];
        }
      }
    }, error => {
      console.log(error);
    });
  }

  setInvoiceValues(control: any, resData: any) {
    control.push(
      this.formBuilder.group({
        employee: [resData.employee],
        billingRate: [],
        perDayRate: [],
        workingDays: [resData.workingDays],
        leaveAdjustments: [],
        finalBillableDays: [resData.workingDays],
        billableAmount: []
      })
    );
  }

  clearFilter() {
    if (this.filterProjectByNamesFrm &&
      this.filterProjectByNamesFrm.value.filterByProjectName !== '' ||
      this.filterProjectByNamesFrm.value.filterByMonth !== '') {
      this.sumOfBillableAmt = 0;
      this.selectedAllProject = this.projectNamesList[0].value;
      this.filterProjectByNamesFrm.controls.filterByMonth.setValue(this.currentMonthAndYear);
      this.frmValue = {
        projectId: 0,
        month: this.filterProjectByNamesFrm.controls.filterByMonth.value.getMonth() + 1,
        year: this.filterProjectByNamesFrm.controls.filterByMonth.value.getFullYear()
      };
      this.fetchInvoiceDataByParams(this.frmValue);
    }
  }

  getLeaveAdjustmentValue(leaveAsjValue: any, index: number) {
    const leaveAdVal = parseFloat(leaveAsjValue);
    const invoiceArrValue = this.invoiceFilterForm.controls.invoiceArr as FormArray;
    const workingDaysHasValue = invoiceArrValue['controls'][index]['controls']['workingDays'].value;
    const perDayRateValue = parseFloat(invoiceArrValue['controls'][index]['controls']['perDayRate'].value);

    if ((workingDaysHasValue === 0 || workingDaysHasValue) && leaveAdVal) {
      const finalBillableDays = workingDaysHasValue - leaveAdVal;
      if (finalBillableDays > 0) {
        invoiceArrValue['controls'][index]['controls']['finalBillableDays'].setValue(finalBillableDays);
      } else {
        invoiceArrValue['controls'][index]['controls']['finalBillableDays'].setValue(0);
      }
      if (perDayRateValue) {
        if (finalBillableDays > 0) {
          invoiceArrValue['controls'][index]['controls']['billableAmount'].setValue(
            (Math.round((finalBillableDays * perDayRateValue) * 100) / 100).toFixed(2));
        } else {
          invoiceArrValue['controls'][index]['controls']['billableAmount'].setValue(0);
        }
      } else {
        invoiceArrValue['controls'][index]['controls']['billableAmount'].setValue(0);
      }
    } else {
      invoiceArrValue['controls'][index]['controls']['finalBillableDays'].setValue(workingDaysHasValue);
      if (perDayRateValue && workingDaysHasValue) {
        invoiceArrValue['controls'][index]['controls']['billableAmount'].setValue(
          (Math.round((perDayRateValue * workingDaysHasValue) * 100) / 100).toFixed(2));
      } else {
        invoiceArrValue['controls'][index]['controls']['billableAmount'].setValue(0);
      }
    }
    this.getSumOfBillableAmount(invoiceArrValue['controls'][index]['controls']['billableAmount'].value, index);
  }

  getBillableAMt(billingRateValue, index) {
    const bRate = parseFloat(billingRateValue);
    const perDayRate = (bRate / this.weekDays);
    const invoiceArrValue = this.invoiceFilterForm.controls.invoiceArr as FormArray;
    const fbRate = invoiceArrValue['controls'][index]['controls']['finalBillableDays'].value;
    if (perDayRate) {
      invoiceArrValue['controls'][index]['controls']['perDayRate'].setValue((Math.round((perDayRate) * 100) / 100).toFixed(2));
    }
    if (bRate && fbRate) {
      invoiceArrValue['controls'][index]['controls']['billableAmount'].setValue((Math.round((perDayRate * fbRate) * 100) / 100).toFixed(2));
    } else {
      invoiceArrValue['controls'][index]['controls']['billableAmount'].setValue(0);
    }
    this.getSumOfBillableAmount(invoiceArrValue['controls'][index]['controls']['billableAmount'].value, index);
  }

  getSumOfBillableAmount(frmData: any, i: number) {
    this.array1[i] = frmData;
    this.sumOfBillableAmt = (Math.round((this.invoiceFilterForm.controls.invoiceArr.value.reduce((a, b) =>
      +a + +b.billableAmount, 0)) * 100) / 100).toFixed(2);
  }

  exportexcel() {
    if (this.projectNamesList[0].label === 'All Projects') {
      this.projectNamesList.shift({ label: 'All Projects', value: null });
    }
    const pNamesList = (this.filterProjectByNamesFrm.value.filterByProjectName === ''
      || this.filterProjectByNamesFrm.value.filterByProjectName === null) ?
      this.projectNamesList.map(pName => pName.name) :
      [this.projectNamesList.filter(pId => pId.id === this.filterProjectByNamesFrm.value.filterByProjectName)[0].name];
    this.invoiceFilterForm.controls.invoiceArr.value.forEach(element => {
      element.billingRate = parseFloat(element.billingRate);
      element.leaveAdjustments = parseFloat(element.leaveAdjustments);
      element.perDayRate = parseFloat(element.perDayRate);
      element.billableAmount = parseFloat(element.billableAmount);
    });
    const invoiceArry = this.invoicesDataLength === 0 ? this.invoicesData : this.invoiceFilterForm.controls.invoiceArr.value;
    this.exportToExcelInvoiceJsonData = {
      projects: pNamesList,
      month: moment(new Date(this.filterProjectByNamesFrm.value.filterByMonth)).format('MMMM - YYYY'),
      total: parseFloat(this.sumOfBillableAmt === undefined ? 0 : this.sumOfBillableAmt),
      invoices: invoiceArry
    };
    this.invoiceAPi.exportToExcelInvoicesData(this.exportToExcelInvoiceJsonData).subscribe(res => {
      const blob = new Blob([res], { type: res.type });
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'Invoices';
      link.click();
    }, error => {
      console.log(error);
    });
  }

  pasteInvoiceDataFromExcelFile() {
    const mainInvoiceArr = this.invoiceFilterForm.controls.invoiceArr as FormArray;
    const formbd = this.formBuilder;
    document.addEventListener('paste', e => {
      this.copyDataFromExcel = e.clipboardData.getData('text');
      if (this.copyDataFromExcel && this.copyDataFromExcel !== null) {
        const stringArray = this.copyDataFromExcel.split('\n');
        const excelFileData = [];
        // tslint:disable-next-line: forin
        for (const y in stringArray) {
          // tslint:disable-next-line: prefer-const
          let cells = stringArray[y].split('\t');
          const obj = {
            employee: cells[0],
            billingRate: cells[1],
          };
          if (obj.employee && obj.billingRate) {
            excelFileData.push(obj);
          }
        }
        const control = mainInvoiceArr;
        this.tabSeparatedInvoiceExcelData(excelFileData, mainInvoiceArr, control, formbd);
      }
    });
  }

  private tabSeparatedInvoiceExcelData(excelFileData: any[], mainInvoiceArr: FormArray, control: FormArray, formbd: FormBuilder) {
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < excelFileData.length; index++) {
      const getEmployeNameUsingFilter = mainInvoiceArr.value.
        filter(n => n.employee.toLowerCase() === excelFileData[index].employee.toLowerCase());
      if (getEmployeNameUsingFilter && getEmployeNameUsingFilter.length > 0) {
        Object.keys(this.t.controls).forEach(key => {
          const invoiceArrEmpName = this.t.controls[key].controls.employee.value.toLowerCase();
          const excelArrEmpName = excelFileData[index].employee.toLowerCase();
          if (invoiceArrEmpName === excelArrEmpName) {
            this.t.controls[key].controls.billingRate.setValue((Math.round((excelFileData[index].billingRate) * 100) / 100).toFixed(2));
            this.getBillableAMt(this.t.controls[key].controls.billingRate.value, parseInt(key, 0));
          }
        });
      } else {
        control.push(
          formbd.group({
            employee: [excelFileData[index].employee],
            billingRate: [(Math.round((excelFileData[index].billingRate) * 100) / 100).toFixed(2)],
            perDayRate: [],
            workingDays: [],
            leaveAdjustments: [],
            finalBillableDays: [],
            billableAmount: []
          })
        );
        this.getBillableAMt(excelFileData[index].billingRate, (mainInvoiceArr.value.length - 1));
      }
    }
  }

  customSortForInvoiceTable(event: SortEvent) {
    event.data.sort((data1, data2) => {
      const value1 = data1['controls'][event.field].value;
      const value2 = data2['controls'][event.field].value;
      let result = null;

      if (value1 == null && value2 != null) {
        result = -1;
      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        const test = value1.substr(2, 1);
        const date1 = moment(value1, 'DD-MMM-YYYY');
        const date2 = moment(value2, 'DD-MMM-YYYY');
        if (test === '-' || test === '/') {
          result = date1.diff(date2, 'days');
        } else {
          result = value1.localeCompare(value2);
        }
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }

      return (event.order * result);
    });
  }

  preventMinusSign(eventCode) {
    if (eventCode === 45) { // for prevent '-' sign on keypress in billing rate
      return false;
    }
  }
}
