const BAZNIURL_JSON = "assets/data/";
const BAZNIURL_PROIZVODI = "assets/img/proizvodi/"
// Nav
const NIZGlavniMeniText = ["Početna", "Proizvodi", "Kontakt", "Autor"];
const NIZGlavniMeniHref = ["index.html", "proizvodi.html", "kontakt.html", "autor.html"];
// Footer
const NIZFooterKontaktText = ["Byzart digital print", "Račkog 6, 11000 Beograd", "tel/fax: +381 11 2766 081", "e-mail: print@bzyart.net"];
const NIZFooterRadnoVremeText = ["Ponedeljak-Petak: 09h-20h", "Subota: 10h-15h", "Nedelja: Ne radimo"]
const NIZFooterMaterijaliText = ["Main.js", "Sitemap", "Dokumentacija", "Github"];
const NIZFooterMaterijalHref = ["js/main.js", "#", "#", "https://github.com/BogdanV44"];

var proizvodi = [];
window.onload = function() {
    ispisivanjeNavigacije();
    if (window.location.pathname === "/byzartstamparija/index.html" || window.location.pathname === "/") {
        ucitajPocetnu();
    }
    else if(window.location.pathname === "/byzartstamparija/proizvodi.html") {
        ajaxZahtev("tipStampe.json", function(rezultat){
            napraviCHBL(rezultat, "#tip-stampe", "tipStampe");
        })
        ajaxZahtev("kategorija.json", function(rezultat){
            napraviCHBL(rezultat, "#kategorije", "kategorija");
        })
        ajaxZahtev("boje.json", function(rezultat){
            napraviFilterBoja(rezultat, "#boje")
        })
        ajaxZahtev("proizvodi.json", function(rezultat) {
            ispisiProizvode(rezultat);
            proizvodi = rezultat;
        })
        $(document).on("change", "#filtriranje", function(){
            let nizKategorijeValue = [];
            let nizTipStampeValue = [];

            let nizCheckedKategorije = this.querySelectorAll('input[type="checkbox"][name="kategorija"]:checked');
            let nizCheckedTipStampe = this.querySelectorAll('input[type="checkbox"][name="tipStampe"]:checked');

            nizCheckedKategorije.forEach (input => {
                nizKategorijeValue.push(Number(input.value));
            })
            nizCheckedTipStampe.forEach (input => {
                nizTipStampeValue.push(Number(input.value));
            })

            console.log(nizKategorijeValue);
            if(nizKategorijeValue.length == 0 && nizTipStampeValue.length==0) {
                ispisiProizvode(proizvodi)
            }
            if(nizKategorijeValue != null || nizTipStampeValue != null) {
                let proizvodiFiltrirani = [];
                proizvodiFiltrirani = proizvodi.filter(proizvod => nizKategorijeValue.includes(proizvod.kategorija))
                ispisiProizvode(proizvodiFiltrirani);
            }
            // else {
            //     for(let proizvod of proizvodi) {
            //         for(let i=0; i<nizCheckedKategorije.length;i++) {
            //             if(proizvod.kategorija == nizCheckedKategorije[i].value) {
            //                 proizvodiFiltrirani.push(proizvod);
            //             }
            //         }           
            //     }
            // }
        })
    
    }   
    ispisivanjeFootera();
}
function ucitajPocetnu() {   
    // Pocetna
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
    }

    button.addEventListener("click", ucitajGaleriju);

    var nizUslugeDigitalna = ["Štampa na papirima do formata 32 x 48.7 cm (korisno 31x47.7) u rezoluciji do 2400 dpi", "Idealna za male tiraže uz vrhunski kvalitet", "Vizit i ID karte, katalozi, CD i DVD nalepnice i omoti..."];
    var nizUslugeVelikiFormati = ["Štampa na rolnama širine do 1050 mm, u rezoluciji do 2880 dpi", "Štampa vrhunskog kvaliteta namenjena isklju?ivo unutrašnjoj (indoor) primeni", "Plakati, backlite, canvas"];
    var nizUslugeDorada = ["Se?enje", "Topla i hladna plastifikacija", "Klamovanje, bigovanje", "Perforacija", "Spiralno kori?enje", "Ugliranje", "Kaširanje na penu"];
    var nizUslugeOstale = ["Priprema za štampu", "Grafički dizajn", "Štampa na tekstilu", "Štampa na kancelarijskom materijalu", "Štampa na šoljama, kao i različitom asortmanu proizvoda."];

    napraviMeniIliListu(nizUslugeDigitalna, "", "#digitalna-lista");
    napraviMeniIliListu(nizUslugeVelikiFormati, "", "#veliki-formati-lista");
    napraviMeniIliListu(nizUslugeDorada, "", "#dorada-lista");
    napraviMeniIliListu(nizUslugeOstale, "", "#ostale-lista");

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
                setTimeout(function() {
                    document.querySelector("#galerija-slike").appendChild(div_slike);
                }, 500);
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
        "Najljubaznije osoblje ikada! Toliko razumevanja i strpljenja za svakog klijenta pojedinačno nisam još video. Izasli su mi u susret iako sam prvi put radio bilo šta kod njih. Odgovaranje na mejlove u roku od 5 min svaki put me je odmah kupilo.",
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
    // Kontakt
    // FORMA



    // Dinamicka ispisivanje padajuce liste forme
    // var nizLice = ["Pravno lice", "Fizičko lice"];
    // var nizLiceVrednost = ["PL", "FL"];

    // var tagSelect = document.createElement("select");
    // tagSelect.setAttribute("id", "ddLista");
    // tagSelect.setAttribute("class", "form-control");

    // var tagIzborPrvi = document.createElement("option");
    // tagIzborPrvi.setAttribute("value", "0");
    // var contentIzborPrvi = document.createTextNode("Izaberite");

    // tagIzborPrvi.appendChild(contentIzborPrvi);
    // tagSelect.appendChild(tagIzborPrvi);

    // for(let i = 0; i < nizLice.length; i++){
    //     var tagIzbor = document.createElement("option");
    //     tagIzbor.setAttribute("value", nizLiceVrednost[i]);

    //     var contentIzbor = document.createTextNode(nizLice[i]);

    //     tagIzbor.appendChild(contentIzbor);
    //     tagSelect.appendChild(tagIzbor);
    // }

    // document.querySelector("#forma").appendChild(tagSelect);

    // document.querySelector("#dugmePosalji_id").addEventListener("click", function(){
    //     var objSlobodnoVreme = document.querySelector("#listaSlobodanSam");
    // });

    // // Broj karaktera - poljeKomentar
    // document.querySelector("#poljeKomentar").addEventListener("keyup", function () {
    //     var komentar = document.querySelector("#poljeKomentar");
    //     var vrednostKomentar = komentar.value;
    //     var brojKaraktera = vrednostKomentar.length;

    //     if (brojKaraktera <= 200) {
    //         komentar.classList.remove('border-danger', 'border', 'border-3');
    //         var ostatakKaraktera = 200 - brojKaraktera;
    //         document.querySelector("#brojKaraktera").innerHTML = ostatakKaraktera;
    //     }
    //     else {
    //         komentar.value = vrednostKomentar.substring(0, 201);
    //         komentar.classList.add('border-danger', 'border', 'border-3');
    //     }
    // })

    // // Validacija forme
    // window.onload = function(){
    //     document.querySelector("#dugmePosalji_id").addEventListener("click", proveriPolje);

    // }
    // function proveriPolje(){
    //     var poljeImePrezime = document.querySelector("#tbImePrezime");

    //     var reImePrezime = /^[A-ZČĆŽŠĐ][a-zčćžšđ]{2,13}(\s[A-ZČĆŽŠĐ][a-zčćžšđ]{2,13})+$/

    //     if(!reImePrezime.test(poljeImePrezime.value)){
    //         poljeImePrezime.nextElementSibling.classList.add("alert", "alert-danger", "mt-1");
    //         poljeImePrezime.nextElementSibling.innerHTML = "Početno slovo imena i prezimena mora biti veliko, maksimalan broj karaktera za ime, i za prezime, je 14.";
    //     }
    //     else {
    //         poljeImePrezime.nextElementSibling.classList.remove("alert", "alert-danger", "mt-1");
    //         poljeImePrezime.nextElementSibling.innerHTML = "";
    //     }

    //     var poljeEmail = document.querySelector("#tbEmail");
    //     var reEmail = /^[a-z][\w\.]*\@[a-z0-9]{3,20}(\.[a-z]{3,6})?(\.[a-z]{2,3})$/

    //     if(!reEmail.test(poljeEmail.value)){
    //         poljeEmail.nextElementSibling.classList.add("alert", "alert-danger", "mt-1");
    //         poljeEmail.nextElementSibling.innerHTML = "Adresa mora sadržati @ karakter, završiti se sa ispravnim domenom. (Npr. primer@gmail.com)";
    //     }
    //     else {
    //         poljeEmail.nextElementSibling.classList.remove("alert", "alert-danger", "mt-1");
    //         poljeEmail.nextElementSibling.innerHTML = "";
    //     }

    //     var objSlobodnoVreme;
    //     objSlobodnoVreme = document.querySelector("#listaSlobodanSam");

    //     var brojacGresaka = 0;

    //     //provera padajuce liste
    //     if (objSlobodnoVreme.options[objSlobodnoVreme.options.selectedIndex].value == "0") {
    //         objSlobodnoVreme.parentElement.parentElement.lastElementChild.classList.add("prikazGreske");
    //         brojacGresaka++;
    //     }
    //     else {
    //         objSlobodnoVreme.parentElement.parentElement.lastElementChild.classList.remove("prikazGreske");
    //     }

    //     // provera radio button-a
    //     var objNewsletter = document.getElementsByName("rbNewsletter");
    //     let poslednjiP_element = document.querySelector("#poslednjiP");

    //     var vrednostNewsletter = "";
    //     for(let i = 0; i < objNewsletter.length; i++){
    //         if(objNewsletter[i].checked){
    //             vrednostNewsletter = objNewsletter[i].value;
    //             break;
    //         }
    //     }
    //     if(vrednostNewsletter == ""){
    //         poslednjiP_element.classList.add("prikazGreske");
    //         brojacGresaka++;
    //     }
    //     else {
    //         poslednjiP_element.classList.remove("prikazGreske");
    //     }

    //     if (brojacGresaka == 0) {
    //         document.querySelector("#ispisProvere").innerHTML = "Hvala Vam što ste Dobro Srce. Naš tim će Vas uskoro kontaktirati!"
    //     }
    //     else {
    //         document.querySelector("#ispisProvere").innerHTML = "";
    //     }
    // }

    // function insertKaoPrviChild (tekst, identifikatorDiv, elementUKojiPravimo) {
    //     var div = document.querySelector(`${identifikatorDiv}`);
    //     var prviChild = div.firstElementChild;
    //     var element = document.createElement(`${elementUKojiPravimo}`);
    //     element.textContent
    //     console.log(element);
    //     var p = "pera";
    // }
    // insertKaoPrviChild("", "#sekcija-usluge", "h2");
}

