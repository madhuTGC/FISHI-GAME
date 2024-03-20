window.onload = function() {
    if (assessmentTypeGame){
      showWelcomePopup();
    }
}
    // const gameContainer = document.querySelector("#game-container");
    const clickContainer = document.querySelector("#click-container");
    const fishingLine = document.querySelector("#line");
    // const startScreen = document.querySelector("#start-screen");
    const startTitle = document.querySelector("#start-title");
    const infoWrapper = document.querySelector("#info-wrapper");
    // const instructions = document.querySelector("#instructions");
    const startBtn = document.querySelector("#start-btn");
    const gameStats = document.querySelector("#game-stats");
    const gameGoal = document.querySelector("#game-goal");
    // const gameDay = document.querySelector("#game-day");
    const gameTimer = document.querySelector("#game-timer");
    const gameTimerGauge = document.querySelector(".timer-gauge");
    const gameScore = document.querySelector("#game-score");
    let assessmentScore = document.getElementById("assessment-score");
    var mousePosition = {
        x:0,
        y:0
    }
    var gameTimerInterval = null;
    var day = 2;
    var score = 0;
    var currentScore = 0;
    var fishTracker = [0,0,0] //first item is fish, second is rare fish. no sharks as it will lead to autolose

    //initialise the create items interval variables
    var createFishInterval = null;
    var createRareFishInterval = null;
    var createBlackFishInterval = null;
    // var createJellyfishInterval = null;
    // var createSharkInterval = null;

    var days = [{
        "day": 0,
        "score": 20,
        "instruction": "<p>You are on a fishing trip!<br>There are total of 2 days to go through.<br>You need to get a certain score to proceed to the next day</p><p>Happy fishing!</p>"
    },{
        "day": 1,
        "score": 30,
        "instruction": "You can catch rare fishes now.<br>They are fast, so be ready!"
    },{
      "day": 2,
      "score": 35,
      "instruction": "Lately, more trash are found in the ocean.<br>There is penalty if you catch some.<br> Let's continue and avoid the trash!"
  }
];

    //music and sounds
    var bgm; //set bgm
    var blop; //fish sound
    var rareBlop; // rare fish sound
    var trashSound; // trash sound
    var bzzt; //jellyfish zapping sound
    var bite; //shark bite sound

    //event listeners
    startBtn.addEventListener("click", startGame);
    clickContainer.addEventListener("mousemove", checkCursor);
    

    // function checkCursor (event){
    //     //update cursor co ordinates
    //     mousePosition.x = event.clientX;
    //     mousePosition.y = event.clientY;
    //     //set fishing line to follow cursor
    //     fishingLine.style.left= mousePosition.x+"px";
    //     fishingLine.style.top = mousePosition.y+"px";
    // }
    function checkCursor(event) {
      console.log("event",event);
      // Check if it's a touch event
      if (event.type === 'touchstart' || event.type === 'touchmove') {
          // Update cursor coordinates for touch event
          mousePosition.x = event.touches[0].clientX;
          mousePosition.y = event.touches[0].clientY;
      } else {
          // Update cursor coordinates for mouse event
          mousePosition.x = event.clientX;
          mousePosition.y = event.clientY;
      }
  
      // Set fishing line to follow cursor
      fishingLine.style.left = mousePosition.x + "%";
      fishingLine.style.top = mousePosition.y + "%";
  }
  
  // Add event listeners for both mouse and touch events
  document.addEventListener('mousemove', checkCursor);
  document.addEventListener('touchmove', checkCursor);
  document.addEventListener('touchstart', checkCursor);
  
    //create audio element for playing music and sfx
    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play();
        }
        this.stop = function(){
            this.sound.pause();
        }
    }

    //start game function
    function startGame() {
        if (!assessmentTypeGame){
        document.querySelector(".chances").style.display = 'flex';
        // document.getElementById("clock").style.display = 'block';
        document.querySelector(".assessment-scorebg").style.display = 'block';

        }
        document.querySelector(".chances").style.display = 'flex';
        document.querySelector(".assessment-scorebg").style.display = 'block';
        document.querySelector(".scorebg").style.display = 'block';
        
        gameGoal.style.display = "none";
        // document.querySelector(".start-page").style.backgroundImage = "url('../finnyfishAssets/new_bg.gif')";        //day = 4;
        //initialise sounds
        blop = new sound('sfx/fish.mp3');
        rareBlop = new sound('sfx/rare-fish.mp3');
        trashSound = new sound('sfx/trash.mp3');
        bzzt = new sound('sfx/bzzt.mp3');
        bite = new sound('sfx/bite.mp3');
        bgm = new sound('sfx/Bug_Catching.mp3');
        bgm.play();
        if (day === 0){
            fishTracker = [0,0,0,0,0];
            score = 0;
        }
        currentScore=0;
        infoWrapper.style.display = "none";
        startTitle.style.display = "none";
        clickContainer.style.display = "block";
        // gameStats.style.display = "flex";
        // gameGoal.style.display = "block";
        createItems();
    }

    //create items function
    function createItems() {
        // if (!assessmentTypeGame) {
        createTimer();
        // }
        day++;
        // gameDay.innerText = "Day 0"+day;
        gameGoal.innerText = `Goal: ${currentScore}/${days[day-1].score}`;
        //start creating items depending on the day
        switch (day) {
            case 1:
                createFishInterval = setInterval(createFish, 250);
                break;

            case 2:
                createFishInterval = setInterval(createFish, 350);
                createRareFishInterval = setInterval(createRareFish, 2200);
                break;
            case 3:
              createFishInterval = setInterval(createFish, 450);
              createRareFishInterval = setInterval(createRareFish, 2000);
              createBlackFishInterval = setInterval(createBlackFish, 900);
              break;

        }
    }

    //create timer function
    function createTimer () {
        gameTimer.innerText = "15s";
        // gameScore.innerText = "Coins: 0";
        // assessmentScore.textContent = "Score: 0";
        let sec = 0;
        if (!assessmentTypeGame){
        gameTimerInterval = setInterval(startGameTimer, 1000);
        }
        function startGameTimer () {
            gameTimer.textContent = 1500-sec+"s";
            if (sec === 1500) {
                sec = 0;
                endDay(false);
                gameTimer.textContent = 1500-sec+"s";
                gameTimer.classList.remove("warning");
                gameTimerGauge.classList.remove("ticking");
                showGameOverPopup();
                async function postData() {
                    const postGamePlayData = [
                      {
                          "ID_ORGANIZATION": ParamOrgID,
                          "id_user": UID[0].Id_User,
                        // "id_user": 123,
                          "Id_Assessment": null,
                          "Id_Game": id_game,
                          "attempt_no": null,
                          "id_question": null,
                          "is_right": null,
                          "score": score,
                          "Id_Assessment_question_ans": null,
                          "Time": 45,
                          "M2ostAssessmentId": M2OstAssesmentID,
                          "status": "A"
                      }
                    ];
                  
                    try {
                      // Convert the data to JSON
                      const postData = JSON.stringify(postGamePlayData);
                  
                      // Make a POST request to the API endpoint
                      const response = await fetch('https://www.playtolearn.in/Mini_games_beta/api/GamePlayDetailsUserLog', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // Add any additional headers if required
                        },
                        body: postData
                      });
                  
                      if (!response.ok) {
                        throw new Error('Network response was not ok');
                      }
                  
                      const data = await response.json();
                      console.log('Response:', data);
                    } catch (error) {
                      console.error('There was a problem with the fetch operation:', error);
                    }
                  } postData();
            }
            else {
                if (sec === 1) {
                    gameTimerGauge.classList.add("ticking");
                }
                if (sec > 9){
                    gameTimer.classList.add("warning");
                }
                sec++
            }
        }
    }

    //create fish function
    function createFish () {
        let fish = document.createElement("div");
        fish.classList.add("item");
        fish.classList.add("fish");
        clickContainer.appendChild(fish);
        setPosition(fish);
        fish.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!fish.classList.contains("caught")){
                fish.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(fish)){
                    clickContainer.removeChild(fish);
                }
            }, 350);
        }, 1500);
    }

    //create rare fish function
    function createRareFish () {
        let fish = document.createElement("div");
        fish.classList.add("item");
        fish.classList.add("rare-fish");
        clickContainer.appendChild(fish);
        setPosition(fish);
        fish.addEventListener("mouseover", hit);
        setTimeout(function() {
            if (!fish.classList.contains("caught")){
                fish.classList.add("disappear");
            }
            setTimeout(function() {
                if (clickContainer.contains(fish)){
                    clickContainer.removeChild(fish);
                }
            }, 350);

        }, 1500);
    }
    function createBlackFish () {
      let fish = document.createElement("div");
      fish.classList.add("item");
      fish.classList.add("black-fish");
      clickContainer.appendChild(fish);
      setPosition(fish);
      fish.addEventListener("mouseover", hit);
      setTimeout(function() {
          if (!fish.classList.contains("caught")){
              fish.classList.add("disappear");
          }
          setTimeout(function() {
              if (clickContainer.contains(fish)){
                  clickContainer.removeChild(fish);
              }
          }, 350);

      }, 1500);
  }

  //   function createTrash () {
  //     let fish = document.createElement("div");
  //     fish.classList.add("item");
  //     fish.classList.add("trash");
  //     clickContainer.appendChild(fish);
  //     setPosition(fish);
  //     fish.addEventListener("mouseover", hit);
  //     setTimeout(function() {
  //         if (!fish.classList.contains("caught")){
  //             fish.classList.add("disappear");
  //         }
  //         setTimeout(function() {
  //             if (clickContainer.contains(fish)){
  //                 clickContainer.removeChild(fish);
  //             }
  //         }, 350);

  //     }, 1500);
  // }


    // function setPosition(item) {
    //     let leftPos = Math.floor(Math.random() * (clickContainer.offsetWidth)-100); //-100
    //     let topPos = Math.floor(Math.random() * ((clickContainer.offsetHeight/5*4)-100)+(clickContainer.offsetHeight/5));
    //     // if it a type of sea creature and is not trash
    //     if (!item.classList.contains("trash")) {
    //         let randomNum = Math.floor(Math.random()*2);
    //         //left side
    //         if (randomNum%2 === 0){
    //             if (!item.classList.contains("jellyfish")){
    //                 leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth/4)-100));
    //             }
    //             else {
    //                 leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth/2)-100));
    //             }
    //             setInterval(function(){
    //                 if (item.classList.contains("fish")) {
    //                     leftPos+=45;
    //                 }
    //                 else if (item.classList.contains("rare-fish")){
    //                     leftPos+=45;
    //                 }
    //                 else if (item.classList.contains("black-fish")){
    //                   leftPos+=45;
    //                 }
    //                 item.style.left = leftPos+"px";
    //                 item.style.top = topPos+"px";
    //             }, 100);
    //             item.classList.add("left");
    //         }
    //         //right side
    //         else {
    //             if (!item.classList.contains("jellyfish")){
    //             leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth/4)-100)+(clickContainer.offsetWidth/4*3));
    //             }
    //             else {
    //                 leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth/2)-100)+(clickContainer.offsetWidth/2));
    //             }
    //             setInterval(function(){
    //                 if (item.classList.contains("fish")) {
    //                    leftPos-=45;
    //                 }
    //                 else if (item.classList.contains("rare-fish")){
    //                    leftPos-=45;
    //                 }
    //                 else if (item.classList.contains("black-fish")){
    //                   leftPos-=45;
    //                }
    //                 item.style.left = leftPos+"px";
    //                 item.style.top = topPos+"px";
    //             }, 100);
    //             item.classList.add("right");
    //         }
    //         item.style.left = leftPos+"px"
    //         item.style.top = topPos+"px";
    //     }
    //     //if it is trash
    //     else {
    //         item.style.left = leftPos+"px";
    //         item.style.top = topPos+"px";
    //     }
    // }
  //   function setPosition(item) {
  //     let leftPos = Math.floor(Math.random() * (clickContainer.offsetWidth-1000)); //-100
  //     let topPos = Math.floor(Math.random() * ((clickContainer.offsetHeight / 5 * 4) - 100) + (clickContainer.offsetHeight / 5));
  //     // if it's not trash
  //     if (!item.classList.contains("trash")) {
  //         let randomNum = Math.floor(Math.random() * 2);
  //         //left side
  //         if (randomNum % 2 === 0) {
  //             if (!item.classList.contains("jellyfish")) {
  //                 leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth / 4) - 100));
  //             } else {
  //                 leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth / 2) - 100));
  //             }
  //             setInterval(function () {
  //                 leftPos += 45;
  //                 item.style.left = leftPos + "px";
  //                 item.style.top = topPos + "px";
  //             }, 120);
  //             item.classList.add("left");
  //         }
  //         //right side
  //         else {
  //             if (!item.classList.contains("jellyfish")) {
  //                 leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth / 4) - 100) + (clickContainer.offsetWidth / 4 * 3));
  //             } else {
  //                 leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth / 2) - 100) + (clickContainer.offsetWidth / 2));
  //             }
  //             setInterval(function () {
  //                 leftPos -= 45;
  //                 item.style.left = leftPos + "px";
  //                 item.style.top = topPos + "px";
  //             }, 120);
  //             item.classList.add("right");
  //         }
  //         item.style.left = leftPos + "px"
  //         item.style.top = topPos + "px";
  //     }
  //     //if it is trash
  //     else {
  //         item.style.left = leftPos + "px";
  //         item.style.top = topPos + "px";
  //     }
  // }
  function setPosition(item) {
    let leftPos = Math.floor(Math.random() * (clickContainer.offsetWidth)); //-100
    let topPos = Math.floor(Math.random() * ((clickContainer.offsetHeight / 5 * 4) - 100) + (clickContainer.offsetHeight / 5));
    
    // Check if it's not trash
    if (!item.classList.contains("black-fish")) {
        let randomNum = Math.floor(Math.random() * 2);
        
        // Left side movement
        if (randomNum % 2 === 0) {
            if (!item.classList.contains("jellyfish")) {
                leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth / 4) - 100));
            } else {
                leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth / 2) - 100));
            }
            
            setInterval(function() {
                leftPos += 45;
                item.style.left = leftPos + "px";
                item.style.top = topPos + "px";
            }, 120);
            
            item.classList.add("left");
        }
        // Right side movement
        else {
            if (!item.classList.contains("jellyfish")) {
                leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth / 4) - 100) + (clickContainer.offsetWidth / 4 * 3));
            } else {
                leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth / 2) - 100) + (clickContainer.offsetWidth / 2));
            }
            
            setInterval(function() {
                leftPos -= 45;
                item.style.left = leftPos + "px";
                item.style.top = topPos + "px";
            }, 120);
            
            item.classList.add("right");
        }
        
        item.style.left = leftPos + "px"
        item.style.top = topPos + "px";
    } 
    // If it is trash, move it like a rare fish
    else {
        let randomNum = Math.floor(Math.random() * 2);
        
        // Left side movement
        if (randomNum % 2 === 0) {
          leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth / 2) - 50));
          setInterval(function() {
                leftPos += 45;
                item.style.left = leftPos + "px";
                item.style.top = topPos + "px";
            }, 120);
            item.classList.add("left");
        }
        // Right side movement
        else {
          leftPos = Math.floor(Math.random() * ((clickContainer.offsetWidth / 2) - 100) + (clickContainer.offsetWidth / 2));
          setInterval(function() {
                leftPos -= 45;
                item.style.left = leftPos + "px";
                item.style.top = topPos + "px";
            }, 120);
            item.classList.add("right");
        }
        
        item.style.left = leftPos + "px";
        item.style.top = topPos + "px";
    }
}
// function setPosition(item) {
//   let leftPos;
//   let topPos;

