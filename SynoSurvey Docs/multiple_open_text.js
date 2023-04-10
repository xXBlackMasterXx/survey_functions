function multiple_open_text({ question_codes, numerical_validation, text_validation } = {}) {
  var question_cards = [];
  question_codes.forEach((question_code) => {
    question_cards.push(document.querySelector(`#q_${question_code}_card`));
  });

  // Create an object to save open text information
  var open_texts = {};

  question_cards.forEach((question_card, index) => {
    free_text = question_card.querySelector("input, textarea");
    open_texts[question_codes[index]] = free_text;
  });

  if (numerical_validation !== undefined && numerical_validation["required_sum"] !== undefined) {
    question_cards[0].insertAdjacentHTML(
      "beforebegin",
      `<div class="question card mb-5 px-4 pt-3 pb-4 border-0 bg-white" style="position: sticky; top: 0px; z-index: 100;"><div class="progress" style="height: 20px; position: sticky; top: 0px; z-index:100">
    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%" id="progressbar_sum">0%</div>
    </div></div>`
    );
  }

  function updateProgress(now, min, max) {
    const percentage = ((now - min) / (max - min)) * 100;
    const progressBar = document.querySelector("#progressbar_sum");
    progressBar.setAttribute('aria-valuenow', now);
    progressBar.setAttribute('aria-valuemin', min);
    progressBar.setAttribute('aria-valuemax', max);
    progressBar.style.width = `${percentage}%`;
    progressBar.textContent = `${now}%`;
    if (percentage <= 50) {
      progressBar.classList.remove('bg-info', 'bg-primary', 'bg-success', 'bg-danger');
      progressBar.classList.add('bg-warning');
    } else if (percentage <= 99) {
      progressBar.classList.remove('bg-warning', 'bg-primary', 'bg-success', 'bg-danger');
      progressBar.classList.add('bg-info');
    } else if (percentage == 100) {
      progressBar.classList.remove('bg-warning', 'bg-info', 'bg-primary', 'bg-danger');
      progressBar.classList.add('bg-success');
    } else {
      progressBar.classList.remove('bg-warning', 'bg-info', 'bg-primary', 'bg-success');
      progressBar.classList.add('bg-danger');
    }
  }

  for (let [key, value] of Object.entries(open_texts)) {
    value.addEventListener("input", (e) => {

      // If there is any numerical validation
      if (numerical_validation !== undefined) {
        // Set up the input to allow only numbers
        e.target.value = e.target.value.replace(/[^0-9]/g, "");

        // Set up the total sum if is required
        if (numerical_validation["required_sum"] !== undefined) {
          console.clear();
          console.log(`${key} : ${e.target.value}`);
          var sum = 0;
          Object.values(open_texts).forEach((open_text) => {
            sum += Number(open_text.value);
          });

          console.log("sum", sum);
          updateProgress(sum, 0, 100);
        }
      }
    });
  }

  document.querySelector("#p_next").addEventListener("click", (e) => {
    e.preventDefault();

    if (numerical_validation !== undefined) {
      for (let [key, input] of Object.entries(open_texts)) {
        if (input.value == "") {
          input.value = 0;
        }
      }
    }

    if (text_validation !== undefined) {
      if (text_validation["required_words"] !== undefined) {
        function count_words(str) {
          str = str.replace(/(^s*)| (s*$)/gi, "");
          str = str.replace(/[ ]{2,}/gi, " ");
          str = str.replace(/n /, "n");
          return str.split(' ').length;
        }

        for (let [key, input] of Object.entries(open_texts)) {
          if (count_words(input.value) < text_validation["required_words"] || input.value == "") {
            var input_container = input;
            while (!input_container.parentElement.classList.contains("card")) {
              input_container = input_container.parentElement;
            }

            feedback = document.querySelector("#feedback_" + key);
            if (feedback != null) {
              feedback.remove();
              input.classList.remove("is-invalid");
            }

            input.classList.add("is-invalid");
            input_container.insertAdjacentHTML(
              "beforebegin",
              `<span class="d-block custom-error pb-1 text-center" id="feedback_` + key + `"><span class="form-error-message text-danger">This field doesn't meet the required quantity of words</span>
                </span>`
            );

            document.querySelector(`#q_${key}_card`).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

          } else {
            feedback = document.querySelector("#feedback_" + key);
            if (feedback != null) {
              feedback.remove();
              input.classList.remove("is-invalid");
            }
          }
        }

      }
    }

  });
}

multiple_open_text({
  /* Define the question codes for each textbox */
  question_codes: ["Q1x1", "Q1x2", "Q1x3", "Q1x4", "Q1x5", "Q1x6"],
  /* Define numerical validations */
  /*numerical_validation: {
    min_value: 0, // Set a min val for each textbox
    max_value: 100, // Set a max val for each textbox
    max_length: 3, // Set a max character length for each textbox
    required_sum: 100 // Set a required sum
  },*/
  /* Define a word validation */
  text_validation: {
    required_words: 15 // Set a required amount of words per textbox
  }
});
