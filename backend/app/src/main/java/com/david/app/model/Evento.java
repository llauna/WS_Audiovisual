package com.david.app.model;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "eventos")
@Data
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class Evento {
    @Id
    private String id;

    private String titulo;
    private String ubicacion;

    /**
     * Formato recomendado: YYYY-MM-DD (ej: 2026-03-15)
     */
    private String fecha;

    /**
     * Ej: "Evento", "Montaje", "Ensayo", "Otro"
     */
    private String tipo;

    /**
     * Ej: "blue", "orange", "green", "purple"
     */
    private String color;
}