//   // Calculate initial position based on screen size
//   if (window.innerWidth < 768) {
//       // For smaller screens (e.g., mobile devices), adjust positioning accordingly
//       leftPos = Math.floor(Math.random() * (window.innerWidth - 100));
//       topPos = Math.floor(Math.random() * ((window.innerHeight / 5 * 4) - 100) + (window.innerHeight / 5));
//   } else {
//       // For larger screens, use original positioning
//       leftPos = Math.floor(Math.random() * (clickContainer.offsetWidth - 100));
//       topPos = Math.floor(Math.random() * ((clickContainer.offsetHeight / 5 * 4) - 100) + (clickContainer.offsetHeight / 5));
//   }

//   // Check if it's not trash
//   if (!item.classList.contains("black-fish")) {
//       // Calculate left position based on random movement
//       if (Math.random() < 0.5) { // Move to left
//           leftPos = (window.innerWidth < 768) ? Math.floor(Math.random() * ((window.innerWidth / 4) - 100)) : Math.floor(Math.random() * ((clickContainer.offsetWidth / 4) - 100));
//           item.classList.add("left");
//       } else { // Move to right
//           leftPos = (window.innerWidth < 768) ? Math.floor(Math.random() * ((window.innerWidth / 2) - 100) + (window.innerWidth / 2)) : Math.floor(Math.random() * ((clickContainer.offsetWidth / 2) - 100) + (clickContainer.offsetWidth / 2));
//           item.classList.add("right");
//       }

