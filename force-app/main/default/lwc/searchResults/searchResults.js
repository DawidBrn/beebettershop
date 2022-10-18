import { LightningElement,track, api ,wire } from 'lwc';
import { subscribe,publish, MessageContext } from 'lightning/messageService';
import beebetterChannel from '@salesforce/messageChannel/beebetterChannel__c';
import searchByName from '@salesforce/apex/searchResultController.searchByName';
import getAllProducts from '@salesforce/apex/searchResultController.getAllProducts';

export default class SearchResults extends LightningElement {
    @track
    pricebookEntries;
    isLoading = false;

    subscription = null;

    @wire(MessageContext)
    messageContext;

    searchTerm;

    @api
    selectedProduct;

    @track
    emptyResults = false;

    connectedCallback() {
        this.subToMessageChannel();
    }

    subToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            beebetterChannel,
            (message) => this.handleMessage(message)
        );
    }
    handleMessage(message) {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.searchTerm = message.searchTerm;
    }
    @wire(searchByName,{
        term : '$searchTerm'
    })getProducts(result){
        this.pricebookEntries = result;
        this.notifyLoading(false);
    }

    notifyLoading(isLoading) {
        if (isLoading) {
            this.dispatchEvent(new CustomEvent('loading'));
        } else {
            this.dispatchEvent(new CustomEvent('doneloading'));
        }
    }
    updateSelectedTile(event) {
        this.selectedProduct = event.detail.prodId;
        this.sendMessageService(this.selectedProduct)
    }
    sendMessageService(prodId) {
        publish(this.messageContext, beebetterChannel, {recordId: prodId});
    }
}