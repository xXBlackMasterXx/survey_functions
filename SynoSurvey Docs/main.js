var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/xXBlackMasterXx/survey_functions/SynoSurvey%20Docs/single_choice.js';
document.body.appendChild(script);

window.addEventListener("load", () => {
    single_choice({
        question_code: "Q1",
        randomize: {
            filter_schema: "Q0xSCHEMA",
            /* OR */
            answer_groups: [[1, 2]],
            randomize_groups: true
        },
        array_filter: {
            filter: "Q0",
            filter_schema: "Q0xSCHEMA",
            type: "inclusive"
        },
        hide_answers: [1, 2]
    });
});

var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/xXBlackMasterXx/survey_functions/SynoSurvey%20Docs/multiple_choice.js';
document.body.appendChild(script);

window.addEventListener("load", () => {
    single_choice({
        question_code: "Q1",
        randomize: {
            filter_schema: "Q0xSCHEMA",
            /* OR */
            answer_groups: [[1, 2]],
            randomize_groups: true
        },
        array_filter: {
            filter: "Q0",
            filter_schema: "Q0xSCHEMA",
            type: "inclusive"
        },
        hide_answers: [1, 2],
        validation: {
            n_required: 1,
            /* OR */
            min_limit: 1,
            max_limit: 2
        }
    });
});