//       // Animate movement
//       setInterval(function() {
//           if (item.classList.contains("left")) {
//               leftPos += 45;
//           } else {
//               leftPos -= 45;
//           }
//           item.style.left = leftPos + "px";
//           item.style.top = topPos + "px";
//       }, 120);}
//   // } else {
//   //     // Trash item movement
//   //     if (Math.random() < 0.5) { // Move to left
//   //         leftPos = (window.innerWidth < 768) ? Math.floor(Math.random() * ((window.innerWidth / 2) - 50)) : Math.floor(Math.random() * ((clickContainer.offsetWidth / 2) - 50));
//   //         item.classList.add("left");
//   //     } else { // Move to right
//   //         leftPos = (window.innerWidth < 768) ? Math.floor(Math.random() * ((window.innerWidth / 2) - 100) + (window.innerWidth / 2)) : Math.floor(Math.random() * ((clickContainer.offsetWidth / 2) - 100) + (clickContainer.offsetWidth / 2));
//   //         item.classList.add("right");
//   //     }

//   //     // Animate movement
//   //     setInterval(function() {
//   //         if (item.classList.contains("left")) {
//   //             leftPos += 45;
//   //         } else {
//   //             leftPos -= 45;
//   //         }
//   //         item.style.left = leftPos + "px";
//   //         item.style.top = topPos + "px";
//   //     }, 120);
//   // }

