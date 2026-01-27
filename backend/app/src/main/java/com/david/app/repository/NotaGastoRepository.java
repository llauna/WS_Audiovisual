package com.david.app.repository;

import com.david.app.model.NotaGasto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaGastoRepository extends MongoRepository<NotaGasto, String> {
    List<NotaGasto> findByEventoId(String eventoId);
}
