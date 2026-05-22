import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { RegistroHoras } from '../model/registro-horas';
import { Personal } from '../model/personal';
import { Evento } from '../model/evento';

interface NominaResumen {
  personalId: string;
  nombre: string;
  horas: number;
  coste: number;
}

interface AutofacturaItem {
  personalId: string;
  nombre: string;
  empresa: string;
  eventoId?: string;
  eventoLabel: string;
  importe: number;
  irpf: number;
  iva: number;
}

@Component({
  selector: 'app-nominas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="nominas-container">
      <header class="section-header">
        <div>
          <h2>Nominas y autofacturas</h2>
          <p class="muted">Resumen de horas y liquidaciones</p>
        </div>
        <a class="btn-secondary" routerLink="/dashboard">Inicio</a>
      </header>

      <section class="card">
        <header class="section-header compact">
          <div>
            <h3>Nominas (plantilla)</h3>
            <p class="muted">Horas registradas y coste estimado</p>
          </div>
        </header>

        <table class="modern-table" *ngIf="nominasResumen.length; else noNominas">
          <thead>
            <tr>
              <th>Tecnico</th>
              <th>Horas</th>
              <th>Coste</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let n of nominasResumen">
              <td>{{ n.nombre }}</td>
              <td>{{ n.horas | number:'1.2-2' }}</td>
              <td>{{ n.coste | number:'1.2-2' }}</td>
            </tr>
          </tbody>
        </table>

        <ng-template #noNominas>
          <p class="muted">No hay registros de horas para plantilla.</p>
        </ng-template>
      </section>

      <section class="card">
        <header class="section-header compact">
          <div>
            <h3>Autofacturas (autonomos)</h3>
            <p class="muted">Importes calculados por evento</p>
          </div>
          <div class="rates">
            <label>
              IRPF %
              <input type="number" min="0" step="0.01" [(ngModel)]="irpfDefault" (ngModelChange)="buildAutofacturas()" />
            </label>
            <label>
              IVA %
              <input type="number" min="0" step="0.01" [(ngModel)]="ivaDefault" (ngModelChange)="buildAutofacturas()" />
            </label>
          </div>
        </header>

        <table class="modern-table" *ngIf="autofacturas.length; else noAutofacturas">
          <thead>
            <tr>
              <th>Autonomo</th>
              <th>Evento</th>
              <th>Importe</th>
              <th>IRPF</th>
              <th>IVA</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of autofacturas">
              <td>
                <strong>{{ a.nombre }}</strong>
                <div class="muted small">{{ a.empresa }}</div>
              </td>
              <td>{{ a.eventoLabel }}</td>
              <td>{{ a.importe | number:'1.2-2' }}</td>
              <td>{{ a.irpf }}% ({{ calcularIrpf(a) | number:'1.2-2' }})</td>
              <td>{{ a.iva }}% ({{ calcularIva(a) | number:'1.2-2' }})</td>
              <td>{{ calcularTotal(a) | number:'1.2-2' }}</td>
            </tr>
          </tbody>
        </table>

        <ng-template #noAutofacturas>
          <p class="muted">No hay registros de horas para autonomos.</p>
        </ng-template>
      </section>
    </div>
  `,
  styles: [`
    .nominas-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .section-header.compact { margin-bottom: 1rem; }
    .muted { color: #7a7a7a; margin: 0.25rem 0 0; }
    .muted.small { font-size: 0.8rem; }
    .card { background: #fff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 1.5rem; }
    .btn-secondary { background: #eef2f6; color: #344054; border: none; padding: 0.6rem 1rem; border-radius: 10px; cursor: pointer; text-decoration: none; }

    .rates { display: flex; gap: 12px; align-items: end; }
    .rates label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; color: #344054; }
    .rates input { padding: 0.4rem 0.6rem; border: 1px solid #ddd; border-radius: 8px; width: 90px; }

    .modern-table { width: 100%; border-collapse: collapse; }
    .modern-table th { text-align: left; padding: 0.75rem; background: #f8f9fa; color: #666; font-weight: 600; }
    .modern-table td { padding: 0.75rem; border-bottom: 1px solid #eee; vertical-align: top; }
  `]
})
export class NominasComponent implements OnInit {
  horas: RegistroHoras[] = [];
  personal: Personal[] = [];
  eventos: Evento[] = [];

  nominasResumen: NominaResumen[] = [];
  autofacturas: AutofacturaItem[] = [];
  irpfDefault = 15;
  ivaDefault = 21;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.api.getPersonal().subscribe({
      next: (data) => {
        this.personal = (data ?? []).map((p: any) => {
          const raw = (p.tipoContrato ?? p.tipocontrato ?? 'Plantilla') as string;
          const tipoContrato = raw === 'Aut\u00c3\u00b3nomo' ? 'Autonomo' : raw;
          return { ...p, tipoContrato };
        });
        this.recalcular();
      }
    });

    this.api.getEventos().subscribe({
      next: (data) => {
        this.eventos = data ?? [];
        this.recalcular();
      }
    });

    this.api.getHoras().subscribe({
      next: (data) => {
        this.horas = data ?? [];
        this.recalcular();
      }
    });
  }

  recalcular(): void {
    this.buildNominas();
    this.buildAutofacturas();
  }

  buildNominas(): void {
    const plantillaIds = new Set(
      this.personal.filter(p => p.tipoContrato === 'Plantilla').map(p => p.id)
    );

    const resumenMap = new Map<string, NominaResumen>();
    this.horas.filter(h => plantillaIds.has(h.personalId)).forEach((h) => {
      const entry = resumenMap.get(h.personalId) ?? {
        personalId: h.personalId,
        nombre: this.nombrePersonal(h.personalId),
        horas: 0,
        coste: 0
      };
      entry.horas += h.horas ?? 0;
      entry.coste += (h.horas ?? 0) * (h.tarifaHora ?? 0);
      resumenMap.set(h.personalId, entry);
    });

    this.nominasResumen = Array.from(resumenMap.values())
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  buildAutofacturas(): void {
    const autonomoIds = new Set(
      this.personal.filter(p => p.tipoContrato === 'Autonomo').map(p => p.id)
    );

    const map = new Map<string, AutofacturaItem>();
    this.horas.filter(h => autonomoIds.has(h.personalId)).forEach((h) => {
      const key = `${h.personalId}::${h.eventoId ?? 'sin-evento'}`;
      const item = map.get(key) ?? {
        personalId: h.personalId,
        nombre: this.nombrePersonal(h.personalId),
        empresa: this.empresaPersonal(h.personalId),
        eventoId: h.eventoId,
        eventoLabel: this.descripcionEvento(h.eventoId),
        importe: 0,
        irpf: this.irpfDefault,
        iva: this.ivaDefault
      };
      item.importe += (h.horas ?? 0) * (h.tarifaHora ?? 0);
      map.set(key, item);
    });

    this.autofacturas = Array.from(map.values())
      .filter(a => a.importe > 0)
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  calcularIrpf(a: AutofacturaItem): number {
    return a.importe * (a.irpf / 100);
  }

  calcularIva(a: AutofacturaItem): number {
    return a.importe * (a.iva / 100);
  }

  calcularTotal(a: AutofacturaItem): number {
    return a.importe - this.calcularIrpf(a) + this.calcularIva(a);
  }

  private nombrePersonal(personalId?: string): string {
    const p = this.personal.find(persona => persona.id === personalId);
    return p ? `${p.nombre} ${p.apellidos}` : 'Desconocido';
  }

  private empresaPersonal(personalId?: string): string {
    const p = this.personal.find(persona => persona.id === personalId);
    return p?.empresa ?? '';
  }

  private descripcionEvento(eventoId?: string): string {
    if (!eventoId) return 'Sin evento';
    const ev = this.eventos.find(e => e.id === eventoId);
    return ev?.descripcion || ev?.titulo || 'Evento';
  }
}
