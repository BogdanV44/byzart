const BAZNIURL_JSON = "assets/data/";
const BAZNIURL_PROIZVODI = "assets/img/proizvodi/"
// Nav
const NIZGlavniMeniText = ["Početna", "Proizvodi", "Kontakt", "Autor", "Obavesti me"];
const NIZGlavniMeniHref = ["index.html", "proizvodi.html", "kontakt.html", "autor.html", "obavesti.html"];
// Footer
const NIZFooterKontaktText = ["Byzart digital print", "Račkog 6, 11000 Beograd", "tel/fax: +381 11 2766 081", "e-mail: print@bzyart.net"];
const NIZFooterRadnoVremeText = ["Ponedeljak-Petak: 09h-20h", "Subota: 10h-15h", "Nedelja: Ne radimo"]
const NIZFooterMaterijaliText = ["Main.js", "Dokumentacija", "Github"];
const NIZFooterMaterijalHref = ["js/main.js", "assets/dokumentacija.pdf", "https://github.com/BogdanV44"];

var proizvodi = [];
let proizvodiFiltrirani = [];
let nizProizvodaJSON = [];

window.onload = function() {
    let location = window.location.pathname;
    ispisivanjeNavigacije();
    if (location === "/index.html" || location === "/") {
        ucitajPocetnu();
    }
    else if(location === "/proizvodi.html") {
        ajaxZahtev("tipStampe.json", function(rezultat){
            napraviCHBiliRBlistu("checkbox", rezultat, "#tip-stampe", "tipStampe");
        })
        ajaxZahtev("kategorija.json", function(rezultat){
            napraviCHBiliRBlistu("checkbox", rezultat, "#kategorije", "kategorija");
        })
        
        ajaxZahtev("dostupnost.json", function(rezultat) {
            napraviCHBiliRBlistu("radio", rezultat, "#dostupnost", "dostupnostRb")
        })

        ajaxZahtev("proizvodi.json", function(rezultat) {
            ispisiProizvode(rezultat);
            proizvodi = rezultat;
        })

        $(document).on("change", "#filtriranje", function(){
            filtriranjeOnChange();
            let value = document.querySelector("#sort-list-proizvodi").value;
            if(value != 0) {
                if(proizvodiFiltrirani.length == 0) {
                    sortiraj(proizvodi);
                } 
                else {
                    sortiraj(proizvodiFiltrirani);
                }
            }

            let stanjeProizvoda = document.querySelectorAll(".proizvod");

            if(stanjeProizvoda.length == 0) {
                document.querySelector("#proizvodi").innerHTML = `<h3>Trenutno nema takvog proizvoda.</h3>`
            }

        })
        
        ucitajProdavnicu();
        $(document).on("change", "#sort-list-proizvodi", function(){
            if(proizvodiFiltrirani.length == 0) {
                sortiraj(proizvodi);
            } 
            else {
                sortiraj(proizvodiFiltrirani);
            }
        })
    }
    else if (location === "/proizvod.html") {
        var urlParams = new URLSearchParams(window.location.search);

        var id = urlParams.get("id");

        let proizvod, dugme;
        ajaxZahtev("proizvodi.json", function(rezultat) {
            proizvod = dohvatiProizvod(rezultat, id);

            ispisiProizvodSingle(proizvod);

            dugme = document.querySelector(".dugme-nije-na-stanju");
        });
    }
    else if (location === "/obavesti.html") {
        let proizvodiLS = dohvatiPodatakLS("proizvodiObavestiMe");

        let emailLS = dohvatiPodatakLS("emailObavestiMe");
        //ispisiProizvode(proizvodiLS, "#proizvodi-obavesti-me");
        if(proizvodiLS.length != 0) {
            ubaciProizvodeIzLS();
        }
        else {
            ispisiProizvodeObavesti(proizvodiLS);
        }

        document.querySelector("#btnUkloniSve").addEventListener("click", function() {
            for (let i = 0; i < proizvodiLS.length; i++) {
                ukloniLS(proizvodiLS[i].id);
            }
        })

        document.querySelector("#btnObavestiEmail").addEventListener("click", function() {
            let email = $("#obavesti-email");

            resetPorukaForm();

            rxValidacija(email.val(), $("#obavesti-email"), rxEmail);

            if(!greskaValidacije) {
                document.querySelector("#forma-obavesti").innerHTML += `<p class="uspeh">Email ažuriran.</p>`
                
                // CSS styles za klasu
                let uspeh = document.querySelector(".uspeh");
                uspeh.style.fontSize = "14px";
                uspeh.style.color = "black";
                uspeh.style.fontWeight = "500";
            }
            else {
                // CSS styles za klasu
                let error = document.querySelector(".greska-forme");
                error.style.color = "black";
                error.style.fontWeight = "500";
                error.style.fontSize = "14px";
            }
            
            //upisiPodatakLS("email", email.val)
        })
    }

    else if (location === "/kontakt.html") {
        document.querySelector("#btnKontakt").addEventListener("click", function(e){
            let ime, email, poruka, rb, vrednostRb = "";
            ime = $("#tbIme");
            email = $("#iEmail");
            poruka = $("#taPoruka");
            rb = document.getElementsByName("rbList");

            resetPorukaForm();

            rxValidacija(ime.val(), $("#tbIme"), rxIme);
            rxValidacija(email.val(), $("#iEmail"), rxEmail);

            if(poruka.val().length == 0) {
                ispisGreskeFormValidacija("Poruka ne može biti prazna.", $("#taPoruka"));
            }

            vrednostRb = proveraRB(rb);

            if (!vrednostRb) {
                ispisGreskeFormValidacija("Obavezno polje", $("#rbDiv"))
            }
            
            if (greskaValidacije) {
                e.preventDefault();
            }

            else {
                document.querySelector("#forma-kontakt").innerHTML += `<p class="uspeh">Uspešno ste poslali poruku.</p>`
            }
        })

        // Poruka
        document.querySelector("#taPoruka").addEventListener("keyup", function () {
            var poruka = document.querySelector("#taPoruka");
            var vrednostPoruka = poruka.value;
            var brojKaraktera = vrednostPoruka.length;
        
            if (brojKaraktera <= 200) {
                poruka.classList.remove('greska-poruka');
                var ostatakKaraktera = 200 - brojKaraktera;
                document.querySelector("#brojKaraktera").innerHTML = ostatakKaraktera;
                document.querySelector("#error-poruka").classList.add('d-none');
                greskaValidacije = false;
            }
            else {
                poruka.value = vrednostPoruka.substring(0, 201);
                poruka.classList.add('greska-poruka');
                document.querySelector("#error-poruka").classList.remove('d-none');
                greskaValidacije = true;
            }
        })
    }
    ispisivanjeFootera();
}
function ucitajPocetnu() {   
    // Pocetna
    // Galerija



    var nizUslugeDigitalna = ["Štampa na papirima do formata 32 x 48.7 cm (korisno 31x47.7) u rezoluciji do 2400 dpi", "Idealna za male tiraže uz vrhunski kvalitet", "Vizit i ID karte, katalozi, CD i DVD nalepnice i omoti..."];
    var nizUslugeVelikiFormati = ["Štampa na rolnama širine do 1050 mm, u rezoluciji do 2880 dpi", "Štampa vrhunskog kvaliteta namenjena isključivo unutrašnjoj (indoor) primeni", "Plakati, backlite, canvas"];
    var nizUslugeDorada = ["Sečenje", "Topla i hladna plastifikacija", "Klamovanje, bigovanje", "Perforacija", "Spiralno koričenje", "Ugliranje", "Kaširanje na penu"];
    var nizUslugeOstale = ["Priprema za štampu", "Grafički dizajn", "Štampa na tekstilu", "Štampa na kancelarijskom materijalu", "Štampa na šoljama, kao i različitom asortmanu proizvoda."];

    napraviMeniIliListu(nizUslugeDigitalna, "", "#digitalna-lista");
    napraviMeniIliListu(nizUslugeVelikiFormati, "", "#veliki-formati-lista");
    napraviMeniIliListu(nizUslugeDorada, "", "#dorada-lista");
    napraviMeniIliListu(nizUslugeOstale, "", "#ostale-lista");

    ispisiGaleriju();

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
}
function ucitajProdavnicu() {
    let nizSortNaziv = ["Naziv rastući", "Naziv opadajući", "Cena rastuća", "Cena opadajuća", "Najnoviji"];
    let nizSortValue = ["nazivAZ", "nazivZA", "cenaRast", "cenaOp", "najnovije"];

    napraviDDL(nizSortNaziv, nizSortValue, "#sort-ddl", "sort-list-proizvodi");
}
function filtriranjeOnChange() {
    let divFilter = document.querySelector("#filtriranje");
    let nizKategorijeValue = [];
    let nizTipStampeValue = [];

    let nizCheckedKategorije = divFilter.querySelectorAll('input[type="checkbox"][name="kategorija"]:checked');
    let nizCheckedTipStampe = divFilter.querySelectorAll('input[type="checkbox"][name="tipStampe"]:checked');
    let dostupnostRb = divFilter.querySelector('input[type="radio"]:checked');

    console.log(dostupnostRb);

    nizCheckedKategorije.forEach (input => {
        nizKategorijeValue.push(Number(input.value));
    })
    nizCheckedTipStampe.forEach (input => {
        nizTipStampeValue.push(Number(input.value));
    })

    if(nizCheckedKategorije.length == 0 && nizCheckedTipStampe.length==0 && dostupnostRb != null) {
        ispisiProizvode(proizvodi)
        proizvodiFiltrirani = [];
    }

    if(dostupnostRb != null) {

        if (dostupnostRb.value == 2) {
            proizvodiFiltrirani = proizvodi.filter(proizvod => proizvod.naStanju != false);
        }
        else {
            proizvodiFiltrirani = proizvodi;
        }

        let proizvodiFiltriraniII = [];

        if(nizKategorijeValue.length != 0 || nizCheckedTipStampe.length != 0) {
            if(nizKategorijeValue.length != 0) {
                proizvodiFiltriraniII = proizvodiFiltrirani.filter(proizvod => nizKategorijeValue.includes(proizvod.kategorija))
        
                ispisiProizvode(proizvodiFiltriraniII);
                if (nizTipStampeValue.length > 0) {
                    ispisiProizvodeTipStampe(nizTipStampeValue, proizvodiFiltriraniII);  
                }
            }
            else {
                ispisiProizvodeTipStampe(nizTipStampeValue, proizvodiFiltrirani);
            }
        }
        else {
            ispisiProizvode(proizvodiFiltrirani);
        }
    }
    else {
        if(nizKategorijeValue.length != 0) {

            proizvodiFiltrirani = proizvodi.filter(proizvod => nizKategorijeValue.includes(proizvod.kategorija))
    
            ispisiProizvode(proizvodiFiltrirani);
            if (nizTipStampeValue.length > 0) {
                ispisiProizvodeTipStampe(nizTipStampeValue, proizvodiFiltrirani);  
            }
        }
        else if (nizCheckedTipStampe.length != 0){
            ispisiProizvodeTipStampe(nizTipStampeValue, proizvodi);
        }
        else {
            ispisiProizvode(proizvodi);
        }
    }
}

