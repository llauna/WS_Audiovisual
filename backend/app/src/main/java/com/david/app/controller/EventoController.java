package com.david.app.controller;

import com.david.app.model.Evento;
import com.david.app.model.EventoMaterial;
import com.david.app.model.Material;
import com.david.app.repository.EventoRepository;
import com.david.app.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "http://localhost:4200")
public class EventoController {

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private MaterialRepository materialRepository;

    @GetMapping
    public List<Evento> getAllEventos() {
        return eventoRepository.findAll();
    }

    @PostMapping
    public Evento saveEvento(@RequestBody Evento evento) {
        applyReservationDelta(buildMaterialMap(evento));
        return eventoRepository.save(evento);
    }

    @PutMapping("/{id}")
    public Evento updateEvento(@PathVariable String id, @RequestBody Evento evento) {
        Evento previous = eventoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado"));

        Map<String, Integer> delta = buildMaterialDelta(previous, evento);
        applyReservationDelta(delta);

        evento.setId(id);
        return eventoRepository.save(evento);
    }

    @DeleteMapping("/{id}")
    public void deleteEvento(@PathVariable String id) {
        Evento previous = eventoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado"));
        Map<String, Integer> delta = buildMaterialMap(previous);
        Map<String, Integer> negative = new HashMap<>();
        delta.forEach((k, v) -> negative.put(k, -v));
        applyReservationDelta(negative);
        eventoRepository.deleteById(id);
    }

    private Map<String, Integer> buildMaterialMap(Evento evento) {
        Map<String, Integer> map = new HashMap<>();
        if (evento.getMateriales() == null) {
            return map;
        }
        for (EventoMaterial item : evento.getMateriales()) {
            if (item.getMaterialId() == null || item.getMaterialId().trim().isEmpty()) {
                continue;
            }
            Integer qty = item.getCantidad();
            if (qty == null || qty <= 0) {
                continue;
            }
            map.merge(item.getMaterialId(), qty, Integer::sum);
        }
        return map;
    }

    private Map<String, Integer> buildMaterialDelta(Evento previous, Evento current) {
        Map<String, Integer> prev = buildMaterialMap(previous);
        Map<String, Integer> curr = buildMaterialMap(current);
        Map<String, Integer> delta = new HashMap<>(curr);
        prev.forEach((k, v) -> delta.merge(k, -v, Integer::sum));
        delta.entrySet().removeIf(e -> e.getValue() == 0);
        return delta;
    }

    private void applyReservationDelta(Map<String, Integer> delta) {
        for (Map.Entry<String, Integer> entry : delta.entrySet()) {
            String materialId = entry.getKey();
            int change = entry.getValue();

            Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Material no encontrado"));

            int stockTotal = material.getStockTotal() == null ? 0 : material.getStockTotal();
            int stockReservado = material.getStockReservado() == null ? 0 : material.getStockReservado();
            int stockReparacion = material.getStockReparacion() == null ? 0 : material.getStockReparacion();
            int newReservado = stockReservado + change;

            if (newReservado < 0) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Stock reservado insuficiente para liberar");
            }
            if (newReservado + stockReparacion > stockTotal) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Stock insuficiente para reservar");
            }

            material.setStockReservado(newReservado);
            material.setStockDisponible(stockTotal - newReservado - stockReparacion);
            materialRepository.save(material);
        }
    }
}
