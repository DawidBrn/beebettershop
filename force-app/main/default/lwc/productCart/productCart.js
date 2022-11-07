import { LightningElement,api,wire,track } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import cartChannel from '@salesforce/messageChannel/cartChannel__c';
import { subscribe, publish , MessageContext } from 'lightning/messageService';

import uid from '@salesforce/user/Id';
import isGuest from '@salesforce/user/isGuest';
import pricebookId from '@salesforce/apex/cartController.getActivePriceBookId';
import getUserOrder from '@salesforce/apex/cartController.getUserOrder';
import getUserOrderItems from '@salesforce/apex/cartController.getOrderItems';
import getUserAccountId from '@salesforce/apex/cartController.getAccountId';
import setOrderItems from '@salesforce/apex/cartController.setOrderItem';

export default class ProductCart extends NavigationMixin(LightningElement) {

subscription = null;
isGuestUser = isGuest;

pricebookentry;
itemCount;
cartItemCount;
cartFlag = false;
orderItems = [];

activePricebook;
userorderId;
useraccountId;
@track
userId;

@wire(MessageContext)
messageContext;

connectedCallback() {
this.userId = uid;
this.cartFlag = false;

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
    this.itemCount = message.itemCount;
    this.createOrderItem();
}

createOrderItem() {
    setOrderItems({
        orderId: this.userorderId,
        record: this.pricebookentry,
        quantity: this.itemCount,
        items: this.orderItems,
    })
        .then((result) => {

        })
        .catch((error) => {
            this.error = error;
        });
}

@wire(getUserOrderItems,{orderId : '$userorderId'})
getItems(result){
    if(result.data !== undefined){
        this.cartItemCount = result.data.length;
        this.orderItems = result.data;
        if(this.cartItemCount !== 0 ){
            this.cartFlag = true;
        }
    }
}

@wire(getUserAccountId,{userId: '$userId'})
getAccountId(result){
    if (result.data !== undefined) {
        this.userAccount = result.data;
    }
}

@wire(getUserOrder,{userId: '$userId'})
getUserOrderId(result){
    if (result.data !== undefined) {
        this.userorderId = result.data;
    }
}
goToCart() {
    this[NavigationMixin.GenerateUrl]({
        type: 'standard__webPage',
        attributes: {
            url: 'https://beebetter-dev-ed.develop.my.site.com/s/cart?recordId=' + this.userorderId
        }
    }).then(generatedUrl => {
        window.open(generatedUrl,"_self");
    });
  }

}