// -FUNKCIJE-
// AJAX Call Back funkcija
function ajaxZahtev (url, rezultat, metod="get") {
    $.ajax({
        url: BAZNIURL_JSON + url,
        method: metod,
        dataType: "json",
        success: rezultat,
        error: function(xhr, izuzetak) {
            var odg = '';
            if (xhr.status === 0) {
                odg = 'Niste konektovani.\n Proverite Mrežu.';
            } else if (xhr.status == 404) {
                odg = 'Stranica nije pronađena. [404]';
            } else if (xhr.status == 500) {
                odg = 'Internal Server Error [500].';
            } else if (izuzetak === 'parsererror') {
                odg = 'Traženi JSON parse neuspešan.';
            } else if (izuzetak === 'timeout') {
                odg = 'Time out error.';
            } else if (izuzetak === 'abort') {
                odg = 'Ajax request zaustavljen.';
            } else {
                odg = 'Nepoznata greška.\n' + xhr.responseText;
            }
            console.log(odg);
        } 
    })
}

// <LOCAL STORAGE>
function dodajUObavestiMe() {
    let id = $(this).data('id');

    var proizvodiLS = dohvatiPodatakLS("proizvodiObavestiMe");

    console.log(proizvodiLS);

    if(proizvodiLS) {
        if(!proveraDaLiPostojiLS(proizvodiLS, id)) {
            dodajProizvodLS(id);
            popup("#popup-container", "Uspešno ste dodali proizvod.");
        }  
        else {
            popup("#popup-container", "Proizvod već dodat.");
        }
        i++;
    }
    else {
        dodajPrviProizvodLS(id);
    }
}
function upisiPodatakLS (ime, data) {
    localStorage.setItem(ime, JSON.stringify(data));
}
function dohvatiPodatakLS(key) {
    return JSON.parse(localStorage.getItem(key));
}
function dodajPrviProizvodLS(id) {
    let proizvodi = [];
    proizvodi[0] = {
        id: id
    };
    upisiPodatakLS("proizvodiObavestiMe", proizvodi);
}
function proveraDaLiPostojiLS(niz, id) {
    return niz.filter(e => e.id == id).length;
}

