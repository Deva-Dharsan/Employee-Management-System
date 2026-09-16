import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast, ConfirmDialog } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Toast Notifications -->
    <div class="toast-container" aria-live="polite" aria-atomic="false">
      @for (toast of toasts; track trackById($index, toast)) {
        <div class="toast toast-{{ toast.type }}" role="alert">
          <span class="toast-icon">{{ iconFor(toast.type) }}</span>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="dismiss(toast.id)" aria-label="Close">✕</button>
        </div>
      }
    </div>

    <!-- Confirm Dialog -->
    @if (confirmDialog) {
      <div class="confirm-backdrop" (click)="onBackdropClick($event)">
        <div class="confirm-card" role="dialog" aria-modal="true">
          <div class="confirm-icon-wrap">⚠️</div>
          <h3 class="confirm-title">Confirm Action</h3>
          <p class="confirm-message">{{ confirmDialog.message }}</p>
          <div class="confirm-actions">
            <button class="confirm-btn cancel-btn" (click)="answer(false)">Cancel</button>
            <button class="confirm-btn ok-btn" (click)="answer(true)">Confirm</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    /* ===== TOAST ===== */
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
      max-width: 420px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 14px;
      font-family: 'Inter', 'Segoe UI', sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
      pointer-events: all;
      animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
      min-width: 280px;
      max-width: 420px;
      border: 1px solid transparent;
    }

    @keyframes toastIn {
      from { opacity: 0; transform: translateX(60px) scale(0.92); }
      to   { opacity: 1; transform: translateX(0) scale(1); }
    }

    .toast-success { background: linear-gradient(135deg,#f0fdf4,#dcfce7); border-color: rgba(34,197,94,0.25); color: #065f46; }
    .toast-error   { background: linear-gradient(135deg,#fef2f2,#fee2e2); border-color: rgba(239,68,68,0.25); color: #991b1b; }
    .toast-warning { background: linear-gradient(135deg,#fffbeb,#fef3c7); border-color: rgba(245,158,11,0.25); color: #92400e; }
    .toast-info    { background: linear-gradient(135deg,#eff6ff,#dbeafe); border-color: rgba(59,130,246,0.25); color: #1e40af; }

    .toast-icon { font-size: 1.1rem; flex-shrink: 0; line-height: 1; }
    .toast-message { flex: 1; line-height: 1.4; }

    .toast-close {
      background: none; border: none; cursor: pointer;
      padding: 2px 5px; border-radius: 6px;
      font-size: 0.78rem; opacity: 0.55;
      transition: opacity 0.2s, background 0.2s;
      color: inherit; flex-shrink: 0; line-height: 1;
    }
    .toast-close:hover { opacity: 1; background: rgba(0,0,0,0.07); }

    /* ===== CONFIRM DIALOG ===== */
    .confirm-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(10, 20, 40, 0.55);
      backdrop-filter: blur(6px);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease both;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .confirm-card {
      background: #ffffff;
      border-radius: 22px;
      padding: 36px 32px 28px;
      max-width: 420px;
      width: 90%;
      box-shadow:
        0 24px 64px rgba(10,20,40,0.22),
        0 8px 24px rgba(10,20,40,0.12);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      animation: cardIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    @keyframes cardIn {
      from { opacity: 0; transform: scale(0.88) translateY(20px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    .confirm-icon-wrap {
      font-size: 2.5rem;
      width: 68px;
      height: 68px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #fef3c7, #fffbeb);
      border-radius: 50%;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.2);
      margin-bottom: 4px;
    }

    .confirm-title {
      font-size: 1.2rem;
      font-weight: 800;
      color: #0d1f35;
      margin: 0;
      letter-spacing: -0.2px;
    }

    .confirm-message {
      font-size: 0.92rem;
      color: #5170a0;
      margin: 0;
      text-align: center;
      line-height: 1.55;
      max-width: 320px;
    }

    .confirm-actions {
      display: flex;
      gap: 12px;
      margin-top: 8px;
      width: 100%;
    }

    .confirm-btn {
      flex: 1;
      padding: 11px 20px;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.22s ease;
      font-family: inherit;
    }

    .cancel-btn {
      background: #f1f5f9;
      color: #475569;
      border: 1.5px solid #e2e8f0;
    }
    .cancel-btn:hover {
      background: #e2e8f0;
      transform: translateY(-1px);
    }

    .ok-btn {
      background: linear-gradient(135deg, #dc2626, #ef4444);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(220,38,38,0.3);
    }
    .ok-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(220,38,38,0.38);
    }
  `]
})
export class ToastContainerComponent implements OnInit {
  private toastSvc = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  
  toasts: Toast[] = [];
  confirmDialog: ConfirmDialog | null = null;

  ngOnInit(): void {
    this.toastSvc.toasts$.subscribe((t) => { 
      this.toasts = t; 
      this.cdr.detectChanges(); 
    });
    this.toastSvc.confirm$.subscribe((d) => { 
      this.confirmDialog = d; 
      this.cdr.detectChanges(); 
    });
  }

  dismiss(id: number): void { this.toastSvc.dismiss(id); }

  answer(value: boolean): void { this.toastSvc.resolveConfirm(value); }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('confirm-backdrop')) {
      this.toastSvc.resolveConfirm(false);
    }
  }

  trackById(index: number, t: Toast): number { return t.id; }

  iconFor(type: string): string {
    const map: Record<string, string> = {
      success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️',
    };
    return map[type] || 'ℹ️';
  }
}
