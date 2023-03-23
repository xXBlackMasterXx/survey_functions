function multiple_choice({ question_code, schema, randomize, array_filter, hide_answers, validation } = {}) {
    const question_card = document.querySelector(`#q_${question_code}_card`);
    const options_container = question_card.querySelector(`#p_${question_code}`);
    const form_checks = [...question_card.querySelectorAll(".form-check")];
    const options = form_checks.map((form_check) => {
        const answer = form_check.querySelector("input");
        const answer_code = answer.value;
        const label = form_check.querySelector("label > div > div").innerText;
        const open_text = form_check.querySelector("label > div:nth-child(2) > input");
        return { form_check, input: answer, label, open_text };
    });

    /* RANDOMIZATION */
    if (randomize !== undefined) {
        if (randomize["filter_schema"] !== undefined) {
            /* RANDOMIZE BASED ON PREVIOUS QUESTION */
            const filteredAnswers = response.answers.find((answer) => answer.questionCode === randomize["filter_schema"]);
            const filteredPositions = filteredAnswers ? filteredAnswers.value.split(",") : [];
            const filteredOptions = filteredPositions.map((position) => options[position]["form_check"]);
            const unfilteredOptions = Object.keys(options).filter((position) => !filteredPositions.includes(position)).map((position) => options[position]["form_check"]);
            const randomizedOptions = [...filteredOptions, ...unfilteredOptions].sort(() => 0.5 - Math.random());

            randomizedOptions.forEach((formCheck) => options_container.appendChild(formCheck));
        } else {
            /* DEFAULT BEHAVIOR */
            function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }

                return array;
            }

            const answerGroups = randomize["answer_groups"];
            const randomizeGroups = randomize["randomize_groups"];
            const randomizedOptions = [];

            answerGroups.forEach((group) => randomizedOptions.push(...shuffle(group)));

            if (randomizeGroups) {
                shuffle(randomizedOptions);
            }

            const randomizedFormChecks = randomizedOptions.map((position) => options[position]["form_check"]);
            const allFormChecks = Object.values(options).map((option) => option["form_check"]);
            const unrandomizedFormChecks = allFormChecks.filter((formCheck) => !randomizedFormChecks.includes(formCheck));

            randomizedFormChecks.forEach((formCheck) => options_container.appendChild(formCheck));
            unrandomizedFormChecks.forEach((formCheck) => options_container.appendChild(formCheck));

            if (schema !== undefined) {
                const dumpAt = document.querySelector(`#p_${schema}_1`);

                if (dumpAt === null) {
                    alert(`There is no such ${schema} open text to save the schema`);
                } else {
                    dumpAt.value = randomizedOptions.toString();
                }
            }
        }
    } else {
        if (schema !== undefined) {
            const dumpAt = document.querySelector(`#p_${schema}_1`);

            if (dumpAt === null) {
                alert(`There is no such ${schema} open text to save the schema`);
            } else {
                dumpAt.value = Object.keys(options).join(",");
            }
        }
    }

    /* ARRAY FILTER */
    if (array_filter !== undefined) {
        const filter_answers = [];
        let filter_schema;
        response.answers.forEach((answer) => {
            if (answer.questionCode === array_filter["filter"]) {
                filter_answers.push(Number(answer.code));
            }

            if (answer.questionCode === array_filter["filter_schema"]) {
                filter_schema = answer.value.split(",");
            }
        });

        for (const [key, value] of Object.entries(options)) {
            if (
                array_filter["type"] === "inclusive" &&
                !filter_answers.includes(Number(key)) &&
                filter_schema.includes(key)
            ) {
                value["form_check"].style.display = "none";
            } else if (
                array_filter["type"] === "exclusive" &&
                filter_answers.includes(Number(key)) &&
                filter_schema.includes(key)
            ) {
                value["form_check"].style.display = "none";
            }
        }
    }

    // Hide answer options
    if (hide_answers !== undefined) {
        for (const [key, value] of Object.entries(options)) {
            if (hide_answers.includes(Number(key))) {
                value.form_check.style.display = "none";
            }
        }
    }

    function handle_error_message(e, n_checked, validation, question_code, options_container) {
        e.preventDefault();
        let feedback = document.querySelector("#feedback_" + question_code);
        if (feedback != null) {
            feedback.remove();
        }

        let message;
        if (validation["n_required"] === undefined) {
            if (validation["min_limit"] !== undefined && n_checked < validation["min_limit"]) {
                message = "Please, select at least " + String(validation["min_limit"]) + " options";
            }
        } else {
            if (n_checked < validation["n_required"]) {
                message = "Please, select " + String(validation["n_required"]) + " options";
            }
        }

        if (message !== undefined) {
            options_container.insertAdjacentHTML(
                "beforebegin",
                `<span class="d-block custom-error pb-1 text-center" id="feedback_` + question_code + `">
                    <span class="form-error-message text-danger">` + message + `</span>
                </span>`
            );

            options_container.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        }
    }

    /* CHECKBOX VALIDATIONS */
    if (validation !== undefined) {
        function autocheck_free_text() {
            for (let [key, value] of Object.entries(options)) {
                if (value.open_text != null) {
                    value.open_text.addEventListener("input", (e) => {
                        if (e.target.value != "") {
                            value.input.checked = true;
                        } else {
                            value.input.checked = false;
                        }
                    });
                }
            }
        }

        function clear_unchecked() {
            for (let [key, value] of Object.entries(options)) {
                if (value.open_text != null && value.input.checked == false && value.open_text != "") {
                    value.open_text = "";
                }
            }
        }

        function count_checked() {
            autocheck_free_text();
            clear_unchecked();
            let n_checked = question_card.querySelectorAll(".form-check > input:checked").length;

            if ((validation["max_limit"] !== undefined && n_checked >= validation["max_limit"]) || (validation["n_required"] !== undefined && n_checked >= validation["n_required"])) {
                for (let [key, value] of Object.entries(options)) {
                    if (value.input.checked == false) {
                        value.input.disabled = true;
                        if (value.open_text != null) {
                            value.open_text.value = "";
                            value.open_text.disabled = true;
                        }
                    }
                }
            } else {
                for (let [key, value] of Object.entries(options)) {
                    if (value.input.disabled == true) {
                        value.input.disabled = false;
                        if (value.open_text != null) {
                            value.open_text.disabled = false;
                        }
                    }
                }
            }

            window.addEventListener("load", count_checked);
            question_card.addEventListener("change", count_checked);

            document.querySelector("#p_next").addEventListener("click", (e) => {
                handle_error_message(e, n_checked, validation, question_code, options_container);
            });
        }
    }

}
