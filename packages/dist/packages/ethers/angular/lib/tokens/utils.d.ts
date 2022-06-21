import { FormControl } from "@angular/forms";
export declare type ToFormControls<T> = {
    [K in keyof T]: FormControl<T[K] | null | undefined>;
};
