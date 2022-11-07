import { LightningElement } from 'lwc';
import isGuest from '@salesforce/user/isGuest';

import home from '@salesforce/label/c.Home_Button';
import aboutus from '@salesforce/label/c.About_Us_Button';
import products from '@salesforce/label/c.Product_Button';
import signin from '@salesforce/label/c.Sign_in_Button';
import signout from '@salesforce/label/c.Sign_Out_Button';
import signup from '@salesforce/label/c.Sign_Up_Button';
import orders from '@salesforce/label/c.Orders';

export default class Homepage extends LightningElement {

    isGuestUser = isGuest;

    label = {
        home,
        aboutus,
        products,
        signin,
        signout,
        signup,
        orders
    };
}