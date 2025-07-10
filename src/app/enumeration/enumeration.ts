export enum EnumSiNo {
    S = 'S',
    N = 'N'
}

export enum EnumTipoCaja {
    EB = 'EB',
    QB = 'QB',
    HB = 'HB'
}

export enum EnumSinDatos {
    NOTDATA = 'SIN DATOS'
}

export enum EnumPagina {
    HUB = 'HUB',
    STA = 'STADING'
}

export enum EnumRutaPagina {
    HUB = '/checkout',
    STA = '/checkout/standing'
}

export enum EnumMensajes {
    EMPTY = '',
    // TROPICAL = 'WE WILL NOTICES YOU WHEN THE TROPICAL FLOWERS WILL BE SHIPPED IF YOU ADDED SOMETHING TO THE CART',
    TROPICAL = 'Tropical flowers will be shipped directly from the farm to your door.',
    TRUCKING = 'TRUCKING',
    PASSWORDNOTEQUAL = 'Passwords are not equal',
    NEWCUSTOMERADD = 'Thank you for adding a new shiny customer! We will rapidly work on adding this information in our system for them to start buying.',
    USEREXITS = 'Error: User already exists',
    NOCONNECTSERVER = 'Error: Could not connect to server, try later',
    REQUIREDFIELDS = 'Error: Fill in the required fields',
    QUESTIONUPDATE = 'Please confirm if you want to update this information.',
    UPDATESUCCESS = 'Custumer updated successfully',
    ERRORSERVER = 'Error: Could not connect to server, try later',
    QUESTIONDELETE = 'Are you sure you want to delete this client?',
    DELETESUCCESS = 'Custumer deleted successfully',
    CUSTOMERINFO = 'CUSTOMER INFORMATION',
    NEWCUSTOMER = "NEW CLIENT FORM",
    DELETECLIENTE = "Are you sure you want to delete this box ?",
    MESSAGETITLE = "Items inside your Mix Box",
    // ORDERECEIVED = "Your order has been received",
    //ORDERECEIVED = 'Your order will be reviewed and processed shortly.',
    ORDERECEIVED = 'Your order will be reviewed and processed shortly. Sit back and relax we will reach out to you if we have questions',
    ORDERECEIVED2='Sit back and relax we will reach out to you if we have questions',
    PENDINGORDERHUB = 'You have a pending "Standing Order" waiting to check out',
    PENDINGORDERSTADING = 'You have a pending "Store" waiting to check out',
    NOTITEMSPROMO = 'There are not items on promo',
    URLJSONPRODUCTS = 'texto.json',
    PRODUCTBLOCKED = 'To buy this item, please contact your sales representative. Thank you',
    INFOSUCCESS = 'Your information has been updated!',
    FILENOTIMAGE = 'The selected file is not an image ',
    QUESTIONDELETECARRIER = 'Are you sure you want to delete this carrier?',
}

export enum EnumAccion {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    U = 'U',
    C = 'C'
}

export enum EnumCodigoCamion {
    ARM = 'ARM',
    FDX = 'FDX',
    FBE = 'FBE',
    PRT = 'PRT'
}

export enum EnumTipoPersona {
    CLIENTE = 'CLIENTE',
    SUBCLIENTE = 'SUBCLIENTE'
}