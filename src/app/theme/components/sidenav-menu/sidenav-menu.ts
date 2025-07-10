import { SidenavMenu } from './sidenav-menu.model';

var data: any
var sidenavMenuItemsValue
data = JSON.parse(localStorage.getItem("Usuario"));

if (data != null) {
    if (data.codigoClientePadre != null || data.codigoClientePadre != undefined) {
        const sidenavMenuItemsValueLocal = [
            new SidenavMenu(1, 'Home', '/home', null, null, false, 0),
            //new SidenavMenu(1, 'Promo', '/promo', null, null, false, 0),
           // new SidenavMenu(1, 'Stading Orders', '/stading', null, null, false, 0),
           // new SidenavMenu(1, 'Combo Box', '/comboBox', null, null, false, 0),
            //new SidenavMenu(1, 'Rose Mixer', '/queryRoses', null, null, false, 0),
            new SidenavMenu(1, 'Orders Status', '/account/orders', null, null, false, 0),
            new SidenavMenu(1, 'Settings', '/account/dashboard', null, null, false, 0),//or true for dropdown
        ]
        sidenavMenuItemsValue = sidenavMenuItemsValueLocal
    }
    else {
        const sidenavMenuItemsValueLocal = [
            new SidenavMenu(1, 'Home', '/home', null, null, false, 0),
            //new SidenavMenu(1, 'Promo', '/promo', null, null, false, 0),
          //  new SidenavMenu(1, 'Stading Orders', '/stading', null, null, false, 0),
           // new SidenavMenu(1, 'Combo Box', '/comboBox', null, null, false, 0),
            //new SidenavMenu(1, 'Rose Mixer', '/queryRoses', null, null, false, 0),
            new SidenavMenu(1, 'Customer', '/account/mycustomers', null, null, false, 0),
            new SidenavMenu(1, 'Orders Status', '/account/orders', null, null, false, 0),
            new SidenavMenu(1, 'Billing', '/account/files', null, null, false, 0),
            new SidenavMenu(1, 'Settings', '/account/dashboard', null, null, false, 0),//or true for dropdown
        ]
        sidenavMenuItemsValue = sidenavMenuItemsValueLocal
    }
}
else{
    const sidenavMenuItemsValueLocal = [
        new SidenavMenu(1, 'Home', '/home', null, null, false, 0),
        //new SidenavMenu(1, 'Promo', '/promo', null, null, false, 0),
      //  new SidenavMenu(1, 'Stading Orders', '/stading', null, null, false, 0),
      //  new SidenavMenu(1, 'Combo Box', '/comboBox', null, null, false, 0),
        //new SidenavMenu(1, 'Rose Mixer', '/queryRoses', null, null, false, 0),
        new SidenavMenu(1, 'Customer', '/account/mycustomers', null, null, false, 0),
        new SidenavMenu(1, 'Orders Status', '/account/orders', null, null, false, 0),
        new SidenavMenu(1, 'Billing', '/account/files', null, null, false, 0),
        new SidenavMenu(1, 'Settings', '/account/dashboard', null, null, false, 0),//or true for dropdown
    ]
    sidenavMenuItemsValue = sidenavMenuItemsValueLocal
}



export const sidenavMenuItems = sidenavMenuItemsValue;




