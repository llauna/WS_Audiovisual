package com.david.app.controller;

import com.david.app.model.Evento;
import com.david.app.model.EventoTecnico;
import com.david.app.model.NotaGasto;
import com.david.app.model.Personal;
import com.david.app.repository.EventoRepository;
import com.david.app.repository.NotaGastoRepository;
import com.david.app.repository.PersonalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/notas-gastos")
@CrossOrigin(origins = "http://localhost:4200")
public class NotasGastoController {

    @Autowired
    private NotaGastoRepository notaGastoRepository;

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private PersonalRepository personalRepository;

    @GetMapping
    public List<NotaGasto> getAll(@RequestParam(required = false) String eventoId) {
        if (eventoId != null && !eventoId.trim().isEmpty()) {
            return notaGastoRepository.findByEventoId(eventoId);
        }
        return notaGastoRepository.findAll();
    }

    @PostMapping
    public NotaGasto create(@RequestBody NotaGasto nota) {
        NotaGasto normalized = normalize(nota);
        return notaGastoRepository.save(normalized);
    }

    @PutMapping("/{id}")
    public NotaGasto update(@PathVariable String id, @RequestBody NotaGasto nota) {
        NotaGasto normalized = normalize(nota);
        normalized.setId(id);
        return notaGastoRepository.save(normalized);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        notaGastoRepository.deleteById(id);
    }

    private NotaGasto normalize(NotaGasto nota) {
        if (nota.getEventoId() == null || nota.getEventoId().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El evento es obligatorio");
        }

        Evento evento = eventoRepository.findById(nota.getEventoId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "El evento no existe"));

        if (nota.getProductorId() == null || nota.getProductorId().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El productor es obligatorio");
        }

        Personal productor = personalRepository.findById(nota.getProductorId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "El productor no existe"));

        String cargo = productor.getCargo() == null ? "" : productor.getCargo().trim();
        if (!"productor".equalsIgnoreCase(cargo)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Solo un productor puede presentar gastos");
        }

        List<EventoTecnico> tecnicos = evento.getTecnicosDetalle();
        boolean asignado = tecnicos != null && tecnicos.stream()
            .anyMatch(t -> nota.getProductorId().equals(t.getPersonalId()));
        if (!asignado) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El productor debe estar asignado al evento");
        }

        if (nota.getFecha() == null || nota.getFecha().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha es obligatoria");
        }
        if (nota.getConcepto() == null || nota.getConcepto().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El concepto es obligatorio");
        }
        Double importe = nota.getImporte() == null ? 0 : nota.getImporte();
        if (importe <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El importe debe ser mayor que 0");
        }
        String estado = nota.getEstado();
        if (estado == null || estado.trim().isEmpty()) {
            estado = "Pendiente";
        }
        if (!"Pendiente".equalsIgnoreCase(estado) && !"Pagado".equalsIgnoreCase(estado)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El estado debe ser Pendiente o Pagado");
        }

        nota.setImporte(importe);
        nota.setEstado(estado);
        return nota;
    }
}