// -FUNKCIJE-
// AJAX Call Back funkcija
function ajaxZahtev (url, rezultat, metod="get") {
    $.ajax({
        url: BAZNIURL_JSON + url,
        method: metod,
        dataType: "json",
        success: rezultat,
        error: function(greska){console.log("Error " + greska);}
    })
}

// funkcija za ispisivanje navigacije
function ispisivanjeNavigacije() {
    var navElementi = document.querySelectorAll(".glavni-meni");

    navElementi.forEach( navTag => {
        napraviMeniIliListu(NIZGlavniMeniText, NIZGlavniMeniHref, ".glavni-meni");
    })
}

// funckija za ispisivanje footera
function ispisivanjeFootera() { 
    napraviMeniIliListu(NIZFooterKontaktText, "", "#kontakt");

    napraviMeniIliListu(NIZFooterRadnoVremeText, "", "#radno-vreme");

    napraviMeniIliListu(NIZFooterMaterijaliText, NIZFooterMaterijalHref, "#materijali");
}
function napraviMeniIliListu(nizText, nizHref="", navTag) {
    var ul = document.createElement("ul");
    for(let i = 0; i < nizText.length; i++) {
        var li = document.createElement("li");

        if(nizHref != "") {
            var a = document.createElement("a");

            a.textContent = nizText[i];
            a.setAttribute("href", nizHref[i]);

            li.appendChild(a);
        } else {
            li.textContent = nizText[i];
        }

        ul.appendChild(li);
    }
    document.querySelector(`${navTag}`).appendChild(ul);
}
// napravi checkbox listu
function napraviCHBL(niz, idDiva, name) {
    for(let i=0; i < niz.length; i++) {
        let div = document.createElement("div");
        let input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("name", name)
        input.setAttribute("value", niz[i].id);

        let label = document.createElement("label");
        label.setAttribute("for", input.name)
        label.textContent = niz[i].naziv;

        div.appendChild(input);
        div.appendChild(label);
        document.querySelector(idDiva).appendChild(div);
    }
}
// napravi izgled filtera po bojama
function napraviFilterBoja (niz, idDiva) {
    for(let i=0; i<niz.length;i++) {
        let a = document.createElement("a");
        a.style.backgroundColor = niz[i].naziv.nazivZaFilter;
        document.querySelector(idDiva).appendChild(a);
    }
}

function ispisiProizvode(nizProizvoda) {
    let div = "";
    for (let i=0; i<nizProizvoda.length; i++) {
        let proizvod = `<div class="proizvod">
            <p class="cena">${nizProizvoda[i].cena.bezStampe}€</p>
            <div class="proizvod-content">
                <img src="${BAZNIURL_PROIZVODI+nizProizvoda[i].slika}" alt=${nizProizvoda[i].naziv}/>
                <p class="naziv-proizvoda">${nizProizvoda[i].naziv}</p>
            </div>`;
        if (nizProizvoda[i].naStanju == false) {
            proizvod += `<div class="div-nije-na-stanju"><p class="p-nije-na-stanju">Nije na stanju</p>
            <a class="a-nije-na-stanju">Dodajte proizvod</a></div>`
        }
        proizvod += "</div>";
        div += proizvod;
    }
    document.querySelector("#proizvodi").innerHTML = div;
}
// ispis proizvoda na osnovu change event
