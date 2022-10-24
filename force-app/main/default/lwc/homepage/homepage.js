import { LightningElement } from 'lwc';
import home from '@salesforce/label/c.Home_Button';
import aboutus from '@salesforce/label/c.About_Us_Button';
import products from '@salesforce/label/c.Product_Button';
import signin from '@salesforce/label/c.Sign_in_Button';

export default class Homepage extends LightningElement {

    label = {
        home,
        aboutus,
        products,
        signin
    };
}