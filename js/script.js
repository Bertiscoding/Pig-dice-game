// SMOOTH SCROLL

$(function() {
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (
            location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
                $("html, body").animate(
                    {
                        scrollTop: target.offset().top
                    },
                    1000
                );
                return false;
            }
        }
    });
});

var gamePlaying = true;
var scores = [0, 0]; // both 0 in the beginning
var currentScore = 0;
var activePlayer = 0; // 0 is first player, 1 is second player
function getDiceValue() {
    var displayDice = $(".dice:not(.inactive)");
    var diceValue = displayDice.attr("data-value");
    console.log("DATA VALUE");

    return parseInt(diceValue);
}

$("#g-score-0").text("0"); // change it to 0
$("#g-score-1").text("0");
$("#current-score-0").text("0");
$("#current-score-1").text("0");

$(document).ready(function() {
    $("#roll-dice").click(function() {
        shuffleAnimation(function() {
            var dice = getDiceValue();

            if (dice > 1) {
                console.log(dice);
                // add score
                currentScore += dice; // currentScore = currentScore + dice
                // setting the current score
                $("#current-score-" + activePlayer).text(currentScore);
            } else {
                nextPlayer();
            }
        });
    });

    function shuffleAnimation(cb) {
        // callback function so result gets displayed after timeout

        var shuffleCounter = 0;
        var currentActive;

        var shuffleInterval = setInterval(function() {
            $(".placeholder").css("display", "none");

            if (shuffleCounter === 6) {
                clearInterval(shuffleInterval);
                shuffleCounter = 0;
                cb(); // call callback function here!
            } else {
                shuffleCounter++;
                if (currentActive) currentActive.toggleClass("inactive");
                var random = Math.floor(Math.random() * 6) + 1;
                console.log("random number: ", random);
                currentActive = $(".dice:nth-child(" + (random + 1) + ")");
                currentActive.toggleClass("inactive");
                console.log(currentActive);
            }
        }, 200);
        $(".dice").addClass("inactive");
    }

    $("#hold-dice").click(function() {
        if (gamePlaying === true) {
            // add CURRENT score to GLOBAL score
            scores[activePlayer] += currentScore;
            $("#g-score-" + activePlayer).text(scores[activePlayer]);

            // check if player won the game
            if (scores[activePlayer] >= 10) {
                $(".dice").addClass("inactive");

                //reset all scores
                $("#g-score-0").text("0");
                $("#g-score-1").text("0");
                $("#current-score-0").text("0");
                $("#current-score-1").text("0");
                currentScore = 0;
                scores = [0, 0];

                //winner pop-up window
                $(".popup").css("opacity", "1");
                $(".popup").css("visibility", "visible");
                var winnerName = $(".player-container-" + activePlayer + " .player-name").text();
                $(".winner-name").text(winnerName);

                gamePlaying === false;
            } else {
                // next player
                nextPlayer();
            }
        }
    });

    $(".new-game").click(function() {
        $(".popup").css("opacity", "0");
        $(".popup").css("visibility", "hidden");
        $(".placeholder").css("display", "block");
        $(".dice").hasClass("inactive");
    });

    $(".popup-close").click(function() {
        $(".popup").css("opacity", "0");
        $(".popup").css("visibility", "hidden");
    });

    function nextPlayer() {
        // if it's 0 change it to 1, else if its 1 change it to 0
        if (activePlayer === 0) {
            activePlayer = 1;
        } else {
            activePlayer = 0;
        }

        // change active class + reset currentScore
        $(".player-container-1").toggleClass("active");
        $(".player-container-0").toggleClass("active");
        currentScore = 0;

        // set current score to 0 if dice=1
        $("#current-score-0").text("0");
        $("#current-score-1").text("0");
    }
});
