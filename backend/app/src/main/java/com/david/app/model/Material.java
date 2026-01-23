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
    private Integer stockReservado;
    private Integer stockReparacion;
    private Double tarifaDia;
    private String almacen;
    private String ubicacionAlmacen;
    private String estado;
}
