package com.david.app.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "materiales")
@Data
public class Material {
    @Id
    private String id;

    private String nombre;
    private String categoria;
    private Integer stockTotal;
    private Integer stockDisponible;
    private String ubicacionAlmacen;
    private String estado;
}