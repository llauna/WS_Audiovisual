package com.david.app.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "almacenes")
@Data
public class Almacen {
    @Id
    private String id;

    private String nombre;
    private String ubicacion;
    private String descripcion;
}
