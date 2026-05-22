package com.david.app.config;

import com.david.app.model.*;
import com.david.app.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final ClienteRepository clienteRepository;
    private final MaterialRepository materialRepository;
    private final PersonalRepository personalRepository;
    private final EventoRepository eventoRepository;
    private final RegistroHorasRepository registroHorasRepository;
    private final NotaGastoRepository notaGastoRepository;
    private final ObjectMapper objectMapper;

    @Bean
    @Profile("seed")
    public CommandLineRunner seedDatabase() {
        return args -> {
            log.info("🌱 Starting database seeding...");
            
            try {
                // Limpiar base de datos existente
                clearDatabase();
                
                // Cargar datos en orden correcto
                seedClientes();
                seedMateriales();
                seedPersonal();
                seedEventos();
                seedRegistroHoras();
                seedNotasGasto();
                
                log.info("✅ Database seeding completed successfully!");
                logStatistics();
                
            } catch (Exception e) {
                log.error("❌ Error during database seeding: {}", e.getMessage(), e);
                throw e;
            }
        };
    }

    private void clearDatabase() {
        log.info("🗑️  Clearing existing data...");
        registroHorasRepository.deleteAll();
        notaGastoRepository.deleteAll();
        eventoRepository.deleteAll();
        personalRepository.deleteAll();
        materialRepository.deleteAll();
        clienteRepository.deleteAll();
        log.info("✅ Database cleared");
    }

    private void seedClientes() throws IOException {
        log.info("👥 Seeding clientes...");
        List<Cliente> clientes = loadJsonData("seed-data/clientes.json", new TypeReference<List<Cliente>>() {});
        clienteRepository.saveAll(clientes);
        log.info("✅ {} clientes loaded", clientes.size());
    }

    private void seedMateriales() throws IOException {
        log.info("📦 Seeding materiales...");
        List<Material> materiales = loadJsonData("seed-data/materiales.json", new TypeReference<List<Material>>() {});
        materialRepository.saveAll(materiales);
        log.info("✅ {} materiales loaded", materiales.size());
    }

    private void seedPersonal() throws IOException {
        log.info("👨‍💼 Seeding personal...");
        List<Personal> personal = loadJsonData("seed-data/personal.json", new TypeReference<List<Personal>>() {});
        personalRepository.saveAll(personal);
        log.info("✅ {} personal records loaded", personal.size());
    }

    private void seedEventos() throws IOException {
        log.info("📅 Seeding eventos...");
        List<Evento> eventos = loadJsonData("seed-data/eventos.json", new TypeReference<List<Evento>>() {});
        eventoRepository.saveAll(eventos);
        log.info("✅ {} eventos loaded", eventos.size());
    }

    private void seedRegistroHoras() throws IOException {
        log.info("⏰ Seeding registro horas...");
        List<RegistroHoras> registros = loadJsonData("seed-data/registro_horas.json", new TypeReference<List<RegistroHoras>>() {});
        registroHorasRepository.saveAll(registros);
        log.info("✅ {} registro horas loaded", registros.size());
    }

    private void seedNotasGasto() throws IOException {
        log.info("💰 Seeding notas de gasto...");
        List<NotaGasto> notas = loadJsonData("seed-data/notas_gastos.json", new TypeReference<List<NotaGasto>>() {});
        notaGastoRepository.saveAll(notas);
        log.info("✅ {} notas de gasto loaded", notas.size());
    }

    private <T> List<T> loadJsonData(String filename, TypeReference<List<T>> typeReference) throws IOException {
        try (InputStream inputStream = new ClassPathResource(filename).getInputStream()) {
            return objectMapper.readValue(inputStream, typeReference);
        }
    }

    private void logStatistics() {
        log.info("📊 Database Statistics:");
        log.info("   • Clientes: {}", clienteRepository.count());
        log.info("   • Materiales: {}", materialRepository.count());
        log.info("   • Personal: {}", personalRepository.count());
        log.info("   • Eventos: {}", eventoRepository.count());
        log.info("   • Registros de horas: {}", registroHorasRepository.count());
        log.info("   • Notas de gasto: {}", notaGastoRepository.count());
    }
}
