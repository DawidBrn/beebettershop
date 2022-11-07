import { LightningElement,api,track,wire } from 'lwc';
import { getSObjectValue } from '@salesforce/apex';
import beebetterChannel from '@salesforce/messageChannel/beebetterChannel__c';
import cartChannel from '@salesforce/messageChannel/cartChannel__c';
import { subscribe, publish , MessageContext } from 'lightning/messageService';
import getProductById from '@salesforce/apex/searchResultController.getProductById';
import { CurrentPageReference } from 'lightning/navigation';
import Id from '@salesforce/user/Id';
import getUserReview from '@salesforce/apex/reviewController.getUserReview';
import getReviews from '@salesforce/apex/reviewController.getReviews';
import getAvgRating from '@salesforce/apex/reviewController.getAvgRating';

import NAME_FIELD from '@salesforce/schema/PricebookEntry.Product2.Name';
import COMP from '@salesforce/schema/PricebookEntry.Product2.Composition__c';
import RCM_USE from '@salesforce/schema/PricebookEntry.Product2.RecommendedUse__c';
import FAMILY_FIELD from '@salesforce/schema/PricebookEntry.Product2.Family';
import DESC_FIELD from '@salesforce/schema/PricebookEntry.Product2.Description';
import IMG_FIELD from '@salesforce/schema/PricebookEntry.Product2.DisplayUrl';
import DETAILS_IMG_FIELD from '@salesforce/schema/PricebookEntry.Product2.DisplayUrl';
import PRICE_FIELD from '@salesforce/schema/PricebookEntry.UnitPrice';
import PRICEBOOKENTRY from '@salesforce/schema/PricebookEntry';

import addtocart from '@salesforce/label/c.Add_to_Cart_Button';
import faq from '@salesforce/label/c.FAQ_Label';
import dosage from '@salesforce/label/c.Dosage_of_supps_Label';
import shippingandcomplatins from '@salesforce/label/c.Shipping_and_complaints_Label';
import storingdrugsandsupps from '@salesforce/label/c.Stroing_drugs_supps_Label';
import description from '@salesforce/label/c.Description_Label';
import recommendeduse from '@salesforce/label/c.Recommended_Use_Label';
import componentsofprod from '@salesforce/label/c.Components_of_the_product_Label';


export default class ProductDetails extends LightningElement {

    label = {
        addtocart,
        faq,
        dosage,
        shippingandcomplatins,
        storingdrugsandsupps,
        description,
        recommendeduse,
        componentsofprod
    };
    userId = Id;
    @track isLoading = false;

    recordId;
    sellingPrice;
    quantity = 1;
    pricebookentry;
    cartItemCount = 1;
    @track
    userReview;
    @track
    userReviews = [];
    @track 
    reviewId;
    @track
    photoUrl;
    @track
    photoUrls = [];
    noReviews = true;
    rating = 0;
    
    @track
    wiredRecord;
    subscription = null;

    @wire(MessageContext)
    messageContext;

    @wire(CurrentPageReference)
    currentPageReference; 

    get recordIdFromState(){
        return this.currentPageReference &&
            this.currentPageReference.state.recordId; 
    }

    connectedCallback(){
        this.recordId=this.recordIdFromState;
        console.log('recordId' + this.recordId);
        console.log('userId' + this.userId);
    }

    get recordIdState(){
        return this.recordId;
    }
    
    @wire(getProductById,{recordId: '$recordId'})
    wiredRecords;

    @wire(getReviews,{id:'$recordId'})
    userReviews({error,data}){
        console.log('data' + data);
        if(data){
        this.userReviews = data;
        console.log('userReviews' + JSON.stringify(this.userReviews));
        this.noReviews = false;
        }else{
             this.noReviews = true;
        }
    }

