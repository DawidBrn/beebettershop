import {LightningElement, wire, track} from 'lwc';
import { subscribe,publish, MessageContext } from 'lightning/messageService';
import beebetterChannel from '@salesforce/messageChannel/beebetterChannel__c';


import search from '@salesforce/label/c.Search_button';

export default class SearchBar extends LightningElement {

    label = {
        search,
    };

    @wire(MessageContext)
    messageContext;

    isLoading = false;
    searchTerm = '';
    handleLoading() {
        this.isLoading = true;
    }

    handleDoneLoading() {
        this.isLoading = false;
    }
    handleSearch(event) {
        this.searchTerm = event.target.value;
    }
    setSearch() {
        const prod = {
            searchQuery : this.searchTerm
        };
        publish(this.messageContext, beebetterChannel, prod);
    }
}