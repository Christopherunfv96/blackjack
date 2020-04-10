const miModulo = (() => {
	"use strict";
	//? Type of Cards
	//* 2C = Two of Clubs
	//* 2D = Two of Diamonds
	//* 2H = Two of Hearts
	//* 2S = Two of Spades
	//? Referencias del HTML
	const btnPedir = document.querySelector("#btnPedir"),
		btnDetener = document.querySelector("#btnDetener");
	const divCartasJugadores = document.querySelectorAll(".divCartas"),
		puntosHTML = document.querySelectorAll("small");

	let deck = [];
	const tipos = ["C", "D", "H", "S"],
		especiales = ["A", "J", "Q", "K"];
	let puntosJugadores = [];
	const inicializarJuego = (numJugadores = 2) => {
		deck = crearDeck();
		puntosJugadores = [];
		puntosHTML.forEach((elemento) => (elemento.innerText = 0));
		divCartasJugadores.forEach((elemento) => (elemento.innerText = ""));
		for (let i = 0; i < numJugadores; i++) {
			puntosJugadores.push(0);
		}
		btnPedir.disabled = false;
		btnDetener.disabled = false;
	};
	const crearDeck = () => {
		deck = [];
		for (let i = 2; i <= 10; i++) {
			for (const tipo of tipos) {
				deck.push(i + tipo);
			}
		}
		for (const tipo of tipos) {
			for (const especial of especiales) {
				deck.push(especial + tipo);
			}
		}
		return _.shuffle(deck);
	};
	const pedirCarta = () => {
		if (deck.length === 0) {
			throw "No hay cartas en el deck";
		}
		return deck.pop();
	};
	const valorCarta = (carta) => {
		const valor = carta.substring(0, carta.length - 1);
		return isNaN(valor) ? (valor === "A" ? 11 : 10) : valor * 1;
	};
	//? Turno: 0:Primer Jugador .... Ultimo: Computadora
	const acumularPuntos = (carta, turno) => {
		puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
		puntosHTML[turno].innerText = puntosJugadores[turno];
		return puntosJugadores[turno];
	};
	const crearCarta = (carta, turno) => {
		const imgCarta = document.createElement("img");
		imgCarta.src = `assets/cartas/${carta}.png`;
		imgCarta.classList.add("carta");
		divCartasJugadores[turno].append(imgCarta);
	};
	const determinarGanador = () => {
		const [puntosMinimos, puntosComputadora] = puntosJugadores;
		setTimeout(() => {
			if (puntosComputadora === puntosMinimos) {
				alert("nadie gana");
			} else if (puntosMinimos > 21) {
				alert("Computadora gana");
			} else if (puntosComputadora > 21) {
				alert("Jugador gana");
			} else {
				alert("Computadora gana");
			}
		}, 600);
	};
	const turnoComputadora = (puntosMinimos) => {
		let puntosComputadora = 0;
		do {
			const carta = pedirCarta();
			puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
			crearCarta(carta, puntosJugadores.length - 1);
		} while (puntosComputadora < puntosMinimos && puntosMinimos <= 21);
		determinarGanador();
	};
	//! EVENTOS
	btnPedir.addEventListener("click", () => {
		const carta = pedirCarta();
		const puntosJugador = acumularPuntos(carta, 0);
		crearCarta(carta, 0);
		if (puntosJugador > 21) {
			console.warn("Lo siento , ha perdido");
			btnPedir.disabled = true;
			btnDetener.disabled = true;
			turnoComputadora(puntosJugador);
		} else if (puntosJugador === 21) {
			console.warn("21, genial");
			btnPedir.disabled = true;
			btnDetener.disabled = true;
			turnoComputadora(puntosJugador);
		}
	});
	btnDetener.addEventListener("click", () => {
		btnDetener.disabled = true;
		btnPedir.disabled = true;
		turnoComputadora(puntosJugadores[0]);
	});
	return {
		nuevoJuego: inicializarJuego,
	};
})();
