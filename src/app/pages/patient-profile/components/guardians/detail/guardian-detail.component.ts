import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { TrowserViewBase } from 'src/app/shared/base-classes';
import * as _ from 'lodash';
import { ButtonOptions, CustomDialogHelper } from 'src/app/shared/utils';
import GuardianService from '../guardian.service';

@Component({
  selector: 'app-guardian-detail',
  templateUrl: './guardian-detail.component.html',
  styleUrls: ['./guardian-detail.component.scss']
})
export class GuardianDetailComponent extends TrowserViewBase implements OnInit {

  @ViewChild('frmGuardianDetails', { static: false }) frmGuardianDetails: DxFormComponent;
  public popupToolbarItems: any[];
  public frmGuardianDetail: any = {};
  public rawGuardianDetail: any = {};
  public currentGuardianDetail: any;
  public dtsGenderTypes:any;

  constructor(private service: GuardianService) {
    super();
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }


  public addGuardian() {
    super.toggleLoadingPanel(true);
    this.initGuardianDetail();
    this.initFormData(false);
    this.cloneRawData();
  }

  public editGuardian(entity) {
    this.isEditMode = true;
    super.toggleLoadingPanel(true);
    this.currentGuardianDetail = _.cloneDeep(entity);
    this.initGuardianDetail();
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
    this.service.getById(this.currentGuardianDetail.id).subscribe((response) => {
      this.frmGuardianDetail = response.data;
      this.cloneRawData();
    });
  }
  private initGuardianDetail() {
    this.frmGuardianDetail = {
      id: 0,
      title: null,
      description: null,
      GuardianDate: null
    };
  }


  private initPopupToolbarItems(): void {
    this.popupToolbarItems = super.getTrowserToolbarItems(
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
    super.setFormFocus(this.frmGuardianDetails.instance, 'title');
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
        this.initGuardianDetail();
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
    this.currentGuardianDetail = { id: this.currentGuardianDetail.id };
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
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmGuardianDetail)
      : this.service.create(this.frmGuardianDetail);
    saveMethod.subscribe(result => {
      if (!this.isEditMode) {
        this.frmGuardianDetail.id = result.data.id;
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
      id: this.frmGuardianDetail.id
    };

    data.id = isEditMode ? this.frmGuardianDetail.id : 0;
    return data;
  }

  private cloneRawData() {
    this.rawGuardianDetail = _.cloneDeep(this.frmGuardianDetail);
  }
  private restoreRawData() {
    this.frmGuardianDetail = _.cloneDeep(this.rawGuardianDetail);
  }
  private isDataChanged(): boolean {
    if (super.isEqual(this.frmGuardianDetail, this.rawGuardianDetail)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {

    const result: any = this.frmGuardianDetails.instance.validate();
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
