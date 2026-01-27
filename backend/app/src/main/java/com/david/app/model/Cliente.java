package com.david.app.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "clientes")
@Data
public class Cliente {
    @Id
    private String id;

    private String nombre;
    private String nif;
    private String email;
    private String telefono;
    private String direccion;
    private String contacto;
    private String notas;
}
