import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppointmentNoShowService } from 'src/app/modules/admin/services/221G/appointment-no-show.service';
import * as FileSaver from 'file-saver';
import { Constants } from 'src/app/shared/enums/constants';
import { NotifierService } from 'src/app/shared/services/notifier/notifier.service';
import { LookupconfigurationService } from 'src/app/modules/lookup/services/lookup-configuration/lookupconfiguration.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-appointment-no-show',
  templateUrl: './appointment-no-show.component.html',
  styleUrls: ['./appointment-no-show.component.scss'],
})
export class AppointmentNoShowComponent implements OnInit {
  @ViewChild('closeButton') closebutton: any;
  @ViewChild('closeButtonUpload') closeButtonUpload: any;
  @ViewChild('inpfile') inpfile: any;
  clickedClass: any = false;
  inputtext: any;
  files: any = [];
  appointmentForm!: FormGroup;
  isChecked: boolean = false;
  isSubmitted = false;
  visaClassList: any[] = [];
  visaTypeList: any[] = [];
  visaCatList: any[] = [];
  noShowList: any = [];
  flagConfirm: any;
  constructor(
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    private noShowService: AppointmentNoShowService,
    private lookupconfigurationService: LookupconfigurationService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getVisaType();
    this.appmtNoShowForm();
    this.getAllNoShowByDate();
  }
  /**
   * method to  build appointmentForm
   */
  appmtNoShowForm() {
    this.appointmentForm = this.formBuilder.group({
      visaClass: ['', []],
      visaType: ['', []],
      visaCat: ['', []],
      currentDate: [new Date().toISOString().substring(0, 10), []],
    });
    console.log(this.appointmentForm.value);
  }
  /**
   * function call to getAllVisaClass API
   */
  // getVisaClass() {
  //   this.noShowService.getvisaClassList().subscribe({
  //     next: (response: any) => {
  //       this.visaClassList = response;
  //     },
  //     error: (e) => console.log(e),
  //   });
  // }
  getVisaClass(evt: any) {
    this.lookupconfigurationService.getChildCdtWithId(evt.value).subscribe({
      next: (response: any) => {
        this.visaClassList = response;
      },
      error: (e) => console.log(e),
    });
  }
  getVisaCat(evt: any) {
    this.lookupconfigurationService.getChildCdtWithId(evt.value).subscribe({
      next: (response: any) => {
        this.visaCatList = response;
      },
      error: (e) => console.log(e),
    });
  }
  /**
   * function call to getAllVisaType API
   */
  getVisaType() {
    this.lookupconfigurationService.getAllCustomLookup('VISA TYPE').subscribe({
      next: (response: any) => {
        this.visaTypeList = response.lookUpCdt;
      },
      error: (e) => console.log(e),
    });
  }

  // Function call for getAllNoshowbydate

  getAllNoShowByDate() {
    this.spinner.show();
    this.noShowService
      .getAllnoshowByFilter(
        this.appointmentForm.value.currentDate,
        this.appointmentForm.value.visaType,
        this.appointmentForm.value.visaCat,
        this.appointmentForm.value.visaClass
      )
      .subscribe({
        next: (data: any) => {
          this.spinner.hide();
          console.log(data);
          this.noShowList = data;
        },
        error: () => {
          this.spinner.hide();
          this.noShowList = [];
        },
      });
  }

  // makeAs221G(appointmentObj: any) {
  //   appointmentObj.appointmentType = '221G';
  //   appointmentObj.appointmentStatus = 'NO_SHOW';
  //   const payLoad = {
  //     appointmentType: '221G',
  //     appointmentStatus: 'NO_SHOW',
  //   };
  //   this.noShowService.getNoShowflag(appointmentObj).subscribe({
  //     next: (data: any) => {
  //       console.log(data);
  //     },
  //   });
  // }
  onchangeAppointmentStatus(eveObj: any, item: any) {
    console.log(eveObj);
    if (eveObj.target.checked) {
      item.appointmentStatus = 'NO_SHOW';
    } else {
      item.appointmentStatus = 'SCHEDULED';
    }
    const payLoad = {
      appointmentStatus: 'NO_SHOW',
      appointmentId: item.appointmentId,
    };
    this.noShowService.updateApp(payLoad).subscribe({
      next: (data: any) => {
        this.getAllNoShowByDate();
        this.notifierService.notify(
          'No Show marked successfully',
          Constants.SUCCESS_NOTIFIER
        );
      },
    });
  }
  flagClick(value: any) {
    this.flagConfirm = value;
    console.log(this.flagConfirm);
  }

  flagConfirmation(event: any) {
    this.UpdateFlag();
  }
  exportExcel() {
    if (this.noShowList.length === 0) {
      this.notifierService.notify(
        ' No Data to Export',
        Constants.WARNING_NOTIFIER
      );
    } else {
      let appList: any = [];
      let str = '';
      this.noShowList.forEach((element: any) => {
        appList.push(element.appointmentId);
        if (str.length === 0) {
          str = 'appointmentId=' + element.appointmentId;
        } else {
          str += '&appointmentId=' + element.appointmentId;
        }
      });
      const payLoad = { appointmentId: appList };
      this.noShowService.getCsvFile(payLoad).subscribe({
        next: (data: any) => {
          console.log(data.body);

          const blob = new Blob([data.body], {
            type: data.headers.get('content-type'),
          });

          const file = new File([blob], 'file.csv', {
            type: data.headers.get('content-type'),
          });

          FileSaver.saveAs(file);
          // let blob: any = new Blob([data.body.blob()], {
          //   type: 'text/json; charset=utf-8',
          // });
          // FileSaver.saveAs(blob, 'employees.csv');
        },
      });
    }
  }
  selectFile(event: any) {
    this.files = [];
    this.files.push(...event.target.files);
  }
  openpopup() {
    this.files = [];
    this.inpfile.nativeElement.value = '';
  }
  uploadCsv() {
    // this.fileUploadForm.patchValue({
    //   inputFileName: this.files[0].name
    // });

    if (this.files.length === 0) {
      this.notifierService.notify(
        ' Please select File',
        Constants.WARNING_NOTIFIER
      );
    } else {
      const payload = new FormData();
      payload.append('file', this.files[0]);
      this.noShowService.uploadCsv(payload).subscribe({
        next: (data: any) => {
          this.notifierService.notify(
            ' Upload Success ',
            Constants.SUCCESS_NOTIFIER
          );
          this.closeButtonUpload.nativeElement.click();
        },
        error: (data: any) => {
          if (data.status === 415) {
            this.notifierService.notify(
              'Unsupported file',
              Constants.ERROR_NOTIFIER
            );
          } else {
            console.log('error');
          }
        },
      });
    }
  }
  UpdateFlagObj() {
    this.clickedClass = true;
  }

  UpdateFlag() {
    const payload = {
      appointmentId: this.flagConfirm.appointmentId,
      appointmentType: 'G',
    };
    this.noShowService.updateApp(payload).subscribe({
      next: (data: any) => {
        this.closebutton.nativeElement.click();
        this.getAllNoShowByDate();
        this.notifierService.notify(
          'Flag marked successfully',
          Constants.SUCCESS_NOTIFIER
        );
        // console.log(event);
        // if (event.target) {
        //   this.flagConfirm.appointmentType = '221G';
        // } else {
        //   this.flagConfirm.appointmentType = 'REGULAR_IV';
        // }
      },
    });
  }
}
