// Galerija
var button = document.querySelector("#vidi-jos");

for (let i = 1; i < 4; i++) {
    var div_slike = document.createElement("div");
    div_slike.classList.add("div-slike");

    var img = document.createElement("img");
    img.setAttribute("src", `assets/img/galerija/img${i}.jpg`);
    img.setAttribute("alt", `img_${i}`);
    img.setAttribute("width", "100%");
    
    div_slike.appendChild(img);
    document.querySelector("#galerija-slike").appendChild(div_slike);
    console.log(img.attributes);
}

button.addEventListener("click", ucitajGaleriju);

var vecProsiren = 0;
var vecUcitaneSlike = 0;
function ucitajGaleriju() {
    if (vecProsiren != 1 && vecUcitaneSlike != 1) {
        for (let i = 4; i < 13; i++) {
            let div_slike = document.createElement("div");
            div_slike.classList.add("div-slike");

            var img = document.createElement("img");
            img.setAttribute("src", `assets/img/galerija/img${i}.jpg`);
            img.setAttribute("alt", `img_${i}`);
            img.setAttribute("width", "100%");
            
            div_slike.appendChild(img);
            document.querySelector("#galerija-slike").appendChild(div_slike);

            vecProsiren = 1;
            vecUcitaneSlike = 1;
            button.textContent = "Umanji";
        }
    }
    else if (vecUcitaneSlike == 1 && vecProsiren == 0) {
        var nizUcitanihSlika = document.querySelectorAll(".div-slike");
        nizUcitanihSlika.forEach(function (slika) {
            slika.classList.remove("display-none");
        })
        vecProsiren = 1;
        button.textContent = "Umanji";
    }
    else {
        var nizUcitanihSlika = document.querySelectorAll(".div-slike");
        for (let i = 3; i < nizUcitanihSlika.length; i++ ) {
            nizUcitanihSlika[i].classList.add("display-none");
        }
        vecProsiren = 0;
        button.textContent = "Učitaj Još";
    }
}
// Iskustva
var recenzijeNizImena = ["Slobodan Ljubisic", "Đina Moković", "Aleksa Stojanovic", "Marija Peric", "Uros Fisic", "Milos Petrovic", "Uroš Maksimović", "Davor Ranic", "Tanja Todorovic"];
var recenzijeNizTekst = ["Profesionalci, stručni, poštuju rokove.", "Ljudi jednostavno znaju posao.", 
    "Najljubaznije osoblje ikada! Toliko razumevanja i strpljenja za svakog klijenta pojedinačno nisam još video. Izasli su mi u susret iako sam prvi put radio bilo šta kod njih. Odgovaranje na mejlove u roku od 5 min svaki put me je odmah kupilo. Svaka vam cast ljudi na kvalitetu proizvoda i na odnosu prema kupcima! Svaka preporuka svima!",
    "Jako stručno i ljubazno osoblje, odličan kvalitet štampe.", "Za svaku pohvalu, kvalitet štampe, ljubaznost, profesionalnost.",
    "Svaka čast, brzi, kvalitet odličan, sve pohvale!", "Štampaju 50x70cm za 10 minuta tako da 5 zvezdica.",
    "Odlicna saradnja, kvalitetna i brza usluga", "Brza i kvalitetna usluga. Dobar izbor papira i uslužno osoblje."];
for (let i=0; i<9; i++) {

    var recenzijeDiv = document.createElement("div");
    recenzijeDiv.classList.add("item");

    var recenzijeIme = document.createElement("h3");
    var recenzijeZvezdice = document.createElement("img");
    var recenzijeTekst = document.createElement("p");

    recenzijeIme.textContent = recenzijeNizImena[i];
    recenzijeZvezdice.src = "assets/img/zvezdice.png";
    recenzijeTekst.textContent = recenzijeNizTekst[i];

    recenzijeDiv.appendChild(recenzijeZvezdice);
    recenzijeDiv.appendChild(recenzijeIme);
    recenzijeDiv.appendChild(recenzijeTekst);

    document.querySelector("#iskustva").appendChild(recenzijeDiv);
}
$('.owl-carousel').owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    autoplay: true,
    autoplayTimeout: 2200,
    autoplayHoverPause: true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:4
        }
    }
})