let i = 0;
function popup(container, poruka) {
    let div = `<div id="popup${i}" class="popup">
    <p>${poruka}</p></div>`;
    document.querySelector(container).innerHTML += div;

    let popups = document.querySelectorAll(".popup");

    popups.forEach(popup => {
        setTimeout(function() {
            jQuery(popup).remove()
        }, 2000)
    });

}
function dodajProizvodLS(id) {
    var proizvodiLS = dohvatiPodatakLS("proizvodiObavestiMe");
    proizvodiLS.push({
        id: id
    });
    upisiPodatakLS("proizvodiObavestiMe", proizvodiLS);
}

//funkcija za uklanjanje proizvoda iz Local Storage-a
function ukloniLS(id) {
    let proizvodiLS = dohvatiPodatakLS("proizvodiObavestiMe");

    proizvodiLS = proizvodiLS.filter(e => e.id != id);

    upisiPodatakLS("proizvodiObavestiMe", proizvodiLS);
    
    ubaciProizvodeIzLS();
}

// </LOCAL STORAGE>

// <VALIDACIJA - REGEX>

let rxIme = /^[A-ZŠĐŽĆČ][a-zšđžćč]{2,15}(\s[A-ZŠĐŽĆČ][azšđžćč]{2,14})?$/;
let rxPrezime = rxIme;
let rxEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let rxLozinka = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;

