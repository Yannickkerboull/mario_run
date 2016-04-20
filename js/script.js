$(document).ready(function(){
	//On masque le panneau gagnant et perdant
	$(".win1").hide(1);
	$(".loose").hide(1);
			
	//Déclaration de mes sons
	var audio = new Audio("./songs/saut.wav");
	var audio1 = new Audio("./songs/Mario.mp3");
	var audio2 = new Audio("./songs/hurry-up.wav");
	var audio3 = new Audio("./songs/game-over.wav");
	
	//Déclaration de mes trous dans le terrain :)
	var tabTrou = ["120","332","382"];
	
	compteur = 0;//Compteur du nb de décalage de px de l'écran pour arrivé au bout!	
	timeDepart = 0;	//Compteur du temps
		
	//var pour la différences de temps entre 2 touches. Cela évite que si on laisse appuyer longtemps sur la touche haut, que je personnage saute X fois
	var last = 0;
	var diff = 1000;
	var lastDroite = 0;
	var diffDroite = 1000;
	
	//Tableau pour souvenir si on appuie sur les touches
	var moov = ["0","0"];
	
	////////////////////////////////////////////////////////// audio1.play();//Je lance ma musique d'ambiance en boucle
	
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
		var offset = $( ".perso" ).offset();
		var offset1 = $( ".win" ).offset();
		var offset2 = offset.left - offset1.left;
		
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
		
		//Je traite les touches entrées
		switch (e.which){
			case 37://touche correspondant à la fléche de gauche
				$(".perso").css( "transform" , "scaleX(-1)" );//J'inverse le sens de mon image en css
				if (offset2 >= 2)//Je vérifie que je ne sois pas au bout de l'écran
				{//Si c'est pas le cas, je peux reculer
					$(".perso").animate({ "left": "-=2px" }, 10); 
				}
				break;
			case 38://touche correspondant à la fléche du haut
				audio.play();//Je lance la musique de saut
				
				//Test d'appuie sur la touche X fois !!
				diff = e.timeStamp - last;
				if ( diff >= 1000 ) 
				{
						if (moov[0] == 39)//On look si on a le car ->
						{
							var longDroite= (offset2 - 36);
							if (longDroite <= 500)
							{	
								$(".perso").animate({ "left": "+=18px", "top": "-40px" }, 500);//Je fais up mon personnage
								$(".perso").animate({ "left": "+=18px", "top": "+=40px" }, 500);//Je le fais descendre
							}
							else
							{
								$(".perso").animate({ "top": "-=40px" }, 500);//Je fais up mon personnage
								$(".perso").animate({ "top": "+=40px" }, 500);//Je le fais descendre
							}
						}
						else if ( moov[0] == 37)//On look si on a le car <-
						{
							var longGauche = (offset2 - 36);
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
				if (offset2 < 500)//Test de si je suis arrivé à la limite de mon écran avant le défillement du paysage
				{				
						$(".perso").animate({ "left": "+=2px" }, 10);
				}
				else
				{
					compteur = compteur + 2;//Je suis fait donc défiler mon paysage, donc je le décale d'autant de px que le personnage bouge 
					//if (compteur < 4190)//Test de si je suis arrivé à la fin
					if (compteur < 200)//Test de si je suis arrivé à la fin pour la démo !!!
					{
						$(".maps").animate({ "background-position": "-=2px" }, 1);
						$(".trou").animate({ "margin-left": "-=2px" }, 1);
					}
					else
					{//C'est la fin
						audio1.pause();//Je stop la musique d'ambiance
						audio2.play();//Je lance la musique de fin
						//Je fais des sauts de victoire !
						$(".perso").animate({ "top": "-=40px" }, 500);
						$(".perso").animate({ "top": "+=40px" }, 500);
						//Calcul du temps passé
						var tempsAll = e.timeStamp - timeDepart;
						tempsAll = parseInt(tempsAll/1000);
						document.getElementById('timeu').innerHTML= "Temps de jeu :" + tempsAll + " sec<br> Il est faisable en 17 sec";
						$(".win").hide(10000);//Fermeture du cadre de jeu
						$(".trou").hide(1);//Fermeture des éléments du jeu
						$(".win1").show(10000);//afficher le cadre gagnant
					}
				}
				break;
		}
		
		//Test de si on tombe dans un trou ou non !
		var i = 0;
		var longTrou = 30;
		for (i = 0;i < tabTrou.length ; i++)
		{
			calc = (tabTrou[i] /1) - compteur;//Variable pour savoir si on est dans un trou ou non
			calcmax = calc + longTrou;
			if ((calc <= offset2) && (calcmax >= offset2))
			{
				audio1.pause();//Je stop la musique d'ambiance
				audio3.play();//Je lance musique pour perdu
				$(".perso").animate({ "top": "+=300px" }, 1000);//Je le fais descendre
				//Calcul du temps passé
				var tempsAll = e.timeStamp - timeDepart;
				tempsAll = parseInt(tempsAll/1000);
				document.getElementById('timeu1').innerHTML= "Temps de jeu à tester:" + tempsAll + " sec";
				$(".win").hide(5000);//Fermeture du cadre de jeu
				$(".trou").hide(1);//Fermeture des éléments du jeu
				$(".loose").show(5000);//afficher le cadre perdant
			}
		}
   });
});