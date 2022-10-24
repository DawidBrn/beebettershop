import { LightningElement,api,wire,track } from 'lwc';
import cartChannel from '@salesforce/messageChannel/cartChannel__c';
import { subscribe, publish , MessageContext } from 'lightning/messageService';

import Id from '@salesforce/user/Id';
import pricebookId from '@salesforce/apex/cartController.getActivePriceBookId';
import getUserOrder from '@salesforce/apex/cartController.getUserOrder';
import getUserOrderItems from '@salesforce/apex/cartController.getOrderItems';
import getUserAccountId from '@salesforce/apex/cartController.getAccountId';
import setOrderItems from '@salesforce/apex/cartController.setOrderItem';

export default class ProductCart extends LightningElement {

subscription = null;

pricebookentry;
itemCount;
cartItemCount;

activePricebook;
@track
userId;
orderId;
accountId;

@wire(MessageContext)
messageContext;

connectedCallback() {
this.userId = Id;
pricebookId()
    .then((result) => {
    this.activePricebook = result;
    })
    .catch((error) => {
    this.error = error;
    });

this.subscribeFromMessageChannel();
}
subscribeFromMessageChannel() {
    if (!this.subscription) {
    this.subscription = subscribe(
    this.messageContext,
    cartChannel,
    (message) => this.handleMessage(message));
    }
}
handleMessage(message){
    this.pricebookentry = message.item;
    console.log('pricebookentry : ' + JSON.stringify(this.pricebookentry));
    this.itemCount = message.itemCount;
    console.log('itemCount : ' + this.itemCount);
    this.cartItemCount = message.cartItemCount;
    console.log('cartItemCount : ' + this.cartItemCount);
}

@wire(getUserAccountId,{userId: '$userId'})
getAccountId(result){
    if (result.data !== undefined) {
        this.userAccount = result.data;
    }
    console.log('userAccountId:', this.userAccount);
}
@wire(getUserOrder,{userId: '$userId'})
getAccountId(result){
    if (result.data !== undefined) {
        this.orderId = result.data;
    }
    console.log('orderId:', this.orderId);
}

}