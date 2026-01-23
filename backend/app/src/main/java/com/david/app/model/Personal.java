package com.david.app.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "personal")
@Data
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class Personal {
    @Id
    private String id;
    private String nombre;
    private String apellidos;
    private String dni;
    private String cargo;
    private String telefono;
    private String email;
    @JsonAlias("tipocontrato") // acepta el nombre viejo al recibir
    private String tipoContrato;
    private String empresa;
    private String estado;
    private Double tarifaHora;
}
