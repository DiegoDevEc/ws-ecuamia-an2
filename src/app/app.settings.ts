import { Injectable } from '@angular/core';

var color:string = "green"

export class Settings {
    constructor(public name: string,
                public theme: string) {
                    color = theme
                 }
}

@Injectable()
export class AppSettings {
    public settings = new Settings(
        'EcuamiaFlowers',  // theme name
        color     // green, blue, red, pink, purple, grey
    );
}
