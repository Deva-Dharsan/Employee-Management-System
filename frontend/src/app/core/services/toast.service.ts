import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ConfirmDialog {
  id: number;
  message: string;
  resolve: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;

  // --- Toasts ---
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  private show(message: string, type: ToastType, duration = 3500): void {
    const id = ++this.counter;
    const toast: Toast = { id, message, type, duration };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string, duration?: number): void { this.show(message, 'success', duration); }
  error(message: string, duration?: number): void   { this.show(message, 'error', duration ?? 5000); }
  warning(message: string, duration?: number): void { this.show(message, 'warning', duration); }
  info(message: string, duration?: number): void    { this.show(message, 'info', duration); }

  dismiss(id: number): void {
    this.toastsSubject.next(this.toastsSubject.value.filter((t) => t.id !== id));
  }

  // --- Confirm Dialogs ---
  private confirmSubject = new BehaviorSubject<ConfirmDialog | null>(null);
  confirm$ = this.confirmSubject.asObservable();

  confirm(message: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const id = ++this.counter;
      this.confirmSubject.next({ id, message, resolve });
    });
  }

  resolveConfirm(value: boolean): void {
    const current = this.confirmSubject.value;
    if (current) {
      current.resolve(value);
      this.confirmSubject.next(null);
    }
  }
}
