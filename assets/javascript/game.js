	// name 	: 	Name of object
	// HP		:  	Health Points
	// AP 		:  	Attack Power
	// CAP 	: 	Counter Attack Power
	// attack 	: 	Increases AP 
var Subzero = {
	name: "Subzero",
	HP: 100,
	AP: 10,
	CAP: 15,
	attack: function() {
		this.AP += 3;
	}
};

var Scorpion = {
	name: "Scorpion",
	HP: 120,
	AP: 12,
	CAP: 20,
	attack: function() {
		this.AP += 5;
	}	
};

var KungLao = {
	name: "Kunglao",
	HP: 90,
	AP: 5,
	CAP: 8,
	attack: function() {
		this.AP += 3;
	}
};

var Smoke = {
	name: "Smoke",
	HP: 130,
	AP: 8,
	CAP: 15,
	attack: function() {
		this.AP += 5;
	}
};


// the switch statement is used to perform different actions based on different conditions
// returns corresponding object given the person clocked on the page

function selected(person) {

	switch($(person).attr("id")) {
		case "Subzero":
			return Subzero;
		case "Scorpion":
			return Scorpion;
		case "KungLao":
			return KungLao;
		case "Smoke":
			return Smoke;
	}

}

var ally = true;
var foe = true;
var kills = 0;
var originalPosition;
var allyChosen;
var foeChosen;
var health;

$(document).ready(function() {

		$(document).on("click", "[data-clickable='true']", function() {
			if(ally) {

				//	move your person to battlefield
				$(this).attr("class", "playing");
				$(this).attr("data-clickable", "false");
				$(this).appendTo(".ally");
				ally = false;
				$(".instructions p").html("Select your enemy to fight");
				$(".ally").css("display", "initial");
				$(".vs h3").css("display", "initial");
				allyChosen = selected(this);
				health = allyChosen.HP;

				//person health point bar
				$(".ally .progress-bar").attr("aria-valuenow", health.toString());
				$(".ally .progress-bar").attr("aria-valuemax", health.toString());
				$(".ally .progress-bar").attr("style", "width: 100%");
				$(".ally .progress span").html(health + "/" + health);
			}
			else if(foe) {

				//	move enemy to battlefield
				foeChosen = $(this);
				originalPosition = $(this).parent();
				$(this).attr("class", "playing");
				$(this).attr("data-clickable", "false");
				$(this).appendTo(".enemy");
				foe = false;
				$(".instructions p").empty();
				$(".enemy").css("display", "initial");
				foeChosen = selected(this);
				health = foeChosen.HP;

				//	enemy healt point bar
				$(".enemy .progress-bar").attr("aria-valuenow", health.toString());
				$(".enemy .progress-bar").attr("aria-valuemax", health.toString());
				$(".enemy .progress-bar").attr("style", "width: 100%");
				$(".enemy .progress span").html(health + "/" + health);
				$(".attack").css("display", "initial");
			};
		});

		$(".attack").on("click", function() {
			$(".message p").html(allyChosen.name + " hit " + foeChosen.name + " for " + allyChosen.AP + " damage.<br>"
					 + foeChosen.name + " counter-attacked for " + foeChosen.CAP + " damage.");
			
			// if foe dies,
			// "tint" person image to red to signify death
			// return the image to its original position from the start of the game
			// foe will not be able to return to battle (unclickable)
			if((foeChosen.HP -= allyChosen.AP) <= 0) {
				$(".message p").append("<br>You defeated " + foeChosen.name + ".");
				$(".instructions p").html("Select your next enemy to fight");
				finish.play();
				var op = $(".enemy .playing"); 
				op.appendTo(originalPosition);
				op.removeAttr("playing");
				op.attr("class", "tint");
				console.log(op.data("clickable"));
				$(".enemy").css("display", "none");
				$(".attack").css("display", "none");
				foe = true;
				kills++;
				if(kills >= 3) {
					finish.pause();
					victory.play();
					$(".reset").css("display", "initial");
					$(".attack").css("display", "none");
					$(".message p").html("YOU WIN!");
					$(".reset").on("click", function() {
						location.reload();
					});
				}
			}
			else {

				//	if your person dies, "tint" image to red and reset" button 
				//	will appear to restart the game
				if((allyChosen.HP -= foeChosen.CAP) <= 0) {

					$(".ally .playing").attr("class", "tint");
					$(".reset").css("display", "initial");
					$(".attack").css("display", "none");
					$(".ally .progress-bar").css("display", "none");
					$(".message p").html("FINISH HIM! FATALITY!");
					haha.play();
					$(".reset").on("click", function() {
						location.reload();
					});
				}
				else {
					//	update progress bar after each attack
					//	ally porgress bar
					$(".ally .progress-bar").attr("aria-valuenow", allyChosen.HP.toString());
					var maxHealth = parseInt($(".ally .progress-bar").attr("aria-valuemax"));
					var percent = (allyChosen.HP/maxHealth) * 100;
					$(".ally .progress-bar").attr("style", "width:" + percent + "%");
					$(".ally .progress span").html(allyChosen.HP + "/" + maxHealth);

					//	enemy progress bar
					$(".enemy .progress-bar").attr("aria-valuenow", foeChosen.HP.toString());
					var maxHealth = parseInt($(".enemy .progress-bar").attr("aria-valuemax"));
					var percent = (foeChosen.HP/maxHealth) * 100;
					$(".enemy .progress-bar").attr("style", "width:" + percent + "%");
					$(".enemy .progress span").html(foeChosen.HP + "/" + maxHealth);
				}
			}
			allyChosen.attack();
			
		});
	// click function to change background by removing any possible previous class and
	// adding the reuqested one
	$('#fortress').click(function() {
		$('body').removeClass("mortal goro night desert").addClass("fortress");
	});
	$('#goro').click(function() {
		$('body').removeClass("mortal fortress night desert").addClass("goro");
	});
	$('#night').click(function() {
		$('body').removeClass("mortal fortress goro desert").addClass("night");
	});
	$('#desert').click(function() {
		$('body').removeClass("mortal fortress goro night").addClass("desert");
	});
	$('#mortal').click(function() {
		$('body').removeClass("desert fortress goro night").addClass("mortal");
	});

	// click help and see rules

	$('#help').click(function() {

		$("#helpModal").modal({
			backdrop: "static",
			keyboard: false});
	}); 
	// music and sound on click
	$('#play').click(function() {
		music.play();
	});
	$('#stop').click(function() {
		music.pause();
	});
	$('.attack').click(function() {
		hit.play();
	});
	$('#Subzero').click(function() {
		blue.play();
	});
	$('#Scorpion').click(function() {
		yellow.play();
	});
	$('#KungLao').click(function() {
		lao.play();
	});
	$('#Smoke').click(function() {
		smoke.play();
	});
	
	

});

