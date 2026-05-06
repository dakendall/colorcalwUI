const formEl = document.getElementById("calc-form");

const goalEyesEl = document.getElementById("goal-eyes");
const goalBody1El = document.getElementById("goal-body1");
const goalBody2El = document.getElementById("goal-body2");
const goalExtra1El = document.getElementById("goal-extra1");
const goalExtra2El = document.getElementById("goal-extra2");

const currEyesEl = document.getElementById("current-eyes");
const currBody1El = document.getElementById("current-body1");
const currBody2El = document.getElementById("current-body2");
const currExtra1El = document.getElementById("current-extra1");
const currExtra2El = document.getElementById("current-extra2");

const calcBtn = document.getElementById("calculate");

const resetBtn = document.getElementById("reset-btn");

const resultsContainer = document.querySelector(".results-container");
const resultsEl = document.getElementById("results");

const cpyAllBtn = document.getElementById("cpy-all");

const resultEyesEl = document.getElementById("eyes");
const resultBody1El = document.getElementById("body1");
const resultBody2El = document.getElementById("body2");
const resultExtra1El = document.getElementById("extra1");
const resultExtra2El = document.getElementById("extra2");

formEl.addEventListener("submit", calcHexCodes);

//Copy
resultsContainer.addEventListener("click", function (e) {
    //copy button
    if (e.target.classList.contains("copy-btn")) {
        const textValue = e.target.nextElementSibling.nextElementSibling.textContent;

        navigator.clipboard.writeText(textValue)
            .then(() => showCopySuccess(e.target))
            .catch((err) => console.log(err))
    } else if (e.target.classList.contains("result-info")) {
        const textValue = e.target.querySelector(".result-value").textContent;

        navigator.clipboard.writeText(textValue)
            .then(() => showCopySuccess(e.target.querySelector(".copy-btn")))
            .catch((err) => console.log(err))
    }
})

function showCopySuccess(element) {
    element.classList.remove("far", "fa-copy")
    element.classList.add("fas", "fa-check")

    element.style.color = "#48bb78";

    setTimeout(() => {
        element.classList.remove("fas", "fa-check");
        element.classList.add("far", "fa-copy");
        element.style.color = "";
    }, 1500);
}

function calcHexCodes(e) {
    e.preventDefault();     //prevent reloading the page

    resultsEl.classList.add("hidden"); //makes sure results are hidden

    calcBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Calculating...';
    calcBtn.disabled = true;

    //check input 
    const isValidHexCode = checkHexCode([goalEyesEl, goalBody1El, goalBody2El, goalExtra1El, goalExtra2El,
        currEyesEl, currBody1El, currBody2El, currExtra1El, currExtra2El
    ]);

    //calculate
    if (isValidHexCode) {
        const calcEyes = getDifference(goalEyesEl, currEyesEl);
        const calcBody1 = getDifference(goalBody1El, currBody1El);
        const calcBody2 = getDifference(goalBody2El, currBody2El);
        const calcExtra1 = getDifference(goalExtra1El, currExtra1El);
        const calcExtra2 = getDifference(goalExtra2El, currExtra2El);

        resultEyesEl.textContent = calcEyes;
        resultBody1El.textContent = calcBody1;
        resultBody2El.textContent = calcBody2;
        resultExtra1El.textContent = calcExtra1;
        resultExtra2El.textContent = calcExtra2;

        resultsEl.classList.remove("hidden");

        currEyesEl.value = "";
        currBody1El.value = "";
        currBody2El.value = "";
        currExtra1El.value = "";
        currExtra2El.value = "";
    }

    //reset submit button text
    calcBtn.innerHTML = '<span>Calculate</span><i class="fa-solid fa-calculator"></i >';
    calcBtn.disabled = false;
}

//reset form
resetBtn.addEventListener("click", () => {
    formEl.reset();
    resultsEl.classList.add("hidden");

    //take off error msgs
    document.querySelectorAll(".input-field").forEach(group => {
        group.className = "input-field";
    });

});

cpyAllBtn.addEventListener("click", () => {
    let values = [];

    values = Array.from(document.querySelectorAll(".result-value"))
        .map(group => group.textContent);

    let allResults = [`Eyes: ${values[0]}`,
    `Body 1: ${values[1]}`,
    `Body 2: ${values[2]}`,
    `Extra 1: ${values[3]}`,
    `Extra 2: ${values[4]}`
    ].join("\n")

    navigator.clipboard.writeText(allResults);
});

//check if hex code is valid
function checkHexCode(inputArray) {
    let isValid = true;

    inputArray.forEach(input => {
        const inputValue = input.value.trim();

        if (inputValue === "") {
            showError(input, `${formatFieldName(input)} is required`);
            isValid = false;
        } else if (inputValue.length != 6) {
            showError(input, `${formatFieldName(input)} must be 6 characters`);
            isValid = false;
        } else {
            for (let i = 0; i < inputValue.length; i++) {
                if (!((input.value.charAt(i) >= 0 && input.value.charAt(i) <= 9
                    || (input.value.charAt(i) >= 'A' && input.value.charAt(i) <= 'F')
                    || (input.value.charAt(i) >= 'a' && input.value.charAt(i) <= 'f')))) {
                    showError(input, `${formatFieldName(input)} is not a valid hex code`)
                    isValid = false;
                } else {
                    const inputGroup = input.parentElement;
                    inputGroup.className = "input-field";
                }
            }

        }
    })

    return isValid;
}

// Format field name with proper capitalization
function formatFieldName(input) {
    return input.name.charAt(0).toUpperCase() + input.name.slice(1);
}

function showError(input, message) {
    const inputGroup = input.parentElement;
    inputGroup.className = "input-field error";
    const small = inputGroup.querySelector("small");
    small.innerText = message;
}

function getDifference(goalInput, currInput) {

    let text;

    const goalValue = goalInput.value.trim();
    const currValue = currInput.value.trim();

    const goalRGB = getRGB(goalValue);
    const currRGB = getRGB(currValue);

    const red = goalRGB[0] - currRGB[0];
    const green = goalRGB[1] - currRGB[1];
    const blue = goalRGB[2] - currRGB[2];

    if (goalRGB[0] > currRGB[0]) {
        text = "-" + Math.abs(red);
    } else if (goalRGB[0] < currRGB[0]) {
        text = "+" + Math.abs(red);
    } else {
        text = Math.abs(red);
    }

    text += " ";

    if (goalRGB[1] > currRGB[1]) {
        text += "-" + Math.abs(green);
    } else if (goalRGB[1] < currRGB[1]) {
        text += "+" + Math.abs(green);
    } else {
        text += Math.abs(green);
    }

    text += " ";

    if (goalRGB[2] > currRGB[2]) {
        text += "-" + Math.abs(blue);
    } else if (goalRGB[2] < currRGB[2]) {
        text += "+" + Math.abs(blue);
    } else {
        text += Math.abs(blue);
    }

    return text;
}

function getRGB(input) {
    let rgb = new Array(3);

    rgb[0] = parseInt(input.slice(0, 2), 16); //red
    rgb[1] = parseInt(input.slice(2, 4), 16); //green
    rgb[2] = parseInt(input.slice(4, 6), 16);//blue

    return rgb;
} 