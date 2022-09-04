let timer;
let deleteFirstPhotoDelay;

async function start() {                                                 // Definning a function caled "start" and attaching "async" to it to make it async.

   // Incase there are errors with fetching the data :
try {   //  If all goes OK.
    const response = await fetch("https://dog.ceo/api/breeds/list/all") // A "response" variable to house the action of awaiting for the fetched data from the specified URL.
    const data = await response.json();     // A data" variable to house the action of awaiting for the fetched data that in the "response" variable to be modified into a JSON format.
    creatBreedList(data.message);
} catch (e) {   // "catch" is to handle errors if there is a problem, The "e" parameter is for older browsers, it contains information about the exact error that happened.
    console.log("There was a problem fetching the breed list.")
    }
}

start();

function creatBreedList(breedList) {    // This "creatBreedList" function is responsible for creating the HTML representation from the received datd, the name in the parameter (argument) inside the parenthesis could be anything we choose and it is infact an object of properties.

    document.getElementById("breed").innerHTML = `                  
    <select onchange="loadByBreed(this.value)">     
        /* "onchang" reffers to the selectiong from the select menu we would call the function "loadByBreed", "this.value" refers to the value of the selected option. */
    <option>Choose a dog breed</option>
    ${Object.keys(breedList).map(function (breed) {  /* This line would return an array, and by default in javascript all arrays has access to the "map" method. */  
        return `<option>${breed}</option>`  /* The function inside "map" would run once for each item in the array and return "<option>${breed}</option>" for each element*/  
    }).join('')}            /* Since we are in a template literal the new returned array has commas inbetween each element, .join('') eliminates those commas  */ 
                                                 
    </select>
    `
}

async function loadByBreed(breed) { // A "loadByBreed" function to get the data with the specified "breed" selection, This function's purpose is to load the data.
    if (breed != "Choose a dog breed") {    // This means that an option has been selected from the options menu.
        const response = await fetch (`https://dog.ceo/api/breed/${breed}/images`) 
         // A "response" variable to house the action of awaiting for the fetched data from  the specified URL with the defined parameter "breed" that specifies the breed selection.
        const data = await response.json()   
        // A "data" variable to house the action of awaiting for the fetched data that in the "response" variable to be modified into a JSON format.
        createSlideShow(data.message);
    }
}

function createSlideShow(images) {  // This function's purpose is to create the HTML in the empty slideshow div, and it would run every time we choose a new dog breed.
 /* There are 2 dives in order of achiving the fade out effect of one image and the fade in effect of the next image. */
    let currenPosition = 0;
    clearInterval(timer);    // This is to cancel the delay once a new breed is selected.
    clearTimeout(deleteFirstPhotoDelay); // This is to cancel the delay once a new breed is selected.
    
    if (images.length > 1) { // Incase there is mmore than 1 images in the breed array selection.
        document.getElementById("slideshow").innerHTML = `  
    <div class="slide" style="background-image: url('${images[0]}')"></div> 
    <div class="slide" style="background-image: url('${images[1]}')"></div>
    `
    currenPosition += 2;    // Because we need 2 images at a time.
    if (images.length == 2) currenPosition = 0; // Incase there are only 2 images.

    timer =  setInterval(nextSlide, 3000)
    } else {  // Incase there is only 1 image in the breed array selection.
        document.getElementById("slideshow").innerHTML = `  
    <div class="slide" style="background-image: url('${images[0]}')"></div> 
    <div class="slide"></div>
    `
    }

    function nextSlide() {  // We are doing ths so that in the next slide we would have access to the current position variable.
        document.getElementById("slideshow").insertAdjacentHTML("beforeend", `<div class="slide" style="background-image: url('${images[currenPosition]}')"></div>`)
        deleteFirstPhotoDelay = setTimeout(function() {     // This is to make the previouse image disappear, its in a variable so we can refferance it to clear it.
            document.querySelector(".slide").remove();
        } , 1000);
        // After the "setTimeout" function we want to increase the current position by 1, and if we reach the eend of all available images we would circle back to 1.
        if (currenPosition + 1 >= images.length) {
            currenPosition = 0;
        } else {
            currenPosition++;
        }
    }
}