//   // Set initial position
//   item.style.left = leftPos + "px";
//   item.style.top = topPos + "px";
// }



    // function hit(event) {
    //     if (!fishingLine.classList.contains("zapped")) {
    //         let type = event.target.classList;
    //         let hitText = document.createElement('span');
    //         hitText.setAttribute('class','hit-text');
    //         this.parentNode.insertBefore(hitText,this);
    //         hitText.style.left = this.style.left;
    //         hitText.style.top = this.style.top;
    //         if (!this.classList.contains("caught")){
    //             this.classList.add("caught");
    //             if (type.contains("fish")) {
    //                 hitText.innerText = "+1";
    //                 hitText.style.color = "#00ffcd";
    //                 blop.play();
    //                 score++;
    //                 currentScore++;
    //                 fishTracker[0]++;
    //                 // displayQuestion();
    //                 openModal();
    //             }
    //             else if (type.contains("rare-fish")) {
    //                 hitText.innerText = "+5";
    //                 hitText.style.color = "#9766d3";
    //                 rareBlop.play();
    //                 score+=5;
    //                 currentScore+=5;
    //                 fishTracker[1]++;
    //             }
    //             setTimeout(function() {
    //                 clickContainer.removeChild(hitText);
    //             }, 1000);
    //             gameScore.innerText = `Score: ${score}`;
    //             gameGoal.innerText = `Goal: ${currentScore}/${days[day-1].score}`;
    //         }
    //     }
    // }
    // Function to handle the hit event
