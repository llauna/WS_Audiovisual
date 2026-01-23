package com.david.app.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "registro_horas")
@Data
public class RegistroHoras {
    @Id
    private String id;

    private String personalId;
    private String fecha; // YYYY-MM-DD
    private Double horas;
    private String tipo; // Plantilla / Extra
    private Double tarifaHora;
    private String notas;
}
