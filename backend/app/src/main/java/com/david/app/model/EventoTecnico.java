package com.david.app.model;

import lombok.Data;

@Data
public class EventoTecnico {
    private String personalId;
    private String nombre;
    private Double horas;
    private Double tarifaHora;
}
