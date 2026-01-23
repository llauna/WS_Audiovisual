import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Evento } from '../model/evento';

interface CalendarCell {
  date: Date | null;      // null = hueco
  isoDate: string | null; // YYYY-MM-DD
  dayNumber: number | null;
}

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="eventos-container">
      <header class="section-header">
        <div>
          <h2>📅 Agenda de Eventos</h2>
          <p class="muted">Vista mensual (persistente en MongoDB)</p>
        </div>

        <div class="header-actions">
          <button class="btn-primary" (click)="addQuickEvent()">+ Nuevo Evento</button>
        </div>
      </header>

      <div class="calendar-layout">
        <aside class="event-sidebar card">
          <h3>Próximos 7 días</h3>

          <div class="mini-event-list" *ngIf="upcoming7.length > 0; else noUpcoming">
            <div class="mini-event-item" *ngFor="let e of upcoming7">
              <span class="date">{{ formatShortDayMonth(e.fecha) }}</span>
              <div class="info">
                <strong>{{ e.titulo }}</strong>
                <small *ngIf="e.ubicacion">📍 {{ e.ubicacion }}</small>
                <small *ngIf="!e.ubicacion" class="muted">Sin ubicación</small>
              </div>
              <button class="mini-delete" title="Eliminar" (click)="deleteEvento(e.id)">×</button>
            </div>
          </div>

          <ng-template #noUpcoming>
            <p class="muted">No hay eventos en los próximos 7 días.</p>
          </ng-template>
        </aside>

        <main class="calendar-main card">
          <div class="calendar-header">
            <button class="btn-nav" (click)="prevMonth()">‹</button>
            <h3>{{ monthLabel }}</h3>
            <button class="btn-nav" (click)="nextMonth()">›</button>
          </div>

          <div class="calendar-grid">
            <div class="day-name" *ngFor="let day of dayNames">{{ day }}</div>

            <div
              class="day"
              *ngFor="let cell of calendarCells"
              [class.empty]="!cell.date"
              [class.today]="cell.isoDate === todayIso"
            >
              <span class="day-number" *ngIf="cell.dayNumber">{{ cell.dayNumber }}</span>

              <ng-container *ngIf="cell.isoDate">
                <div
                  class="event-tag"
                  *ngFor="let ev of eventosByDate(cell.isoDate)"
                  [class.blue]="ev.color==='blue'"
                  [class.orange]="ev.color==='orange'"
                  [class.green]="ev.color==='green'"
                  [class.purple]="ev.color==='purple'"
                >
                  <span class="event-title" title="{{ ev.titulo }}">{{ ev.titulo }}</span>
                  <button class="event-delete" title="Eliminar" (click)="deleteEvento(ev.id)">×</button>
                </div>
              </ng-container>
            </div>
          </div>

          <div class="legend">
            <span class="pill blue">Evento</span>
            <span class="pill orange">Montaje</span>
            <span class="pill green">Ensayo</span>
            <span class="pill purple">Otro</span>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .eventos-container { padding: 2rem; max-width: 1400px; margin: 0 auto; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .muted { color: #7a7a7a; margin: 0.25rem 0 0; }

    .calendar-layout { display: grid; grid-template-columns: 320px 1fr; gap: 2rem; }
    .card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }

    .calendar-header { display: flex; justify-content: center; align-items: center; gap: 2rem; margin-bottom: 1.5rem; }
    .btn-nav { width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; font-size: 18px; }
    .btn-nav:hover { background: #f7f7f7; }

    .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); border: 1px solid #eee; border-radius: 10px; overflow: hidden; }
    .day-name { padding: 10px; text-align: center; background: #f8f9fa; font-weight: 600; border-right: 1px solid #eee; }
    .day-name:last-child { border-right: none; }

    .day { min-height: 110px; padding: 8px; border-top: 1px solid #eee; border-right: 1px solid #eee; position: relative; background: #fff; }
    .day:nth-child(7n) { border-right: none; }
    .day.empty { background: #fcfcfc; }
    .day.today { outline: 2px solid rgba(46, 134, 222, 0.35); outline-offset: -2px; }

    .day-number { font-size: 0.85rem; color: #666; font-weight: 600; }

    .event-tag {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      font-size: 0.75rem;
      padding: 3px 6px;
      border-radius: 6px;
      margin-top: 6px;
      color: white;
    }
    .event-title { display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px; }
    .event-delete {
      border: none;
      background: rgba(255,255,255,0.2);
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 6px;
      cursor: pointer;
      line-height: 18px;
      padding: 0;
    }
    .event-delete:hover { background: rgba(255,255,255,0.35); }

    .blue { background: #3498db; }
    .orange { background: #e67e22; }
    .green { background: #27ae60; }
    .purple { background: #8e44ad; }

    .mini-event-item { display: grid; grid-template-columns: auto 1fr auto; gap: 10px; margin-top: 1rem; padding-bottom: 10px; border-bottom: 1px solid #eee; align-items: center; }
    .mini-event-item .date { background: #f0f3f5; padding: 6px 8px; border-radius: 8px; font-weight: 700; font-size: 0.8rem; }
    .mini-delete {
      border: 1px solid #e5e7eb;
      background: #fff;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 18px;
      line-height: 20px;
    }
    .mini-delete:hover { background: #f7f7f7; }

    .btn-primary { background: #2c3e50; color: white; border: none; padding: 0.8rem 1.2rem; border-radius: 10px; cursor: pointer; }
    .btn-primary:hover { filter: brightness(1.05); }

    .legend { margin-top: 1.25rem; display: flex; gap: 8px; flex-wrap: wrap; }
    .pill { font-size: 0.75rem; padding: 4px 10px; border-radius: 999px; color: #fff; }
    .pill.blue { background: #3498db; }
    .pill.orange { background: #e67e22; }
    .pill.green { background: #27ae60; }
    .pill.purple { background: #8e44ad; }
  `]
})
export class EventosComponent {
  readonly dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  currentMonth = this.startOfMonth(new Date());
  todayIso = this.toIsoDate(new Date());

  eventos: Evento[] = [];

  constructor(private api: ApiService) {
    this.loadEventos();
  }

  loadEventos(): void {
    this.api.getEventos().subscribe({
      next: (data) => this.eventos = data ?? [],
      error: (e) => console.error('Error cargando eventos:', e)
    });
  }

  deleteEvento(id?: string): void {
    if (!id) return;
    this.api.deleteEvento(id).subscribe({
      next: () => this.loadEventos(),
      error: (e) => console.error('Error eliminando evento:', e)
    });
  }

  addQuickEvent(): void {
    console.log('CLICK + Nuevo Evento'); // <-- añade esto

    const fecha = this.toIsoDate(new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1));

    const nuevo: Evento = {
      titulo: 'Nuevo evento',
      ubicacion: 'Por definir',
      fecha,
      tipo: 'Otro',
      color: 'purple'
    };

    this.api.saveEvento(nuevo).subscribe({
      next: (saved) => {
        console.log('Evento guardado:', saved);
        this.loadEventos();
      },
      error: (e) => console.error('Error guardando evento:', e)
    });
  }

  eventosByDate(isoDate: string): Evento[] {
    return (this.eventos ?? [])
      .filter(e => e.fecha === isoDate)
      .sort((a, b) => (a.titulo ?? '').localeCompare(b.titulo ?? ''));
  }

  get monthLabel(): string {
    const m = this.currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    return m.charAt(0).toUpperCase() + m.slice(1);
  }

  get calendarCells(): CalendarCell[] {
    const y = this.currentMonth.getFullYear();
    const m = this.currentMonth.getMonth();

    const first = new Date(y, m, 1);
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstDayIdx = this.mondayIndex(first); // lunes=0..domingo=6

    const cells: CalendarCell[] = [];

    for (let i = 0; i < firstDayIdx; i++) {
      cells.push({ date: null, isoDate: null, dayNumber: null });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m, d);
      cells.push({ date, isoDate: this.toIsoDate(date), dayNumber: d });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ date: null, isoDate: null, dayNumber: null });
    }

    return cells;
  }

  prevMonth(): void {
    const y = this.currentMonth.getFullYear();
    const m = this.currentMonth.getMonth();
    this.currentMonth = this.startOfMonth(new Date(y, m - 1, 1));
  }

  nextMonth(): void {
    const y = this.currentMonth.getFullYear();
    const m = this.currentMonth.getMonth();
    this.currentMonth = this.startOfMonth(new Date(y, m + 1, 1));
  }

  get upcoming7(): Evento[] {
    const start = this.startOfDay(new Date());
    const end = this.addDays(start, 7);

    return (this.eventos ?? [])
      .filter(e => {
        const d = this.fromIsoDate(e.fecha);
        return d >= start && d < end;
      })
      .sort((a, b) => (a.fecha ?? '').localeCompare(b.fecha ?? ''));
  }

  formatShortDayMonth(isoDate: string): string {
    const d = this.fromIsoDate(isoDate);
    const day = String(d.getDate()).padStart(2, '0');
    const mon = d.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '');
    return `${day} ${mon}`;
  }

  private toIsoDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private fromIsoDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1);
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  private mondayIndex(date: Date): number {
    const js = date.getDay(); // 0..6 (Dom..Sáb)
    return (js + 6) % 7;
  }
}
