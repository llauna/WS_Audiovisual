package com.david.app.repository;

import com.david.app.model.RegistroHoras;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroHorasRepository extends MongoRepository<RegistroHoras, String> {
}