    @wire(getUserReview,{id:'$userId', prodId:'$recordId'})
    userReview({error,data}){
        if(data){
            this.userReview = data[0];   
            console.log('userReview' + JSON.stringify(this.userReview));
            this.reviewId=data[0].Id;
            console.log('reviewId' + this.reviewId);
        }
    }

    @wire(getAvgRating,{id:'$recordId'})
    avgRating(result){
        if(result){
            this.rating = result.data * 20;
            console.log('this.rating:', this.rating);
        }else{
            this.rating = 0;
        }
        
    }

    incQuantity() {
        this.quantity++;
    }

    decQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }
    @track type='';
    @track message = '';
    @track messageIsHtml=false;
    @track showToastBar = false;
    @api autoCloseTime = 5000;
    @track icon='utility:success';

    @api
    showToast(type, message,icon,time) {
        this.type = type;
        this.message = message;
        this.icon=icon;
        this.autoCloseTime=time;
        this.showToastBar = true;
        setTimeout(() => {
            this.closeModel();
        }, this.autoCloseTime);
    }
    
    closeModel() {
        this.showToastBar = false;
        this.type = '';
        this.message = '';
    }

    addItemToCart(){
        this.cartItemCount++;
        const load = {
            item : this.wiredRecords.data,
            cartItemCount : this.cartItemCount,
            itemCount: this.quantity
        };
        this.sendMessageService(load);
        this.showToast('success','<strong>Item added to cart<strong/>','utility:success',3000);
    }
    

    sendMessageService(load) {
        publish(this.messageContext, cartChannel, load);
    }

    get getIconName() {
        if(this.icon)
        {
            return this.icon;
        }
        return 'utility:' + this.type;
    }
 
    get innerClass() {
        return 'slds-icon_container slds-icon-utility-' + this.type + ' slds-m-right_small slds-no-flex slds-align-top';
    }
 
    get outerClass() {
        return 'slds-notify slds-notify_toast slds-theme_' + this.type;
    }

    get name() {
        return this.wiredRecords.data ? getSObjectValue(this.wiredRecords.data, NAME_FIELD) : '';
    }
    get family() {
        return this.wiredRecords.data ? getSObjectValue(this.wiredRecords.data, FAMILY_FIELD) : '';
    }
    get desc() {
        return this.wiredRecords.data ? getSObjectValue(this.wiredRecords.data, DESC_FIELD) : '';
    }
    get comp() {
        return this.wiredRecords.data ? getSObjectValue(this.wiredRecords.data, COMP) : '';
    }
    get rmd_use() {
        return this.wiredRecords.data ? getSObjectValue(this.wiredRecords.data, RCM_USE) : '';
    }
    get img() {
        return this.wiredRecords.data ? getSObjectValue(this.wiredRecords.data, IMG_FIELD) : '';
    }
    get details_img() {
        return this.wiredRecords.data ? getSObjectValue(this.wiredRecords.data, DETAILS_IMG_FIELD) : '';
    }
    get price() {
        return this.wiredRecords.data ? this.quantity * getSObjectValue(this.wiredRecords.data, PRICE_FIELD) : '';
    }
    @track isModalOpen = false;
    openModal() {
        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
    }
    submitDetails() {
        this.isModalOpen = false;
    }
    value = 'inProgress';
    newrating = 0;
    get options() {
        return [
            { label: '1 - Bad', value: 1 },
            { label: '2 - Not so bad', value: 2 },
            { label: '3 - Would recommend', value: 3 },
            { label: '4 - Highly recommend', value: 4 },
            { label: '5 - Amazing', value: 5 }
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
        this.newrating = event.detail.value;
        console.log(this.newrating);
    }
    handleSubmit(event){
        event.preventDefault();
        this.isModalOpen = false;
        const fields = event.detail.fields;
        this.showToast('success','<strong>Added your rating <strong/>','utility:success',3000);
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
    handleSucess(event){
        const updatedRecord = event.detail.id;
        console.log('onsuccess: ', updatedRecord);
     }

}