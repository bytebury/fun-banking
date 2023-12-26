import { Pipe, type PipeTransform } from '@angular/core';
import { marked } from 'marked';

@Pipe({
  name: 'markdown',
  standalone: true,
})
export class MarkdownPipe implements PipeTransform {
  transform(value: string): string {
    marked.setOptions({ async: false, gfm: true, breaks: true });
    return marked(value) as string;
  }
}
