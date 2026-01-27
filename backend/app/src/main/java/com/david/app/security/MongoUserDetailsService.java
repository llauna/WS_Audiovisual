package com.david.app.security;

import com.david.app.model.Usuario;
import com.david.app.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MongoUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsernameIgnoreCase(username)
            .orElseGet(() -> usuarioRepository.findByEmailIgnoreCase(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado")));

        String role = usuario.getRole() == null || usuario.getRole().trim().isEmpty()
            ? "USER"
            : usuario.getRole().trim();
        String principal = usuario.getUsername() != null && !usuario.getUsername().isBlank()
            ? usuario.getUsername()
            : usuario.getEmail();

        return new User(
            principal,
            usuario.getPassword(),
            List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
        );
    }
}
