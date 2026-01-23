package com.david.app.controller;

import com.david.app.model.Evento;
import com.david.app.repository.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "http://localhost:4200")
public class EventoController {

    @Autowired
    private EventoRepository eventoRepository;

    @GetMapping
    public List<Evento> getAllEventos() {
        return eventoRepository.findAll();
    }

    @PostMapping
    public Evento saveEvento(@RequestBody Evento evento) {
        System.out.println("Evento recibido: " + evento);
        return eventoRepository.save(evento);
    }

    @DeleteMapping("/{id}")
    public void deleteEvento(@PathVariable String id) {
        eventoRepository.deleteById(id);
    }
}