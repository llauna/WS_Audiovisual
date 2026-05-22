package com.david.app.controller;

import com.david.app.dto.PresupuestoDetalle;
import com.david.app.model.Evento;
import com.david.app.model.Presupuesto;
import com.david.app.model.PresupuestoMaterial;
import com.david.app.model.PresupuestoTecnico;
import com.david.app.repository.EventoRepository;
import com.david.app.repository.PresupuestoRepository;
import com.david.app.service.PresupuestoCalculatorService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/presupuestos")
@CrossOrigin(origins = "http://localhost:4200")
public class PresupuestoController {

    private final EventoRepository eventoRepository;
    private final PresupuestoRepository presupuestoRepository;
    private final PresupuestoCalculatorService presupuestoCalculatorService;

    public PresupuestoController(EventoRepository eventoRepository,
                                 PresupuestoRepository presupuestoRepository,
                                 PresupuestoCalculatorService presupuestoCalculatorService) {
        this.eventoRepository = eventoRepository;
        this.presupuestoRepository = presupuestoRepository;
        this.presupuestoCalculatorService = presupuestoCalculatorService;
    }

    @GetMapping
    public List<Presupuesto> getAllPresupuestos() {
        return presupuestoRepository.findAll();
    }

    @GetMapping("/eventos/{id}")
    public PresupuestoDetalle calcularDesdeEvento(@PathVariable String id,
                                                  @RequestParam(value = "margenPct", defaultValue = "0") Double margenPct) {
        Evento evento = eventoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Evento no encontrado"));
        return presupuestoCalculatorService.calcular(evento, margenPct);
    }

    @PostMapping("/eventos/{id}")
    public Presupuesto guardarDesdeEvento(@PathVariable String id,
                                          @RequestParam(value = "margenPct", defaultValue = "0") Double margenPct,
                                          @RequestParam(value = "estado", defaultValue = "Pendiente") String estado) {
        Evento evento = eventoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Evento no encontrado"));
        PresupuestoDetalle detalle = presupuestoCalculatorService.calcular(evento, margenPct);
        Presupuesto presupuesto = toPresupuesto(evento, detalle, estado);
        return presupuestoRepository.save(presupuesto);
    }

    @PostMapping("/calcular")
    public PresupuestoDetalle calcularDesdePayload(@RequestBody Evento evento,
                                                   @RequestParam(value = "margenPct", defaultValue = "0") Double margenPct) {
        return presupuestoCalculatorService.calcular(evento, margenPct);
    }

    private Presupuesto toPresupuesto(Evento evento, PresupuestoDetalle detalle, String estado) {
        Presupuesto presupuesto = new Presupuesto();
        presupuesto.setEventoId(evento.getId());
        presupuesto.setEventoTitulo(evento.getTitulo());
        presupuesto.setClienteId(evento.getClienteId());
        presupuesto.setFechaEvento(evento.getFecha());
        presupuesto.setModoCalculo(detalle.getModoCalculo());
        presupuesto.setDias(detalle.getDias());
        presupuesto.setJornadas(detalle.getJornadas());
        presupuesto.setMultiplicador(detalle.getMultiplicador());
        presupuesto.setMargenPct(detalle.getMargenPct());
        presupuesto.setCosteMateriales(detalle.getCosteMateriales());
        presupuesto.setCosteTecnicos(detalle.getCosteTecnicos());
        presupuesto.setCosteBase(detalle.getCosteBase());
        presupuesto.setMargenImporte(detalle.getMargenImporte());
        presupuesto.setImportePresentado(detalle.getTotal());
        presupuesto.setEstado(estado == null || estado.isBlank() ? "Pendiente" : estado);
        presupuesto.setCreatedAt(OffsetDateTime.now().toString());
        presupuesto.setMateriales(detalle.getMateriales() == null ? List.of() : detalle.getMateriales().stream().map(linea -> {
            PresupuestoMaterial material = new PresupuestoMaterial();
            material.setMaterialId(linea.getMaterialId());
            material.setNombre(linea.getNombre());
            material.setCantidad(linea.getCantidad());
            material.setTarifaDia(linea.getTarifaDia());
            material.setTotal(linea.getTotal());
            return material;
        }).toList());
        presupuesto.setTecnicos(detalle.getTecnicos() == null ? List.of() : detalle.getTecnicos().stream().map(linea -> {
            PresupuestoTecnico tecnico = new PresupuestoTecnico();
            tecnico.setPersonalId(linea.getPersonalId());
            tecnico.setNombre(linea.getNombre());
            tecnico.setHoras(linea.getHoras());
            tecnico.setTarifaHora(linea.getTarifaHora());
            tecnico.setTotal(linea.getTotal());
            return tecnico;
        }).toList());
        return presupuesto;
    }
}
