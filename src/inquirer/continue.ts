import inquirer from "inquirer";

export const userContinue: inquirer.QuestionCollection<{ start: boolean }> = {
  type: "confirm",
  name: "start",
  message: "Continue?",
};
