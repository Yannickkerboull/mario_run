$(document).ready(function(){
	//On masque le panneau gagnant et perdant
	$(".win1").hide(1);
	$(".loose").hide(1);
			
	//Déclaration de mes sons
	var audio = new Audio("./songs/saut.wav");
	var audio1 = new Audio("./songs/Mario.mp3");
	var audio2 = new Audio("./songs/hurry-up.wav");
	
	//Déclaration de mes trous dans le terrain :)
	//var tabTrou = ["55","50"];
	var tabTrou = ["48","50"];
	//Compteur du nb de décalage de px de l'écran pour arrivé au bout!
	compteur = 0;
	//Compteur du temps
	timeDepart = 0;	
	
	audio1.play();//Je lance ma musique d'ambiance de boucle
	
	//var pour la différences de temps entre 2 touches. Cela évite que si on laisse appuyer longtemps sur la touche haut, que je personnage saute X fois
	var last = 0;
	var diff = 1000;
	var lastDroite = 0;
	var diffDroite = 1000;
	
	//Tableau pour souvenir si on appuie sur les touches
	var moov = ["0","0"];
	
	//Sav des touches -> et <- si up en prendant en compte la derniére
	$(document).keyup(function(e){
		if (e.keyCode == 39)
		{
			moov[0] = e.keyCode;
		}
		if (e.keyCode == 37)
		{
			moov[0] = e.keyCode;
		}
	});
	
	$(document).keydown(function(e){//Fonction qui récupere les touches entrées au clavier
		//Je récupere la position de mon perso sur le terrain
		var p = $( ".perso" );
		var offset = p.offset();
		if (timeDepart == 0)
		{
			timeDepart = e.timeStamp;
		}
		
		//Sav des touches -> et <- si down en prendant en compte la derniére
		if (e.keyCode == 39)
		{
			moov[0] = 0;
		}
		if (e.keyCode == 37)
		{
			moov[0] = 0;
		}
		
		
		//Donnes de récup pour les tests
		var p1 = $( ".maps" );
		var offset1 = p1.offset();
		
		//Je traite les touches entrées
		switch (e.which){
			case 37://touche correspondant à la fléche de gauche
				$(".perso").css( "transform" , "scaleX(-1)" );//J'inverse le sens de mon image en css
				if (offset.left > 330)//Je vérifie que je ne sois pas au bout de l'écran
				{//Si c'est pas le cas, je peux reculer
					$(".perso").animate({ "left": "-=2px" }, 10); 
				}
				break;
			case 38://touche correspondant à la fléche du haut
				//alert(compteur); //Tset
				//alert(offset.left);   //Tset
				audio.play();//Je lance la musique de saut
				
				//Test d'appuie sur la touche X fois !!
				diff = e.timeStamp - last;
				if ( diff >= 1000 ) 
				{
						if (moov[0] == 39)//On look si on a le car ->
						{	
							$(".perso").animate({ "left": "+=18px", "top": "-40px" }, 500);//Je fais up mon personnage
							$(".perso").animate({ "left": "+=18px", "top": "+=40px" }, 500);//Je le fais descendre	
							index = moov.indexOf(39);
							  if ( index >= 0 ) {
								moov[index] = 0;
								moov.splice(index,1);
							  }							
						}
						else if ( moov[0] == 37)//On look si on a le car <-
						{
							var longGauche = (offset.left - 338.5);
							if (longGauche >= 0)
							{	
								$(".perso").animate({ "left": "-=18px", "top": "-40px" }, 500);//Je fais up mon personnage
								$(".perso").animate({ "left": "-=18px", "top": "+=40px" }, 500);//Je le fais descendre
							}
							else
							{
								$(".perso").animate({ "top": "-=40px" }, 500);//Je fais up mon personnage
								$(".perso").animate({ "top": "+=40px" }, 500);//Je le fais descendre
							}
						}
						else
						{
							$(".perso").animate({ "top": "-=40px" }, 500);//Je fais up mon personnage
							$(".perso").animate({ "top": "+=40px" }, 500);//Je le fais descendre
						}
					
					last = e.timeStamp;
				}
				break;
			case 39://touche correspondant à la fléche de droite
				$(".perso").css( "transform" , "scaleX(+1)" );//je met mon personnage dans sa position initiale.
				if (offset.left < 730)//Test de si je suis arrivé à la limite de mon écran avant le défillement du paysage
				{				
						$(".perso").animate({ "left": "+=2px" }, 10);
				}
				else
				{
					//imgWidth = $('#hiddenImg').width();
					compteur = compteur + 2;//Je suis fait donc défiler mon paysage, donc je le décale d'autant de px que le personnage bouge 
					//if (compteur < 4190)//Test de si je suis arrivé à la fin
					if (compteur < 200)//Test de si je suis arrivé à la fin
					{
						$(".maps").animate({ "background-position": "-=2px" }, 1);
					}
					else
					{//C'est la fin
					console.log("mon res" + offset.left + " compteur: " + compteur);
						audio1.pause();//Je stop la musique d'ambiance
						audio2.play();//Je lance la musique de fin
						//Je fais des sauts de victoire !
						$(".perso").animate({ "top": "-=40px" }, 500);
						$(".perso").animate({ "top": "+=40px" }, 500);
						//Calcul du temps passé
						var tempsAll = e.timeStamp - timeDepart;
						tempsAll = parseInt(tempsAll/1000);
						document.getElementById('timeu').innerHTML= "Temps de jeux :" + tempsAll + "sec";
						$(".win").hide(10000);
						$(".win1").show(10000);
					}
				}
				break;
		}
		
		//Test de si on tombe dans un trou ou non !
		var i = 0;
		var longTrou = 6;
		for (i = 0;i < tabTrou.length ; i++)
		{
			//calc = (tabTrou[i] + longTrou) - offset.left;//Variable pour savoir si on est dans un trou ou non
			calc = (tabTrou[i] + longTrou) - offset.left - compteur;//Variable pour savoir si on est dans un trou ou non
			if ((calc >= longTrou) && calc <= (2 * longTrou))
			{
				$(".perso").animate({ "top": "+=300px" }, 1000);//Je le fais descendre
				$(".win").hide(10000);
				$(".loose").show(10000);
			}
		}
		//console.log(offset.left);
   });
});