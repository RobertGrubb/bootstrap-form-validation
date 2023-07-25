/**
 * Bootstrap Form Validation V1.0
 *
 * @author Matt Grubb
 * @email matt@grubb.com
 *
 * Make sure JQuery is loaded before this script on the DOM.
 */

const BootstrapValidation = {
  utilities: {
    capitalizeFirstLetter: (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    bracketValue: (string) => {
      let matches = string.match(/\[(.*?)\]/);
      if (!matches) {
        return false;
      }
      return matches[1];
    },
    findPosition: (obj) => {
      var currenttop = -130;
      if (obj.offsetParent) {
        do {
          currenttop += obj.offsetTop;
        } while ((obj = obj.offsetParent));
        return [currenttop];
      }
    },
  },

  /**
   * Returns whether a string is a valid email
   * address.
   */
  validateEmail: (email) => {
    return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  },

  /**
   * Processes validation for an element
   * based on the validationRules provided.
   */
  process: (el) => {
    /**
     * Check if JQuery is loaded
     */
    if (window.$ === "undefined") {
      console.error("JQuery is not loaded.");
      return false;
    }

    /**
     * If the element does not exist
     */
    if (!$(el).length) {
      console.error(`${el} does not exist.`);
      return false;
    }

    /**
     * Set element variables
     */
    el = $(el);
    let validationRules = el.data("validate-validation");

    /**
     * Check if the element has validation rules set.
     */
    if (!validationRules) {
      console.error(`${el} has no validation rules set.`);
      return false;
    }

    validationRules = validationRules.split("|");
    const errors = [];
    let valid = true;

    const fieldName = el.attr("name") ? BootstrapValidation.utilities.capitalizeFirstLetter(el.attr("name").replace("_", " ")) : "This field";

    /**
     * Iterates through the validation rules
     * and does validation based on it.
     */
    for (let i = 0; i < validationRules.length; i++) {
      if (validationRules[i] === "trim") {
        /**
         * Trim the value of the element and update it.
         */
        el.val(el.val().trim());
      } else if (validationRules[i] === "required") {
        /**
         * If this is a checkbox, make sure it is checked if required.
         */
        if (el.attr("type") == "checkbox") {
          if (!el.is(":checked")) {
            errors.push(`${fieldName} is required`);
            valid = false;
          }
        } else {
          /**
           * If it does not have a value, return invalid.
           */
          if (!el.val()) {
            errors.push(`${fieldName} is required`);
            valid = false;
          }
        }

        /**
         * If the value has to be a valid email address
         */
      } else if (validationRules[i] === "email") {
        if (!BootstrapValidation.validateEmail(el.val())) {
          errors.push(`${fieldName} must be a valid email address.`);
          valid = false;
        }
        /**
         * If the validation is a minimum number of characters
         */
      } else if (validationRules[i] === "number") {
        if (isNaN(el.val()) === true) {
          errors.push(`${fieldName} must be a number.`);
          valid = false;
        }
      } else if (validationRules[i].includes("matches")) {
        /**
         * During the match validation rule, the identifier of the
         * input element loads the element, checks the value against the current
         * element's value, then returns valid or not.
         */

        /**
         * Get the bracket value
         */
        const bracketValue = BootstrapValidation.utilities.bracketValue(validationRules[i]);
        if (!bracketValue) {
          console.log("Matches validation requires an input element identifier (matches[#inputId])");
          continue;
        }

        /**
         * Get the matching element and make sure it exists
         */
        const matchingElement = $(bracketValue);
        if (!matchingElement.length) {
          console.log("Matches validation failed to run because the specified element does not exist.");
          continue;
        }

        /**
         * Setup matching element variables.
         */
        const matchingElementValue = matchingElement.val();
        if (!matchingElement.attr("name")) {
          console.log("Matches validation failed because the matching element does not have a name attribute.");
          continue;
        }

        const matchingElementName = BootstrapValidation.utilities.capitalizeFirstLetter(matchingElement.attr("name").replace("_", " "));

        if (el.val() !== matchingElementValue) {
          errors.push(`${fieldName} must match ${matchingElementName}`);
          valid = false;
        }
      } else if (validationRules[i].includes("min_length")) {
        const bracketValue = BootstrapValidation.utilities.bracketValue(validationRules[i]);

        if (!bracketValue) {
          console.log("Min length and max length should only have to parameters (ex min_length[2])");
          continue;
        }

        if (el.val().length < parseInt(bracketValue)) {
          errors.push(`${fieldName} must be atleast ${bracketValue} characters.`);
          valid = false;
        }
      } else if (validationRules[i].includes("max_length")) {
        const bracketValue = BootstrapValidation.utilities.bracketValue(validationRules[i]);

        if (!bracketValue) {
          console.log("Min length and max length should only have to parameters (ex min_length[2])");
          continue;
        }

        if (el.val().length > parseInt(bracketValue)) {
          errors.push(`${fieldName} must be equal to or less than ${bracketValue} characters.`);
          valid = false;
        }
      }
    }

    return {
      errors: errors,
      valid: valid,
    };
  },

  processForm: (el) => {
    // Variables set
    const errors = [];
    let valid = true;

    // Get the elements in the form that require validation
    const elements = $(el).find("*[data-validate-validation]").toArray();

    /**
     * Iterate through the element and validate
     * based on the validate-validation data attribute.
     */
    for (let i = 0; i < elements.length; i++) {
      const res = BootstrapValidation.process(elements[i]);

      errors.concat(res.errors);
      valid = res.valid;

      /**
       * Depending on whether valid is returned or not,
       * setup the validation errors on the element.
       */
      if (!res.valid) {
        const invalidFeedback = $(elements[i]).parent().find(".invalid-feedback");

        if (!invalidFeedback.length) {
          $(elements[i])
            .parent()
            .append(`<div class="invalid-feedback text-left">${res.errors.join("<br />")}</div>`);
        } else {
          $(elements[i]).parent().find(".invalid-feedback").html(res.errors.join("<br />"));
        }

        $(elements[i]).addClass("is-invalid");
      } else {
        // Clear validation from before.

        $(elements[i]).removeClass("is-invalid");
        $(elements[i]).parent().find(".invalid-feedback").remove();
      }
    }

    /**
     * If validation passes, submit the form.
     */
    if (valid === true) {
      $(this).find('button[type="submit"]').prop("disabled", false);
    }

    /**
     * Stop the submission if valid is false.
     */
    $(this).find('button[type="submit"]').prop("disabled", true);
  },
};

window.BootstrapValidation = BootstrapValidation;

$(function () {
  if (window.$ === "undefined") {
    console.error("Bootstrap is not loaded.");
    return false;
  }

  /**
   * On a form submit,
   */
  window.$('[data-validate-on-submit="true"], [data-validate-on-blur="true"]').on("submit", function (e) {
    // Prevent the default submission
    e.preventDefault();

    // Variables set
    const errors = [];
    let valid = true;

    // Get the elements in the form that require validation
    const elements = $(this).find("*[data-validate-validation]").toArray();

    /**
     * Iterate through the element and validate
     * based on the validate-validation data attribute.
     */
    for (let i = 0; i < elements.length; i++) {
      const res = BootstrapValidation.process(elements[i]);

      errors.concat(res.errors);

      if (res.valid === false) {
        valid = false;
      }

      /**
       * Depending on whether valid is returned or not,
       * setup the validation errors on the element.
       */
      if (!res.valid) {
        const invalidFeedback = $(elements[i]).parent().find(".invalid-feedback");

        if (!invalidFeedback.length) {
          $(elements[i])
            .parent()
            .append(`<div class="invalid-feedback text-left">${res.errors.join("<br />")}</div>`);
        } else {
          $(elements[i]).parent().find(".invalid-feedback").html(res.errors.join("<br />"));
        }

        $(elements[i]).addClass("is-invalid");
      } else {
        // Clear validation from before.

        $(elements[i]).removeClass("is-invalid");
        $(elements[i]).parent().find(".invalid-feedback").remove();
      }
    }

    if ($(this).data("validate-scroll-on-fail")) {
      window.scroll(0, BootstrapValidation.utilities.findPosition(this));
    }

    /**
     * If validation passes, submit the form.
     */
    if (valid === true) {
      e.target.submit();
      return true;
    }

    /**
     * Stop the submission if valid is false.
     */
    return false;
  });

  /**
   * On a input, textarea, select blur
   */
  window.$('[data-validate-on-blur="true"] input, [data-validate-on-blur="true"] textarea, [data-validate-on-blur="true"] select').on("blur", function (e) {
    // Variables set
    const errors = [];
    let valid = true;

    const res = BootstrapValidation.process(this);

    errors.concat(res.errors);
    valid = res.valid;

    /**
     * Depending on whether valid is returned or not,
     * setup the validation errors on the element.
     */
    if (!res.valid) {
      const invalidFeedback = $(this).parent().find(".invalid-feedback");

      if (!invalidFeedback.length) {
        $(this)
          .parent()
          .append(`<div class="invalid-feedback text-left">${res.errors.join("<br />")}</div>`);
      } else {
        $(this).parent().find(".invalid-feedback").html(res.errors.join("<br />"));
      }

      $(this).addClass("is-invalid");
    } else {
      // Clear validation from before.

      $(this).removeClass("is-invalid");
      $(this).parent().find(".invalid-feedback").remove();
    }

    BootstrapValidation.processForm($(this).closest("form"));
  });
});