function hit(event) {
    // Check if the game is paused
    if (!gamePaused) {
        if (!fishingLine.classList.contains("zapped")) {
            let type = event.target.classList;
            let hitText = document.createElement('span');
            hitText.setAttribute('class','hit-text');
            this.parentNode.insertBefore(hitText,this);
            hitText.style.left = this.style.left;
            hitText.style.top = this.style.top;
            if (!this.classList.contains("caught")){
                this.classList.add("caught");
                if (type.contains("fish")) {
                    hitText.innerText = "+10";
                    hitText.style.color = "red";
                    blop.play();
                    score+=10;
                    currentScore+=10;
                    fishTracker[0]++;
                    // displayQuestion();
                    // openModal();
                    // pauseGame();
                }
                else if (type.contains("rare-fish")) {
                    hitText.innerText = "+20";
                    hitText.style.color = "#9766d3";
                    rareBlop.play();
                    score+=20;
                    currentScore+=20;
                    fishTracker[1]++;
                }
              //   else if (type.contains("black-fish")){
              //     // hitText.innerText = "-3";
              //     // hitText.style.color = "#ff5252";
              //     trashSound.play();
              //     // score-=3;
              //     // currentScore-3;
              //     fishTracker[2]++;
              //     removeHeart();
              //     resumeGame();
              // }
                setTimeout(function() {
                    clickContainer.removeChild(hitText);
                }, 1000);
                gameScore.innerText = `Coins: ${score}`;
                assessmentScore.textContent = `Score: ${points}`;
                gameGoal.innerText = `Goal: ${currentScore}/${days[day-1].score}`;
            }
        }
    }
}

    function endDay(died) {
        bgm.stop();
        clearInterval(gameTimerInterval);
        clearInterval(createFishInterval);
        clearInterval(createRareFishInterval);
        // clearInterval(createTrashInterval);
        clearInterval(createBlackFishInterval);

        let remainingItems = document.querySelectorAll(".item");
        for (var i=0;i<remainingItems.length;i++){
            clickContainer.removeChild(remainingItems[i]);
        }
        // gameStats.style.display = "none";
        document.getElementById("clock").style.display = 'none';
        // document.querySelector(".scorebg").style.display = 'none';
        // document.querySelector(".scorebg").style.display = 'none';

        clickContainer.style.display = "none";
        gameGoal.style.display = "none";
        // startBtn.style.top = "66%";
        // if (!died) {
        //     console.log (`Day${day}`);
        //     if (day < 2) {
        //         if (currentScore<=days[day-1].score){
        //             document.getElementById("start-title").src = "../finnyfishAssets/Finny_Fish_Game_Over.png";
        //             document.getElementById("start-btn").style.display = "none";
        //             day=0;
        //         }
        //         else {
        //             document.getElementById("start-title").src = "../finnyfishAssets/Finny_Fish_Game_Over.png";
        //             document.getElementById("start-btn").style.display = "none";                }
        //     }
        //     else {
        //         document.getElementById("start-title").src = "../finnyfishAssets/Finny_Fish_Game_Over.png";
        //         document.getElementById("start-btn").style.display = "none";
        //         day=0;
        //     }

        // }
        // else {
        //     day = 0;
        //     document.getElementById("start-title").src = "../finnyfishAssets/Finny_Fish_Game_Over.png";
        //     document.getElementById("start-btn").style.display = "none";
        //     }
        // infoWrapper.style.display = "block";
        // startTitle.style.display = "block";
    }
    function removeHeart() {
      // Find the heart elements
      const hearts = document.querySelectorAll('.chances img');
      
      // Loop through the hearts to find the first visible one
      let foundVisibleHeart = false;
      
        if (!assessmentTypeGame){
          for (let i = 0; i < hearts.length; i++) {
          if (hearts[i].style.display !== 'none') {
            // Hide this heart
            hearts[i].style.display = 'none';
            life();
            pauseGame();
            // gameStarted = true;
            foundVisibleHeart = true;
            break; // Stop looping after hiding one heart
          }}
      // } else{
      //   for (let i = 0; i < hearts.length; i++) {
      //     if (hearts[i].style.display !== 'none') {
      //       hearts[i].style.display = 'none';
      //       life();
      //       pauseGame();
      //       // gameStarted = false;
      //       foundVisibleHeart = true;
      //      break;
            
      //     } 
      //   }
      }
      
    
      // If no visible heart was found, reset to 5 hearts
      if (!foundVisibleHeart && assessmentTypeGame) {
        hearts.forEach(heart => {
          // points-=10;
          // updateScoreDisplay()
          heart.style.filter = 'block'; // Display all hearts
        });  
      }
      if (!foundVisibleHeart && !assessmentTypeGame) {
        // Iterate through each heart
        for (let i = 0; i < hearts.length; i++) {
          // Hide the heart
          hearts[i].style.display = 'none';
      
          // Show game over popup after hiding all hearts
          if (i === hearts.length - 1) {
            showGameOverPopup();
            postData();
          }
      
          // Define the postData function
          async function postData() {
            const postGamePlayData = [{
              "ID_ORGANIZATION": ParamOrgID,
              "id_user": UID[0].Id_User,
              "Id_Assessment": null,
              "Id_Game": id_game,
              "attempt_no": null,
              "id_question": null,
              "is_right": null,
              "score": score,
              "Id_Assessment_question_ans": null,
              "Time": 45,
              "M2ostAssessmentId": M2OstAssesmentID,
              "status": "A"
            }];
      
            try {
              // Convert the data to JSON
              const postData = JSON.stringify(postGamePlayData);
      
              // Make a POST request to the API endpoint
              const response = await fetch('https://www.playtolearn.in/Mini_games_beta/api/GamePlayDetailsUserLog', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  // Add any additional headers if required
                },
                body: postData
              });
      
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
      
              const data = await response.json();
              console.log('Response:', data);
            } catch (error) {
              console.error('There was a problem with the fetch operation:', error);
            }
          }
      
          // Call the async function
          
        }
      }
      
    }
    
    
    
    function life() {
      document.getElementById("lifePopup").style.display = 'block';
      // gameStarted = false;
      // run();
    }

    //Make bubbles
    var bubbles = document.getElementById('bubbles');
    var randomN = function(start, end){
        return Math.random()*end+start;
    };
    var bubbleNumber = 0,
    generateBubble = function(){
        if(bubbleNumber < 20){
            var bubble = document.createElement('div');
            var size = randomN(5, 10);
            bubble.setAttribute('style','width: '+size+'px; height: '+size+'px; left:'+randomN(1, bubbles.offsetWidth-(size+4) )+'px;');
            bubbles.appendChild(bubble);
            bubbleNumber++;
        }
        else {
          clearInterval(bubbleInterval);
        }
    };
    
    generateBubble();
    var bubbleInterval = setInterval(generateBubble, 500);

    // instructions.innerHTML = `<p>${days[day].instruction}</p>`;




