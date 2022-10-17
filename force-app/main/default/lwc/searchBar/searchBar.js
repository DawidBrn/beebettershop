import {LightningElement, wire, track} from 'lwc';
import { subscribe,publish, MessageContext } from 'lightning/messageService';
import beebetterChannel from '@salesforce/messageChannel/beebetterChannel__c';

export default class SearchBar extends LightningElement {
    @wire(MessageContext)
    messageContext;

    isLoading = false;
    searchTerm;
    handleLoading() {
        this.isLoading = true;
    }

    handleDoneLoading() {
        this.isLoading = false;
    }
    handleSearch(event) {
        this.searchTerm = event.target.value;
    }
    setSearchKey() {
        const value = {
            searchTerm : this.searchTerm
        };
        publish(this.messageContext, beebetterChannel, value);
    }
}