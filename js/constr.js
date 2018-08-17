function Game() {
    this.players = [];
    this.currentPlayerIndex = -1; // minus1 because it's been increased right from the start -> starts at 0;
    this.currentPlayer;

    // add new Players tp player array
    this.addPlayer = function(player) {
        this.players.push(player);
    };
}

function Player(name, id) {
    this.name = name;
    this.currentScore = 0;
    this.globalScore = 0;
    this.id = id;

    // create player divs
    this.selector = $(
        '<div class="player-container player-container-' +
            this.id +
            '"><div class="player-name">' +
            this.name +
            '</div><div class="g-score-container"><p class="g-score-ttl">Global score</p><p class="g-score" id="g-score-' +
            this.id +
            '">0</p></div><div class="curr-score-container"><p class="curr-score-ttl">Current score</p><p class="current-score" id="current-score-' +
            this.id +
            '">0</p></div></div>'
    );

    if (this.id % 2 === 1) {
        // display all UNEVEN on the left side
        $(".player-wrapper-one").append(this.selector);
    } else {
        // display all EVEN on the right
        $(".player-wrapper-two").append(this.selector);
    }

    this.increaseCurrentScore = function(score) {
        this.currentScore += score;
    };

    this.hold = function() {
        // updating global score
        this.globalScore += this.currentScore;
    };

    this.reset = function() {
        // reset all scores
        this.globalScore = 0;
        $(".g-score").text("0");
        this.currentScore = 0;
        $(".current-score").text("0");
    };
}
// current Player

Game.prototype.turn = function() {
    if (this.currentPlayerIndex >= 0)
        $(".player-container-" + this.currentPlayer.id).removeClass("active");

    this.currentPlayerIndex++;

    if (this.currentPlayerIndex >= this.players.length) this.currentPlayerIndex = 0;

    this.currentPlayer = this.players[this.currentPlayerIndex];

    // add active class to current player
    $(".player-container-" + this.currentPlayer.id).addClass("active");
    return this.currentPlayer;
};

Game.prototype.rollDice = function() {
    // get random dice number
    var dice = function getDiceValue() {
        var displayDice = $(".dice:not(.inactive)");
        var diceValue = displayDice.attr("data-value");

        return parseInt(diceValue);
    };

    shuffleAnimation(
        function() {
            this.dice = dice();
            if (this.dice != 1) {
                // add score
                this.currentPlayer.increaseCurrentScore(this.dice); // currentScore = currentScore + dice

                // setting the current score
                $("#current-score-" + this.currentPlayer.id).text(this.currentPlayer.currentScore);
            } else {
                this.currentPlayer.currentScore = 0;
                $("#current-score-" + this.currentPlayer.id).text("0");
                $(".player-container-" + this.currentPlayer.id).removeClass("active");

                this.turn();
            }
        }.bind(this)
    );

    function shuffleAnimation(cb) {
        // callback function so result gets displayed after timeout

        var shuffleCounter = 0;
        var currentActive;

        var shuffleInterval = setInterval(
            function() {
                $(".placeholder").css("display", "none");

                if (shuffleCounter === 6) {
                    clearInterval(shuffleInterval);
                    shuffleCounter = 0;

                    cb(); // call callback function here!
                } else {
                    shuffleCounter++;
                    if (currentActive) currentActive.toggleClass("inactive");
                    var random = Math.floor(Math.random() * 6) + 1;
                    currentActive = $(".dice:nth-child(" + (random + 1) + ")");
                    currentActive.toggleClass("inactive");
                }
            }.bind(this),
            200
        );
        $(".dice").addClass("inactive");
    }
};

Game.prototype.holdDice = function() {
    this.currentPlayer.hold();
    // printing global score
    this.currentPlayer.currentScore = 0;
    $("#g-score-" + this.currentPlayer.id).text(this.currentPlayer.globalScore);
    $("#current-score-" + this.currentPlayer.id).text("0");

    // check if player won the game
    if (this.currentPlayer.globalScore >= 30) {
        $(".dice").addClass("inactive");

        //winner pop-up window
        $(".popup").css("opacity", "1");
        $(".popup").css("visibility", "visible");

        var winnerName = this.currentPlayer.name;
        $(".winner-name").css("-webkit-animation:", "fadein 4s");
        $(".winner-name").css("animation:", "fadein 4s");
        $(".winner-name").text(winnerName);

        //reset all scores
        this.players.forEach(function(player) {
            player.reset();
        });
    } else {
        // next player
        this.turn();
    }
};

$(document).ready(function() {
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

    // ------------------------

    var game = new Game();

    var howManyPlayers = parseInt(prompt("How many players?"));

    for (var i = 1; i <= howManyPlayers; i++) {
        var player = new Player(prompt("Give me the name for player #" + i), i);
        game.addPlayer(player);
    }

    // start the game
    game.turn();

    $("#roll-dice").click(function() {
        game.rollDice();
    });

    // add current score to global score
    $("#hold-dice").click(function() {
        game.holdDice();
    });

    // start a new game
    $(".new-game").click(function() {
        $(".popup").css("opacity", "0");
        $(".popup").css("visibility", "hidden");
        $(".placeholder").css("display", "block");

        this.players.forEach(function(player) {
            player.reset();
        });
    });
    $(".popup-close").click(function() {
        $(".popup").css("opacity", "0");
        $(".popup").css("visibility", "hidden");
        $(".placeholder").css("display", "block");
        $(".player-container").removeClass("active");
        $(".player-name").text("");
    });
});
