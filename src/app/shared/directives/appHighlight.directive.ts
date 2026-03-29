import { Directive, ElementRef, HostListener, Input, Renderer2 } from "@angular/core";

@Directive({
    selector: '[appHighlights]',
    standalone: true
})
export class AppHighlights {
    @Input() appHighlight: string = '#f5f5f5';

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    @HostListener('mouseenter')
    onMouseEnter() {
        console.log('testEnter');

        this.el.nativeElement.style.backgroundColor = this.appHighlight;
    }
    @HostListener('mouseleave')
    onMouseLeave() {
        console.log('testOut');
        this.el.nativeElement.style.backgroundColor = '';
    }
}