// variables assigned
const loader = document.getElementById("loader");
const cursor = document.querySelector(".cursor");
const holes = [...document.querySelectorAll(".hole")];
// let score = 0;
const timerElement = document.getElementById("timer");
let timerSeconds = 60;
var url = new URL(window.location.href);
var urlParams = new URLSearchParams(window.location.search);
let paramUserID = urlParams.get("Email");
let ParamOrgID = urlParams.get("OrgID");
let M2OstAssesmentID = urlParams.get("M2ostAssessmentId");
let id_game = urlParams.get("idgame");
let gameAssesmentId = urlParams.get("gameassid");
let currentQuestionIndex = 0;
let UID = [];
let questionList = [];
let index = 0;
let timerInterval;
let currentQuestion;
let assessmentData = [];
let assessmentObject = [];
let selectedOptionData = null;
let submitBtn;
let points = 0;

let assessmentTypeGame;

if (url.href.includes("gameassid")) {
//   scoreBoard.style.display = 'none';
document.getElementById("clock").style.display = 'none';
  assessmentTypeGame = true;
  showWelcomePopup();
  displayQuestion();
}
else{
    // document.getElementById("clock").style.display = 'block';
    // createTimer();
    loader.style.display = "none";

      async function postData() {
        const postGamePlayData = [
          {
              "ID_ORGANIZATION": ParamOrgID,
            //   "id_user": UID[0].Id_User,
            "id_user": 123,
              "Id_Assessment": null,
              "Id_Game": id_game,
              "attempt_no": null,
              "id_question": null,
              "is_right": null,
              "score": points,
              "Id_Assessment_question_ans": null,
              "Time": 45,
              "M2ostAssessmentId": M2OstAssesmentID,
              "status": "A"
          }
        ];
      
        try {
          // Convert the data to JSON
          const postData = JSON.stringify(postGamePlayData);
      
          // Make a POST request to the API endpoint
          const response = await fetch('https://www.playtolearn.in/Mini_games_beta/api/GamePlayDetailsUserLog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any additional headers if required
            },
            body: postData
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json();
          console.log('Response:', data);
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
      }
      
      // Call the async function
    //   postData();
      
}

// Function to show instruction before game start
function showWelcomePopup() {
  let startPage = document.querySelector(".start-page");
  startPage.classList.add("blur");
  document.getElementById("welcomePopup").classList.remove("hide");
  document.getElementById("start-btn").style.display = "none";
}

// Function to close the start instruction and start the game
function closeWelcomePopup() {
  let startPage = document.querySelector(".start-page");
  startPage.classList.remove("blur");
  document.getElementById("welcomePopup").classList.add("hide");
  document.getElementById("start-btn").style.display = "block";
  document.getElementById("welcomePopup").style.display = "none";
  document.getElementById("lifePopup").style.display = "none";
// resumeGame();
}

// Function to show the gameOver popup
function showGameOverPopup() {
  document.getElementById("gameOverPopup").style.display = "block";
  // document.getElementById("assessment-scorebg").style.display = "none";

  endDay(false);
}


// 
async function getIdUser(
  url = `https://www.playtolearn.in/Mini_games_beta/api/UserDetail?OrgId=${ParamOrgID}&Email=${paramUserID}`
) {
  try {
   
    const response = await fetch(url, { method: "GET" });
    const encryptedData = await response.json();
    const IdUser = JSON.parse(encryptedData);
    console.log(IdUser);
    UID.push(IdUser);
    console.log(UID[0].Id_User);
    // getDetails();
    if (assessmentTypeGame) {
      getDetails();
    //   document.getElementById("timerContainer1").style.display = 'none'
    //   loader.style.display = "none";  
    }
    document.getElementById("welcomePopup").style.display = 'none';
    return encryptedData;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
}

async function getDetails(
  url = `https://www.playtolearn.in/Mini_games_beta/api/GetAssessmentDataList?OrgID=${ParamOrgID}&UID=${UID[0].Id_User}&M2ostAssessmentId=${M2OstAssesmentID}&idgame=${id_game}&gameassid=${gameAssesmentId}`
) {
  try {
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      throw new Error(
        `Network response was not ok, status code: ${response.status}`
      );
    }
    
    const encryptedData = await response.json();
    questionList = JSON.parse(encryptedData);
    loader.style.display = 'none';
    document.getElementById("welcomePopup").style.display = 'block';

    console.log("ResponseData", questionList);
    return encryptedData;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", initializePage);

async function initializePage() {
  try {
    await getIdUser();
  } catch (error) {
    console.error("Error during initialization:", error.message);
  }
}

async function saveAssessment(data) {
  try {
    let postData = data;

    const baseUrl = "https://www.playtolearn.in/";
    const endpoint = "Mini_games_beta/api/assessmentdetailuserlog";
    const url = baseUrl + endpoint;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Save Assessment Error:", error.message);
    throw error;
  }
}
 
async function saveAssessmentMasterLog(data) {
  try {
    let postData = data;

    const baseUrl = "https://www.playtolearn.in/";
    const endpoint = "Mini_games_beta/api/gameusermasterlog";
    const url = baseUrl + endpoint;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    const responsedata = await response.json();
    return responsedata;
  } catch (error) {
    console.error("Save Assessment Master Log Error:", error.message);
    throw error;
  }
}




// Function to open the question modal on hit 
function openModal() {
    
  if (assessmentTypeGame) {
    pauseGame();
  document.getElementById("questionModal").style.display = "block";
//   document.querySelector(".cursor").style.display = "none";
  displayQuestion();
  clearInterval(timerInterval);
  startTimer();
  gameStarted = false;
//   run();
  }
  else{
    document.getElementById("questionModal").style.display = "none";
    gameStarted =true;
    // run()
  }
}

// Function  to close the question modal
function closeModal() {
//   document.querySelector(".cursor").style.display = "block";
  document.getElementById("questionModal").style.display = "none";
  clearInterval(timerInterval);
  gameStarted = true;
  // resumeGame();
//   run();
}

// document.getElementById("timer").innerHTML = "10 sec";

// Function to start the timer
function startTimer() {
  let timer = 10;
  // Function to update the timing whenever new question appears
  function updateTimerDisplay() {
    document.getElementById("timer").innerHTML = `${timer} Sec`;
  }

  // Set the timer duration in seconds
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    if (timer > 0) {
      timer--; // Update the timer before decrementing
      updateTimerDisplay();
      gameStarted = false;
    } else {
      clearInterval(timerInterval);
      closeModal();
      index++;
      if (index <= questionList.length) {
        assessmentData.push({
          ...currentQuestion,
          selectedOptionIndex: null,
        });
        if (index === questionList.length){
          onGameOver();
          document.getElementById("questionModal").style.display = "none";
         gameStarted = false;
        }
      }
      updateTimerDisplay();
    }
  }, 1000);
}

function displayQuestion() {
  currentQuestion = questionList[index];
  const questionText = document.getElementById("questionText");
  const optionsContainer = document.querySelector(".radio-container");
  const errorText = document.getElementById("error-text");

  if (currentQuestion) {
    // Display question text
    questionText.textContent = currentQuestion.Assessment_Question;
    // Clear previous options
    optionsContainer.innerHTML = "";

    // Display answer options
    currentQuestion.optionList.forEach((option, optionIndex) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "group";
      input.value = optionIndex + 1; // Adding 1 to make the value unique for each option
      label.appendChild(input);
      label.appendChild(document.createTextNode(option.Answer_Description));
      optionsContainer.appendChild(label);
    });

    // Clear error text
    errorText.textContent = "";

    // Get the assessment type
    const assessmentType = currentQuestion.Assessment_Type;
    console.log("at", assessmentType);

    // Depending on the assessment type, add the corresponding content
    const contentDiv = document.getElementById("contentDiv");

    // Clear previous content
    contentDiv.innerHTML = "";

    switch (assessmentType) {
      case 1:
        // Add image
        const imageUrl = currentQuestion.assessment_question_url;
        const imageElement = document.createElement("img");
        imageElement.src = imageUrl;
        imageElement.alt = "Image Alt Text";
        imageElement.classList.add("assessment-image"); // Add class
        contentDiv.appendChild(imageElement);
        break;

      case 2:
        // Add audio
        const audioUrl = currentQuestion.assessment_question_url;
        const audioElement = document.createElement("audio");
        audioElement.controls = true;
        audioElement.src = audioUrl;
        contentDiv.appendChild(audioElement);
        break;

      case 3:
        // Add video
        const videoUrl = currentQuestion.assessment_question_url;
        const videoElement = document.createElement("video");
        videoElement.controls = true;
        videoElement.src = videoUrl;
        videoElement.classList.add("assessment-video"); // Add class
        contentDiv.appendChild(videoElement);
        break;

      default:
        // Handle other assessment types or provide a default behavior
        contentDiv.textContent = "Unsupported assessment type";
    }
  } 
}