var greskaValidacije = false;
function rxValidacija(string, element, rx, pass = false) {
	if (string == "") {
		return ispisGreskeFormValidacija("Obavezno polje.", element);
	} 
    else if (!rx.test(string)) {
        if (pass) {
            return ispisGreskeFormValidacija("Lozinka mora da sadrži malo slovo, broj i da bude minimum 8 karaktera.", element);
            }
        return ispisGreskeFormValidacija("Neispravno unet podatak.", element);
    }
}
function resetPorukaForm() {
    greskaValidacije = false;
    $(".greska-forme").remove();
    $(".uspeh-forme").remove();
}

function ispisGreskeFormValidacija(poruka, element) {
    greskaValidacije = true;
    $(`<p class="greska-forme">${poruka}</p>`).insertAfter($(element));
}

function proveraRB (rb) {
    for(let i = 0; i < rb.length; i++){
        var vrednost;
        if(rb[i].checked){
            vrednost = rb[i].value;
            break;
        }
    }
    return vrednost;
}
// </VALIDACIJA>

// <FUNKCIJE ZA ISPIS>

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

// Za ispisivanje Galerije
var vecProsiren = 0;
var vecUcitaneSlike = 0;
function ispisiGaleriju() {

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

    // Kada se klikne na Vidi jos
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
}

