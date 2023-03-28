"use strict";

function single_choice_matrix({ question_code } = {}) {
    var question_code = "M1";
    var question_card = document.querySelector("#q_" + question_code + "_card");
    var matrix_container = question_card.querySelector("table.matrix");
    // Obtener todas las celdas con la clase .form-check
    const form_check_cells = document.querySelectorAll('.form-check');

    // Crear un objeto para almacenar las opciones de respuesta
    let answer_options = {};

    // Recorrer todas las celdas .form-check
    form_check_cells.forEach((cell) => {
        // Obtener el input de la celda
        const input = cell.querySelector('input');

        // Obtener el ID del input y dividirlo en secciones
        const id = input.id;
        const idSections = id.split('_');

        // Obtener el número de fila y de columna
        const row = idSections[2];
        const col = input.value;

        // Almacenar los datos en el objeto answer_options
        answer_options[row] = answer_options[row] || {};
        answer_options[row][col] = {
            form_check: cell,
            input: input,
        };
    });

    

    /* RANDOMIZATION */

    /* ARRAY FILTER */
    /* EXCLUSIVE OPTIONS */
    /* HIDE COLS AND ROWS */
    /* HANDLE MESSAGE ERRORS */
}