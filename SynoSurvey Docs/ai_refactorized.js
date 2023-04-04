var question_code = "R3";
var validation = {
    /*"max_limit": 3,
    "min_limit" : 2*/
    "n_required" : 3
};

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

var row_checks = [];
if (validation !== undefined) {
    console.log("n_required", validation.n_required, "min_limit", validation.min_limit, "max_limit", validation.max_limit);

    function count_checked() {
        row_checks = [];
        // Iterate over rows
        for (let [row, value] of Object.entries(answer_options)) {
            if (row != 0) {
                var n_checked = 0;
                // Count n_check in this row
                for (let [col, value2] of Object.entries(value)) {
                    if (value2.input.checked == true) {
                        n_checked++;
                    }
                }
    
                console.log(`row ${row} has n_checked: ${n_checked}`);
    
                if ((validation["max_limit"] !== undefined && n_checked >= validation["max_limit"]) || (validation["n_required"] !== undefined && n_checked >= validation["n_required"])) {
                    for (let [col, value2] of Object.entries(value)) {
                        if (value2.input.checked == false) {
                            value2.input.disabled = true;
                        }
                    }
                } else {
                    for (let [col, value2] of Object.entries(value)) {
                        if (value2.input.disabled == true) {
                            value2.input.disabled = false;
                        }
                    }
                }
            }

            row_checks.push(n_checked);
        }
    }

    window.addEventListener("load", count_checked);
    matrix_container.addEventListener("change", count_checked);
}

document.querySelector("#p_next").addEventListener("click", (e) => {
    if(validation["n_required"] === undefined){
        if(validation["min_limit"] !== undefined){
            console.log("row checks validation: ", row_checks);
            row_checks.forEach((n_checked) => {
                if(n_checked < validation["min_limit"]){
                    e.preventDefault();
                    feedback = document.querySelector("#feedback_" + question_code);
                    if(feedback != null) {
                        feedback.remove();
                    }

                    matrix_container.insertAdjacentHTML(
                        "beforebegin",
                        `<span class="d-block custom-error pb-1 text-center" id="feedback_` + question_code + `">
                        <span class="form-error-message text-danger">Please, select at least `+ String(validation["min_limit"]) + ` option(s) per row</span></span>`
                    );

                    question_card.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

                    return; // breaks the forEach
                }
            });

        }

    } else {
        console.log("row checks required", row_checks);
        row_checks.forEach((n_checked) => {
            if(n_checked < validation["n_required"]){
                e.preventDefault();
                feedback = document.querySelector("#feedback_"+question_code);
                if(feedback!=null){
                    feedback.remove();
                }
    
                matrix_container.insertAdjacentHTML(
                    "beforebegin",
                    `<span class="d-block custom-error pb-1 text-center" id="feedback_` + question_code + `">
                    <span class="form-error-message text-danger">Please, select `+ String(validation["n_required"]) + ` option(s) per row</span></span>`
                );
    
                question_card.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
                
                return; // breaks the forEach
            }   
        });
    }
});