// Function to store the details in the post api called above on gameOver 
function onGameOver() {
  // Check if all questions have been answered
  let saveAssessmentData = [];
  let assementDataForMasterLog = [];

  const mergedData = assessmentData.map((game) => ({ ...game }));

  for (let i = 0; i < mergedData.length; i++) {
    const currentQuestionData = mergedData[i];
    const selectedOptionIndex = currentQuestionData.selectedOptionIndex;
    console.log(selectedOptionIndex);
    if (selectedOptionIndex !== null) {
      let model = {
        ID_ORGANIZATION: ParamOrgID,
        id_user: UID[0].Id_User,
        Id_Assessment: currentQuestionData.Id_Assessment,
        Id_Game: currentQuestionData.Id_Game,
        attempt_no: currentQuestionData.allow_attempt,
        id_question: currentQuestionData.Id_Assessment_question,
        is_right: currentQuestionData.optionList[selectedOptionIndex].Right_Ans,
        score: currentQuestionData.optionList[selectedOptionIndex].Score_Coins,
        Id_Assessment_question_ans:
          currentQuestionData.optionList[selectedOptionIndex]
            .Id_Assessment_question_ans,
        Time: timerSeconds,
        M2ostAssessmentId: M2OstAssesmentID,
      };

      let modelForGameMasterLog = {
        ID_ORGANIZATION: ParamOrgID,
        id_user: UID[0].Id_User,
        Id_Room: mergedData[0].Id_Assessment,
        Id_Game: mergedData[0].Id_Game,
        attempt_no: mergedData[0].allow_attempt,
        score: points,
      };

      saveAssessmentData.push(model);
      assementDataForMasterLog.push(modelForGameMasterLog);
    } else {
      let model = {
        ID_ORGANIZATION: ParamOrgID,
        id_user: UID[0].Id_User,
        Id_Assessment: null,
        Id_Game: currentQuestionData.Id_Game,
        attempt_no: currentQuestionData.allow_attempt,
        id_question: currentQuestionData.Id_Assessment_question,
        is_right: 2,
        score: 0,
        Id_Assessment_question_ans: null,
        Time: timerSeconds,
        M2ostAssessmentId: M2OstAssesmentID,
      };
      let modelForGameMasterLog = {
        ID_ORGANIZATION: ParamOrgID,
        id_user: UID[0].Id_User,
        Id_Room: mergedData[0].Id_Assessment,
        Id_Game: mergedData[0].Id_Game,
        attempt_no: mergedData[0].allow_attempt,
        score: points,
      };
      saveAssessmentData.push(model);
      assementDataForMasterLog.push(modelForGameMasterLog);
    }
  }
  // Add API calls here
  saveAssessment(saveAssessmentData);
  saveAssessmentMasterLog(
    assementDataForMasterLog[assementDataForMasterLog.length - 1]
  );
  showGameOverPopup();
}

