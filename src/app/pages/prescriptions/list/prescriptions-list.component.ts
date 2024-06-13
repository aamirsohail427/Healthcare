import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonOptions, GridListHelper } from 'src/app/shared';
import { ListViewBase } from 'src/app/shared/base-classes';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-prescriptions-list',
  templateUrl: './prescriptions-list.component.html',
  styleUrls: ['./prescriptions-list.component.scss']
})
export class PrescriptionsListComponent extends ListViewBase implements OnInit {
  @ViewChild('grdPrescription', { static: false }) grdPrescription: DxDataGridComponent;
  public dtsPrescriptions: any;
  public dtsClasses: any;
  constructor(public gridListHelper: GridListHelper) {
    super();
  }

  ngOnInit(): void {
  }
  public initData() {

  }
  public onGrdPrescriptionsContentReady(e) {

  }
  public onGrdPrescriptionsToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnExportToPDFClick),
      new ButtonOptions('', false, null),
      null);
  }
  private onBtnRefreshClick = () => {
    this.initData();
  }
  private onBtnExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdPrescription.instance
    }).then(() => {
      doc.save('Prescription.pdf');
    })
  }

  public getPrescriptionsByAppointment(id) {

  }
}
