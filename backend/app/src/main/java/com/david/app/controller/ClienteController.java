package com.david.app.controller;

import com.david.app.model.Cliente;
import com.david.app.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:4200")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping
    public List<Cliente> getAllClientes() {
        return clienteRepository.findAll();
    }

    @PostMapping
    public Cliente saveCliente(@RequestBody Cliente cliente) {
        Cliente normalized = normalize(cliente);
        if (clienteRepository.existsByNombre(normalized.getNombre())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un cliente con ese nombre");
        }
        return clienteRepository.save(normalized);
    }

    @PutMapping("/{id}")
    public Cliente updateCliente(@PathVariable String id, @RequestBody Cliente cliente) {
        Cliente normalized = normalize(cliente);
        if (clienteRepository.existsByNombreAndIdNot(normalized.getNombre(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un cliente con ese nombre");
        }
        normalized.setId(id);
        return clienteRepository.save(normalized);
    }

    @DeleteMapping("/{id}")
    public void deleteCliente(@PathVariable String id) {
        clienteRepository.deleteById(id);
    }

    private Cliente normalize(Cliente cliente) {
        if (cliente.getNombre() == null || cliente.getNombre().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }
        cliente.setNombre(cliente.getNombre().trim());
        if (cliente.getNif() == null) cliente.setNif("");
        if (cliente.getEmail() == null) cliente.setEmail("");
        if (cliente.getTelefono() == null) cliente.setTelefono("");
        if (cliente.getDireccion() == null) cliente.setDireccion("");
        if (cliente.getContacto() == null) cliente.setContacto("");
        if (cliente.getNotas() == null) cliente.setNotas("");
        return cliente;
    }
}