// Event listener for the continue button
submitBtn = document
  .getElementById("continueButton")
  .addEventListener("click", function () {
    const selectedOption = document.querySelector(
      'input[name="group"]:checked'
    );
    if (selectedOption.checked) {
      const selectedOptionIndex = selectedOption.value - 1;
      const isCorrectOption =
        currentQuestion.optionList[selectedOptionIndex].Right_Ans;
      if (isCorrectOption == 1) {
        // Increase score by 10 points since the selected option is correct
        points += 10;
        console.log("points",points)
        assessmentScore.textContent = `Score: ${points}`;
        console.log(assessmentScore)
        // updateScoreDisplay();
      } else {
        points+= 0;
        assessmentScore.textContent = `Score: ${points}`;
        // updateScoreDisplay();
      }
      closeModal();
      index++;
      if (index <= questionList.length) {
        assessmentData.push({
          ...currentQuestion,
          selectedOptionIndex: selectedOptionIndex,
        });
      if (index === questionList.length){
        onGameOver();
        document.getElementById("questionModal").style.display = "none";
        gameStarted = false;
      }
      }
      clearInterval(timerInterval);
    } else {
      document.getElementById("error-text").textContent =
        "Please select an option.";
    }
  });


  var gamePaused = false; // Variable to track if the game is paused

  // Function to pause the game
  function pauseGame() {
      gamePaused = true;
      // Stop creating new items
      clearInterval(createFishInterval);
      clearInterval(createRareFishInterval);
      // clearInterval(createTrashInterval);
      clearInterval(createBlackFishInterval);

      // Disable hit events
      clickContainer.removeEventListener("mouseover", hit);
  }

// Function to resume the game
function resumeGame() {
    gamePaused = false;
    // Re-assign interval functions to create items
    switch (day) {
        case 1:
            createFishInterval = setInterval(createFish, 250);
            break;
        case 2:
            createFishInterval = setInterval(createFish, 250);
            createRareFishInterval = setInterval(createRareFish, 2200);
            break;
        case 3:
          createFishInterval = setInterval(createFish, 450);
          createRareFishInterval = setInterval(createRareFish, 2000);
          createBlackFishInterval = setInterval(createBlackFish, 2500);
          break;
    }
    // Enable hit events
    clickContainer.addEventListener("mouseover", hit);
}
