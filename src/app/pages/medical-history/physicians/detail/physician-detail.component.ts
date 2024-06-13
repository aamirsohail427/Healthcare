import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { DetailPopupViewBase } from 'src/app/shared/base-classes';
import Physicianservice from '../physician.service';
import * as _ from 'lodash';
import { ButtonOptions, CustomDialogHelper } from 'src/app/shared/utils';

@Component({
  selector: 'app-physician-detail',
  templateUrl: './physician-detail.component.html',
  styleUrls: ['./physician-detail.component.scss']
})
export class PhysicianDetailComponent extends DetailPopupViewBase implements OnInit {

  @ViewChild('frmPhysiciansDetails', { static: false }) frmPhysiciansDetails: DxFormComponent;
  public popupToolbarItems: any[];
  public frmPhysicianDetail: any = {};
  public rawPhysicianDetail: any = {};
  public currentPhysicianDetail: any;
  public dtsClasses: any[];
  constructor(private service: Physicianservice) {
    super();
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }


  public addPhysician() {
    super.toggleLoadingPanel(true);
    this.initPhysicianDetail();
    this.initFormData(false);
    this.cloneRawData();
  }

  public editPhysician(entity) {
    this.isEditMode = true;
    super.toggleLoadingPanel(true);
    this.currentPhysicianDetail = _.cloneDeep(entity);
    this.initPhysicianDetail();
    this.initFormData(true);
  }


  private initFormData(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.initPopupToolbarItems();
    this.initEditors();
  }

  private initEditors() {
    if (this.isEditMode) {
      this.getPhysicianDetails();
    }
    setTimeout(() => {
      this.popupVisible = true;
    });
    super.toggleLoadingPanel(false);
  }
  private getPhysicianDetails() {
    this.service.getById(this.currentPhysicianDetail.id).subscribe((response) => {
      this.frmPhysicianDetail = response.data;
      this.cloneRawData();
    });
  }
  private initPhysicianDetail() {
    this.frmPhysicianDetail = {
      id: 0,
      firstName: null,
      lastName: null,
      userId: null,
      password: null,
      confirmPassword: null,
      email: null
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
        this.getPhysicianDetails();
      });
    } else {
      this.getPhysicianDetails();
    }
    this.focusToFirstField();
  }
  private focusToFirstField() {
    super.setFormFocus(this.frmPhysicianDetail.instance, 'firstName');
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
        this.initPhysicianDetail();
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
    this.currentPhysicianDetail = { id: this.frmPhysicianDetail.id };
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
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmPhysicianDetail)
      : this.service.create(this.frmPhysicianDetail);
    saveMethod.subscribe(result => {
      if (!this.isEditMode) {
        this.frmPhysicianDetail.id = result.data.id;
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
      id: this.frmPhysicianDetail.id
    };

    data.id = isEditMode ? this.frmPhysicianDetail.id : 0;
    return data;
  }

  private cloneRawData() {
    this.rawPhysicianDetail = _.cloneDeep(this.frmPhysicianDetail);
  }
  private restoreRawData() {
    this.frmPhysicianDetail = _.cloneDeep(this.rawPhysicianDetail);
  }
  private isDataChanged(): boolean {
    if (super.isEqual(this.frmPhysicianDetail, this.rawPhysicianDetail)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {

    const result: any = this.frmPhysiciansDetails.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }
  public onPopupHiding(e) {
    this.popupVisible = false;
  }

}
