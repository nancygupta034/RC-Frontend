import { defineRule, configure } from 'vee-validate';
// import AllRules from '@vee-validate/rules';
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  alpha_num as alphaNum,
  alpha,
  email,
  min_value as minVal,
  max_value as maxVal,
  not_one_of as excluded,
  confirmed, regex as regex_exp,
  numeric, url
} from "@vee-validate/rules";

export default defineNuxtPlugin(nuxtApp => {
    defineRule("required", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("alpha", alpha);
    defineRule("alpha_spaces", alphaSpaces);
    defineRule("alpha_num", alphaNum);
    defineRule("email", email);
    defineRule("min_value", minVal);
    defineRule("max_value", maxVal);
    defineRule("excluded", excluded);
    defineRule("country_excluded", excluded);
    defineRule("password_mismatch", confirmed);
    defineRule("numeric", numeric);
    defineRule("url", url);
    defineRule("regex", regex_exp);
    defineRule('hyphen_numeric', (value) => {
      return /^[0-9-]*$/.test(value);
    });
    // Object.keys(AllRules).forEach(rule => {
    //     defineRule(rule, AllRules[rule]);
    //     defineRule('hyphen_numeric', (value) => {
    //       return /^[0-9-]*$/.test(value);
    //     });
    // }); 

    configure({
        validateOnInput: true,
        generateMessage: (context) => {
            const messages = {
              required: `This field is required.`,
              regex: `This field is invalid.`,
              hyphen_numeric: `This field can accept only numeric digit`,
              min: `The value of this field is too short.`,
              max: `The value of this field is too long.`,
              alpha_spaces: `This field can only contain letters and spaces.`,
              email: `This is not a valid email.`,
              min_value: `This field is too low.`,
              max_value: `This field is too high.`,
              excluded: "This field is not allowed.",
              country_excluded: "We do not allow users from this location",
              password_mismatch: `This ${context.field} field does not match.`,
            };
            const message = messages[context.rule.name]
              ? messages[context.rule.name]
              : `The field is invalid`;
            return message;
          },
    });
})