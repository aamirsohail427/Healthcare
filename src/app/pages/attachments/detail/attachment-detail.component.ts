import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { ButtonOptions, CustomDialogHelper, DetailPopupViewBase } from 'src/app/shared';
import AttachmentService from '../attachment.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-attachment-detail',
  templateUrl: './attachment-detail.component.html',
  styleUrls: ['./attachment-detail.component.scss']
})
export class AttachmentDetailComponent extends DetailPopupViewBase implements OnInit {

  @ViewChild('frmAttachmentDetails', { static: false }) frmAttachmentDetails: DxFormComponent;
  public popupToolbarItems: any[];
  public frmAttachmentDetail: any = {};
  public rawAttachmentDetail: any = {};
  public currentAttachmentDetail: any;

  constructor(private service: AttachmentService) {
    super();
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }


  public addAttachment() {
    super.toggleLoadingPanel(true);
    this.initAttachmentDetails();
    this.initFormData(false);
    this.cloneRawData();
  }

  public editAttachment(entity) {
    this.isEditMode = true;
    super.toggleLoadingPanel(true);
    this.currentAttachmentDetail = _.cloneDeep(entity);
    this.initAttachmentDetails();
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
    this.service.getById(this.currentAttachmentDetail.id).subscribe((response) => {
      this.currentAttachmentDetail = response.data;
      this.cloneRawData();
    });
  }
  private initAttachmentDetails() {
    this.currentAttachmentDetail = {
      id: 0,
      text: null,
      type: null,
      value: null
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
    super.setFormFocus(this.frmAttachmentDetail.instance, 'title');
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
        this.initAttachmentDetails();
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
    this.currentAttachmentDetail = { id: this.currentAttachmentDetail.id };
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
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmAttachmentDetail)
      : this.service.create(this.frmAttachmentDetail);
    saveMethod.subscribe(result => {
      if (!this.isEditMode) {
        this.frmAttachmentDetail.id = result.data.id;
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
      id: this.frmAttachmentDetail.id
    };

    data.id = isEditMode ? this.frmAttachmentDetail.id : 0;
    return data;
  }

  private cloneRawData() {
    this.rawAttachmentDetail = _.cloneDeep(this.frmAttachmentDetail);
  }
  private restoreRawData() {
    this.frmAttachmentDetail = _.cloneDeep(this.rawAttachmentDetail);
  }
  private isDataChanged(): boolean {
    if (super.isEqual(this.frmAttachmentDetail, this.rawAttachmentDetail)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {

    const result: any = this.frmAttachmentDetails.instance.validate();
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
