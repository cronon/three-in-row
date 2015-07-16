declare module Backbone {
    export class Model {
        constructor (attr?: any, opts?: any);
        get(name: string): any;
        set(name: string, val: any): void;
        set(obj: any): void;
        save(attr?: any, opts?: any): void;
        destroy(): void;
        bind(ev: string, f: Function, ctx?: any): void;
        toJSON(): any;
    }
    export class Collection {
        constructor (models?, opts?);
        bind(ev: string, f: Function, ctx?): void;
        collection: Model;
        length: number;
        create(attrs: any, opts? ): Collection;
        each(f: (elem: any) => void ): void;
        fetch(opts?: any): void;
        last(): any;
        last(n: number): any[];
        filter(f: (elem: any) => any): Collection;
        without(...values: any[]): Collection;
    }
    export class View {
        constructor (options?: any);
        $(selector: string): any;
        el: HTMLElement;
        $el: any;
        model: Model;
        remove(): void;
        delegateEvents: any;
        make(tagName: string, attrs?: any, opts?: any): View;
        setElement(element: HTMLElement, delegate?: boolean): void;
        tagName: string;
        events: any;

        static extend: any;
    }
}
declare module 'backbone' {
    export = Backbone
}