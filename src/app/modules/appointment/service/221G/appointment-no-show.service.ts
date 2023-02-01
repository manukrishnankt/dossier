import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentNoShowService {
  private visaAdminURL: any;
  private visaAppointmentURL: any;
  constructor(private http: HttpClient) {
    this.visaAdminURL = environment.visaAdmin;
    this.visaAppointmentURL = environment.visaAppointment;
  }
  getvisaClassList() {
    const url = this.visaAdminURL + '/visaClass';
    return this.http.get(url);
  }
  getvisaTypeList() {
    const url = this.visaAdminURL + '/visaType';
    return this.http.get(url);
  }
  getAllNoShow() {
    const url = this.visaAppointmentURL + '/appointments/getall';
    return this.http.get(url);
  }

  getAllnoshowByFilter(
    currentDate: any,
    visaType: any,
    visaCat: any,
    visaClass: any
  ) {
    const url =
      this.visaAppointmentURL +
      '/appointments/findByDateAndVisa?currentDate=' +
      currentDate +
      '&visaType=' +
      visaType +
      '&visaClass=' +
      visaClass +
      '&visaCatg=' +
      visaCat;
    return this.http.post(url, {});
  }

  updateFlag(payload: any) {
    const url = this.visaAppointmentURL + '/appointments/bulkupdates';
    return this.http.put(url, payload);
  }
  updateApp(payload: any) {
    const url = this.visaAppointmentURL + '/appointments';
    return this.http.put(url, payload);
  }
  getCsvFile(payLoad: any) {
    const url = this.visaAppointmentURL + '/appointments/download';
    return this.http.post(url, payLoad, {
      responseType: 'arraybuffer',
      observe: 'response',
    });
  }
  uploadCsv(file: any) {
    const url = this.visaAppointmentURL + '/appointments/upload';
    return this.http.post(url, file);
  }
}
