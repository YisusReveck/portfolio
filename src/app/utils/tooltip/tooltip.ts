import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ElementRef,
  HostListener,
  OnDestroy,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface TooltipPosition {
  top: number;
  left: number;
  arrowLeft: number;
  placement: 'top' | 'bottom';
}

@Component({
  selector: 'app-tooltip',
  imports: [CommonModule],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
})
export class Tooltip implements OnDestroy {
  @Input({ required: true }) text = '';
  @Input() placement: 'top' | 'bottom' | 'auto' = 'auto';
  @Input() gap = 10; // px entre el host y el tooltip

  private el = inject(ElementRef);

  visible = signal(false);
  pos = signal<TooltipPosition>({ top: 0, left: 0, arrowLeft: 50, placement: 'top' });

  // Expuesto al template
  resolvedPlacement = computed(() => this.pos().placement);

  @HostListener('mouseenter')
  show() {
    this.pos.set(this.calculatePosition());
    this.visible.set(true);
  }

  @HostListener('mouseleave')
  hide() {
    this.visible.set(false);
  }

  @HostListener('focusin')
  onFocus() {
    this.show();
  }

  @HostListener('focusout')
  onBlur() {
    this.hide();
  }

  ngOnDestroy() {
    this.hide();
  }

  private calculatePosition(): TooltipPosition {
    const hostRect = this.el.nativeElement.getBoundingClientRect();

    // Decidir placement
    const spaceAbove = hostRect.top;
    const spaceBelow = window.innerHeight - hostRect.bottom;
    const resolvedPlacement =
      this.placement !== 'auto' ? this.placement : spaceAbove >= spaceBelow ? 'top' : 'bottom';

    const centerX = hostRect.left + hostRect.width / 2;

    let top: number;
    if (resolvedPlacement === 'top') {
      // Se calculará con CSS usando la altura del tooltip, aproximamos
      top = hostRect.top - this.gap;
    } else {
      top = hostRect.bottom + this.gap;
    }

    return {
      top,
      left: centerX,
      arrowLeft: 50, // siempre centrado sobre el host
      placement: resolvedPlacement,
    };
  }
}
