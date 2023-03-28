"use strict";

function single_choice_matrix({ question_code, array_filter, exclusive_answers, hide_answers, validation } = {}) {
    var question_card = document.querySelector("#q_" + question_code + "_card");
    var matrix_container = question_card.querySelector("table.matrix");
    // Obtener todas las celdas con la clase .form-check
    const formCheckCells = matrix_container.querySelectorAll('.form-check');

    // Crear un objeto para almacenar las opciones de respuesta
    let answer_options = {};

    // Obtener las filas del tbody y del thead
    const tableRows = document.querySelectorAll('tbody tr, thead tr');

    function reverseNodeList(nodeList) {
        var nodeArray = Array.prototype.slice.call(nodeList);
        return nodeArray.reverse();
    }

    var column_codes = [];
    var col_i = 0;
    // Recorrer todas las filas
    reverseNodeList(tableRows).forEach((row, rowIndex) => {
        // Obtener los nodos de columna de la fila
        const colNodes = row.querySelectorAll('th, td');

        // Recorrer las columnas
        colNodes.forEach((colNode, colIndex) => {
            // Si es la primera fila, agregar una nueva propiedad al objeto answer_options
            if (rowIndex === tableRows.length - 1) {
                if (colIndex != 0) {
                    answer_options[0] = answer_options[0] || {};
                    answer_options[0][column_codes[col_i]] = {
                        form_check: null,
                        input: null,
                        rowNode: row,
                        colNode: colNode
                    };
                    col_i++;
                }
            } else {
                // Si no es la primera fila, obtener la celda .form-check de la columna
                const cell = colNode.querySelector('.form-check');

                if (cell) {
                    // Obtener el input de la celda
                    const input = cell.querySelector('input');

                    // Obtener el ID del input y dividirlo en secciones
                    const id = input.id;
                    const idSections = id.split('_');

                    // Obtener el número de fila y de columna
                    const rowId = idSections[2];
                    const col = input.value;

                    // Almacenar los datos en el objeto answer_options
                    answer_options[rowId] = answer_options[rowId] || {};
                    answer_options[rowId][col] = {
                        form_check: cell,
                        input: input,
                        rowNode: row,
                        colNode: colNode
                    };
                    if (rowIndex === 0) {
                        column_codes.push(col);
                    }
                }

            }
        });
    });

    /* RANDOMIZATION */


    /* ARRAY FILTER */
    if (array_filter !== undefined) {
        if (array_filter["rows"] !== undefined) {
            var filter = [];
            var filter_schema = [];

            response.answers.forEach((answer) => {
                if (answer.questionCode == array_filter["rows"]["filter"]) {
                    filter.push(answer.code);
                }

                if (answer.questionCode == array_filter["rows"]["filter_schema"]) {
                    filter_schema = answer.value.split(",");
                }
            });

            console.log("array_filter", filter);
            console.log("filter_schema", filter_schema);
            
            // Iterate over all the rows
            for (let [key, value] of Object.entries(answer_options)) {
                if (array_filter["rows"]["type"] == "inclusive") {
                    if (key != 0 && !filter.includes(key) && filter_schema.includes(key)) {
                        console.log(key, value);
                        console.log(value[Object.keys(value)[0]]);
                        value[Object.keys(value)[0]]["rowNode"].remove();
                    }
                } else if (array_filter["rows"]["type"] == "exclusive") {
                    if (key != 0 && filter.includes(key) && filter_schema.includes(key)) {
                        console.log(key, value);
                        console.log(value[Object.keys(value)[0]]);
                        value[Object.keys(value)[0]]["rowNode"].remove();
                    }
                }
            }
        }

        if (array_filter["columns"] !== undefined) {
            var filter = [];
            var filter_schema = [];

            response.answers.forEach((answer) => {
                if (answer.questionCode == array_filter["columns"]["filter"]) {
                    filter.push(answer.code);
                }

                if (answer.questionCode == array_filter["columns"]["filter_schema"]) {
                    filter_schema = answer.value.split(",");
                }
            });

            console.log("array_filter", filter);
            console.log("filter_schema", filter_schema);

            for (let [key, value] of Object.entries(answer_options)) {
                if (array_filter["columns"]["type"] == "inclusive") {
                    console.log("row", key)
                    for (let [key2, value2] of Object.entries(value)) {
                        if (!filter.includes(key2) && filter_schema.includes(key2)) {
                            console.log("cols", value);
                            console.log("col", key2, "value", value2);
                            value2.colNode.remove();
                        }
                    }

                } else if (array_filter["columns"]["type"] == "exclusive") {
                    for (let [key2, value2] of Object.entries(value)) {
                        if (filter.includes(key2) && filter_schema.includes(key2)) {
                            value2.colNode.remove();
                        }
                    }
                }
            }
        }
    }

    /* EXCLUSIVE ANSWERS */
    if (exclusive_answers !== undefined) {
        if (exclusive_answers["columns"] !== undefined) {
            console.log("exclusive answers", exclusive_answers);
            matrix_container.addEventListener("change", () => {
                // Iterate over rows
                for (let [row, value] of Object.entries(answer_options)) {
                    if(row != 0){
                        var exclude_siblings = false;
                        var exclusive_checked;
                        exclusive_answers["columns"].forEach((column_code) => {
                            if(value[column_code] !== undefined && value[column_code].input.checked == true){
                                exclude_siblings = true;
                                exclusive_checked = column_code;
                                
                                return; // breaks the foreach
                            }
                        })
                        
                        for (let [col, value2] of Object.entries(value)) {
                            if(exclude_siblings == true && col != exclusive_checked){
                                value2.input.disabled = true;
                                value2.input.checked = false;
                            } else {
                                value2.input.disabled = false;
                            }
                        }

                        console.log("row", row);
                        console.log("exclude_siblings", exclude_siblings);
                        console.log("exclude_checked", exclusive_checked);
                    }
                }
            });
        }
    }

    /* HIDE COLS AND ROWS */
    if(hide_answers !== undefined) {
        if(hide_answers["rows"] !== undefined){
            // Iterate answer rows configured by user
            hide_answers["rows"].forEach((row) => {
                if(Object.keys(answer_options).includes(String(row))) {
                    var this_row = answer_options[String(row)];
                    this_row[Object.keys(this_row)[0]]["rowNode"].remove();
                }
            });
        }

        if(hide_answers["columns"] !== undefined) {
            // Iterate over rows
            for (let [row, value] of Object.entries(answer_options)) {
                for (let [col, value2] of Object.entries(value)) {
                    if (hide_answers["columns"].includes(Number(col))) {
                        value2.colNode.remove();
                    }
                }
            }
        }
    }

    /* MAKE ROWS NOT REQUIRED */
    /* SET MIN,MAX & REQ CHECKS PER ROW */
    if(validation !== undefined) {
        if(validation["n_required"] !== undefined) {
            
        } else if(validation["max_limit"]) {

        }
    }

    /* HANDLE MESSAGE ERRORS */
    document.querySelector("#p_next").addEventListener("click", (e) => {
        if ( (array_filter !== undefined && array_filter["rows"] !== undefined) || (hide_answers !== undefined && hide_answers["rows"] !== undefined) ) {
            var n_checked;
            var displayed_rows = matrix_container.querySelectorAll("tbody > tr");
            console.log("validating rows");
            displayed_rows.forEach((row) => {
                console.log(row);
                n_checked = row.querySelectorAll("input:checked").length;
                if (n_checked == 0) {
                    e.preventDefault();
                    var feedback = document.querySelector("#feedback_" + question_code);
                    if (feedback != null) {
                        feedback.remove();
                    }

                    matrix_container.insertAdjacentHTML(
                        "beforebegin",
                        `<span class="d-block custom-error pb-1 text-center" id="feedback_` + question_code + `">
                        <span class="form-error-message text-danger">Please select an answer for each row</span></span>`
                    );

                    question_card.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
                    return; // breaks the foreach
                }
            });
        }
    });
}

single_choice_matrix({
    question_code: "Q3",
    hide_answers : {
        rows : [3], 
        columns : [1]
    }
})