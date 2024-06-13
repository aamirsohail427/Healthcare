import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonOptions, GridListHelper } from 'src/app/shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.scss']
})
export class InvoicesListComponent implements OnInit {
  @ViewChild('grdInvoices', { static: false }) grdInvoices: DxDataGridComponent;
  public dtsInvoices: any = [{
    id: 1,
    patientName: "Amir"
  }];
  constructor(public gridListHelper: GridListHelper) { }

  ngOnInit(): void {
  }
  public onGrdInvoicesToolbarPreparing(e) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnExportToPDFClick),
      null,
      null);
  }
  private onBtnRefreshClick = () => {

  }
  private onBtnExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdInvoices.instance
    }).then(() => {
      doc.save('Prescription.pdf');
    })
  }
  public onGrdInvoicesContentReady(e) {

  }
  public getInvoicesByAppointment(id) {

  }
}
