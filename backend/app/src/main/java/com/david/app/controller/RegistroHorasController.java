package com.david.app.controller;

import com.david.app.model.RegistroHoras;
import com.david.app.repository.EventoRepository;
import com.david.app.repository.PersonalRepository;
import com.david.app.repository.RegistroHorasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/horas")
@CrossOrigin(origins = "http://localhost:4200")
public class RegistroHorasController {

    @Autowired
    private RegistroHorasRepository registroHorasRepository;

    @Autowired
    private PersonalRepository personalRepository;

    @Autowired
    private EventoRepository eventoRepository;

    @GetMapping
    public List<RegistroHoras> getAll() {
        return registroHorasRepository.findAll();
    }

    @PostMapping
    public RegistroHoras create(@RequestBody RegistroHoras registro) {
        RegistroHoras normalized = normalize(registro);
        return registroHorasRepository.save(normalized);
    }

    @PutMapping("/{id}")
    public RegistroHoras update(@PathVariable String id, @RequestBody RegistroHoras registro) {
        RegistroHoras normalized = normalize(registro);
        normalized.setId(id);
        return registroHorasRepository.save(normalized);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        registroHorasRepository.deleteById(id);
    }

    private RegistroHoras normalize(RegistroHoras registro) {
        if (registro.getPersonalId() == null || registro.getPersonalId().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El tecnico es obligatorio");
        }
        if (!personalRepository.existsById(registro.getPersonalId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El tecnico no existe");
        }
        if (registro.getEventoId() != null && !registro.getEventoId().trim().isEmpty()
            && !eventoRepository.existsById(registro.getEventoId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El evento no existe");
        }
        if (registro.getFecha() == null || registro.getFecha().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha es obligatoria");
        }
        Double horas = registro.getHoras() == null ? 0 : registro.getHoras();
        Double tarifa = registro.getTarifaHora() == null ? 0 : registro.getTarifaHora();
        if (horas <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Las horas deben ser mayores que 0");
        }
        if (tarifa < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La tarifa no puede ser negativa");
        }
        String tipo = registro.getTipo();
        if (tipo == null || tipo.trim().isEmpty()) {
            tipo = "Plantilla";
        }
        registro.setTipo(tipo);
        registro.setHoras(horas);
        registro.setTarifaHora(tarifa);
        if (registro.getNotas() == null) {
            registro.setNotas("");
        }
        return registro;
    }
}
