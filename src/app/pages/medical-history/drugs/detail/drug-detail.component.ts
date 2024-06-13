import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { DetailPopupViewBase } from 'src/app/shared/base-classes';
import * as _ from 'lodash';
import { ButtonOptions, CustomDialogHelper } from 'src/app/shared/utils';
import DrugService from '../drugs.service';
@Component({
  selector: 'app-drug-detail',
  templateUrl: './drug-detail.component.html',
  styleUrls: ['./drug-detail.component.scss']
})
export class DrugDetailComponent extends DetailPopupViewBase implements OnInit {

  @ViewChild('frmDrugDetails', { static: false }) frmDrugDetails: DxFormComponent;
  public popupToolbarItems: any[];
  public frmDrugDetail: any = {};
  public rawDrugDetail: any = {};
  public currentDrugDetail: any;
  public dtsReceiverTypes: any;
  constructor(private service: DrugService) {
    super();
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }

  public addDrug() {
    super.toggleLoadingPanel(true);
    this.initDrugDetail();
    this.initFormData(false);
    this.cloneRawData();
  }

  public editDrug(entity) {
    this.isEditMode = true;
    super.toggleLoadingPanel(true);
    this.currentDrugDetail = _.cloneDeep(entity);
    this.initDrugDetail();
    this.initFormData(true);
  }


  private initFormData(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.initPopupToolbarItems();
    this.initEditors();
  }

  private initEditors() {
    if (this.isEditMode) {
      this.getUserDetails();
    }
    setTimeout(() => {
      this.popupVisible = true;
    });
    super.toggleLoadingPanel(false);
  }
  private getUserDetails() {
    this.service.getById(this.currentDrugDetail.id).subscribe((response) => {
      this.frmDrugDetail = response.data;
      this.cloneRawData();
    });
  }
  private initDrugDetail() {
    this.frmDrugDetail = {
      id: 0,
      title: null,
      description: null,
      isPublished: null
    };
  }


  private initPopupToolbarItems(): void {
    this.popupToolbarItems = super.getDetailPopupToolbarItems(
      new ButtonOptions('', false, null),
      new ButtonOptions('Cancel', true, this.onBtnCancelClick, this.isDataProcessing),
      new ButtonOptions('', this.isEditMode, this.onBtnRefreshClick, this.isDataProcessing),
      new ButtonOptions('', true, this.onBtnSaveClick, this.isDataProcessing),
      new ButtonOptions('', true, this.onBtnSaveAndNewClick, this.isDataProcessing),
      new ButtonOptions('', true, this.onBtnSaveAndDoneClick, this.isDataProcessing)
    );
  }


  private onBtnRefreshClick = () => {
    if (this.isDataChanged()) {
      super.confirmUnsavedChanges(() => {
        if (this.validateFormData()) {
          this.save(() => {
            this.cloneRawData();
            super.showSavedSuccessMsg(false);
          });
        }
      }, () => {
        this.getUserDetails();
      });
    } else {
      this.getUserDetails();
    }
    this.focusToFirstField();
  }
  private focusToFirstField() {
    super.setFormFocus(this.frmDrugDetails.instance, 'title');
  }
  private onBtnCancelClick = () => {
    if (this.isDataChanged()) {
      super.confirmUnsavedChanges(() => {
        this.saveAndClose();
      }, () => {
        this.isChangesDiscarded = true;
        this.popupVisible = false;
      });
    } else {
      this.popupVisible = false;
    }
  }

  private onBtnSaveClick = () => {
    this.setSaveButtonStatus(() => {
      this.validateAndSave(false, this.saveCallback);
    });
  }

  private onBtnSaveAndNewClick = () => {
    this.setSaveButtonStatus(() => {
      this.validateAndSave(false, () => {
        this.isEditMode = false;
        this.initPopupToolbarItems();
        this.initDrugDetail();
        this.cloneRawData();
        super.showSavedSuccessMsg(false);
      });
    });
  }

  private saveAndClose() {
    if (this.validateFormData()) {
      this.validateAndSave(true, this.saveAndDoneCallback);
    }
  }

  private onBtnSaveAndDoneClick = () => {
    this.setSaveButtonStatus(() => {
      this.validateAndSave(true, this.saveAndDoneCallback);
    });
  }

  private saveCallback = () => {
    super.showSavedSuccessMsg(false);
    this.isEditMode = true;
    this.initPopupToolbarItems();
    this.cloneRawData();
    this.currentDrugDetail = { id: this.currentDrugDetail.id };
    super.toggleLoadingPanel(false);
  }

  private setSaveButtonStatus(callbackFn: any = null) {
    this.isDataProcessing = true;
    this.initPopupToolbarItems();
    if (this.validateFormData()) {
      if (callbackFn != null) {
        callbackFn();
      }
    } else {
      this.isDataProcessing = false;
      this.initPopupToolbarItems();
    }
  }

  private saveAndDoneCallback = () => {
    this.cloneRawData();
    super.showSavedSuccessMsg(true);
  }
  private validateAndSave(isSaveAndDone, callbackFn: any = null, isRefresh: boolean = false) {
    const validateData = this.getValidateData(this.isEditMode);
    super.toggleLoadingPanel(true);
    this.service.validate(validateData).subscribe(response => {
      if (response.data.isValid) {
        this.save(callbackFn);
      } else {
        this.isDataProcessing = false;
        this.initPopupToolbarItems();
        super.toggleLoadingPanel(false);
        this.showErrorMsg(this.service.getMessageByCode('U06'));
      }
    });
  }

  private showErrorMsg(msgCode: string) {
    CustomDialogHelper.alertErrorMsg(msgCode);
  }
  private save(callbackFn: any = null) {
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmDrugDetail)
      : this.service.create(this.frmDrugDetail);
    saveMethod.subscribe(result => {
      if (!this.isEditMode) {
        this.frmDrugDetail.id = result.data.id;
      }

      this.isDataSaved = true;
      this.isDataProcessing = false;
      this.initPopupToolbarItems();
      if (callbackFn != null) {
        callbackFn();
      }
    }, err => {
      super.toggleLoadingPanel(false);
    }, () => {
      super.toggleLoadingPanel(false);
    });
  }

  private getValidateData(isEditMode: boolean) {
    const data: any = {
      id: this.frmDrugDetail.id
    };

    data.id = isEditMode ? this.frmDrugDetail.id : 0;
    return data;
  }

  private cloneRawData() {
    this.rawDrugDetail = _.cloneDeep(this.frmDrugDetail);
  }
  private restoreRawData() {
    this.frmDrugDetail = _.cloneDeep(this.rawDrugDetail);
  }
  private isDataChanged(): boolean {
    if (super.isEqual(this.frmDrugDetail, this.rawDrugDetail)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {
    const result: any = this.frmDrugDetails.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }
  public onPopupHiding(e) {
    this.popupVisible = false;
  }
  public onReceiverValueChanged(e) {

  }

}
