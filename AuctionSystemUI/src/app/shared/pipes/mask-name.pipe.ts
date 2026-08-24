import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskName',
  standalone: true
})
export class MaskNamePipe implements PipeTransform {
  transform(name?: string): string {
    if (!name) return 'Ẩn danh';
    return name;
  }
}
