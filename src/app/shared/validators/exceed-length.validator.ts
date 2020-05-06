import { FormGroup } from '@angular/forms';

export function ExceededLength(controlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];

        if (new String(control.value).length > 255) {
          control.setErrors({ exceededLength: true });
        } else {
          control.setErrors(null);
        }
    }
}
