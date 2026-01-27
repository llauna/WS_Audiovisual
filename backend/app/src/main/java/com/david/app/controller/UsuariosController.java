package com.david.app.controller;

import com.david.app.model.Usuario;
import com.david.app.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuariosController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<UsuarioResponse> getAll() {
        return usuarioRepository.findAll().stream()
            .map(u -> new UsuarioResponse(u.getId(), u.getUsername(), u.getEmail(), u.getRole()))
            .collect(Collectors.toList());
    }

    @PostMapping
    public UsuarioResponse create(@RequestBody UsuarioRequest request) {
        Usuario normalized = normalizeForCreate(request);
        Usuario saved = usuarioRepository.save(normalized);
        return new UsuarioResponse(saved.getId(), saved.getUsername(), saved.getEmail(), saved.getRole());
    }

    @PutMapping("/{id}")
    public UsuarioResponse update(@PathVariable String id, @RequestBody UsuarioRequest request) {
        Usuario current = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (request.username() != null && !request.username().trim().isEmpty()) {
            current.setUsername(request.username().trim());
        }
        if (request.email() != null && !request.email().trim().isEmpty()) {
            current.setEmail(request.email().trim());
        }
        if (request.role() != null && !request.role().trim().isEmpty()) {
            current.setRole(request.role().trim());
        }
        if (request.password() != null && !request.password().trim().isEmpty()) {
            current.setPassword(passwordEncoder.encode(request.password().trim()));
        }

        Usuario saved = usuarioRepository.save(current);
        return new UsuarioResponse(saved.getId(), saved.getUsername(), saved.getEmail(), saved.getRole());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        usuarioRepository.deleteById(id);
    }

    private Usuario normalizeForCreate(UsuarioRequest request) {
        String username = request.username() == null ? "" : request.username().trim();
        String email = request.email() == null ? "" : request.email().trim();
        String password = request.password() == null ? "" : request.password().trim();
        String role = request.role() == null || request.role().trim().isEmpty()
            ? "USER"
            : request.role().trim();

        if (username.isEmpty() && email.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuario o email es obligatorio");
        }
        if (password.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria");
        }

        Optional<Usuario> existingUsername = username.isEmpty()
            ? Optional.empty()
            : usuarioRepository.findByUsernameIgnoreCase(username);
        if (existingUsername.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El usuario ya existe");
        }
        Optional<Usuario> existingEmail = email.isEmpty()
            ? Optional.empty()
            : usuarioRepository.findByEmailIgnoreCase(email);
        if (existingEmail.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El email ya existe");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(password));
        usuario.setRole(role);
        return usuario;
    }

    public record UsuarioRequest(String username, String email, String password, String role) {}
    public record UsuarioResponse(String id, String username, String email, String role) {}
}