// ispisi lista
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
function napraviCHBiliRBlistu(tipInput, niz, idDiva, name) {
    for(let i=0; i < niz.length; i++) {
        let div = document.createElement("div");
        let input = document.createElement("input");
        input.setAttribute("type", tipInput);
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

function napraviDDL(nizNaziv, nizValue, idtDiva, idSelect) {
    let select = document.createElement("select");
    select.setAttribute("id", idSelect);

    let optionIzb = document.createElement("option");
    optionIzb.setAttribute("value", 0);
    optionIzb.textContent = "Izaberite...";
    select.appendChild(optionIzb);
    for(let i = 0; i<nizNaziv.length; i++) {
        let option = document.createElement("option");
        
        option.setAttribute("value", nizValue[i]);
        option.textContent = nizNaziv[i];
        select.appendChild(option);
    }
    document.querySelector(idtDiva).appendChild(select);
}

// <FUNKCIJE ZA ISPIS PROIZVODA>
function ispisiProizvode(nizProizvoda, htmlDiv = "#proizvodi") {
    let div = "";
    for (let i=0; i<nizProizvoda.length; i++) {
        let proizvod = `<div class="proizvod">
            <p class="cena">${nizProizvoda[i].cena.bezStampe}€</p>
            <div class="proizvod-content">
                <a href="proizvod.html?id=${nizProizvoda[i].id}">
                    <img src="${BAZNIURL_PROIZVODI+nizProizvoda[i].slika}" alt=${nizProizvoda[i].naziv}/>
                    <p class="naziv-proizvoda">${nizProizvoda[i].naziv}</p>
                </a>
            </div>`;
        proizvod += proveraDaLiNaStanju(nizProizvoda[i]);
        proizvod += "</div>";
        div += proizvod;
    }
    document.querySelector(htmlDiv).innerHTML = div;
    $('.dugme-nije-na-stanju').click(dodajUObavestiMe);
}

function ispisiProizvodeTipStampe (niz, nizProizvoda) {
    let drugiStepenPrzFilt = [];
    for(let proizvod of nizProizvoda) {
        // da se nebi pravili duplikati kada je čekirano više tipa štampe u koje proizvod spada
        let vecPrikazan = false;
        for(let i=0;i<proizvod.tipStampe.length;i++){
            let idTipaStampe = proizvod.tipStampe[i];

            if(niz.includes(idTipaStampe) && vecPrikazan == false){
                drugiStepenPrzFilt.push(proizvod);
                vecPrikazan = true;
            }
        }
    }
    ispisiProizvode(drugiStepenPrzFilt);   
}

function proveraDaLiNaStanju(proizvod) {
    let html = "";
    if(proizvod.naStanju == false) {
        html += `<div class="div-nije-na-stanju"><p class="p-nije-na-stanju">Nije na stanju</p>
        <input type="button" data-id="${proizvod.id}" value="Obavesti me" class="dugme-nije-na-stanju" /></div>`
    }
    return html;
}
// ispis za stranicu obavesti.html
function ispisiProizvodeObavesti(nizProizvoda) {
    if(nizProizvoda.length != 0) {
        let div = `<table id='tabela'>
        <tr>
            <th>Rb.</th>
            <th>Slika</th>
            <th>Naziv proizvoda</th>
            <th></th>
        </tr>`;
        let rednibroj = 1;
        for(let proizvod of nizProizvoda) {
            div += `<tr>
                        <td>${rednibroj}</td>
                        <td><img src='../assets/img/proizvodi/${proizvod.slika}' alt='${proizvod.naziv}'/></td>
                        <td>${proizvod.naziv}</td>
                        <td>
                            <div class="ukloni">
                                <button onclick='ukloniLS(${proizvod.id})'>Ukloni</button>
                            </div>
                        </td>`;
            rednibroj++;
        }
        div += "</table>";
        document.querySelector("#proizvodi-obavesti-me").innerHTML = div;
    }
    else {
        obavestenje("#proizvodi-obavesti-me", "Nije dodat nijedan proizvod");
    }
    
}

// Ispis jednog proizvoda po njegovom id
function ispisiProizvodSingle(proizvod) {
    let naStanju = proveraDaLiNaStanju(proizvod);
    let opis = ispisiOpis(proizvod.opis);

    let div = `<div id="sSlika">
        <img src="assets/img/proizvodi/${proizvod.slika}" alt="Privezak GLIT" />
    </div>
    <div id="sProizvod-tekst">
        <h3>${proizvod.naziv}</h3>
        <p><span>Šifra: ${proizvod.sifra}</span></p>
        <ul id="sBoje">
        </ul>
        <div id="sCene">
            <p><strong>Cena bez štampe: </strong>${proizvod.cena.bezStampe}€</p>
            <p><strong>Cena sa štampom: </strong>${proizvod.cena.saStampom}€</p>
        </div>
        ${opis}
        ${naStanju}
    </div>`;
    document.querySelector("#sContainer").innerHTML = div;
    $('.dugme-nije-na-stanju').click(dodajUObavestiMe);
}
// za stranicu proizvod.html
function ispisiOpis(nizOpis) {
    let div = "<p>";
    for(let i = 0; i < nizOpis.length; i++) {
        div += `${nizOpis[i]}<br/>`;
    }
    div += "</p>"
    return div;
}
// funkcija koja ispisuje niz dohvacenih proizvoda za Obavesti me
function ubaciProizvodeIzLS() {
    let proizvodiLS = dohvatiPodatakLS("proizvodiObavestiMe");
    ajaxZahtev("proizvodi.json", function(niz) {
        niz = niz.filter(e => {
            for(let proizvod of proizvodiLS) {
                if(e.id == proizvod.id) {
                    return true;
                }
            }
            return false;
        });
        
        ispisiProizvodeObavesti(niz);
    })
}

// </FUNKCIJE ZA ISPIS PROIZVODA>
// </FUNKCIJE ZA ISPIS>

// Funkcija sa logikom sortiranja
function sortiraj(niz) {
    let value = document.querySelector("#sort-list-proizvodi").value;
    if(value == "nazivAZ") {
        niz = niz.sort((a,b) => a.naziv>b.naziv? 1 : -1);
    }
    else if (value == "nazivZA") {
        niz = niz.sort((a,b) => a.naziv<b.naziv? 1 : -1);
    }
    else if(value == "cenaRast") {
        niz = niz.sort((a,b) => a.cena.bezStampe>b.cena.bezStampe? 1 : -1);
    }
    else if(value == "cenaOp") {
        niz = niz.sort((a,b) => a.cena.bezStampe<b.cena.bezStampe? 1 : -1);
    }
    else if(value == "najnovije") {
        niz = niz.sort((a,b) => a.id<b.id? 1 : -1);
    }
    ispisiProizvode(niz);
}

// funkcija za dohvatanje proizvoda iz JSON
function dohvatiProizvod(jsonNiz, id) {
    let filtrianiNiz = jsonNiz.filter(e => e.id == id);
    console.log(filtrianiNiz);
    if (jsonNiz.length > 0) {
        let proizvod = filtrianiNiz[0];
        return proizvod;
    }
    return jsonNiz;
}
// funkcija koja u slucaju da nema proizvoda daje poruku korisnicima
function obavestenje(htmlDiv, poruka) {
    document.querySelector(htmlDiv).innerHTML = `<h2 class="obavestenje">${poruka}</h2>`;
}