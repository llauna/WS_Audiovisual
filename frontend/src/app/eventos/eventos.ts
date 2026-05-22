import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Evento, EventoMaterial, EventoTecnico } from '../model/evento';
import { Material } from '../model/material';
import { Personal } from '../model/personal';
import { Cliente } from '../model/cliente';
import { RegistroHoras } from '../model/registro-horas';
import { NotaGasto } from '../model/nota-gasto';
import { PresupuestoResumen } from '../services/api.service';

interface CalendarCell {
  date: Date | null;      // null = hueco
  isoDate: string | null; // YYYY-MM-DD
  dayNumber: number | null;
}

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="eventos-container">
      <header class="section-header">
        <div>
          <!-- Title moved to sidebar -->
        </div>
      </header>

      <div class="calendar-layout">
        <aside class="event-sidebar card">
          <div class="sidebar-header">
            <h2>Agenda de Eventos</h2>
            <h4>Pr&oacute;ximos 7 d&iacute;as</h4>
            <div class="sidebar-actions">
              <a class="btn-secondary" routerLink="/dashboard">Inicio</a>
              <button class="btn-primary" (click)="openNewEventModal()">+ Nuevo Evento</button>
            </div>
          </div>

          <div class="mini-event-list" *ngIf="upcoming7.length > 0; else noUpcoming">
            <div class="mini-event-item" *ngFor="let e of upcoming7" (click)="openEditEvent(e)">
              <span class="date">{{ formatShortDayMonth(e.fecha) }}</span>
              <div class="info">
                <strong>{{ e.titulo }}</strong>
                <small *ngIf="e.ubicacion">{{ e.ubicacion }}</small>
                <small *ngIf="!e.ubicacion" class="muted">Sin ubicaci&oacute;n</small>
              </div>
              <button class="mini-edit" title="Editar" (click)="$event.stopPropagation(); openEditEvent(e)">Editar</button>
              <button class="mini-delete" title="Eliminar" (click)="$event.stopPropagation(); deleteEvento(e.id)">&times;</button>
            </div>
          </div>

          <ng-template #noUpcoming>
            <p class="muted">No hay eventos en los pr&oacute;ximos 7 d&iacute;as.</p>
          </ng-template>
        </aside>

        <main class="calendar-main card" translate="no">
          <div class="calendar-header" translate="no">
            <button class="btn-nav" (click)="prevMonth()">&#8249;</button>
            <h3 translate="no">{{ monthLabel }}</h3>
            <button class="btn-nav" (click)="nextMonth()">&#8250;</button>
          </div>

          <div class="calendar-grid" translate="no">
            <div class="day-name" *ngFor="let day of dayNames" translate="no">{{ day }}</div>

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
                  (click)="openEditEvent(ev)"
                  [class.blue]="ev.color==='blue'"
                  [class.orange]="ev.color==='orange'"
                  [class.green]="ev.color==='green'"
                  [class.purple]="ev.color==='purple'"
                >
                  <span class="event-title" title="{{ ev.titulo }}">{{ ev.titulo }}</span>
                  <button class="event-delete" title="Eliminar" (click)="$event.stopPropagation(); deleteEvento(ev.id)">&times;</button>
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

    <div class="modal-backdrop" *ngIf="showModal">
      <div class="modal">
        <header class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button class="icon-btn" (click)="closeModal()">&times;</button>
        </header>

        <div class="modal-body">
          <div class="tabs">
            <button class="tab-btn" [class.active]="activeTab === 'datos'" (click)="activeTab = 'datos'">Datos</button>
            <button class="tab-btn" [class.active]="activeTab === 'material'" (click)="activeTab = 'material'">Material</button>
            <button class="tab-btn" [class.active]="activeTab === 'tecnicos'" (click)="activeTab = 'tecnicos'">Tecnicos</button>
            <button class="tab-btn" [class.active]="activeTab === 'horas'" (click)="activeTab = 'horas'">Horas</button>
            <button class="tab-btn" [class.active]="activeTab === 'gastos'" (click)="activeTab = 'gastos'">Gastos</button>
          </div>

          <div class="tab-panel" *ngIf="activeTab === 'datos'">
            <div class="form-grid">
            <label>
              T&iacute;tulo *
              <input type="text" [(ngModel)]="newEvent.titulo" />
            </label>

            <label>
              Fecha *
              <input class="input-compact" type="date" [(ngModel)]="newEvent.fecha" />
            </label>

            <label>
              Ubicaci&oacute;n
              <input type="text" [(ngModel)]="newEvent.ubicacion" />
            </label>

            <label>
              Cliente
              <select [(ngModel)]="newEvent.clienteId">
                <option value="">Selecciona cliente</option>
                <option *ngFor="let c of clientes" [value]="c.id">{{ c.nombre }}</option>
              </select>
            </label>

            <div class="inline-pair span-2">
              <label class="field-compact">
                Tipo *
                <select class="select-compact" [(ngModel)]="newEvent.tipo" (ngModelChange)="syncColorWithTipo()">
                  <option value="Evento">Evento</option>
                  <option value="Montaje">Montaje</option>
                  <option value="Ensayo">Ensayo</option>
                  <option value="Otro">Otro</option>
                </select>
              </label>

              <label class="field-compact">
                Modo calculo
                <select class="select-compact" [(ngModel)]="newEvent.modoCalculo">
                  <option value="Dias">Dias</option>
                  <option value="Jornadas">Jornadas</option>
                </select>
              </label>
            </div>

            <div class="inline-pair span-2">
              <label class="field-compact">
                Dias
                <input class="input-compact input-narrow" type="number" min="0" step="1" [(ngModel)]="newEvent.dias" />
              </label>

              <label class="field-compact">
                Jornadas
                <input class="input-compact input-narrow" type="number" min="0" step="1" [(ngModel)]="newEvent.jornadas" />
              </label>
            </div>

            <label class="span-2">
              Descripci&oacute;n
              <textarea rows="3" [(ngModel)]="newEvent.descripcion"></textarea>
            </label>

            <label class="field-compact">
              Presupuesto (&euro;)
              <input class="input-compact" type="number" min="0" step="0.01" [(ngModel)]="newEvent.presupuesto" />
            </label>

            <label class="field-compact">
              Presupuesto presentado (&euro;)
              <input class="input-compact" type="number" min="0" step="0.01" [(ngModel)]="newEvent.presupuestoPresentado" />
            </label>

            <label class="field-compact">
              N&ordm; t&eacute;cnicos
              <input class="input-compact" type="number" min="0" step="1" [(ngModel)]="newEvent.tecnicos" />
            </label>
            </div>

            <div class="summary">
              <div><strong>Presupuesto calculado:</strong> {{ presupuestoCalculado | number:'1.2-2' }}</div>
              <div *ngIf="newEvent.presupuestoPresentado != null">
                <strong>Presupuesto presentado:</strong> {{ newEvent.presupuestoPresentado | number:'1.2-2' }}
              </div>
              <div *ngIf="diferenciaPresupuesto != null" [class.positive]="diferenciaPresupuesto >= 0" [class.negative]="diferenciaPresupuesto < 0">
                <strong>Diferencia:</strong> {{ diferenciaPresupuesto | number:'1.2-2' }}
              </div>
            </div>

            <div class="budget-panel" *ngIf="presupuestoGuardadoSeleccionado as presupuesto; else sinPresupuestoGuardado">
              <h4>Ultimo presupuesto guardado</h4>
              <div class="quote-meta">
                <div><strong>Estado:</strong> {{ presupuesto.estado || 'Pendiente' }}</div>
                <div><strong>Fecha:</strong> {{ presupuesto.createdAt || '-' }}</div>
                <div><strong>Coste material:</strong> {{ presupuesto.costeMateriales | number:'1.2-2' }}</div>
                <div><strong>Coste tecnicos:</strong> {{ presupuesto.costeTecnicos | number:'1.2-2' }}</div>
                <div><strong>Margen:</strong> {{ presupuesto.margenImporte | number:'1.2-2' }}</div>
                <div><strong>Total:</strong> {{ presupuesto.importePresentado | number:'1.2-2' }}</div>
              </div>

              <table class="modern-table" *ngIf="presupuesto.materiales?.length">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Unidades</th>
                    <th>Tarifa</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let m of presupuesto.materiales ?? []">
                    <td>{{ m.nombre }}</td>
                    <td>{{ m.cantidad }}</td>
                    <td>{{ m.tarifaDia | number:'1.2-2' }}</td>
                    <td>{{ m.total | number:'1.2-2' }}</td>
                  </tr>
                </tbody>
              </table>

              <table class="modern-table" *ngIf="presupuesto.tecnicos?.length">
                <thead>
                  <tr>
                    <th>Tecnico</th>
                    <th>Horas</th>
                    <th>Tarifa</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let t of presupuesto.tecnicos ?? []">
                    <td>{{ t.nombre }}</td>
                    <td>{{ t.horas }}</td>
                    <td>{{ t.tarifaHora | number:'1.2-2' }}</td>
                    <td>{{ t.total | number:'1.2-2' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ng-template #sinPresupuestoGuardado>
              <p class="muted">No hay presupuesto guardado para este evento.</p>
            </ng-template>
          </div>

          <div class="tab-panel" *ngIf="activeTab === 'material'">
            <div class="materials">
              <div class="materials-header">
                <h4>Material necesario</h4>
                <button class="btn-secondary" (click)="addMaterialRow()">+ A&ntilde;adir material</button>
              </div>

              <div class="material-row material-row-header" *ngIf="newEvent.materiales?.length">
                <span>Material</span>
                <span>Cantidad</span>
                <span>Tarifa / d&iacute;a</span>
                <span>Coste</span>
                <span></span>
              </div>

              <div class="material-row" *ngFor="let m of newEvent.materiales; let i = index">
                <select [(ngModel)]="m.materialId" (ngModelChange)="onMaterialChange(i)">
                  <option value="">Selecciona material</option>
                  <option *ngFor="let mat of materiales" [value]="mat.id">{{ mat.nombre }} ({{ mat.almacen }})</option>
                </select>
                <input type="number" min="1" step="1" placeholder="Cantidad" [(ngModel)]="m.cantidad" />
                <span class="material-value">{{ materialTarifa(m) | number:'1.2-2' }}</span>
                <span class="material-value">{{ materialSubtotal(m) | number:'1.2-2' }}</span>
                <button class="icon-btn danger" title="Eliminar" (click)="removeMaterialRow(i)">&times;</button>
              </div>

              <div class="materials-summary" *ngIf="newEvent.materiales?.length">
                <strong>Total material:</strong> {{ totalMaterialesCoste | number:'1.2-2' }}
              </div>
            </div>
          </div>

          <div class="tab-panel" *ngIf="activeTab === 'tecnicos'">
            <div class="materials">
              <div class="materials-header">
                <h4>Tecnicos necesarios</h4>
                <button class="btn-secondary" (click)="addTecnicoRow()">+ A&ntilde;adir tecnico</button>
              </div>

              <div class="tecnico-row" *ngFor="let t of newEvent.tecnicosDetalle; let i = index">
                <select [(ngModel)]="t.personalId" (ngModelChange)="onTecnicoChange(i)">
                  <option value="">Selecciona tecnico</option>
                  <option *ngFor="let p of personal" [value]="p.id">{{ p.nombre }} {{ p.apellidos }}</option>
                </select>
                <input type="number" min="0" step="0.25" placeholder="Horas" [(ngModel)]="t.horas" />
                <button class="icon-btn danger" title="Eliminar" (click)="removeTecnicoRow(i)">&times;</button>
              </div>
            </div>
          </div>

          <div class="tab-panel" *ngIf="activeTab === 'horas'">
            <p class="muted" *ngIf="!isEditing">Guarda el evento para registrar horas.</p>
            <div class="materials" *ngIf="isEditing">
              <div class="materials-header">
                <h4>Horas del personal</h4>
                <span class="muted">Registro vinculado al evento</span>
              </div>

              <div class="hours-grid">
                <label>
                  Tecnico
                  <select [(ngModel)]="nuevoRegistroEvento.personalId" (ngModelChange)="onRegistroTecnicoChange()">
                    <option value="">Selecciona tecnico</option>
                    <option *ngFor="let p of personal" [value]="p.id">{{ p.nombre }} {{ p.apellidos }}</option>
                  </select>
                </label>
                <label>
                  Fecha
                  <input type="date" [(ngModel)]="nuevoRegistroEvento.fecha">
                </label>
                <label>
                  Horas
                  <input type="number" min="0" step="0.25" [(ngModel)]="nuevoRegistroEvento.horas">
                </label>
                <label>
                  Tarifa / hora
                  <input type="number" min="0" step="0.01" [(ngModel)]="nuevoRegistroEvento.tarifaHora">
                </label>
                <label>
                  Notas
                  <input type="text" [(ngModel)]="nuevoRegistroEvento.notas" placeholder="Opcional">
                </label>
                <button class="btn-secondary" [disabled]="!newEvent.id" (click)="guardarHoraEvento()">
                  Registrar horas
                </button>
              </div>

              <table class="hours-table" *ngIf="registrosEvento.length">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tecnico</th>
                    <th>Horas</th>
                    <th>Tarifa</th>
                    <th>Coste</th>
                    <th>Notas</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let r of registrosEvento">
                    <td>{{ r.fecha }}</td>
                    <td>{{ nombreTecnico(r.personalId) }}</td>
                    <td>{{ r.horas }}</td>
                    <td>{{ r.tarifaHora | number:'1.2-2' }}</td>
                    <td>{{ costeRegistro(r) | number:'1.2-2' }}</td>
                    <td>{{ r.notas }}</td>
                    <td>
                      <button class="mini-delete" (click)="eliminarHoraEvento(r.id)">&times;</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p class="muted" *ngIf="!registrosEvento.length">Sin registros de horas para este evento.</p>
            </div>
          </div>

          <div class="tab-panel" *ngIf="activeTab === 'gastos'">
            <p class="muted" *ngIf="!isEditing">Guarda el evento para registrar gastos.</p>
            <div class="materials" *ngIf="isEditing">
              <div class="materials-header">
                <h4>Notas de gastos</h4>
                <span class="muted">Solo productores asignados</span>
              </div>

              <p class="muted" *ngIf="productoresEvento.length === 0">No hay productores asignados en este evento.</p>

              <div class="hours-grid" *ngIf="productoresEvento.length">
                <label>
                  Productor
                  <select [(ngModel)]="nuevaNotaGasto.productorId">
                    <option value="">Selecciona productor</option>
                    <option *ngFor="let p of productoresEvento" [value]="p.id">{{ p.nombre }} {{ p.apellidos }}</option>
                  </select>
                </label>
                <label>
                  Fecha
                  <input type="date" [(ngModel)]="nuevaNotaGasto.fecha">
                </label>
                <label>
                  Concepto
                  <input type="text" [(ngModel)]="nuevaNotaGasto.concepto">
                </label>
                <label>
                  Importe
                  <input type="number" min="0" step="0.01" [(ngModel)]="nuevaNotaGasto.importe">
                </label>
                <label>
                  Estado
                  <select [(ngModel)]="nuevaNotaGasto.estado">
                    <option value="Pendiente">Pendiente</option>
                    <option value="Pagado">Pagado</option>
                  </select>
                </label>
                <button class="btn-secondary" (click)="guardarNotaGasto()">Registrar gasto</button>
              </div>

              <table class="hours-table" *ngIf="notasGasto.length">
                <thead>
                  <tr>
                    <th>Productor</th>
                    <th>Fecha</th>
                    <th>Concepto</th>
                    <th>Importe</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let n of notasGasto">
                    <td>
                      <select [(ngModel)]="n.productorId">
                        <option *ngFor="let p of productoresEvento" [value]="p.id">{{ p.nombre }} {{ p.apellidos }}</option>
                      </select>
                    </td>
                    <td><input type="date" [(ngModel)]="n.fecha"></td>
                    <td><input type="text" [(ngModel)]="n.concepto"></td>
                    <td><input type="number" min="0" step="0.01" [(ngModel)]="n.importe"></td>
                    <td>
                      <select [(ngModel)]="n.estado">
                        <option value="Pendiente">Pendiente</option>
                        <option value="Pagado">Pagado</option>
                      </select>
                    </td>
                    <td>
                      <button class="btn-link" (click)="actualizarNotaGasto(n)">Guardar</button>
                      <button class="btn-link danger" (click)="borrarNotaGasto(n.id)">Eliminar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p class="muted" *ngIf="!notasGasto.length">Sin notas de gastos para este evento.</p>
            </div>
          </div>

          <div class="errors" *ngIf="validationErrors.length">
            <p *ngFor="let e of validationErrors">&bull; {{ e }}</p>
          </div>
        </div>

        <footer class="modal-footer">
          <button class="btn-secondary" (click)="closeModal()">Cancelar</button>
          <button class="btn-primary" (click)="saveNewEvent()">Guardar</button>
        </footer>
      </div>
    </div>
  `,

  styles: [`
    .eventos-container { padding: 0.25rem; max-width: 100%; margin: 0 auto; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
    .header-actions { display: flex; align-items: center; gap: 12px; }
    .muted { color: #7a7a7a; margin: 0.25rem 0 0; }

    .calendar-layout { display: grid; grid-template-columns: 320px 1fr; gap: 1rem; max-width: 100%; margin-top: 0; }
    .calendar-main { min-width: 0; }
    .card { background: white; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }

    .calendar-header { display: flex; justify-content: center; align-items: center; gap: 2rem; margin-bottom: 0.75rem; }
    .btn-nav { width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; font-size: 18px; }
    .btn-nav:hover { background: #f7f7f7; }

    .calendar-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); border: 1px solid #eee; border-radius: 10px; overflow: hidden; width: 100%; min-width: 0; }
    .calendar-grid > * { min-width: 0; }
    .day-name { padding: 6px 4px; text-align: center; background: #f8f9fa; font-weight: 600; border-right: 1px solid #eee; font-size: 0.8rem; }
    .day-name:last-child { border-right: none; }

    .day { min-height: 65px; padding: 4px; border-top: 1px solid #eee; border-right: 1px solid #eee; position: relative; background: #fff; }
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
      cursor: pointer;
    }
    .event-title { display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100px; }
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

    .sidebar-header {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .sidebar-actions {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
    }
    .blue { background: #3498db; }
    .orange { background: #e67e22; }
    .green { background: #27ae60; }
    .purple { background: #8e44ad; }

    .mini-event-item { display: grid; grid-template-columns: auto 1fr auto auto; gap: 10px; margin-top: 1rem; padding: 6px 8px; border-bottom: 1px solid #eee; align-items: center; cursor: pointer; border-radius: 10px; }
    .mini-event-item:hover { background: #f7f9fb; }
    .mini-event-item .date { background: #f0f3f5; padding: 6px 8px; border-radius: 8px; font-weight: 700; font-size: 0.8rem; }
    .mini-event-item .info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .mini-event-item .info strong,
    .mini-event-item .info small { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .mini-edit {
      border: 1px solid #e5e7eb;
      background: #fff;
      padding: 4px 8px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
    }
    .mini-edit:hover { background: #f7f7f7; }
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

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal {
      background: #fff;
      width: min(1100px, 96vw);
      border-radius: 14px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.2);
      overflow: hidden;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }
    .modal-header, .modal-footer {
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
    }
    .modal-footer {
      border-top: 1px solid #eee;
      border-bottom: none;
      background: #fff;
      position: sticky;
      bottom: 0;
      z-index: 2;
    }
    .modal-body {
      padding: 1.5rem;
      overflow: auto;
      max-height: calc(90vh - 120px);
    }
    .icon-btn {
      border: none;
      background: #f1f3f5;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 18px;
    }
    .icon-btn.danger { background: #ffe5e5; color: #b00020; }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.9rem;
      margin-bottom: 1.2rem;
    }
    .tabs {
      display: flex;
      gap: 8px;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.6rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    .tab-btn {
      border: 1px solid #e5e7eb;
      background: #f8f9fb;
      padding: 0.4rem 0.85rem;
      border-radius: 999px;
      cursor: pointer;
      font-weight: 600;
      color: #344054;
    }
    .tab-btn.active {
      background: #2c3e50;
      color: #fff;
      border-color: #2c3e50;
    }
    .tab-panel { min-height: 160px; }
    .form-grid label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; color: #344054; }
    .form-grid input, .form-grid select, .form-grid textarea {
      border: 1px solid #d0d5dd;
      border-radius: 8px;
      padding: 0.6rem 0.75rem;
      font-weight: 500;
    }
    .form-grid input,
    .form-grid select {
      height: 36px;
      line-height: 1.2;
      box-sizing: border-box;
    }
    .form-grid .input-compact,
    .form-grid .select-compact {
      padding: 0.25rem 0.5rem;
      font-size: 0.85rem;
      height: 36px;
      line-height: 1.2;
      box-sizing: border-box;
    }
    .form-grid .field-compact {
      align-items: flex-start;
    }
    .form-grid .field-compact .input-compact,
    .form-grid .field-compact .select-compact {
      width: 150px;
    }
    .form-grid .input-narrow {
      width: 120px;
    }
    .form-grid .inline-pair {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      align-items: end;
    }
    .span-2 { grid-column: span 2; }
    .materials { margin-top: 0.5rem; }
    .materials-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
    .material-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 110px 120px 140px 40px;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
      align-items: center;
    }
    .tecnico-row {
      display: grid;
      grid-template-columns: 1fr 120px 40px;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
      align-items: center;
    }
    .material-row-header {
      font-size: 0.85rem;
      color: #667085;
      font-weight: 600;
      margin-bottom: 0.35rem;
    }
    .material-value {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .materials-summary { margin-top: 0.75rem; font-size: 0.9rem; }
    .btn-secondary {
      background: #eef2f6;
      color: #344054;
      border: none;
      padding: 0.6rem 1rem;
      border-radius: 10px;
      cursor: pointer;
    }
    .btn-link { background: none; border: none; color: #2c3e50; cursor: pointer; margin-right: 8px; }
    .btn-link.danger { color: #c0392b; }
    .summary { margin: 0.5rem 0 1rem; padding: 0.75rem 1rem; background: #f8f9fb; border-radius: 10px; }
    .budget-panel { margin-top: 1rem; padding: 0.75rem 1rem; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; }
    .budget-panel h4 { margin: 0 0 0.75rem; }
    .summary .positive { color: #1b7b3a; }
    .summary .negative { color: #b00020; }
    .errors { margin-top: 1rem; color: #b00020; font-weight: 600; }
    .hours-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.75rem;
      align-items: end;
      margin-bottom: 0.75rem;
    }
    .hours-table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; }
    .hours-table th {
      text-align: left;
      padding: 0.6rem;
      background: #f8f9fa;
      color: #666;
      font-weight: 600;
      font-size: 0.85rem;
    }
    .hours-table td {
      padding: 0.6rem;
      border-bottom: 1px solid #eee;
      font-size: 0.85rem;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .calendar-layout {
        grid-template-columns: 280px 1fr;
        gap: 1rem;
      }
      .eventos-container {
        padding: 1rem;
      }
    }

    @media (max-width: 968px) {
      .calendar-layout {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .event-sidebar {
        order: 2;
      }
      .calendar-main {
        order: 1;
      }
      .day {
        min-height: 60px;
        padding: 3px;
      }
      .event-title {
        max-width: 80px;
        font-size: 0.7rem;
      }
    }

    @media (max-width: 768px) {
      .eventos-container {
        padding: 0.5rem;
      }
      .section-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      .header-actions {
        justify-content: center;
      }
      .calendar-header {
        gap: 1rem;
      }
      .day {
        min-height: 55px;
        padding: 2px;
      }
      .day-name {
        padding: 6px;
        font-size: 0.8rem;
      }
      .event-tag {
        font-size: 0.65rem;
        padding: 2px 4px;
        margin-top: 3px;
      }
      .event-title {
        max-width: 60px;
        font-size: 0.65rem;
      }
      .card {
        padding: 1rem;
      }
    }

    @media (max-width: 480px) {
      .eventos-container {
        padding: 0.25rem;
      }
      .day {
        min-height: 45px;
        padding: 2px;
      }
      .event-tag {
        font-size: 0.6rem;
        padding: 1px 3px;
      }
      .event-title {
        max-width: 50px;
        font-size: 0.6rem;
      }
      .btn-nav {
        width: 30px;
        height: 30px;
        font-size: 14px;
      }
      .legend {
        gap: 4px;
      }
      .pill {
        font-size: 0.65rem;
        padding: 2px 6px;
      }
    }
  `]
})
class EventosComponent {
  private readonly _dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  get dayNames(): readonly string[] {
    return Object.freeze([...this._dayNames]);
  }
  currentMonth!: Date;
  todayIso = this.toIsoDate(new Date());

  eventos: Evento[] = [];
  materiales: Material[] = [];
  personal: Personal[] = [];
  clientes: Cliente[] = [];
  presupuestos: PresupuestoResumen[] = [];
  registrosEvento: RegistroHoras[] = [];
  nuevoRegistroEvento: RegistroHoras = this.resetRegistroEvento();
  notasGasto: NotaGasto[] = [];
  nuevaNotaGasto: NotaGasto = this.resetNotaGasto();
  showModal = false;
  validationErrors: string[] = [];
  newEvent: Evento = this.emptyEvent();
  isEditing = false;
  activeTab: 'datos' | 'material' | 'tecnicos' | 'horas' | 'gastos' = 'datos';

  constructor(private api: ApiService) {
    this.currentMonth = this.startOfMonth(new Date());
    this.loadEventos();
    this.loadMateriales();
    this.loadPersonal();
    this.loadClientes();
    this.loadPresupuestos();
  }

  loadEventos(): void {
    this.api.getEventos().subscribe({
      next: (data) => this.eventos = data ?? [],
      error: (e) => console.error('Error cargando eventos:', e)
    });
  }

  private loadPresupuestos(): void {
    this.api.getPresupuestosGuardados().subscribe({
      next: (data) => this.presupuestos = data ?? [],
      error: (e) => console.error('Error cargando presupuestos:', e)
    });
  }

  deleteEvento(id?: string): void {
    if (!id) return;
    this.api.deleteEvento(id).subscribe({
      next: () => this.loadEventos(),
      error: (e) => console.error('Error eliminando evento:', e)
    });
  }

  openNewEventModal(): void {
    this.validationErrors = [];
    this.newEvent = this.emptyEvent();
    this.registrosEvento = [];
    this.nuevoRegistroEvento = this.resetRegistroEvento();
    this.notasGasto = [];
    this.nuevaNotaGasto = { ...this.resetNotaGasto(), fecha: this.newEvent.fecha };
    this.activeTab = 'datos';
    this.isEditing = false;
    this.showModal = true;
  }

  openEditEvent(evento: Evento): void {
    this.validationErrors = [];
    this.newEvent = this.cloneEvent(evento);
    this.loadHorasEvento(this.newEvent.id);
    this.loadNotasGasto(this.newEvent.id);
    this.nuevaNotaGasto = { ...this.resetNotaGasto(), fecha: this.newEvent.fecha };
    this.activeTab = 'datos';
    this.isEditing = true;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveNewEvent(): void {
    this.validationErrors = this.validateNewEvent(this.newEvent);
    if (this.validationErrors.length) return;

    this.newEvent.presupuesto = this.presupuestoCalculado;
    this.newEvent.tecnicos = this.newEvent.tecnicosDetalle?.length ?? 0;

    const request = this.isEditing && this.newEvent.id
      ? this.api.updateEvento(this.newEvent.id, this.newEvent)
      : this.api.saveEvento(this.newEvent);

    request.subscribe({
      next: () => {
        this.closeModal();
        this.loadEventos();
      },
      error: (e) => console.error('Error guardando evento:', e)
    });
  }

  addMaterialRow(): void {
    if (!this.newEvent.materiales) this.newEvent.materiales = [];
    this.newEvent.materiales.push({ materialId: '', nombre: '', cantidad: 1 });
  }

  removeMaterialRow(index: number): void {
    this.newEvent.materiales?.splice(index, 1);
  }

  onMaterialChange(index: number): void {
    const item = this.newEvent.materiales?.[index];
    if (!item) return;
    const material = this.materiales.find(m => m.id === item.materialId);
    item.nombre = material?.nombre ?? '';
  }

  materialTarifa(item: EventoMaterial): number {
    if (!item.materialId) return 0;
    const material = this.materiales.find(m => m.id === item.materialId);
    return material?.tarifaDia ?? 0;
  }

  materialSubtotal(item: EventoMaterial): number {
    const cantidad = item.cantidad ?? 0;
    return cantidad * this.materialTarifa(item) * this.multiplier();
  }

  syncColorWithTipo(): void {
    this.newEvent.color = this.colorForTipo(this.newEvent.tipo);
  }

  addTecnicoRow(): void {
    if (!this.newEvent.tecnicosDetalle) this.newEvent.tecnicosDetalle = [];
    this.newEvent.tecnicosDetalle.push({ personalId: '', nombre: '', horas: 0, tarifaHora: 0 });
  }

  removeTecnicoRow(index: number): void {
    this.newEvent.tecnicosDetalle?.splice(index, 1);
  }

  onTecnicoChange(index: number): void {
    const item = this.newEvent.tecnicosDetalle?.[index];
    if (!item) return;
    const tecnico = this.personal.find(p => p.id === item.personalId);
    item.nombre = tecnico ? `${tecnico.nombre} ${tecnico.apellidos}` : '';
    item.tarifaHora = tecnico?.tarifaHora ?? 0;
  }

  eventosByDate(isoDate: string): Evento[] {
    return (this.eventos ?? [])
      .filter(e => e.fecha === isoDate)
      .sort((a, b) => (a.titulo ?? '').localeCompare(b.titulo ?? ''));
  }

  get modalTitle(): string {
    return this.isEditing ? 'Editar evento' : 'Nuevo evento';
  }

  get monthLabel(): string {
    const m = this.currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    return m.charAt(0).toUpperCase() + m.slice(1);
  }

  get presupuestoCalculado(): number {
    return this.totalMaterialesCoste + this.totalTecnicosCoste;
  }

  get diferenciaPresupuesto(): number | null {
    if (this.newEvent.presupuestoPresentado == null) return null;
    return (this.newEvent.presupuestoPresentado ?? 0) - this.presupuestoCalculado;
  }

  get presupuestoGuardadoSeleccionado(): PresupuestoResumen | undefined {
    const id = this.newEvent.id;
    if (!id) return undefined;
    const encontrados = (this.presupuestos ?? [])
      .filter(p => p.eventoId === id)
      .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
    return encontrados[0];
  }

  get totalMaterialesCoste(): number {
    return (this.newEvent.materiales ?? []).reduce((acc, item) => {
      return acc + this.materialSubtotal(item);
    }, 0);
  }

  get totalTecnicosCoste(): number {
    return (this.newEvent.tecnicosDetalle ?? []).reduce((acc, t) => {
      const horas = t.horas ?? 0;
      const tarifa = t.tarifaHora ?? 0;
      return acc + horas * tarifa * this.multiplier();
    }, 0);
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
        if (!e.fecha) return false;
        const d = this.fromIsoDate(e.fecha);
        return d >= start && d < end;
      })
      .sort((a, b) => (a.fecha ?? '').localeCompare(b.fecha ?? ''));
  }

  formatShortDayMonth(isoDate?: string | null): string {
    if (!isoDate) return '';
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
    if (!iso) return new Date(NaN);
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
    const js = date.getDay(); // 0..6 (Dom..Sab)
    return (js + 6) % 7;
  }

  private emptyEvent(): Evento {
    const fecha = this.toIsoDate(new Date());
    return {
      titulo: '',
      ubicacion: '',
      clienteId: '',
      fecha,
      tipo: 'Evento',
      color: this.colorForTipo('Evento'),
      descripcion: '',
      presupuesto: undefined,
      presupuestoPresentado: undefined,
      presupuestoEstado: undefined,
      tecnicos: undefined,
      materiales: [],
      dias: 1,
      jornadas: 1,
      modoCalculo: 'Dias',
      tecnicosDetalle: []
    };
  }

  private cloneEvent(evento: Evento): Evento {
    const tipo = evento.tipo ?? 'Evento';
    return {
      id: evento.id,
      titulo: evento.titulo ?? '',
      ubicacion: evento.ubicacion ?? '',
      clienteId: evento.clienteId ?? '',
      fecha: evento.fecha ?? this.toIsoDate(new Date()),
      tipo,
      color: evento.color ?? this.colorForTipo(tipo),
      descripcion: evento.descripcion ?? '',
      presupuesto: evento.presupuesto,
      presupuestoPresentado: evento.presupuestoPresentado,
      presupuestoEstado: evento.presupuestoEstado,
      tecnicos: evento.tecnicos,
      materiales: (evento.materiales ?? []).map(m => ({ ...m })),
      dias: evento.dias ?? 1,
      jornadas: evento.jornadas ?? 1,
      modoCalculo: evento.modoCalculo ?? 'Dias',
      tecnicosDetalle: (evento.tecnicosDetalle ?? []).map(t => ({ ...t }))
    };
  }

  private colorForTipo(tipo: Evento['tipo']): Evento['color'] {
    switch (tipo) {
      case 'Montaje':
        return 'orange';
      case 'Ensayo':
        return 'green';
      case 'Otro':
        return 'purple';
      default:
        return 'blue';
    }
  }

  private multiplier(): number {
    if (this.newEvent.modoCalculo === 'Jornadas') {
      return this.newEvent.jornadas ?? 1;
    }
    return this.newEvent.dias ?? 1;
  }

  private validateNewEvent(evento: Evento): string[] {
    const errors: string[] = [];
    if (!evento.titulo?.trim()) errors.push('El t\u00edtulo es obligatorio.');
    if (!evento.fecha) errors.push('La fecha es obligatoria.');
    if (!evento.tipo) errors.push('El tipo es obligatorio.');
    if (evento.presupuesto != null && evento.presupuesto < 0) errors.push('El presupuesto no puede ser negativo.');
    if (evento.presupuestoPresentado != null && evento.presupuestoPresentado < 0) {
      errors.push('El presupuesto presentado no puede ser negativo.');
    }
    if (evento.tecnicos != null && evento.tecnicos < 0) errors.push('El n\u00famero de t\u00e9cnicos no puede ser negativo.');
    if ((evento.dias ?? 0) < 0) errors.push('Los dias no pueden ser negativos.');
    if ((evento.jornadas ?? 0) < 0) errors.push('Las jornadas no pueden ser negativas.');

    (evento.materiales ?? []).forEach((m, i) => {
      if (!m.materialId) errors.push(`Material ${i + 1}: selecciona un material.`);
      if (!m.cantidad || m.cantidad < 1) errors.push(`Material ${i + 1}: cantidad inv\u00e1lida.`);
    });

    (evento.tecnicosDetalle ?? []).forEach((t, i) => {
      if (!t.personalId) errors.push(`Tecnico ${i + 1}: selecciona un tecnico.`);
      if (!t.horas || t.horas <= 0) errors.push(`Tecnico ${i + 1}: horas invalidas.`);
    });

    return errors;
  }

  private resetRegistroEvento(): RegistroHoras {
    return {
      personalId: '',
      fecha: '',
      horas: 0,
      tipo: 'Extra',
      tarifaHora: 0,
      notas: ''
    };
  }

  private resetNotaGasto(): NotaGasto {
    return {
      eventoId: '',
      productorId: '',
      fecha: '',
      concepto: '',
      importe: 0,
      estado: 'Pendiente'
    };
  }

  private loadMateriales(): void {
    this.api.getMateriales().subscribe({
      next: (data) => this.materiales = data ?? [],
      error: (e) => console.error('Error cargando materiales:', e)
    });
  }

  private loadPersonal(): void {
    this.api.getPersonal().subscribe({
      next: (data) => this.personal = data ?? [],
      error: (e) => console.error('Error cargando personal:', e)
    });
  }

  private loadClientes(): void {
    this.api.getClientes().subscribe({
      next: (data) => this.clientes = data ?? [],
      error: (e) => console.error('Error cargando clientes:', e)
    });
  }

  private loadHorasEvento(eventoId?: string): void {
    if (!eventoId) {
      this.registrosEvento = [];
      return;
    }
    this.api.getHoras().subscribe({
      next: (data) => {
        this.registrosEvento = (data ?? []).filter(r => r.eventoId === eventoId);
      },
      error: (e) => console.error('Error cargando horas:', e)
    });
  }

  private loadNotasGasto(eventoId?: string): void {
    if (!eventoId) {
      this.notasGasto = [];
      return;
    }
    this.api.getNotasGasto(eventoId).subscribe({
      next: (data) => {
        this.notasGasto = data ?? [];
      },
      error: (e) => console.error('Error cargando notas de gasto:', e)
    });
  }

  guardarHoraEvento(): void {
    if (!this.newEvent.id) return;
    if (!this.nuevoRegistroEvento.personalId || !this.nuevoRegistroEvento.fecha) {
      alert('Tecnico y fecha son obligatorios');
      return;
    }
    const payload: RegistroHoras = {
      ...this.nuevoRegistroEvento,
      eventoId: this.newEvent.id
    };
    this.api.saveHora(payload).subscribe({
      next: () => {
        this.loadHorasEvento(this.newEvent.id);
        this.nuevoRegistroEvento = this.resetRegistroEvento();
      },
      error: (err) => alert(err?.error?.message || 'No se pudo guardar el registro')
    });
  }

  guardarNotaGasto(): void {
    if (!this.newEvent.id) return;
    if (!this.nuevaNotaGasto.productorId || !this.nuevaNotaGasto.fecha || !this.nuevaNotaGasto.concepto) {
      alert('Productor, fecha y concepto son obligatorios');
      return;
    }
    if (!this.nuevaNotaGasto.importe || this.nuevaNotaGasto.importe <= 0) {
      alert('El importe debe ser mayor que 0');
      return;
    }
    const payload: NotaGasto = {
      ...this.nuevaNotaGasto,
      eventoId: this.newEvent.id
    };
    this.api.saveNotaGasto(payload).subscribe({
      next: () => {
        this.loadNotasGasto(this.newEvent.id);
        this.nuevaNotaGasto = this.resetNotaGasto();
      },
      error: (err) => alert(err?.error?.message || 'No se pudo guardar la nota de gasto')
    });
  }

  actualizarNotaGasto(nota: NotaGasto): void {
    if (!nota.id) return;
    this.api.updateNotaGasto(nota.id, nota).subscribe({
      next: () => this.loadNotasGasto(this.newEvent.id),
      error: (err) => alert(err?.error?.message || 'No se pudo actualizar la nota de gasto')
    });
  }

  borrarNotaGasto(id?: string): void {
    if (!id) return;
    if (!confirm('Eliminar nota de gasto?')) return;
    this.api.deleteNotaGasto(id).subscribe({
      next: () => this.loadNotasGasto(this.newEvent.id),
      error: (e) => console.error('Error eliminando nota de gasto:', e)
    });
  }

  eliminarHoraEvento(id?: string): void {
    if (!id) return;
    if (!confirm('Eliminar registro de horas?')) return;
    this.api.deleteHora(id).subscribe({
      next: () => this.loadHorasEvento(this.newEvent.id),
      error: (e) => console.error('Error eliminando horas:', e)
    });
  }

  onRegistroTecnicoChange(): void {
    const tecnico = this.personal.find(p => p.id === this.nuevoRegistroEvento.personalId);
    if (!tecnico) return;
    this.nuevoRegistroEvento.tarifaHora = tecnico.tarifaHora ?? 0;
    this.nuevoRegistroEvento.tipo = tecnico.tipoContrato === 'Plantilla' ? 'Plantilla' : 'Extra';
    if (!this.nuevoRegistroEvento.fecha) {
      this.nuevoRegistroEvento.fecha = this.newEvent.fecha;
    }
  }

  nombreTecnico(personalId?: string): string {
    if (!personalId) return 'Desconocido';
    const tecnico = this.personal.find(p => p.id === personalId);
    return tecnico ? `${tecnico.nombre} ${tecnico.apellidos}` : 'Desconocido';
  }

  costeRegistro(registro: RegistroHoras): number {
    return (registro.horas ?? 0) * (registro.tarifaHora ?? 0);
  }

  get productoresEvento(): Personal[] {
    const ids = new Set((this.newEvent.tecnicosDetalle ?? [])
      .map(t => t.personalId)
      .filter((id): id is string => Boolean(id)));
    return this.personal.filter(p => {
      if (!p.id || !ids.has(p.id)) return false;
      return (p.cargo ?? '').trim().toLowerCase() === 'productor';
    });
  }
}

export default EventosComponent
