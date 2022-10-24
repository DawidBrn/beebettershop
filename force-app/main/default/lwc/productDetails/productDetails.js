import { LightningElement,api,track,wire } from 'lwc';
import { getSObjectValue } from '@salesforce/apex';
import beebetterChannel from '@salesforce/messageChannel/beebetterChannel__c';
import cartChannel from '@salesforce/messageChannel/cartChannel__c';
import { subscribe, publish , MessageContext } from 'lightning/messageService';
import getProductById from '@salesforce/apex/searchResultController.getProductById';
import { CurrentPageReference } from 'lightning/navigation';
import getPictureUrl from '@salesforce/apex/searchResultController.getPictureUrl';

import NAME_FIELD from '@salesforce/schema/PricebookEntry.Product2.Name';
import FAMILY_FIELD from '@salesforce/schema/PricebookEntry.Product2.Family';
import DESC_FIELD from '@salesforce/schema/PricebookEntry.Product2.Description';
import IMG_FIELD from '@salesforce/schema/PricebookEntry.Product2.DisplayUrl';
import DETAILS_IMG_FIELD from '@salesforce/schema/PricebookEntry.Product2.Details_URL__c';
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

    @track isLoading = false;

    handleLoading() {
        this.isLoading = true;
    }

   handleDoneLoading() {
    this.isLoading = false;
   }
    recordId;
    sellingPrice;
    quantity = 1;
    pricebookentry;
    cartItemCount = 1;
    
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

    connectedCallback()
    {
        this.recordId=this.recordIdFromState;
    }

    get recordIdState(){
        return this.recordId;
    }
    
    @wire(getProductById,{recordId: '$recordId'})
    wiredRecords;

    incQuantity() {
        this.quantity++;
    }

    decQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    addItemToCart(){
        this.cartItemCount++;
        console.log('data:', this.wiredRecords.data);
        const load = {
            item : this.wiredRecords.data,
            cartItemCount : this.cartItemCount,
            itemCount: this.quantity
        };
        console.log('wysyłanie - detailsLoad:')
        console.log(JSON.stringify(load));
        this.sendMessageService(load);
    }

    sendMessageService(load) {
        publish(this.messageContext, cartChannel, load);
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
    get img() {
        return this.wiredRecords.data ? getSObjectValue(this.wiredRecords.data, IMG_FIELD) : '';
    }
    get details_img() {
        return this.wiredRecords.data ? getSObjectValue(this.wiredRecords.data, DETAILS_IMG_FIELD) : '';
    }
    get price() {
        return this.wiredRecords.data ? this.quantity * getSObjectValue(this.wiredRecords.data, PRICE_FIELD) : '';
    }

}